import React from 'react'
import { Table, Card, Breadcrumb, Icon, Button, Modal,Tag } from 'antd';
import * as URL from '@components/interfaceURL.js'

import { get, post } from "@components/axios";

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
		const api = 'http://localhost:8000/student/score/me';
		get(api).then((res) => {
			this.setState({
				list: res.data
			})
		});
	}

	render() {
		const columns = [{
			title: '考试',
			dataIndex: 'exam.name',
			key: 'exam.name',
			render: text => <span>{text}</span>
		}, {
			title: '批次',
			dataIndex: 'batch.name',
			key: 'batch.name',
			render: text => <span>{text}</span>
		}, {
			title: '当前状态',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				if (text == 3) {
					return (
						<Tag color="cyan">考试已提交，等待改卷</Tag>
					)
				} else if (text == 4) {
					return (
						<Tag color="red">缺考</Tag>
					)
				} else if (text == 5) {
					return (
						<Tag color="blue">已出成绩</Tag>
					)
				}
			}
		}, {
			title: '成绩',
			dataIndex: 'score',
			key: 'score',
			render: (text, record) => {
					return (
						<span>{text}分</span>
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
					<Breadcrumb.Item>我的成绩</Breadcrumb.Item>
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