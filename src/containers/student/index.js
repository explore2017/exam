import React from 'react'
import { Menu, Icon, Button } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
//路由组件
import { Route,Link,Switch  } from 'react-router-dom';
import 	HeaderBar from './header_bar/index.js';
import MyClass from './my_class'
import * as URL from '@components/interfaceURL.js'
import { get } from '@components/axios.js';

class Student extends React.Component {
	constructor(){
		super();
		this.state = {
				roleSet : '',
		}
	}


	componentWillMount(){
		//判断用户是否已经登录
		// if(!localStorage.getItem("userName")||!localStorage.getItem("role")=="student")
		//  {
		// 	this.props.history.push('/student/login');//跳转至登录页
		// }
		// this.setState({roleSet : localStorage.getItem("roleSet")})
	}


	render(){
		
		
		return(
			<div>
		     <div id="leftMenu">
			 <img className="logo" src={require("@assets/images/timg2.jpg")}/>
				<div>
				<Menu
				  mode="inline"							
		        >
					{/* 在这里写菜单 
				       <Link>是跳转的路径 
					 */}
				<SubMenu key="personal_center" title={<span><Icon type="user" /><span>个人中心aa</span></span>}>
				    <Menu.Item key="change_password"><Link to="/student/personal_center/change_password">修改密码</Link></Menu.Item>
				</SubMenu>
				<Menu.Item key="1">
            <Icon type="pie-chart" />
            <span><Link to="/student/my_class">我的班级</Link></span>
          </Menu.Item>
				</Menu>
				</div>         
			</div>
			<div id="rightWrap">
			<HeaderBar></HeaderBar>
			<div className="right-box">    
			{/* 在这里写路由 例如：
					<Route path="/student/personal_center/change_password" component={ChangePassword}/>
					path参数是拦截的路径， component是显示组件 且只能是/student的子路径 
					记得导入组件
					 */}
          <Route path="/student/my_class" component={MyClass}/>
			</div>
			</div>
			</div>
		)
	}
}



export default Student
