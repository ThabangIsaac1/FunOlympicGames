import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Avatar, Tag,Dropdown, Table, Badge, Menu } from 'antd';
import RegiondataWidget from 'components/shared-components/RegiondataWidget';
import DonutChartWidget from 'components/shared-components/DonutChartWidget'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import utils from 'utils'
import { useHistory } from 'react-router-dom'

import {
   ReloadOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { 
  
  sessionData, 
  sessionLabels, 
  conbinedSessionData,
  sessionColor,
} from './AnalyticDashboardData'
import moment from 'moment'; 
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'


const rederRegionTopEntrance = (
  <div className="mb-4">
    <div className="d-flex align-items-center">
      <Avatar size={20} src="/img/flags/us.png"/>
      <h2 className="mb-0 ml-2 font-weight-bold">37.61%</h2>
    </div>
    <span className="text-muted">Top entrance region</span>
  </div>
)

export const AnalyticDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [subscribers, setSubscribers] = useState([])
  const [hasError, setErrors] = useState(false)
  const [eventsData, setEvents] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  let history = useHistory()

  useEffect(() => {
    // console.log()
    setIsLoading(true)
    fetch(
      'https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/subscribers',
    )
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error('Error fetching data.')
        }
      })
      .then((subscribers) => {
        //console.log(subscribers);

        setSubscribers(subscribers)
      })
      .catch((error) => {
        setErrors(error)
      })


     
      fetch(
        'https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events',
      )
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw Error('Error fetching data.')
          }
        })
        .then((eventsData) => {
          //console.log(subscribers);
  
          setEvents(eventsData)
        })
        .catch((error) => {
          setErrors(error)
        })
  }, [])




	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center">
					<EditOutlined onClick={null} />
					<span className="ml-2">Update</span>
				</Flex>
			</Menu.Item>
			<Menu.Item>
				<Flex alignItems="center">
					<  DeleteOutlined />
					<span className="ml-2">Delete</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);


  const cardDropdown = (menu) => (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
        <EllipsisOutlined />
      </a>
    </Dropdown>
  )
  const rowSelection = {
		onChange: (key, rows) => {
			setSelectedRows(rows)
			setSelectedRowKeys(key)
		}
	};

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? eventsData : eventsData
		const data = utils.wildCardSearch(searchArray, value)
		setEvents(data)
		setSelectedRowKeys([])
	}
  const tableCols = [
		{
			title: 'Sporting Code',
			dataIndex: 'codeName',
			// render: (_, record) => (
			// 	<div className="d-flex">
			// 		<AvatarStatus size={30} src={record.image} name={record.name}/>
			// 	</div>
			// ),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
    {
			title: 'Category',
			dataIndex: 'category',
			
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
		},
		{
			title: 'Location',
			dataIndex: 'eventLocation',
			
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
		},

		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm)} />
				</div>
			)
		}
		

	];

    

   const regionData = [
    {
      color: '#3e82f7',
      name:   'Botswana',
      value: '37.61%'
      },
      {
      color: '#04d182',
      name: 'Brazil',
      value: '16.79%'
      },
      {
      color: '#ffc542',
      name: 'India',
      value: '12.42%'
     },
      {
      color: '#fa8c16',
      name: 'China',
      value: '9.85%'
    },
    {
      color: '#ff6b72',
      name: 'Malaysia',
      value: '7.68%'
    },
    {
      color: '#a461d8',
      name: 'Thailand',
      value: '5.11%'
    }
  ]

  
  

  
 const RecentTransactionData = [
	{
		id: '#5331',
		name: 'Clayton Bates',
		date: '8 May 2020',
		amount: '$137.00',
		status: 'Approved',
		avatarColor: '#04d182'
	},
	{
		id: '#5332',
		name: 'Gabriel Frazier',
		date: '6 May 2020',
		amount: '$322.00',
		status: 'Approved',
		avatarColor: '#fa8c16'
	},
	{
		id: '#5333',
		name: 'Debra Hamilton',
		date: '1 May 2020',
		amount: '$543.00',
		status: 'Pending',
		avatarColor: '#1890ff'
	},
	{
		id: '#5334',
		name: 'Stacey Ward',
		date: '28 April 2020',
		amount: '$876.00',
		status: 'Rejected',
		avatarColor: '#ffc542'
	},
	{
		id: '#5335',
		name: 'Troy Alexander',
		date: '28 April 2020',
		amount: '$241.00',
		status: 'Approved',
		avatarColor: '#ff6b72'
	},
];

  const latestTransactionOption = (
    <Menu>
      <Menu.Item key="0">
        <span>
          <div className="d-flex align-items-center">
            <ReloadOutlined />
            <span className="ml-2">Refresh</span>
          </div>
        </span>
      </Menu.Item>
      <Menu.Item key="1">
        <span>
          <div className="d-flex align-items-center">
            <PrinterOutlined />
            <span className="ml-2">Print</span>
          </div>
        </span>
      </Menu.Item>
      <Menu.Item key="12">
        <span>
          <div className="d-flex align-items-center">
            <FileExcelOutlined />
            <span className="ml-2">Export</span>
          </div>
        </span>
      </Menu.Item>
    </Menu>
  );


  const columns = [
    { title: "Rank", dataIndex: "rank", key: "rank" },
    { title: "Country", dataIndex: "country", key: "age" },
    { title: "Gold", dataIndex: "gold", key: "gold" },
    { title: "Silver", dataIndex: "silver", key: "silver" },
    { title: "Bronze", dataIndex: "bronze", key: "bronze" },
    { title: "Total", dataIndex: "total", key: "total" },
  
  ];

  const data = [
    {
      key: 1,
      rank: "1",
      country: "South Africa",
      gold: "3",
      silver:"2",
      bronze:"2",
      total:"2",
      description:
        "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
    }

   
   
  ];
  const tableColumns = [
    {
      title: 'Sporting Code',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <Avatar size={30} className="font-size-sm" style={{backgroundColor: record.avatarColor}}>
            {utils.getNameInitial(text)}
          </Avatar>
          <span className="ml-2">{text}</span>
        </div>
      ),
    },
    {
      title: 'Event Location',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Duration',
      dataIndex: 'amount',
      key: 'amount',
    },
   
  ];
  const getPaymentStatus = status => {
    if(status === 'Paid') {
      return 'success'
    }
    if(status === 'Pending') {
      return 'warning'
    }
    if(status === 'Expired') {
      return 'error'
    }
    return ''
  }
  
  const getShippingStatus = status => {
    if(status === 'Ready') {
      return 'blue'
    }
    if(status === 'Shipped') {
      return 'cyan'
    }
    return ''
  }

 const recentOrderData = [
    {
      id: '#5331',
      name: 'Eileen Horton',
      image: '/img/avatars/thumb-1.jpg',
      date: 1573430400,
      amount: 677,
      paymentStatus: 'Paid',
      orderStatus: 'Ready'
    },
    {
      id: '#5328',
      name: 'Terrance Moreno',
      image: '/img/avatars/thumb-2.jpg',
      date: 1572393600,
      amount: 1328.35,
      paymentStatus: 'Paid',
      orderStatus: 'Ready'
    },
    {
      id: '#5321',
      name: 'Ron Vargas',
      image: '/img/avatars/thumb-3.jpg',
      date: 1593949805,
      amount: 629,
      paymentStatus: 'Paid',
      orderStatus: 'Shipped'
    },
    {
      id: '#5287',
      name: 'Luke Cook',
      image: '/img/avatars/thumb-4.jpg',
      date: 1579132800,
      amount: 25.9,
      paymentStatus: 'Paid',
      orderStatus: 'Shipped'
    },
    {
      id: '#5351',
      name: 'Joyce Freeman',
      image: '/img/avatars/thumb-5.jpg',
      date: 1591286400,
      amount: 817.5,
      paymentStatus: 'Pending',
      orderStatus: 'Ready'
    },
  ]

  const tableColumns02 = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Product',
      dataIndex: 'name',
      render: (_, record) => (
        <Flex>
          <AvatarStatus size={30} src={record.image} name={record.name}/>
        </Flex>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (_, record) => (
        <span>{moment.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
    },
    {
      title: 'Order status',
      dataIndex: 'orderStatus',
      render: (_, record) => (
        <><Tag color={getShippingStatus(record.orderStatus)}>{record.orderStatus}</Tag></>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
    },
    {
      title: 'Payment status',
      dataIndex: 'paymentStatus',
      render: (_, record) => (
        <><Badge status={getPaymentStatus(record.paymentStatus)} /><span>{record.paymentStatus}</span></>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'paymentStatus')
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      render: (_, record) => (
        <span className="font-weight-semibold">
          <NumberFormat
            displayType={'text'} 
            value={(Math.round(record.amount * 100) / 100).toFixed(2)} 
            prefix={'$'} 
            thousandSeparator={true} 
          />
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
    }
  ]
 

  
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24} xxl={18}>
          <RegiondataWidget 
            title="Subscribers by regions"
            data={regionData}
            content={rederRegionTopEntrance}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xxl={6}>
          <DonutChartWidget 
            series={sessionData} 
            labels={sessionLabels} 
            title="Viewers By Gender"
            customOptions={{colors: sessionColor}}
            extra={
              <Row  justify="center">
                <Col xs={20} sm={20} md={20} lg={24}>
                  <div className="mt-4 mx-auto" style={{maxWidth: 200}}>
                    {conbinedSessionData.map(elm => (
                      <Flex alignItems="center" justifyContent="between" className="mb-3" key={elm.label}>
                        <div>
                          <Badge color={elm.color} />
                          <span className="text-gray-light">{elm.label}</span>
                        </div>
                        <span className="font-weight-bold text-dark">{elm.data}</span>
                      </Flex>
                    ))}
                  </div>
                </Col>
              </Row>
            }
          />
        </Col>
      </Row>
      <Row gutter={16}>
       
     
        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>

        <Card title="List Of Sporting Codes" extra={cardDropdown(latestTransactionOption)}>
        <div className="table-responsive">
				<Table
					columns={tableCols}
					dataSource={eventsData}
					rowKey='id'
					rowSelection={{
						selectedRowKeys: selectedRowKeys,
						type: 'checkbox',
						preserveSelectedRowKeys: false,
						...rowSelection,
					}}
				/>
			</div>
          </Card>



        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xxl={24}>
          <Card title="Event Log Standings">
      <Card title="Event Log Standings">
            <Table
              columns={columns}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>{record.description}</p>
                ),
                rowExpandable: (record) => record.name !== "Not Expandable",
              }}
              dataSource={data}
            />
          </Card>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AnalyticDashboard