import React from 'react'
import { Table, Card, Breadcrumb, Icon, Button, Modal,Tag } from 'antd';
import { Link } from 'react-router-dom'
import * as URL from '@components/interfaceURL.js'

import { get, post } from "@components/axios";

class Index extends React.Component {

	constructor() {
		super()
		this.state = {
			list: [],
			visible: false,
			batchId: undefined
		}
	}

	componentDidMount() {
		this.initData();
	}

	initData() {
		const api = 'http://localhost:8000/student/batch/me';
		get(api).then((res) => {
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

	handleStart(record) {
		this.setState({
			batchId:record.batchId			
		},()=>{
			//继续考试
			if(record.status==2){
				this.openExam();
			}else{
				const api = 'http://localhost:8000/exam/batch/' + record.batchId + '/check';
				get(api).then((res) => {
					if (res.status == 0) {
						this.setState({
							visible:true
						})
					}
				});
			}
		})
	}

	openExam(){
		window.open("#/reply/"+this.state.batchId,'_blank'); 
	}

	handleOk(e) {
		this.setState({
			visible: false,
		});
		this.openExam();
	}

	handleCancel(e) {
		this.setState({
			visible: false,
		});
	}

	handleSign(record){
		const api = 'http://localhost:8000/exam/batch/' + record.batchId + '/sign';
		post(api).then((res) => {
			if (res.status == 0) {
				this.initData();
			}
		});
	}

	render() {
		
		const columns = [{
			title: '考试',
			dataIndex: 'exam.name',
			key: 'exam.name',
			render: text => <span><a>{text}</a></span>
		}, {
			title: '批次',
			dataIndex: 'batch.name',
			key: 'batch.name',
			render: text => <span><a>{text}</a></span>
		}, {
			title: '考试开始时间',
			dataIndex: 'batch.startTime',
			key: 'batch.startTime',
		}, {
			title: '考试截止时间',
			dataIndex: 'batch.endTime',
			key: 'batch.endTime',
		}, {
			title: '状态',
			dataIndex:'status',
			key: 'status',
			render: (text, record) => {
				if(text==0){
					return (
						<Button size="small" onClick={() => this.handleSign(record)}>签到</Button>
					)
				}else if(text==2){
					return (
						<Button size="small" onClick={() => this.handleStart(record)}>继续考试</Button>
					)
				}else if(text==1){
					return (
						<Button size="small" onClick={() => this.handleStart(record)}>开始考试</Button>
					)
				}else if(text==3){
					return(
						<Tag color="cyan">已提交</Tag>
					)
				}else if(text==4){
					return(
						<Tag color="red">缺考</Tag>
					)
				}else if(text==5){
					return(
						<Link to='/student/score/me'><Tag color="cyan">已出成绩</Tag></Link>
					)
				}
				
			}
		}];

		return [

			<div>
				<Breadcrumb>
					<Breadcrumb.Item >
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
				<Modal
					title="考试注意事项"
					visible={this.state.visible}
					onOk={() => this.handleOk()}
					onCancel={() => this.handleCancel()}
					okText="同意"
          cancelText="取消"
				>
					<p>阅读考试注意事项</p>
				</Modal>
			</div>
		]
	}
}

export default Index;