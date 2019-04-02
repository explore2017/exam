import React from 'react'
import { connect } from 'react-redux'
import { Form,Input,Select,Row,Col,Button,Tag, InputNumber,} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { bindActionCreators } from 'redux'
import {post} from "@components/axios";
import * as URL from '@components/interfaceURL.js'
import {get} from '@components/axios.js'
import * as classinfoActions from '../../../actions/classinfo'

class AddTeacher extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pathList : ['班级管理','添加班级'],//面包屑路径
      managerId : 0,
      subjectArr:this.props.subjectinfo.subjectArr||[],
      teacher:[],
    }
  }

  handleChange(value) {
  }

   //得到老师数据
  getTacherDate(){
    get(URL.get_teacher)
    .then((res)=>{
      if(res.status==0){
        this.setState({
          teacher:res.data,     
        })
      }    
    })
  }
  componentWillMount(){
        this.getTacherDate();
  }



  //提交
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {     
        post(URL.add_class,{
          name:values.name, 
          subjectId:values.subject,
          teacherId:values.teacher,
        }).then(()=>{
          get(URL.get_class_info)
          .then((res)=>{
            //状态存储
            this.props.classinfoActions.setClassInfo({
              classArr: res.data
            })
          })
        })
      }
    });
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

     //老师列表
     let teacher = [];
     this.state.teacher.map((item)=>{
      teacher.push(
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
              label="班级名称"
            >
              {getFieldDecorator('name', {
              rules: [{ required: true, message: '班级名称不能为空！'}],
            })(
                <Input />
              )}
            </FormItem>
            <FormItem
            {...formItemLayout}
              label="科目"
            >          
              {getFieldDecorator('subject', {
              rules: [{ required: true, message: '科目不能为空！'}]}
            )(
                <Select size='default' style={{ width: 300 }}>               
                   {subject}
                </Select>
              )}      
            </FormItem>
            <FormItem
            {...formItemLayout}
              label="老师"
            >          
              {getFieldDecorator('teacher', {
              rules: [{ required: true, message: '老师不能为空！'}],
            })(
                <Select size='default' style={{ width: 300 }}>               
                   {teacher}
                </Select>
              )}      
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
      subjectinfo: state.subjectinfo,
      userinfo:state.userinfo
  }
}

function mapDispatchToProps(dispatch) {
  return {
      classinfoActions: bindActionCreators(classinfoActions, dispatch),
  }
}


export default connect( mapStateToProps,mapDispatchToProps)(Form.create()(AddTeacher))
