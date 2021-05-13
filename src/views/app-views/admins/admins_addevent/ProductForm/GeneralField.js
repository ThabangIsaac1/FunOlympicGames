import React, { useState } from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Select, Button, message
} from "antd";
import axios from 'axios'
import { set } from "lodash";


const GeneralField = (props) => {


  const { Option } = Select;

  const rules = {
    codeName: [
      {
        required: true,
        message: "Please enter product name",
      },
    ],
    eventDescription: [
      {
        required: true,
        message: "Please enter the event description",
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
    dateScheduled: [
      {
        required: true,
        message: "Please  enter the date of event",
      },
    ],
    countriesParticipating: [
      {
        required: true,
        message: "Please enter the countries participating",
      },
    ],
    eventLocation: [
      {
        required: true,
        message: "Please enter the event location",
      },

    ],
    virtualLink: [
      {
        required: true,
        message: "Please enter the event streaming id",
      },

    ],
    eventDescription: [
      {
        required: true,
        message: "Please enter the event description",
      },

    ]
  };





  const [data, setData] = useState({
    codeName: '',
    category: '',
    eventLocation: '',
    dateScheduled: '',
    countriesParticipating: '',
    virtualLink: '',
    eventDescription: ''
  })

  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data)
  };
  
  const Submit = () => {
  
   
   
      axios.post(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events`, data,).then(() => {
        message.success('Event has been successfully added')
        setData({
          codeName: '',
          category: '',
          eventLocation: '',
          dateScheduled: '',
          countriesParticipating: '',
          virtualLink: '',
          eventDescription: ''
        })
      })
    
  }

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <Card>


            <Row gutter={16}>

              <Col xs={24} sm={24} md={12}>
                <Form.Item name="sporting_code" label="Sporting Code Name" rules={rules.codeName}>
                  <Input name="codeName" className="w-100" value={data.codeName} placeholder="Example - Tennis"
                    onChange={handle} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item name="category" label="Category" rules={rules.category}>
                  <Input name="category" value={data.category}
                    onChange={handle} placeholder="Example - Outdoor" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item name="countries_participating" label="Countries Participating" rules={rules.countriesParticipating}>
                  <Input name="countriesParticipating" value={data.countriesParticipating}
                    onChange={handle} placeholder="Example - Botswana, Zimbabwe, Malawi" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Date Scheduled" rules={rules.dateScheduled}>
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
                <Form.Item name="location" label="Event Location" rules={rules.eventLocation}>
                  <Input name="eventLocation" value={data.eventLocation}
                    onChange={handle} placeholder="Example - Great Mansion Grounds" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item name="link" label="Virtual Link" rules={rules.virtualLink}>
                  <Input name="virtulLink" value={data.virtualtLink}
                    onChange={handle} placeholder="Youtube streamID - HPDSv6CSo_M" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24}>
                <Form.Item name="description" label="Event Description" rules={rules.eventDescription}>
                  <Input.TextArea name="eventDescription" value={data.eventDescription}
                    onChange={handle} placeholder="Short brief description" />
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
