import React from 'react'
import { Table, Card, Breadcrumb, Icon, message, Popconfirm, Badge, Button } from 'antd';
import * as URL from '@components/interfaceURL.js'

import { get, post, DELETE } from "@components/axios";

class Index extends React.Component {

	constructor() {
		super()
		this.state = {
			list: []
		}
	}

	componentDidMount() {
		this.initData();
	}

	initData() {
		const api = 'http://localhost:8000/student/batch/me';
		get(api, {}).then((res) => {
			this.setState({
				list: res.data
			})
		});
	}

	handleCancel(record) {
		const api = 'http://localhost:8000/student/batch/cancel';
		post(api,
			{ id: record.id });
		this.initData();
	}

	render() {

		const columns = [{
			title: '考试名称',
			dataIndex: 'name',
			key: 'name',
			render:text =><span><a>{text}</a></span>
		}, {
			title: '批次',
			dataIndex: 'batch.name',
			key: 'batch.name',
			render:text =><span><a>{text}</a></span>
		}, {
			title: '考试开始时间',
			dataIndex: 'batch.startTime',
			key: 'batch.startTime',
		}, {
			title: '考试截止时间',
			dataIndex: 'batch.endTime',
			key: 'batch.endTime',
		}, {
			title: '当前状态',
			key: 'state',
			render: (text,record) => {
				return (
					<Button onClick={()=>this.handleStart(record)}>开始考试</Button>
				)
			}
		}];

		return [
			<div>
				<Breadcrumb>
					<Breadcrumb.Item href="/">
						<Icon type="home" />
					</Breadcrumb.Item>
					<Breadcrumb.Item href="">
						<Icon type="user" />
						<span>我的考试</span>
					</Breadcrumb.Item>
					<Breadcrumb.Item>已报名批次</Breadcrumb.Item>
				</Breadcrumb>
				<Card style={{ minHeight: 500 }}>
					<Table
						pagination={false}
						defaultExpandAllRows
						columns={columns}
						dataSource={this.state.list}
					/>
				</Card>
			</div>
		]
	}
}

export default Index;