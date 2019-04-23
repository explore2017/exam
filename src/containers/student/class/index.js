import React from 'react'
import { Row, Col, Input, Button, Table, Card, Breadcrumb, Icon, message,Popconfirm } from 'antd';
import * as URL from '@components/interfaceURL.js'

import { post, DELETE } from "@components/axios";

class Index extends React.Component {

	constructor() {
		super()
		this.state = {
			classNo: undefined,
			list: []
		}
	}

	componentDidMount() {
		post(URL.my_class, {}).then((res) => {
			this.setState({
				list: res.data
			})
		});
	}

	// 学生加入班级
	addClass() {
		if(this.state.classNo==undefined){
				message.warning("请输入班级号");
				return;
		}
		post(URL.add_class_student,
			{ classNo: this.state.classNo });
	}

	handleExitClass(e) {
		DELETE(URL.delete_class_student,
			{ classNo: e.classNo });
	}
	
	render() {
		const columns = [{
			title: '班级',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '老师',
			dataIndex: 'teacherName',
			key: 'teacherName',
		}, {
			title: '科目',
			dataIndex: 'subjectName',
			key: 'subjectName',
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => (
					<Popconfirm title="你确定要退出吗?" onConfirm={()=>this.handleExitClass(record)}  okText="Yes" cancelText="No">
						<a>退出班级</a>
					</Popconfirm>
			),
		}];

		

		const onChange = (e) => {
			this.state.classNo = e.target.value;
		};

		return [
			<div>
				<Breadcrumb>
					<Breadcrumb.Item href="/">
						<Icon type="home" />
					</Breadcrumb.Item>
					<Breadcrumb.Item href="">
						<Icon type="user" />
						<span>我的班级</span>
					</Breadcrumb.Item>
					<Breadcrumb.Item>详情</Breadcrumb.Item>
				</Breadcrumb>
				<Card style={{ minHeight: 500 }}>
					<Row gutter={16}>
						<Col span={6} >
							<Input placeholder="请输入班级号" allowClear onChange={onChange} />
						</Col>
						<Col span={6} >
							<Button type="entry_class" onClick={this.addClass.bind(this)}>加入班级</Button>
						</Col>
					</Row>
					<div style={{ marginTop: 20 }}>
						<Table columns={columns} dataSource={this.state.list} />
					</div>
				</Card>
			</div>
		]
	}
}

export default Index;