import React from 'react'
import { Form, Icon, Input, Button, Checkbox, Table } from 'antd';
import * as URL from '@components/interfaceURL.js'

const FormItem = Form.Item;


import {post} from "@components/axios";
import Axios from "axios"

class Index extends React.Component {

	constructor(){
			super()
			this.state = {
				my_class: []
			}
    }
    
    componentWillMount(){
			post(URL.my_class,
				{})
		 .then((res) => {
			console.log(res);
				this.setState({
					my_class:res.data
				})
			});
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
		}];

		return(
			<div >
				{this.state.my_class.map((item)=>{
					return (
						<div>
							<Table columns={columns} dataSource={this.state.my_class} />
						</div>
					)
				})}
			</div>
		)
	}
}

export default Index;