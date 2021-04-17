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
    users: [],
    formInput: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      position: '',
      userType: '',
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
    let link = ''

    if (
      this.state.formInput.firstName === '' ||
      this.state.formInput.lastName === '' ||
      this.state.formInput.emailAddress === '' ||
      this.state.formInput.position === '' ||
      this.state.formInput.userType === ''
    ) {
      message.warning(`Please fill in all required fields!`)
      return
    }

    //console.log(this.state.formInput)

    this.setState({ ...this.state, submitLoading: true })

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(
        this.state.formInput.emailAddress,
        'password123',
      )
      .then(() => {
        // Send verification email

        firestore
          .collection('users')
          .doc(this.state.formInput.emailAddress)
          .set({
            firstName: this.state.formInput.firstName,
            lastName: this.state.formInput.lastName,
            position: this.state.formInput.position,
            userType: this.state.formInput.userType,
          })
          .then(() => {
            // Update user claim

            if (this.state.formInput.userType === 'olympic-admin') {
              link =
                'https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/olympic-admin-claim'
            } else if (this.state.formInput.userType === 'olympic-super-admin') {
              link =
                'https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/olympic-super-admin-claim'
            }

            fetch(`${link}/${this.state.formInput.emailAddress}`, {
              method: 'PUT',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((data) => {
                console.log(data)
                message.success(`User account successfully created.`)
                this.setState({
                  ...this.state,
                  formInput: {
                    firstName: '',
                    lastName: '',
                    emailAddress: '',
                    position: '',
                    userType: '',
                    submitLoading: false,
                  },
                  
                })
                this.setState({ ...this.state, submitLoading: false })
                this.onClose()
              })
              .catch((error) => {
                console.log(error)
              })
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
        return (
          doc.userType === 'olympic-admin' || doc.userType === 'olympic-super-admin'
        )
      })

      if (documents) {
        documents = documents.map((item) => {
          const i = documents.indexOf(item)
          return { ...item, id: i + 1 }
        })
      }

      //console.log(documents)

      this.setState({ ...this.state, users: documents })
    })
  }

  render() {
    const cols = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '5%',
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        width: '25%',
        ...this.getColumnSearchProps('firstName'),
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        width: '25%',
        ...this.getColumnSearchProps('lastName'),
      },
      {
        title: 'Email Address',
        dataIndex: 'email',
        key: 'email',
        width: '25%',
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'User Type',
        dataIndex: 'userType',
        key: 'userType',
        width: '20%',
        ...this.getColumnSearchProps('userType'),
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
            <PlusOutlined /> Add System User
          </Button>
          <Table columns={cols} dataSource={this.state.users} />
        </Card>

        <Drawer
          title="Create an system account"
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
                  label="First Name"
                  rules={[{ required: true, message: 'First name required!' }]}
                >
                  <Input
                    name="firstName"
                    value={this.state.formInput.firstName}
                    onChange={this.handle}
                    placeholder="Please enter first name"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  rules={[{ required: true, message: 'Last name required!' }]}
                >
                  <Input
                    name="lastName"
                    onChange={this.handle}
                    value={this.state.formInput.lastName}
                    placeholder="Please enter last name"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Email Address"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter email address',
                    },
                  ]}
                >
                  <Input
                    name="emailAddress"
                    type="email"
                    onChange={this.handle}
                    value={this.state.formInput.emailAddress}
                    placeholder="Please enter email address"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Position"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter user position',
                    },
                  ]}
                >
                  <Input
                    name="position"
                    type="text"
                    onChange={this.handle}
                    value={this.state.formInput.position}
                    placeholder="Please enter user's user position"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="User Type"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter user type',
                    },
                  ]}
                >
                  <select
                    className="mr-2"
                    style={{
                      width: 350,
                      height: 37,
                      backgroundColor: '#ffff',
                      borderRadius: '8px',
                      borderColor: '#445068',
                    }}
                    name="userType"
                    value={this.state.formInput.userType}
                    onChange={this.handle}
                  >
                    <option value="">Select user type...</option>
                    <option value="olympic-admin">admin</option>
                    <option value="olympic-super-admin">super admin</option>
                  </select>
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
