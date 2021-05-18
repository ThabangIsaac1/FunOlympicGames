import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import {
  Tabs,
  DatePicker,
  Row,
  Col,
  Select,
  Form,
  Input,
  Card,
  Upload,
  Button,
  message,
} from 'antd'
import Flex from 'components/shared-components/Flex'
// import GeneralField from './GeneralField'
import VariationField from './VariationField'
import ShippingField from './ShippingField'

import moment from 'moment'
import axios from 'axios'
import { auth,storage } from '../../../../firebase'

const { TabPane } = Tabs
const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const ADD = 'ADD'
const EDIT = 'EDIT'

const ProductForm = (props) => {
  const { mode = ADD, param } = props

  const [form] = Form.useForm()
  const [uploadedImg, setImage] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  // const [list, setList] = useState({})

   useEffect(() => {


     if (mode === EDIT) {

      const { id } = param
      axios
      .get(
        `https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events/${id}`
        
      )
      .then((res) => {
         console.log(id)
        setData(res.data)
       // message.success(`Job listing submitted successfully`)
      
     form.setFieldsValue({
        codeName:data.codeName,
        category:data.category,
        eventLocation:data.eventLocation,
      })
      })
    }
  }, [])

  

  const handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImage(imageUrl)
        setUploadLoading(true)
      })
    }
  }

  const onFinish = () => {
    if (
    
      data.eventLocation === '' ||
      data.dateSecheduled === '' ||
      data.countriesParticipating === '' ||
      data.eventLocation === '' 
    
    ) {
  
      message.warning(`Please fill in all fields!`)
      return
    }
    setSubmitLoading(true)
    form.validateFields().then(() => {
      setTimeout(() => {
        if (mode === ADD) {
          setSubmitLoading(false)
          submit()
        }
        if (mode === EDIT){
          const { id } = param
          axios
          .put(
              `https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/eventUpdate/${id}`,data
            
            )
            .then(() => {
              setSubmitLoading(false)
              message.success(`Sporting Code Details successfully Edited`)
              setData({
                dateScheduled: '',
                eventLocation: '',
                eventDescription: '',
                countriesParticipating:'',
              })
            })

        }
      }, 1500)
    })
  }

  const { Dragger } = Upload
  const { Option } = Select

  const { MonthPicker, RangePicker } = DatePicker

  const dateFormat = 'YYYY/MM/DD'
  const monthFormat = 'YYYY/MM'
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']

  const imageUploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    showUploadList: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const discard = () => {
    setData({
      codeName: '',
    category: '',
    eventLocation: ''
    })
  }

  const [data, setData] = useState({
    dateScheduled: '',
    eventLocation: '',
    eventDescription: '',
    countriesParticipating:'',

  })

  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const submit = () => {
    axios
      .post(
        'https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/update_code',
        data,
      )
      .then((res) => {
        message.success(`Sporting Code submitted successfully`)
        setData({
          codeName: '',
          category: '',
          eventLocation: ''
        })
      })
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          heightUnit: 'cm',
          widthUnit: 'cm',
          weightUnit: 'kg',
        }}
       onSubmit={(e) => submit(e)}
      >
      
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="between"
              alignItems="center"
            >
              <h2 className="mb-3">
                {mode === 'ADD' ? 'ADD JOB LISTING' : `Edit  Sporting Code`}{' '}
              </h2>
              <div className="mb-3">
                {/* <Button onClick={discard} className="mr-2">
                  Discard
                </Button> */}
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={submitLoading}
                >
                  {mode === 'ADD' ? 'Add Job' : `Save Changes`}
                </Button>
              </div>
            </Flex>
          </div>
    
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            <TabPane tab="General" key="1">
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24}>
                  <Card title="">
                    <Row gutter={16}>
                      <Col xs={24} sm={24} md={12}>
                        <Form.Item label="Date">
                          <Input
                          type="date"
                            name="dateScheduled"
                            placeholder="Enter Sporting date"
                            onChange={handle}
                            value={data.dateScheduled}
                            className="w-100"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={12}>
                        <Form.Item label="Event Location">
                          <Input
                            type="text"
                            name="eventLocation"
                            placeholder="Enter Location"
                            onChange={handle}
                            value={data.eventLocation}
                            className="w-100"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={12}>
                        <Form.Item label="Countries Participating">
                          <Input
                            type="text"
                            name="countriesParticipating"
                            placeholder="Enter countries participating"
                            onChange={handle}
                            value={data.countriesParticipating}
                            className="w-100"
                          />
                        </Form.Item>
                      </Col>

                      
                      <Col xs={24} sm={24} md={12}>
                        <Form.Item label="Event Description">
                          <Input
                            type="text"
                            name="eventDescription"
                            placeholder="Enter Event location"
                            onChange={handle}
                            value={data.eventDescription}
                            className="w-100"
                          />
                        </Form.Item>
               
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  )
}

export default ProductForm
