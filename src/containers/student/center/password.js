import React from 'react'
import { Row, Col, Form, Icon, Input, Button, Card,message,Modal } from 'antd';
import * as URL from '@components/interfaceURL.js'

const FormItem = Form.Item;

import { post } from "@components/axios";

class Index extends React.Component {

  submitChange(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.newPassword !== values.confirmPassword) {
          Modal.warning({
            title: '两次输入的密码不一致',
            okText: '确定'
          })
          return;
        }
        const api = 'http://localhost:8000/student/password';
        post(api,{
            newPassword: values.newPassword,
            oldPassword: values.oldPassword
          }).then((res)=>{
            if(res.status==0){
              this.props.form.resetFields();
            }
          })
      }
    });
  }

  
  passwordChangeHandler(e){
    if(e.target.value!==this.props.form.getFieldValue('newPassword')){
      //TODO 
    }
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
      <Card>
        <Form style={{marginTop:50,marginBottom:50}} onSubmit={this.submitChange.bind(this)}>
          <FormItem
            {...formItemLayout}
            label="原密码"
          >
            {getFieldDecorator('oldPassword', {
              rules: [{ required: true, message: '请输入原密码！' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新密码"
          >
            {getFieldDecorator('newPassword', {
              rules: [{ required: true, message: '请输入新密码！' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码"
          >
            {getFieldDecorator('confirmPassword', {
              rules: [{ required: true, message: '请输入确认密码！' }],
            })(
              <Input onChange={this.passwordChangeHandler.bind(this)}/>
            )}
          </FormItem>
          <Row>
            <Col span={12} offset={4}>
              <Button type="primary" htmlType="submit" className="f-r">确定</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(Index);