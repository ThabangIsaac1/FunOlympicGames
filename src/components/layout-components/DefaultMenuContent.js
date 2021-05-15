import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Grid } from 'antd'
import IntlMessage from '../util-components/IntlMessage'
import Icon from '../util-components/Icon'
import { SyncOutlined } from '@ant-design/icons'
import { blankConfig } from 'configs/NavigationConfig'
import { connect } from 'react-redux'
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from 'constants/ThemeConstant'
import utils from 'utils'
import { onMobileNavToggle } from 'redux/actions/Theme'

const { SubMenu } = Menu
const { useBreakpoint } = Grid

const setLocale = (isLocaleOn, localeKey) =>
  isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString()

const setDefaultOpen = (key) => {
  let keyList = []
  let keyString = ''
  if (key) {
    const arr = key.split('-')
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index]
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`)
      keyList.push(keyString)
    }
  }
  return keyList
}

const SideNavContent = (props) => {
  const {
    sideNavTheme,
    routeInfo,
    hideGroupTitle,
    localization,
    onMobileNavToggle,
  } = props
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
  const closeMobileNav = () => {
    if (isMobile) {
      onMobileNavToggle(false)
    }
  }
  return <SyncOutlined spin />
}

const TopNavContent = (props) => {
  const { topNavColor, localization } = props
  return <SyncOutlined style={{ marginLeft: '35px', marginTop: '60px' }} spin />
}

const MenuContent = (props) => {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  )
}

const mapStateToProps = ({ theme }) => {
  const { sideNavTheme, topNavColor } = theme
  return { sideNavTheme, topNavColor }
}

export default connect(mapStateToProps, { onMobileNavToggle })(MenuContent)
