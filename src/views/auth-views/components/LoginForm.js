import React, { useState, useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Alert, notification } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { UserContext } from '../../../provider/UserProvider'

import {
  signIn,
  showLoading,
  showAuthMessage,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
} from 'redux/actions/Auth'
import { useHistory, Redirect } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auth, firestore } from '../../../firebase'

export const LoginForm = (props) => {
  const { currentUser, userDetails } = useContext(UserContext)

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Error',
      description:
        'Invalid email and password combination entered. Please try again.',
    })
  }

  const openNotificationWithIconWarning = (type) => {
    notification[type]({
      message: 'Warning',
      description: 'Email and Password required to sign in!',
    })
  }

  let history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)

  const {
    showForgetPassword,
    onForgetPasswordClick,
    extra,
    redirect,
    showMessage,
    message,
  } = props

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget

    if (name === 'email') {
      setEmail(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }

  const onLogin = (values) => {
    setButtonLoading(true)
    if (email === '' || password === '') {
      openNotificationWithIconWarning('warning')
      setButtonLoading(false)
      return
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setButtonLoading(false)
        history.push(`/app`)
      })
      .catch((error) => {
        //console.log(error)
        setButtonLoading(false)
        openNotificationWithIcon('error')
      })
  }

  if (auth.currentUser !== null) {
    return <Redirect to="/app" />
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert type="error" showIcon message={message}></Alert>
      </motion.div>
      <Form layout="vertical" name="login-form" onFinish={onLogin}>
        <Form.Item
          label="Email"
          onChange={(event) => onChangeHandler(event)}
          rules={[
            {
              required: true,
              message: 'Please input your email',
            },
            {
              type: 'email',
              message: 'Please enter a validate email!',
            },
          ]}
        >
          <Input
            name="email"
            onChange={(event) => onChangeHandler(event)}
            prefix={<MailOutlined className="text-primary" />}
            required
          />
        </Form.Item>
        <Form.Item
          label={
            <div
              className={`${
                showForgetPassword
                  ? 'd-flex justify-content-between w-100 align-items-center'
                  : ''
              }`}
            >
              <span>Password</span>
              {showForgetPassword && (
                <span
                  onClick={() => onForgetPasswordClick}
                  className="cursor-pointer font-size-sm font-weight-normal text-muted"
                >
                  Forget Password?
                </span>
              )}
            </div>
          }
          rules={[
            {
              required: true,
              message: 'Please input your password',
            },
          ]}
        >
          <Input.Password
            name="password"
            onChange={(event) => onChangeHandler(event)}
            prefix={<LockOutlined className="text-primary" />}
            required
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={buttonLoading}
            type="primary"
            onClick={onLogin}
            block
          >
            Sign In
          </Button>
        </Form.Item>

        {extra}
      </Form>
    </>
  )
}

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
}

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth
  return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
  signIn,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
