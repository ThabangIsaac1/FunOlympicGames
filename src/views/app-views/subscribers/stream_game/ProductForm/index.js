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
  Avatar,
  Comment,
  Tooltip,
  Card,
  Upload,
  Button,
  message,
} from 'antd'
import Flex from 'components/shared-components/Flex'
// import GeneralField from './GeneralField'
import VariationField from './VariationField'
import ShippingField from './ShippingField'
import { CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import ProductListData from 'assets/data/product-list.data2.json'
import moment from 'moment'
import axios from 'axios'
import { auth,storage } from '../../../../../firebase'
import YouTube from "@u-wave/react-youtube";
const { TabPane } = Tabs
const { TextArea } = Input;
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
  const [events, setEvents] = useState({})
  const [uploadedImg, setImage] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  // const [list, setList] = useState({})

   useEffect(() => {


     if (mode === EDIT) {

      const { id } = param
     
    
      axios.get(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events/${id}
      `).
      then((res) => {
        console.log(res.data)
        setEvents(res.data.virtualLink)  
      })}
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
      data.jobTitle === '' ||
      data.companyName === '' ||
      data.experience === '' ||
      data.description === '' ||
      data.deadline === '' ||
      data.location === '' ||
      data.email === ''
    ) {
      console.log(
        `${data.jobTitle} ${data.companyName} ${data.experience} ${data.description} ${data.deadline} ${data.location} ${data.email}`,
      )
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
              `https://us-central1-reib-platform.cloudfunctions.net/app/api/job-listing/${id}`,data
            
            )
            .then(() => {
              setSubmitLoading(false)
              message.success(`Job Details successfully Edited`)
           //   window.location.reload()
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
      jobTitle: '',
      companyName: '',
      experience: '',
      description: '',
      deadline: '',
      location: '',
      email:auth.currentUser.email,
    })
  }

  const [data, setData] = useState({
    jobTitle: '',
    companyName: '',
    experience: '',
    description: '',
    deadline: '',
    location: '',
    email: auth.currentUser.email,
  })

  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const submit = () => {
    axios
      .post(
        'https://us-central1-reib-platform.cloudfunctions.net/app/api/job-listings',
        data,
      )
      .then((res) => {
        message.success(`Job listing submitted successfully`)
        setData({
          jobTitle: '',
          companyName: '',
          experience: '',
          description: '',
          deadline: '',
          location: '',
          email:auth.currentUser.email,
        })
      })
  }

  return (
    <>


      <Row gutter={16}>
        <Col xs={24} sm={16} md={16}>
          <Card hoverable>
            <div className="video-responsive">
              <YouTube video={events} autoplay />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={7}>
          <Card hoverable>
            <Comment
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <p style={{ textAlign: "justify" }}>
                  Incredible Hurdle race, I think bolt should have started the race though.Jamaica would have won the race.
          </p>
              }
              datetime={
                <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
            <Form.Item style={{ paddingTop: 30 }}>
              <TextArea name="comment" value={data.comment} rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={null} icon={<CommentOutlined />}>
                Comment
    </Button>

              <Tooltip title="Share" >
                <Button shape="circle" icon={<ShareAltOutlined style={{ color: "green" }} />} style={{ float: "right" }} />
              </Tooltip>

            </Form.Item>
          </Card>
        </Col>
      </Row>

   
   
    </>
  )
}

export default ProductForm
