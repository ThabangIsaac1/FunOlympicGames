import React, { useEffect, useContext, useState } from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_DARK,
  NAV_TYPE_SIDE,
} from 'constants/ThemeConstant'
import { Scrollbars } from 'react-custom-scrollbars'
// import CompanyMenuContent from './CompanyMenuContent'
// import MemberMenuContent from './MemberMenuContent'
// import DefaultMenuContent from './DefaultMenuContent'
import { UserContext } from '../../provider/UserProvider'
import MenuContent from './MenuContent'
import AdminContent from './AdminMenuContent'
import SuperContent from './SuperMenuContent'
import SubscriberContent from './SubscriberMenuContent'
import DefaultMenuContent from './DefaultMenuContent'

const { Sider } = Layout

export const SideNav = ({
  navCollapsed,
  sideNavTheme,
  routeInfo,
  hideGroupTitle,
  localization = true,
}) => {
  let { currentUser } = useContext(UserContext)
  currentUser = JSON.parse(localStorage.getItem('current-user'))

  const [claim, setClaim] = useState({})

  const props = { sideNavTheme, routeInfo, hideGroupTitle, localization }

  useEffect(() => {
    fetch(
      `https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/retrieve-claim/${currentUser.email}`,
    )
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error('Error fetching data.')
        }
      })
      .then((claim) => {
        console.log(claim)
        setClaim(claim)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <Sider
      className={`side-nav ${
        sideNavTheme === SIDE_NAV_DARK ? 'side-nav-dark' : ''
      }`}
      width={SIDE_NAV_WIDTH}
      collapsed={navCollapsed}
    >
      <Scrollbars autoHide>
        {/** Conditional render of menus ************/}
        {claim.super ? (
          <SuperContent type={NAV_TYPE_SIDE} {...props} />
        ) : claim.olympicAdmin ? (
          <AdminContent type={NAV_TYPE_SIDE} {...props} />
        ) : claim.subscriber ? (
          <SubscriberContent type={NAV_TYPE_SIDE} {...props} />
        ) : (
          <DefaultMenuContent />
        )}
        {/*******************************************/}
      </Scrollbars>
    </Sider>
  )
}

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, sideNavTheme } = theme
  return { navCollapsed, sideNavTheme }
}

export default connect(mapStateToProps)(SideNav)
