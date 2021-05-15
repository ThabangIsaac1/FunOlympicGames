import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import {
  Row,
  Col,
  Form,
  Avatar,
  Comment,
  Tooltip,
  Card,
  Button,

} from 'antd'
import { CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import moment from 'moment'
import axios from 'axios'

import YouTube from "@u-wave/react-youtube";
import { set } from 'lodash';


const ADD = 'ADD'
const EDIT = 'EDIT'

const ProductForm = (props) => {
  const { mode = ADD, param } = props
  const [events, setEvents] = useState({})
  const [comments, setComments] = useState({})
 
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

  

  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const submit = () => {
    axios.post(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/eventsComments/`).then(()=>{
      setComments(res.data)
      console.log(res.data)
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
              {  comments.comment}
          </p>
          

              }
              datetime={
                <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
            <Form.Item style={{ paddingTop: 30 }}>
              <TextArea name="comment" value={comments.comment} rows={2} />
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
