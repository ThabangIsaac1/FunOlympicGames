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
import { auth, storage } from '../../../../../firebase'
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
  const [events, setEvents] = useState({})
  const [list, setList] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [comments, setComments] = useState({
    comment:'',
  })

  useEffect(() => {
    axios.get(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/subscribers
    `).
      then((res) => {
        console.log(res.data)
        setSubscribers(res.data)
    //  console.log(res.data)
        
      })

    if (mode === EDIT) {

      const { id } = param
      // axios.get(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/subscribers
      // `).
      //   then((res) => {
      //     console.log(res.data)
      //     setSubscribers(res.data)
      // //  console.log(res.data)
          
      //   })

      axios.get(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events/${id}
      `).
        then((res) => {
      //    console.log(res.data)
          setEvents(res.data.virtualLink)
        
          
        }).then(()=>{
          // axios
          // .get(
          //   'http://localhost:5000/funolympic-fnqi/us-central1/app/api/eventComments',
            
          // )
          // .then((res) => {
    
          //   setList(res.data[0])
          //   console.log(res.data[0].comment)
          // })
        })
    }
  }, [])


  const handle = (e) => {
    setComments({ ...comments, [e.target.name]: e.target.value })
  }


  const submit = () => {
   let email = auth.currentUser.email 
   let subcr = subscribers.filter((e)=>{
     return e.email === email
   })

   let name = subcr[0].fullName


    axios
      .post(
        'https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/eventComments',{fullName:name,comment:comments},
      )
      .then(() => {
 
   
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
              // author={<a>{name.fullname}</a>}
              // avatar={
              //   <Avatar
              //     src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              //     alt="Han Solo"
              //   />
              // }
              content={
                <p style={{ textAlign: "justify" }}>
                  {/* {list} */}
                </p>
              }
              datetime={
                <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
            <Form.Item style={{ paddingTop: 30 }}>
              <TextArea name="comment" value={comments.comment} onChange={handle} rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={submit} icon={<CommentOutlined />}>
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
