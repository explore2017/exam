import React from 'react'
import { Row, Col, Form, Icon, Input, Button, Tooltip, Table } from 'antd';
import * as URL from '@components/interfaceURL.js'

const FormItem = Form.Item;


import {post,DELETE} from "@components/axios";
import Axios from "axios"

class Index extends React.Component {

	constructor(){
			super()
			this.state = {
				add_class:'',
				my_class: []
			}
    }
    
    componentWillMount(){
			post(URL.my_class,
				{})
		 .then((res) => {
				this.setState({
					my_class:res.data
				})
			});
		}

		// 学生加入班级
		addClass(){
			post(URL.add_class_student,
				{classId: this.state.add_class});
		}

		// 学生退出班级
		deleteClass(record){
			DELETE(URL.delete_class_student,
				{classNo: record.classNo});
		}
		

	render(){
		const columns = [{
			title: '班级编号',
			dataIndex: 'classNo',
			key: 'classNo',
		}, {
			title: '老师',
			dataIndex: 'teacherName',
			key: 'teacherName',
		}, {
			title: '科目',
			dataIndex: 'subjectName',
			key: 'subjectName',
		}, {
			title: '活动',
			key: 'action',
			render: (text, record) => (
				<span >
					<a onClick={this.deleteClass.bind(this,record)}>退出班级</a>
				</span>
			),
		}];

		const onChange = (e) => {
			this.state.add_class = e.target.value;
		};

		return [
			<div>
				<Row gutter={16}>
					<Col span={6} >
						<Input placeholder="Enter ClassInfo" allowClear onChange={onChange} />
					</Col>
					<Col span={6} >
						<Button type="entry_class" onClick={this.addClass.bind(this)}>加入班级</Button>
					</Col>
				</Row>
			</div>,
				<div style={{marginTop:20}}>
					<Table columns={columns} dataSource={this.state.my_class} />
				</div>
		]
	}
}

export default Index;