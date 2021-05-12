import { 
  DashboardOutlined,UsergroupAddOutlined,CalendarOutlined  
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


const superAdminNavTree = [{
  key: 'super',
  path: `${APP_PREFIX_PATH}/`,
  title: 'SuperAdmin',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [
    {
      key: 'dashboard',
      path: `${APP_PREFIX_PATH}/`,
      title: 'Dashboard',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'add-admins',
      path: `${APP_PREFIX_PATH}/add-admins`,
      title: 'Add Admins',
      icon: UsergroupAddOutlined,
      breadcrumb: false,
      submenu: []
    }
  ]
}]

const adminAdminNavTree = [{
  key: 'admindash',
  path: `${APP_PREFIX_PATH}/home`,
  title: 'Admin',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [
    {
      key: 'admin',
      path: `${APP_PREFIX_PATH}/home`,
      title: 'Dashboard',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'Event',
      path: `${APP_PREFIX_PATH}/add-event`,
      title: 'Sporting Code',
      icon: CalendarOutlined ,
      breadcrumb: false,
      submenu: []
    }
  ]
}]

const subscriberNavTree = [{
  key: 'subscriber',
  path: `${APP_PREFIX_PATH}/subscribers`,
  title: 'Subscriber',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [
    {
      key: 'subscriber',
      path: `${APP_PREFIX_PATH}/subscribers`,
      title: 'Dashboard',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'watch',
      path: `${APP_PREFIX_PATH}/stream-event`,
      title: 'Stream Event',
      icon: CalendarOutlined ,
      breadcrumb: false,
      submenu: []
    }
  ]
}]
const navigationConfig = [
  ...superAdminNavTree,
  ...adminAdminNavTree,
  ...subscriberNavTree
]

export default navigationConfig;
