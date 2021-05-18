import React, { useEffect, useState } from 'react'
import LoginForm from "../../components/LoginForm";
import { Row, Col,Modal,message, Input, Form } from "antd";
import { useSelector } from "react-redux";
import axios from 'axios'

const backgroundURL = "/img/others/login-bg.png";
const backgroundStyle = {
  backgroundImage: `url(${backgroundURL})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const LoginTwo = (props) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [send, setEmail] = useState({
	email: "",

})
const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 16 },
};

const submitResults = () => {
	setModal1Visible(false)
	axios.post(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/send-reset`, send).then(() => {
		message.success(`Check Your Email For The Next Steps!`)
	});


}
const typeEmail = () => {

	setModal1Visible(true);

}

const handle = (e) => {
	setEmail({ ...send, [e.target.name]: e.target.value })
}
  return (
    <div className={`h-100 ${theme === "light" ? "bg-white" : ""}`}>
      <Row justify="center" className="align-items-stretch h-100">
        <Col xs={20} sm={20} md={24} lg={16}>
          <div className="container d-flex flex-column justify-content-center h-100">
            <Row justify="center">
              <Col xs={24} sm={24} md={20} lg={12} xl={8}>
                <h1>Sign In</h1>
                <p>
                  Forgort Password Reset Here |{" "}
                  <a onClick={() => typeEmail()} >Reset</a>
                </p>
                <div className="mt-4">
                  <LoginForm {...props} />
                </div>
				<Modal
				title="Type Email To Receive Reset Link"
				style={{ top: 20 }}
				visible={modal1Visible}
				onOk={submitResults}
				onCancel={() => setModal1Visible(false)}
			>

				<Form
					{...layout} name="nest-messages"
					onFinish={null}
					>

					<Form.Item label="Email" >
						<Input type="email" name="email" value={send.email}   onChange={handle} />
					</Form.Item>

				
				</Form>
			</Modal>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={8}>
          <div
            className="d-flex flex-column justify-content-between h-100 px-4"
            style={backgroundStyle}
          >
            <div className="text-right">
              <img src="/img/logo-white.png" alt="logo" />
            </div>
            <Row justify="center">
              <Col xs={0} sm={0} md={0} lg={20}>
                <img
                  className="img-fluid mb-5"
                  src="/img/others/img-18.png"
                  alt=""
                />
                <h1 className="text-white">Welcome to The Fun Olympic Games</h1>
                <p className="text-white">
                  Get Ready to experience the heart pumping and mind blowing
                  virtual experience. Login, sit back and Relax!
                </p>
              </Col>
            </Row>
            <div className="d-flex justify-content-end pb-4">
              <div>
                <a
                  className="text-white"
                  href="/#"
                  onClick={(e) => e.preventDefault()}
                >
                  Term & Conditions
                </a>
                <span className="mx-2 text-white"> | </span>
                <a
                  className="text-white"
                  href="/#"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy & Policy
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginTwo;
