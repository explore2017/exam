//单选题
import React from 'react';
import {post} from '@components/axios.js'
import { Form,Input,Select,Icon,Radio,Row,Col,Button,InputNumber ,message,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
import * as URL from '@components/interfaceURL.js'

class QTrueOrFalse extends React.Component {
  constructor(){
    super();
    this.state = {
      fileList : [],
      rightAnswer : '',
      localCounter : 0
    }
  }

  //提交
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        //提交题目信息
        post(URL.add_question,{
          content:values.tigan,
          questionTypeId:1,                  
          answer:values.answer,
          isSubjective:1,
          difficulty:values.diffculty,
          subjectId:values.subject,
          keyPoint:values.knowledgePoint,
          defaultScore:values.defaultScore,
          title:'判断题',
        }).then((res)=>{
          if(res.status==0){
            this.props.form.resetFields()
          }         
        }); 
      }
    });
  }

  render(){
    //验证
    const { getFieldDecorator } = this.props.form;

    //表单项布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };


    //科目列表
    let subject = [];
    this.props.subjectinfo.map((item)=>{
      subject.push(
        <Option key={item.id} value={item.id}>{item.name}</Option>
      )
    })

    return(
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
            {...formItemLayout}
            label="科目"         >          
            {getFieldDecorator('subject', {
              rules: [{ required: true, message: '科目不能为空'}]
            })(
              <Select style={{ width: 120 }}>
               {subject}
              </Select>      
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="知识点"
          >
            {getFieldDecorator('knowledgePoint', {
              rules: [{ required: true, message: '知识点不能为空！'}],
            })(
              <Input style={{ width: 120 }}/>        
            )}
          </FormItem>
          <FormItem 
           {...formItemLayout}
            label="难度选择">
             {getFieldDecorator('diffculty', {
              rules: [{ required: true, message: '请选择难度'}],
            })(
              <Select style={{ width: 120 }} >
         <Option value={0}>简单</Option>
         <Option value={1}>中等</Option>
         <Option value={2}>困难</Option>
       </Select>      
            )}
         
          </FormItem>
          <FormItem
           {...formItemLayout}
            label="默认分数"
          >
            {getFieldDecorator('defaultScore', {
             initialValue:3
            })(
              <InputNumber  style={{ width: 120 }}/>      
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="题干"
          >
            {getFieldDecorator('tigan',{
              rules: [{ required: true, message: '题干不能为空！' }],
            })(
                  <TextArea rows={4} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="答案"
          >
            {getFieldDecorator('answer',{ 
                rules: [{ required: true, message: '答案不能为空！' }]})(
              <RadioGroup>
                <Radio value={0}>正确</Radio>
                <Radio value={1}>错误</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
          >
            <Row>
              <Col sm={3} xs={0}>
              </Col>
              <Col sm={20} xs={24}>
                <Row>
                  <Col sm={4} xs={4} offset={13}>

                  </Col>
                  <Col sm={4} xs={4}>
                    <Button type="primary" htmlType="submit" className="f-r">保存</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
    )
  }

}

export default Form.create()(QTrueOrFalse);
