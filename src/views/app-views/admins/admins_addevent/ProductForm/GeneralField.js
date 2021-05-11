import React, { useState } from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Select,Button, message
} from "antd";
import axios from 'axios'


const GeneralField = (props) => {


  const { Option } = Select;

  const rules = {
    name: [
      {
        required: true,
        message: "Please enter product name",
      },
    ],
    description: [
      {
        required: true,
        message: "Please enter product description",
      },
    ],
    code: [
      {
        required: true,
        message: "Please enter a sporting code",
      },
    ],
    category: [
      {
        required: true,
        message: "Please enter a category",
      },
    ],
    date: [
      {
        required: true,
        message: "Please  enter the date of event",
      },
    ],
    countries: [
      {
        required: true,
        message: "Please enter the countries participating",
      },
    ],
    locations: [
      {
        required: true,
        message: "Please enter the event location",
      },
      
    ],
    virtual: [
      {
        required: true,
        message: "Please enter the event link",
      },
      
    ],
    event_description: [
      {
        required: true,
        message: "Please enter the event description",
      },
      
    ]
  };
  
  



  const [data, setData] = useState({
    codeName:'',
    category:'',
    eventLocation:'',
    dateScheduled:'',
    countriesParticipating:'',
    virtualLink:'',
    eventDescription:''
   })
  
  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data)
  };

 const Submit = ()=>{

  axios.post(`http://localhost:5000/funolympic-fnqi/us-central1/app/api/events`,data).then(()=>{
    message.success('Event has been successfully added')
  })
 }


  return (
    <>
  <Row gutter={16}>
    <Col xs={24} sm={24} md={24}>
      <Card>
      

        <Row gutter={16}>

          <Col xs={24} sm={24} md={12}>
            <Form.Item name="sporting_code" label="Sporting Code Name" rules={rules.code}>
              <Input  name="codeName" className="w-100"     value={data.codeName} placeholder="Example - Tennis"
                onChange={handle}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="category" label="Category" rules={rules.category}>
              <Input name="category"  value={data.category}
                onChange={handle} placeholder="Example - Outdoor" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="countries_participating" label="Countries Participating" rules={rules.countries}>
              <Input  name="countriesParticipating" value={data.countriesParticipating}
                onChange={handle}  placeholder="Example - Botswana, Zimbabwe, Malawi"/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item  label="Date Scheduled" rules={rules.date}>
            <Input
                            type="date"
                            name="dateScheduled"
                            onChange={handle}
                            value={data.dateScheduled}
                            className="w-100"
                          />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item name="location" label="Event Location" rules={rules.locations}>
              <Input  name="eventLocation" value={data.eventLocation}
                onChange={handle}  placeholder="Example - Great Mansion Grounds"/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="link" label="Virtual Link" rules={rules.virtual}>
              <Input  name="virtulaLink" value={data.eventLink}
                onChange={handle}  placeholder="Livestream - Google Link"/>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24}>
            <Form.Item name="description" label="Event Description" rules={rules.event_description}>
              <Input.TextArea  name="eventDescription" value={data.eventDescription}
                onChange={handle}  placeholder="Short brief description"/>
            </Form.Item>
          </Col>
        </Row>
      

        <Button
        style={{
          display: "inline-block",
          width: "calc(10% - 5px)",
          margin: -10,
        }}
        onClick={Submit}
        type="primary"
        htmlType="Submit"
      >
        Submit
      </Button>
      </Card>
    </Col>
  </Row>
  </>
  )
}


export default GeneralField;
