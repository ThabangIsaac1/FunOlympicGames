/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import { Card } from 'antd'
import SuperAdmins from './administrators'
import Admins from './superadmins'

const tabList = [
  {
    key: 'tab1',
    tab: 'System Admins',
  },
  
]

const contentList = {
  tab1: <Admins />,
  tab2: <SuperAdmins />,
}

const tabListNoTitle = [
  {
    key: 'article',
    tab: 'article',
  },
  {
    key: 'app',
    tab: 'app',
  },
  {
    key: 'project',
    tab: 'project',
  },
]

const contentListNoTitle = {
  article: <p>article content</p>,
  app: <p>app content</p>,
  project: <p>project content</p>,
}

export class Tabs extends Component {
  state = {
    key: 'tab1',
    noTitleKey: 'app',
  }

  onTabChange = (key, type) => {
    console.log(key, type)
    this.setState({ [type]: key })
  }

  componentDidMount() {
    console.log('did mount')
  }

  render() {
    return (
      <div>
        <Card
          style={{ width: '100%' }}
          title="User Management"
          extra={<a href="#"></a>}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={(key) => {
            this.onTabChange(key, 'key')
          }}
        >
          {contentList[this.state.key]}
        </Card>
      </div>
    )
  }
}

export default Tabs
