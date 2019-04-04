import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

import {post} from "@components/axios";
import * as URL from '@components/interfaceURL.js';

class StudentLogin extends React.Component {

	constructor(){
		super()
		this.state = {
			loginTip : ''
		}
	}

	handleSubmit(e){
	 e.preventDefault();

	 this.props.form.validateFields((err, values) => {
		 if (!err) {		
             post(URL.student_login,
                {
                    username:values.sno,
                    password:values.password
                })
             .then((res) => {
				 if(res.status === 0) {//登录成功		
						//本地存储用户名
                        localStorage.setItem("userName",values.sno);
                        localStorage.setItem("role","student");
						//跳转主页
					 	this.props.history.push('/student');//react-router 4.0 写法
				 }
				 else if(res.status === 1) {//登录失败
					 this.setState({loginTip : "学号或密码错误"})
				 }
				 else if(res.status === -1){ //系统错误
					 this.setState({loginTip : "系统出错了，请稍等~"})
				 }
			 });
		 }
	 });
 }

	render(){
		const { getFieldDecorator } = this.props.form;
		return(
			<div className="student_login">
				<div className="login-content-wrap">
						<div className="login-content" >
							<img className="logo" src={require("@assets/images/timg2.jpg")}/>
							<div className="login-from" >
								<div className="login-tip">{this.state.loginTip}</div>
								<Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
					        <FormItem>
					          {getFieldDecorator('sno', {
					            rules: [{ required: true, message: '请输入学号！' }],
					          })(
					            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="学号" />
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



export default Form.create()(StudentLogin)