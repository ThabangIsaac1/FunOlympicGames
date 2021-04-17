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
    email: [
      {
        required: true,
        message: "Please enter email",
      },
    ],
    username: [
      {
        required: true,
        message: "Please enter username",
      },
    ],
    taxRate: [
      {
        required: true,
        message: "Please  tax rate",
      },
    ],
    cost: [
      {
        required: true,
        message: "Please enter item cost",
      },
    ],
  };
  
  
  const [data, setData] = useState({
    email:'',
    username:'',
    position:'',
    userType:''
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
            <Form.Item name="email" label="Email" rules={rules.email}>
              <Input  name="email" className="w-100"     value={data.email}
                onChange={handle}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="username" label="Username" rules={rules.username}>
              <Input name="username"  value={data.username}
                onChange={handle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="position" label="Position" rules={rules.cost}>
              <Input  name="position" value={data.position}
                onChange={handle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item  label="User Type" rules={rules.taxRate}>
              <select
                placeholder="select user type"
                style={{
                  width: 650,
                  height: 80220,
                  backgroundColor: "#283142",
                  borderRadius: "7px",
                  borderColor: "#445068",
                }}  style={{ width: 650 }}
                name="userType"
                value={data.userType}
                onChange={handle}>

                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
            
              </select>
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
