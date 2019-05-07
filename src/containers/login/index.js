import React from 'react'
import { Form, Icon, Input, Button, Checkbox,Menu, } from 'antd';
const FormItem = Form.Item;


import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//actions
import * as userinfoActions from '../../actions/userinfo'

import { axiosLogin } from './axios'

class Login extends React.Component {

	constructor(){
		super()
		this.state = {
			loginTip : '',
			current:'teacher',
			role:0
		}
		this.handleClick=this.handleClick.bind(this);
		// this.handleSubmit=this.handleSubmit.bind(this);
	}

	handleSubmit(e){
	 e.preventDefault();

	 this.props.form.validateFields((err, values) => {
		 if (!err) {
			 axiosLogin({
				 username : values.userName,
				 password : values.password,
			 },this.state.role,(res) => {
				 if(res.status === 0) {//登录成功
					 //发送Action  向Store 写入用户名和密码
					 this.props.userinfoActions.login({
							userName: values.userName,
							id:res.data.id
						})

						//本地存储用户名
						localStorage.setItem("userName",values.userName);

						localStorage.setItem("id",res.data.id);

						localStorage.setItem("role",this.state.role);
						//跳转主页
					 	this.props.history.push('/main/homepage');//react-router 4.0 写法
				 }
				 else if(res.status === 1) {//登录失败
					 this.setState({loginTip : "登录名或密码错误"})
				 }
				 else if(res.status === -1){ //系统错误
					 this.setState({loginTip : "系统出错了，请稍等~"})
				 }
			 },(err) => {
				 console.log(err);
			 });


		 }
	 });
 }

 handleClick(e){ 
	 let role=0;
	 if(e.key=="manage"){
		 role=1;
	 }
	this.setState({
		current: e.key,
		role:role,
	});
	this.props.form.resetFields();
}


	render(){
		const { getFieldDecorator } = this.props.form;
		return(
			<div className="login">
				<div className="login-content-wrap">
						<div className="login-content">
						<Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
			     <Menu.Item key="teacher" style={{marginLeft:20}}>
          <Icon type="user" />老师登陆
        </Menu.Item>
				<Menu.Item key="manage" style={{marginLeft:20}} >
				<Icon type="android" />管理员登陆
        </Menu.Item>
				</Menu>
							{this.state.role==0?<img className="logo" src={require("@assets/images/pencil.svg")}/>
							: ''		}
										{this.state.role==1?<img className="logo" src={require("@assets/images/manage.png")}/>
							: ''		}
							<div className="login-from">
								<div className="login-tip">{this.state.loginTip}</div>
								<Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
					        <FormItem>
					          {getFieldDecorator('userName', {
					            rules: [{ required: true, message: '请输入用户名！' }],
					          })(
					            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
					          )}
					        </FormItem>
					        <FormItem>
					          {getFieldDecorator('password', {
					            rules: [{ required: true, message: '请输入密码！' }],
					          })(
					            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
					          )}
					        </FormItem>
					        <FormItem>
						          <Button type="primary" htmlType="submit" className="login-form-button">
						          	登录
						          </Button>
					        </FormItem>
					      </Form>
							</div>
						</div>
				</div>

			</div>
		)
	}
}

//传递state给子组件
function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}

//组合userinfoActions和dispatch的对象传递给子组件
//在子组件中，调用userinfoActions.action1,相当于实现了store.dispatch(action1)
//于是我们就实现了在没有store和dispatch组件中，如何调用dispatch(action)
function mapDispatchToProps(dispatch) {
    return {
        userinfoActions: bindActionCreators(userinfoActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(Login))
