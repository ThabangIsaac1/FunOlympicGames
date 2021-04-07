import React from 'react'
import { connect } from 'react-redux'
import { Radio, Switch, Button, message } from 'antd';
import { 
	toggleCollapsedNav, 
	onNavTypeChange,
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme,
	onDirectionChange
} from 'redux/actions/Theme';
import { CopyOutlined } from '@ant-design/icons';
import ColorPicker from 'components/shared-components/ColorPicker';
import CopyToClipboard from 'react-copy-to-clipboard';
import NavLanguage from './NavLanguage';
import { 
	SIDE_NAV_LIGHT,
	NAV_TYPE_SIDE,
	NAV_TYPE_TOP,
	SIDE_NAV_DARK,
	DIR_RTL,
	DIR_LTR
} from 'constants/ThemeConstant';
import { useThemeSwitcher } from "react-css-theme-switcher";
import utils from 'utils/index';

const colorOptions = [
	'#3e82f7',
	'#24a772',
	'#de4436',
	'#924aca',
	'#193550'
]

const ListOption = ({name, selector, disabled, vertical}) => (
	<div className={`my-4 ${vertical? '' : 'd-flex align-items-center justify-content-between'}`}>
		<div className={`${disabled ? 'opacity-0-3' : ''} ${vertical? 'mb-3' : ''}`}>{name}</div>
		<div>{selector}</div>
	</div>
)

export const ThemeConfigurator = ({ 
	navType, 
	sideNavTheme, 
	navCollapsed,
	topNavColor,
	headerNavColor,
	locale,
	currentTheme,
	toggleCollapsedNav, 
	onNavTypeChange, 
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme,
	direction,
	onDirectionChange
}) => {
	const isNavTop = navType === NAV_TYPE_TOP? true : false
	const isCollapse = navCollapsed 

	const { switcher, themes } = useThemeSwitcher();

	const toggleTheme = (isChecked) => {
		onHeaderNavColorChange('')
		const changedTheme = isChecked ? 'dark' : 'light'
		onSwitchTheme(changedTheme)
    switcher({ theme: themes[changedTheme] });
  };

	const ontopNavColorClick = (value) => {
		onHeaderNavColorChange('')
		const { rgb } = value
		const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
		const hex = utils.rgbaToHex(rgba)
		onTopNavColorChange(hex)
	}
	const onHeaderNavColorClick = (value) => {
		const { rgb } = value
		const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
		const hex = utils.rgbaToHex(rgba)
		onHeaderNavColorChange(hex)
	}

	const onNavTypeClick = (value) => {
		onHeaderNavColorChange('')
		if(value === NAV_TYPE_TOP) {
			onTopNavColorChange(colorOptions[0])
			toggleCollapsedNav(false)
		}
		onNavTypeChange(value)
	}

	const genCopySettingJson = (configState) => JSON.stringify(configState, null, 2);

	return (
		<>
			<div className="mb-5">
				<h4 className="mb-3 font-weight-bold">Navigation</h4>
				
				
			
			
				<ListOption 
					name="Dark Theme:"
					selector={
						<Switch checked={currentTheme === 'dark'} onChange={toggleTheme} />
					}
				/>
				
			</div>
		
			
		</>
	)
}

const mapStateToProps = ({ theme }) => {
  const { navType, sideNavTheme, navCollapsed, topNavColor, headerNavColor, locale, currentTheme, direction } =  theme;
  return { navType, sideNavTheme, navCollapsed, topNavColor, headerNavColor, locale, currentTheme, direction }
};

const mapDispatchToProps = {
	toggleCollapsedNav,
	onNavTypeChange,
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme,
	onDirectionChange
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeConfigurator)
