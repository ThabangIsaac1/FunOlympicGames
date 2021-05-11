import React, { Component } from 'react'
import { Row, Col, Card, Avatar, Button } from 'antd';
import { Icon } from 'components/util-components/Icon'
import { employementList, interestedList, connectionList, groupList } from './profileData';
import { 
	GlobalOutlined,
	MailOutlined,
	HomeOutlined,
	PhoneOutlined
} from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import Flex from 'components/shared-components/Flex'
import ProductForm from 'views/app-views/admins/admins_addevent/ProductForm'

const ProfileInfo = props => (
	<Card>
		<Row justify="center"> 
			<Col sm={24} md={23}>
	
			<ProductForm mode="ADD"/>

			</Col>
		</Row>
	</Card>
)


export class Profile extends Component {
	render() {
		const avatarSize = 150;
		return (
			<>
				<PageHeaderAlt background="/img/others/img-12.jpg" cssClass="bg-primary" overlap>
					<div className="container text-center">
						<div className="py-5 my-md-5">
						</div>
					</div>
				</PageHeaderAlt>
				<div className="container my-4">
					<ProfileInfo avatarSize={avatarSize} />
				
				</div>
			</>
		)
	}
}

export default Profile
