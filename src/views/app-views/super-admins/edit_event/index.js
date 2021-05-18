/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Modal, Form, message } from 'antd';
import OrderListData from "assets/data/order-list.data.json"
import { EyeOutlined, EditOutlined, SearchOutlined, PlusCircleOutlined,DeleteOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { useHistory } from 'react-router-dom'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import axios from 'axios'


const { Option } = Select

const getPaymentStatus = status => {
	if (status === 'Paid') {
		return 'success'
	}
	if (status === 'Pending') {
		return 'warning'
	}
	if (status === 'Expired') {
		return 'error'
	}
	return ''
}

const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 16 },
};
const getShippingStatus = status => {
	if (status === 'Ready') {
		return 'blue'
	}
	if (status === 'Shipped') {
		return 'cyan'
	}
	return ''
}

const paymentStatusList = ['Paid', 'Pending', 'Expired']

const Orders = () => {
	const [modal1Visible, setModal1Visible] = useState(false);
	const [list, setList] = useState([])
	const [eventsData, setEvents] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	let history = useHistory()

	const [results, setResults] = useState({
		id: "",
		codeName: "",
		gold: "",
		silver: "",
		bronze: "",
	})

	const viewEvent = (row) => {
		history.push(`./watch/${row.id}`)
	}

	const viewDetails = (row) => {
		history.push(`./edit_details/${row.id}`)
	}


	const AddResults = (row) => {

		setModal1Visible(true);
		results.id = row.id;
		results.codeName = row.codeName;



	
	}


	

	const deleteEvent = (row) => {


		axios
		.delete(
		  `https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events/${row.id}`
		)
		.then(() => {
		  message.success(` Event Removed successfuly`);
		  //window.location.reload()

		  
		});


	}
	const editEvent = (row) => {



	}

	const handleShowStatus = value => {
		if (value !== 'All') {
			const key = 'paymentStatus'
			const data = utils.filterArray(OrderListData, key, value)
			setList(data)
		} else {
			setList(OrderListData)
		}
	}
	useEffect(() => {


		axios.get(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events`).
			then((res) => {
				// console.log(res.data)
				setList(res.data)
				setEvents(res.data)
			})


	}, [])
	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => viewEvent(row)}>
				<Flex alignItems="center">
					<EyeOutlined />
					<span className="ml-2">Watch</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => AddResults(row)} >
				<Flex alignItems="center">
					<PlusCircleOutlined />
					<span className="ml-2">Add Results</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => viewDetails(row)} >
				<Flex alignItems="center">
					<EditOutlined />
					<span className="ml-2">Edit Event</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => deleteEvent(row)} >
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">Delete Event</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);
	// render: (_, record) => (
	// 				<div className="d-flex">
	// 					{/* <AvatarStatus size={30} src={record.image} name={record.name}/> */}
	// 				</div>
	// 			),
	const tableColumns = [
		{
			title: 'Event',
			dataIndex: 'codeName',
			// render: (_, record) => (
			// 	<div className="d-flex">
			// 		<AvatarStatus size={30} src={record.image} name={record.name}/>
			// 	</div>
			// ),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'Date',
			dataIndex: 'dateScheduled',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
		},
		{
			title: 'Location',
			dataIndex: 'eventLocation',

			// sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
		},

		{
			title: 'Countries Participating',
			dataIndex: 'countriesParticipating',

			// sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
		},
		{
			title: 'Status',
			dataIndex: 'status',
			// render: (_, record) => (
			// 	<><Badge status={getPaymentStatus(record.paymentStatus)} /><span>{record.paymentStatus}</span></>
			// ),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'paymentStatus')
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


	const validateMessages = {
		required: 'This field is required!',
		types: {
			gold: 'Please specify country!',
			silver: 'Please specify country!',
			bronze: 'Please specify country!',
		}

	};


	const rowSelection = {
		onChange: (key, rows) => {
			setSelectedRows(rows)
			setSelectedRowKeys(key)
		}
	};

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? list : eventsData
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		setSelectedRowKeys([])
	}
	const handle = (e) => {
		setResults({ ...results, [e.target.name]: e.target.value })
	}

	const submitResults = () => {
		setModal1Visible(false)
		axios.post(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/results`, results).then(() => {
			message.success(` Results Updated successful`)
		});

		{
			axios
				.put(
					`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/ended/`, results,
				)
				.then(() => {
					//message.success(` Delete successful`)



				})
		}

	}
	// useEffect()=
	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
					</div>

				</Flex>

			</Flex>
			<div className="table-responsive">
				<Table
					columns={tableColumns}
					dataSource={list}
					rowKey='id'
					rowSelection={{
						selectedRowKeys: selectedRowKeys,
						type: 'checkbox',
						preserveSelectedRowKeys: false,
						...rowSelection,
					}}
				/>
			</div>
			<Modal
				title="Publish Results"
				style={{ top: 20 }}
				visible={modal1Visible}
				onOk={submitResults}
				onCancel={() => setModal1Visible(false)}
			>

				<Form
					{...layout} name="nest-messages"
					onFinish={null}
					validateMessages={validateMessages}>

					<Form.Item label="Sporting Code" >
						<Input type="codeName" name="codeName" value={results.codeName} readOnly />
					</Form.Item>

					<Form.Item label="Gold Medal" rules={[{ required: true }]}>
						<Input type="gold" name="gold" value={results.gold} onChange={handle} placeholder="Country 01" style={{ backgroundColor: "gold", color: "white" }} />
					</Form.Item>

					<Form.Item label="Silver Medal" rules={[{ required: true }]}>
						<Input type="silver" name="silver" value={results.silver} onChange={handle} placeholder="Country 02" style={{ backgroundColor: "silver", color: "white" }} />
					</Form.Item>
					<Form.Item label="Bronze Medal" rules={[{ required: true }]}>
						<Input type="bronze" name="bronze" value={results.bronze} onChange={handle} placeholder="Country 03" style={{ backgroundColor: "#cd7f32", color: "white" }} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	)
}

export default Orders
