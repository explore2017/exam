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
      pathList : ['学生管理','添加学生'],//面包屑路径
      managerId : 0,
      classArr:this.props.classinfo.classArr||[],
      classes:[],
    }
    this.addClass=this.addClass.bind(this);
  }
  //选择班级
  handleChange(value) {
  }

  //提交
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let classId="";
        this.state.classes.map((item)=>{
          if(classId==="")
          {
            classId=item.id
          }
          else{
            classId+=","+item.id
          }       
        })     
        post(URL.add_student,{
          sno:values.username,
          password:values.password,      
          name:values.name,
          classes:classId
        })
      }
    });
  }

  addClass(){
    this.props.form.validateFields((err, values) => {

     this.state.classArr.map((item)=>{
       if(item.id===values.classes&&this.state.classes.indexOf(item)==-1){
        this.setState({
          classes:[...this.state.classes,item],
         })
       }
     })
    }
    )
  }

  handleTagClick(index){
    const newClass= JSON.parse(JSON.stringify(this.state.classes))
    newClass.splice(index,1);
    this.setState({
      classes:newClass
    })
  }


  componentWillReceiveProps(nextProps){
      if(nextProps.classinfo.classArr){
        this.setState({classArr:nextProps.classinfo.classArr});
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
  let classes = [];
  this.state.classArr.map((item)=>{
    classes.push(
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
              label="学号"
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
              {getFieldDecorator('name')(
                <Input />
              )}
            </FormItem>
            <FormItem
            {...formItemLayout}
              label="添加班级"
            >          
              {getFieldDecorator('classes')(
                <Select size='default' style={{ width: 300 }}>               
                   {classes}
                </Select>
              )}
            <Button type="primary" style={{marginTop:0,marginLeft:0}} onClick={this.addClass}  >增加班级</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已选班级"
            >
               
             {this.state.classes.map((item,index)=>{
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
      classinfo: state.classinfo
  }
}

export default connect( mapStateToProps)(Form.create()(AddTeacher))
