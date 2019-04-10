import React from 'react'
import { Table, Card, Breadcrumb, Icon, message, Popconfirm, Badge } from 'antd';
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
		const api = 'http://localhost:8000/student/exam';
		get(api, {}).then((res) => {
			this.setState({
				list: res.data
			})
		});
	}

	handleEnroll(record) {
		const api = 'http://localhost:8000/student/batch/enroll';
		post(api,
			{ id: record.id });
		this.initData();
	}

	handleCancel(record) {
		const api = 'http://localhost:8000/student/batch/cancel';
		post(api,
			{ id: record.id });
		this.initData();
	}

	render() {

		const expandedRowRender = (record) => {
			const columns = [
				{ title: '批次', dataIndex: 'name', key: 'name' },
				{ title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
				{ title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
				{
					title: '人数', dataIndex: 'maxNumber', key: 'maxNumber', render: (text, record) => {
						return (
							<span>{record.selectedNumber}/{text}</span>
						)
					}
				},
				{
					title: '状态', key: 'state', render: (text, record) => {
						if (record.isFull) {
							return (
								<span><Badge status="error" />disable</span>
							)
						} else {
							return (
								<span><Badge status="success" />enable</span>
							)
						}
					}
				},
				{ title: '描述', dataIndex: 'describe', key: 'describe' },
				{
					title: 'Action',
					key: 'operation',
					render: (text, record) => {
						if (record.hasSelected) {
							return (
								<span className="table-operation">
									<Popconfirm title="你确定要取消吗?" onConfirm={() => this.handleCancel(record)} okText="Yes" cancelText="No">
										<a style={{ color: 'red' }} href="javascript:;">取消</a>
									</Popconfirm>
								</span>
							)
						} else {
							return (
								<span className="table-operation">
									<a onClick={() => this.handleEnroll(record)} href="javascript:;">报名</a>
								</span>
							)
						}
					},
				},
			];

			return (
				<Table
					columns={columns}
					dataSource={record.batches}
					pagination={false}
				/>
			);
		};

		const columns = [{
			title: '考试名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '报名开始时间',
			dataIndex: 'startTime',
			key: 'startTime',
		}, {
			title: '报名截止时间',
			dataIndex: 'endTime',
			key: 'endTime',
		}, {
			title: '报名状态',
			dataIndex: 'hasEnroll',
			key: 'hasEnroll',
			render: (text) => {
				if (text) {
					return (
						<span style={{ color: 'green' }}>已选择批次</span>
					)
				} else {
					return (
						<span style={{ color: 'orange' }}>未选择批次</span>
					)
				}
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
						<span>报名考试</span>
					</Breadcrumb.Item>
					<Breadcrumb.Item>考试列表</Breadcrumb.Item>
				</Breadcrumb>
				<Card style={{ minHeight: 500 }}>
						<Table
							pagination={false}
							defaultExpandAllRows
							expandedRowRender={(record) => expandedRowRender(record)}
							columns={columns}
							dataSource={this.state.list}
						/>
				</Card>
			</div>
		]
	}
}

export default Index;