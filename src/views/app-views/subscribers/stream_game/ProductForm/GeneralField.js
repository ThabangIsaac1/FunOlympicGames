// import React from 'react'
// import {
//   Input,
//   Row,
//   Col,
//   Card,
//   Form,
//   Upload,
// view,
//   InputNumber,
//   message,
//   Select,DatePicker
// } from 'antd'
// import { ImageSvg } from 'assets/svg/icon'
// import CustomIcon from 'components/util-components/CustomIcon'
// import { LoadingOutlined } from '@ant-design/icons'
// import moment from 'moment';
// import TextArea from 'antd/lib/input/TextArea'
// const { Dragger } = Upload
// const { Option } = Select

// const { MonthPicker, RangePicker } = DatePicker;

// const dateFormat = 'YYYY/MM/DD';
// const monthFormat = 'YYYY/MM';
// const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

// const rules = {
//   name: [
//     {
//       required: true,
//       message: 'Please enter product name',
//     },
//   ],
//   description: [
//     {
//       required: true,
//       message: 'Please enter product description',
//     },
//   ],
//   price: [
//     {
//       required: true,
//       message: 'Please enter product price',
//     },
//   ],
//   comparePrice: [],
//   taxRate: [
//     {
//       required: true,
//       message: 'Please enter tax rate',
//     },
//   ],
//   cost: [
//     {
//       required: true,
//       message: 'Please enter item cost',
//     },
//   ],
// }

// const imageUploadProps = {
//   name: 'file',
//   multiple: true,
//   listType: 'picture-card',
//   showUploadList: false,
//   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
// }

// const beforeUpload = (file) => {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
//   if (!isJpgOrPng) {
//     message.error('You can only upload JPG/PNG file!')
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2
//   if (!isLt2M) {
//     message.error('Image must smaller than 2MB!')
//   }
//   return isJpgOrPng && isLt2M
// }

// const categories = ['Cloths', 'Bags', 'Shoes', 'Watches', 'Devices']
// const tags = ['Cotton', 'Nike', 'Sales', 'Sports', 'Outdoor', 'Toys', 'Hobbies']

// const GeneralField = (props) => (
//   <Row gutter={16}>
//     <Col xs={24} sm={24} md={24}>
//       <Card title="">
//         <Form.Item name="jobTitle" label="Job Title" rules={rules.jobTitle}>
//           <Input className="w-50" />
//         </Form.Item>
//         <Form.Item
//           name="experience"
//           label="Experience (years)"
//           rules={rules.experience}
//         >
//           <view className="w-50" />
//         </Form.Item>
//         <Form.Item
//           name="description"
//           label="Description"
//           rules={rules.category}
//         >
//           <Input.TextArea className="w-50" rows={4} />
//         </Form.Item> <Form.Item
//           name="experience"
//           label="Job Deadline"
//           rules={rules.experience}
//         >
//            <DatePicker  className="w-50" defaultValue={moment('01/01/2015', dateFormatList[0])} format={dateFormatList} />
//         </Form.Item>


//       </Card>
//     </Col>
//   </Row>
// )

// export default GeneralField
