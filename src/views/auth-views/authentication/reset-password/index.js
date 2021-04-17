import React, { useState } from 'react'
import { Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { auth} from '../../../../firebase'
import { useHistory, Redirect } from 'react-router-dom'



const backgroundStyle = {
	backgroundImage: 'url(/img/others/img-17.jpg)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const ForgotPassword = () => {


	let history = useHistory()

	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const onSend = values => {

		console.log(values)
		setLoading(true)

		if (values.newpassword !== values.repeatpassword) {

			setTimeout(() => {
				setLoading(false)
				message.error('Password Mismatch!');
			}, 1500);
		  } else if(values.newpassword.length < 6){

			message.error('Password must be more than 6 characters please!');
			setLoading(false)

		  } else if(values.repeatpassword.length < 6){

			message.error('Password must be more than 6 characters please!');
			setLoading(false)

		  }


		  
		  auth
		  .signInWithEmailAndPassword(values.email, '123456')
		  .then((response) => {
  
			let user = auth.currentUser;
  
			user
			  .updatePassword(values.newpassword)
			  .then(() => {
				message.success('Password updated Succesfully!');

				console.log('password updated');
				setLoading(false)

				history.push(`/app`)
			})
			  .catch((error) => {
				console.log(error)
				setLoading(false)

			  });
		  })
		  .catch((error) => {
			alert(error.message);
		
		  });
	  }


  

	return (
		<div className="h-100" style={backgroundStyle}>
			<div className="container d-flex flex-column justify-content-center h-100">
				<Row justify="center">
					<Col xs={20} sm={20} md={20} lg={9}>
						<Card>
							<div className="my-2">
								<div className="text-center">
									<img className="img-fluid" src="/img/logo.png" alt="" />
									<h3 className="mt-3 font-weight-bold">Reset Password?</h3>
									<p className="mb-4">Enter your Email and set password</p>
								</div>
								<Row justify="center">
									<Col xs={24} sm={24} md={20} lg={20}>
										<Form form={form} layout="vertical" name="reset-password" onFinish={onSend}>
											<Form.Item 
												name="email" 
												rules={
													[
														{ 
															required: true,
															message: 'Please input your email address'
														},
														{ 
															type: 'email',
															message: 'Please enter a validate email!'
														}
													]
												}>
												<Input placeholder="Email Address" prefix={<MailOutlined className="text-primary" />}/>
											</Form.Item>

											<Form.Item 
												name="newpassword" 
												rules={
													[
														{ 
															required: true,
															message: 'Please input your new password'
														}
													]
												}>
												<Input placeholder="New Password" type="password" prefix={<LockOutlined className="text-primary" />}/>
											</Form.Item>
											<Form.Item 
												name="repeatpassword" 
												rules={
													[
														{ 
															required: true,
															message: 'Please repeat your new password'
														}
													]
												}>
												<Input placeholder="Repeat Password" type="password" prefix={<LockOutlined className="text-primary" />}/>
											</Form.Item>
											<Form.Item>
												<Button loading={loading} type="primary" htmlType="submit" block>{loading? 'Sending' : 'Send'}</Button>
											</Form.Item>
										</Form>
									</Col>
								</Row>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	)
}

export default ForgotPassword

