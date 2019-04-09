import React from 'react'
import { Row, Col, Form, Icon, Input, Button, Tooltip, Table, Card } from 'antd';
import * as URL from '@components/interfaceURL.js'

const FormItem = Form.Item;


import { post, DELETE } from "@components/axios";
import Axios from "axios"

class Index extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentWillMount() {

	}

	render() {
		return(
			<Card>

			</Card>
		)
	}
}

export default Index;