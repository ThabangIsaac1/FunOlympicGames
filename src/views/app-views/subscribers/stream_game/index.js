/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import OrderListData from "assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
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

	const [list, setList] = useState([])
	const [data, setData] = useState({
		comment:''
})
	const [eventsData, setEvents] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	let history = useHistory()

	const viewEvent = (row) => {
		history.push(`./view_game/${row.id}`)
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
			<Menu.Item>
				<Flex alignItems="center">
					<PlusCircleOutlined />
					<span className="ml-2">Add to remark</span>
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
		</Card>
	)
}

export default Orders
