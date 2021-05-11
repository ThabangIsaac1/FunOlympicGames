import React, { Component } from 'react';
import { SettingOutlined,PoweroffOutlined } from '@ant-design/icons';
import { Drawer, Menu, Popconfirm } from 'antd';
import ThemeConfigurator from './ThemeConfigurator';
import { connect } from "react-redux";
import { DIR_RTL } from 'constants/ThemeConstant';
import { auth } from '../../firebase'
import { Redirect } from 'react-router-dom'



export class NavPanel extends Component {
	state = { visible: false };

  
  SignOut = () => {
    auth
      .signOut()
      .then(() => {
        this.setState({
          ...this.state,
          isLoggedOut: true,
        })
        console.log('done')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
	};
	
	render() {
    if (this.isLoggedOut) {
      return <Redirect to="/auth/logout" />
    }
		return (
      <>
        <Menu mode="horizontal">
          <Menu.Item onClick={this.showDrawer}>
            <SettingOutlined className="nav-icon mr-0" />
            
          </Menu.Item>
          <Menu.Item onClick={null}>
            <Popconfirm
              placement="topLeft"
              title="Are you sure you want to log out of your session?"
              onConfirm={this.SignOut.bind(this)}
              okText="Yes"
              cancelText="No"
            >
              <PoweroffOutlined className="nav-icon mr-0" />
            </Popconfirm>
          </Menu.Item>
        </Menu>
        <Drawer
          title="Theme Config"
          placement={this.props.direction === DIR_RTL ? 'left' : 'right'} 
          width={350}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <ThemeConfigurator/>
        </Drawer>
      </>
    );
	}
}

const mapStateToProps = ({ theme }) => {
  const { locale } =  theme;
  return { locale }
};

export default connect(mapStateToProps)(NavPanel);