import React, { Component } from 'react'
import {
  PlusOutlined,
  SearchOutlined,
  GlobalOutlined,
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
} from '@ant-design/icons'
import {
  Table,
  Input,
  Card,
  Drawer,
  Form,
  Button,
  Menu,
  Col,
  Row,
  Select,
  DatePicker,
  message,
} from 'antd'
import Highlighter from 'react-highlight-words'
import Flex from 'components/shared-components/Flex'
import { firebaseApp, firestore } from '../../../../firebase'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'

export class CustomFilterPanel extends Component {
  state = {
    searchText: '',
    searchedColumn: '',
    visible: false,
    submitLoading: false,
    companies: [],
    formInput: {
      companyName: '',
      tradingName: '',
      adminName: '',
      adminEmailAddress: '',
      companyPhysicalAddress: '',
    },
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  showDrawer = () => {
    this.setState({
      ...this.state,
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      ...this.state,
      visible: false,
    })
  }

  handle = (e) => {
    this.setState({
      ...this.state,
      formInput: {
        ...this.state.formInput,
        [e.target.name]: e.target.value,
      },
    })
  }

  submitForm = () => {
    if (
      this.state.formInput.companyName === '' ||
      this.state.formInput.tradingName === '' ||
      this.state.formInput.adminName === '' ||
      this.state.formInput.adminEmailAddress === '' ||
      this.state.formInput.companyPhysicalAddress === ''
    ) {
      message.warning(`Please fill in all required fields!`)
      return
    }
    this.setState({ ...this.state, submitLoading: true })

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(
        this.state.formInput.adminEmailAddress,
        'password123',
      )
      .then(() => {
        // Send email verification:
        firestore
          .collection('users')
          .doc(this.state.formInput.adminEmailAddress)
          .set({
            companyName: this.state.formInput.companyName,
            tradingName: this.state.formInput.tradingName,
            adminName: this.state.formInput.adminName,
            companyPhysicalAddress: this.state.formInput.companyPhysicalAddress,
            userType: 'company-admin',
          })
          .then(() => {
            // Update user claim
            fetch(
              `https://us-central1-reib-platform.cloudfunctions.net/app/api/company-admin-claim/${this.state.formInput.adminEmailAddress}`,
              {
                method: 'PUT',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
              .then((data) => {
                console.log(data)
                message.success(`Company account successfully created.`)
                this.setState({
                  ...this.state,
                  formInput: {
                    companyName: '',
                    tradingName: '',
                    adminName: '',
                    adminEmailAddress: '',
                    companyPhysicalAddress: '',
                  },
                })
              })
              .catch((error) => {
                console.log(error)
              })

            this.setState({ ...this.state, setSubmitLoading: false })
            this.onClose()
          })
          .catch((error) => {
            console.error('Error writing document: ', error)
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  dropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={null}>
        <Flex alignItems="center">
          <EditOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={null}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  )

  componentDidMount() {
    firestore.collection('users').onSnapshot((snapshot) => {
      let documents = snapshot.docs.map((doc) => ({
        email: doc.id,
        ...doc.data(),
      }))

      documents = documents.filter((doc) => {
        return doc.userType === 'company-admin'
      })

      if (documents) {
        documents = documents.map((item) => {
          const i = documents.indexOf(item)
          return { ...item, id: i + 1 }
        })
      }

      //console.log(documents)

      this.setState({ ...this.state, companies: documents })
    })
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '20%',
        ...this.getColumnSearchProps('age'),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        ...this.getColumnSearchProps('address'),
      },
    ]

    const cols = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '5%',
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '15%',
        ...this.getColumnSearchProps('companyName'),
      },
      {
        title: 'Trading Name',
        dataIndex: 'tradingName',
        key: 'tradingName',
        width: '15%',
        ...this.getColumnSearchProps('tradingName'),
      },
      {
        title: 'Admin Name',
        dataIndex: 'adminName',
        key: 'adminName',
        width: '15%',
        ...this.getColumnSearchProps('companyName'),
      },
      {
        title: 'Admin Email',
        dataIndex: 'email',
        key: 'email',
        width: '15%',
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'Company Address',
        dataIndex: 'companyPhysicalAddress',
        key: 'companyPhysicalAddress',
        width: '25%',
        ...this.getColumnSearchProps('companyPhysicalAddress'),
      },
      // {
      //   title: '',
      //   dataIndex: 'actions',
      //   render: (_, elm) => (
      //     <div className="text-right">
      //       <EllipsisDropdown menu={this.dropdownMenu(elm)} />
      //     </div>
      //   ),
      // },
    ]

    return (
      <>
        <Card style={{ width: '100%' }} title="">
          <Button type="primary" onClick={this.showDrawer}>
            <PlusOutlined /> Add Company
          </Button>
          <Table columns={cols} dataSource={this.state.companies} />
        </Card>

        <Drawer
          title="Create a company account"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                onClick={this.submitForm}
                loading={this.state.submitLoading}
                type="primary"
              >
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Company Name"
                  rules={[
                    { required: true, message: 'Company name required!' },
                  ]}
                >
                  <Input
                    name="companyName"
                    value={this.state.formInput.companyName}
                    onChange={this.handle}
                    placeholder="Please enter company name"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trading Name"
                  rules={[
                    { required: true, message: 'Trading name required!' },
                  ]}
                >
                  <Input
                    name="tradingName"
                    onChange={this.handle}
                    value={this.state.formInput.tradingName}
                    placeholder="Please enter trading name"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Admin Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter name of admin user',
                    },
                  ]}
                >
                  <Input
                    name="adminName"
                    onChange={this.handle}
                    value={this.state.formInput.adminName}
                    placeholder="Please enter name of admin user"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Email Address"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter admin email address',
                    },
                  ]}
                >
                  <Input
                    name="adminEmailAddress"
                    type="email"
                    onChange={this.handle}
                    value={this.state.formInput.adminEmailAddress}
                    placeholder="Please enter admin email address"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Company Physical Address"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter company physical address',
                    },
                  ]}
                >
                  <Input.TextArea
                    name="companyPhysicalAddress"
                    onChange={this.handle}
                    value={this.state.formInput.companyPhysicalAddress}
                    placeholder="Please enter company physical address"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </>
    )
  }
}

export default CustomFilterPanel
