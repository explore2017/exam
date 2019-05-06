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
		this.getDate=this.getDate.bind(this);
	}

	getDate(){
		post(URL.my_class).then((res) => {
			this.setState({
				list: res.data
			})
		});
	}

	componentDidMount() {
		this.getDate();
	}

	// 学生加入班级
	addClass() {
		if(this.state.classNo==undefined){
				message.warning("请输入班级号");
				return;
		}
		post(URL.join_class_student+"?classNo="+this.state.classNo)
		.then((res)=>{
			if(res.status==0){
				this.getDate();
			}
		})
	}

	handleExitClass(e) {
		DELETE(URL.exit_class,1).then((res)=>{
				if(res.status==0){
					this.getDate();
				}
			});
	}
	
	render() {
		const columns = [{
			title: '班级',
			dataIndex: 'class.name',
			key: 'name',
		},{
			title: '班级号',
			dataIndex: 'class.classNo',
			key: 'classNo',
		}, {
			title: '老师',
			dataIndex: 'teacherName',
			key: 'teacherName',
		}, {
			title: '科目',
			dataIndex: 'subject.name',
			key: 'subject',
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
					<Breadcrumb.Item>
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