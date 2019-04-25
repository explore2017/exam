import React from 'react'
import { Row, Col, Form, Icon, Input, Button, Tooltip, Table, Card,Breadcrumb } from 'antd';
import * as URL from '@components/interfaceURL.js'
import { post, DELETE } from "@components/axios";
const FormItem = Form.Item;


class Index extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			user: {}
		}
	}

	componentWillMount() {
		this.setState({
			user: JSON.parse(localStorage.getItem('user'))
		})
	}

	submitChange(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const api = 'http://localhost:8000/student/reviseMessage';
				post(api,{
						phone: values.phone,
						email: values.email
					}).then((res)=>{
						if(res.status==0){
							let user = this.state.user;
							user.phone = values.phone,
							user.phone = values.phone,
							localStorage.setItem('user',JSON.stringify(user));
						}
					})
			}
		});
	}

	render() {

		const { getFieldDecorator } = this.props.form;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4, offset: 4 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
		};

		return (
			<div>
			<Breadcrumb>
					<Breadcrumb.Item href="/">
						<Icon type="home" />
					</Breadcrumb.Item>
					<Breadcrumb.Item href="">
						<Icon type="user" />
						<span>个人中心</span>
					</Breadcrumb.Item>
					<Breadcrumb.Item>个人信息</Breadcrumb.Item>
				</Breadcrumb>
			<Card>
				<Form onSubmit={this.submitChange.bind(this)}>
					<FormItem
						{...formItemLayout}
						label="学号"
					>
						{this.state.user.sno}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="姓名"
					>
						{this.state.user.name}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="电话"
					>
						{getFieldDecorator('phone', {
							initialValue:this.state.user.phone,
							rules: [{ required: false, message: '请输入电话！' }],
						})(
							<Input placeholder='请输入电话' />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="邮箱"
					>
						{getFieldDecorator('email', {
							initialValue:this.state.user.email,
							rules: [{ required: false, message: '请输入邮箱！' }],
						})(
							<Input placeholder='请输入邮箱'/>
						)}
					</FormItem>
					<Row>
						<Col span={12} offset={4}>
							<Button type="primary" htmlType="submit" className="f-r">修改</Button>
						</Col>
					</Row>
				</Form>
			</Card>
			</div>
		)
	}
}

export default Form.create()(Index);