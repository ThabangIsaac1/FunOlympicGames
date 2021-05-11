import React, { useState } from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Select,Button
} from "antd";



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
    sporting_code:'',
    category:'',
    location:'',
    date_scheduled:'',
    countries_participating:'',
    location:'',
    link:'',
    description:''
   })
  
  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data)
  };


  return (
    <>
  <Row gutter={16}>
    <Col xs={24} sm={24} md={24}>
      <Card>
      

        <Row gutter={16}>

          <Col xs={24} sm={24} md={12}>
            <Form.Item name="sporting_code" label="Sporting Code Name" rules={rules.code}>
              <Input  name="sporting_code" className="w-100"     value={data.sporting_code} placeholder="Example - Tennis"
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
              <Input  name="countries_participating" value={data.countries_participating}
                onChange={handle}  placeholder="Example - Botswana, Zimbabwe, Malawi"/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item  label="Date Scheduled" rules={rules.date}>
            <Input
                            type="date"
                            name="date_scheduled"
                            onChange={handle}
                            value={data.date_scheduled}
                            className="w-100"
                          />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item name="location" label="Event Location" rules={rules.locations}>
              <Input  name="location" value={data.location}
                onChange={handle}  placeholder="Example - Great Mansion Grounds"/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="link" label="Virtual Link" rules={rules.virtual}>
              <Input  name="link" value={data.link}
                onChange={handle}  placeholder="Livestream - Google Link"/>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24}>
            <Form.Item name="description" label="Event Description" rules={rules.event_description}>
              <Input.TextArea  name="description" value={data.description}
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
        onClick={null}
        type="primary"
        htmlType="submit"
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
