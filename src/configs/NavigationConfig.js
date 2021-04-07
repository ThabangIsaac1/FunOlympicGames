import { 
  DashboardOutlined,UsergroupAddOutlined 
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


const dashBoardNavTree = [{
  key: 'dashboards',
  path: `${APP_PREFIX_PATH}/home`,
  title: 'SuperAdmin',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [
    {
      key: 'dashboard',
      path: `${APP_PREFIX_PATH}/home`,
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
const navigationConfig = [
  ...dashBoardNavTree
]

export default navigationConfig;
