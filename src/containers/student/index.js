import React from 'react'
import { Menu, Icon, Button } from 'antd';
import { Route, Link, Switch } from 'react-router-dom';
import HeaderBar from './header_bar/index.js';
import MyClass from './class'
import MyInfo from './center/info'
import Exam from './exam/enroll'
import MyExam from './exam/me'
import MyPassword from './center/password'
const SubMenu = Menu.SubMenu;

class Student extends React.Component {
	constructor() {
		super();
		this.state = {
			roleSet: '',
		}
	}

	componentWillMount() {
		//判断用户是否已经登录
		// if(!localStorage.getItem("userName")||!localStorage.getItem("role")=="student")
		//  {
		// 	this.props.history.push('/student/login');//跳转至登录页
		// }
		// this.setState({roleSet : localStorage.getItem("roleSet")})
	}

	render() {
		return (
			<div>
				<div 
				id="leftMenu"
				>
					<img 
						className="logo" 
						src={require("@assets/images/explore.jpg")} 
					/>
					<div>
						<Menu
							mode="inline"
							defaultSelectedKeys={['class']}
						>
							<Menu.Item key="class">
								<Icon type="pie-chart" />
								<span><Link to="/student/class">我的班级</Link></span>
							</Menu.Item>
							<Menu.Item key="enroll">
								<Icon type="profile" />
								<span><Link to="/student/exam/enroll">报名考试</Link></span>
							</Menu.Item>
							<Menu.Item key="exam">
								<Icon type="solution" />
								<span><Link to="/student/exam/me">我的考试</Link></span>
							</Menu.Item>
							<SubMenu key="center" title={<span><Icon type="user" /><span>个人中心</span></span>}>
								<Menu.Item key="info"><Link to="/student/center/info">个人信息</Link></Menu.Item>
								<Menu.Item key="password"><Link to="/student/center/password">修改密码</Link></Menu.Item>
							</SubMenu>
						</Menu>
					</div>
				</div>
				<div id="rightWrap">
					<HeaderBar></HeaderBar>
					<div className="right-box">
						<Route path="/student/class" component={MyClass} />
						<Route path="/student/exam/enroll" component={Exam} />
						<Route path="/student/exam/me" component={MyExam} />
						<Route path="/student/center/info" component={MyInfo} />
						<Route path="/student/center/password" component={MyPassword} />
					</div>
				</div>
			</div>
		)
	}
}

export default Student
