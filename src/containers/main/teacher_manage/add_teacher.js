import React from 'react'
import { connect } from 'react-redux'
import { Form,Input,Select,Row,Col,Button,Tag,} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import {post} from "@components/axios";
import * as URL from '@components/interfaceURL.js'

class AddTeacher extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pathList : ['教师管理','添加教师'],//面包屑路径
      managerId : 0,
      subjectArr:this.props.subjectinfo.subjectArr||[],
      subject:[],
    }
    this.addSubject=this.addSubject.bind(this);
  }
  //选择班级
  handleChange(value) {
  }

  //获取工号


  //提交
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let subjectId="";
        this.state.subject.map((item)=>{
          if(subjectId==="")
          {
            subjectId=item.id
          }
          else{
            subjectId+=","+item.id
          }       
        })     
        post(URL.add_teacher,{
          username:values.username,
          password:values.password,      
          name:values.name,
          subjectId:subjectId
        })
      }
    });
  }

  addSubject(){
    this.props.form.validateFields((err, values) => {

     this.state.subjectArr.map((item)=>{
       if(item.id===values.subject&&this.state.subject.indexOf(item)==-1){
        this.setState({
          subject:[...this.state.subject,item],
         })
       }
     })
    }
    )
  }

  handleTagClick(index){
    const newSubject= JSON.parse(JSON.stringify(this.state.subject))
    newSubject.splice(index,1);
    this.setState({
      subject:newSubject
    })
  }


  componentWillReceiveProps(nextProps){
      if(nextProps.subjectinfo.subjectArr){
        this.setState({subjectArr:nextProps.subjectinfo.subjectArr});
      }
  }
  render(){
    const { getFieldDecorator } = this.props.form;

    //表单布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 , offset : 4},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
     //科目列表
  let subject = [];
  this.state.subjectArr.map((item)=>{
    subject.push(
      <Option key={item.id} value={item.id}>{item.name}</Option>
    )
  })

    return(
      <div>
        <BreadcrumbCustom pathList={this.state.pathList}></BreadcrumbCustom>
        <div className="add-student-content">
          <Form onSubmit={this.handleSubmit.bind(this)}>
        
            <FormItem
              {...formItemLayout}
              label="用户名"
            >
              {getFieldDecorator('username', {
              rules: [{ required: true, message: '用户名不能为空！'}],
            })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('password', {
              rules: [{ required: true, message: '密码不能为空！'}],
              initialValue:123456
            })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('name', {
              rules: [{ required: true, message: '姓名不能为空！'}],
            })(
                <Input />
              )}
            </FormItem>
            <FormItem
            {...formItemLayout}
              label="科目"
            >          
              {getFieldDecorator('subject')(
                <Select size='default' style={{ width: 300 }}>               
                   {subject}
                </Select>
              )}
            <Button type="primary" style={{marginTop:0,marginLeft:0}} onClick={this.addSubject}  >增加课程</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已选科目"
            >
               
             {this.state.subject.map((item,index)=>{
               return <Tag color="blue" key={item.id} onClick={this.handleTagClick.bind(this,index)}>{item.name}</Tag>
             })}    
            </FormItem>
           
            <Row>
              <Col span={12} offset={4}>           
                <Button type="primary" htmlType="submit" className="f-r">添加</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
      subjectinfo: state.subjectinfo
  }
}

export default connect( mapStateToProps)(Form.create()(AddTeacher))
