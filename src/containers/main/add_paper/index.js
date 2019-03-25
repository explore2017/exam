import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form,Input,Select,Icon,Empty,Row,Col,Button,message,InputNumber,Card,List ,Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const confirm = Modal.confirm;
import { connect } from 'react-redux'
const { Meta } = Card;
import {Link} from 'react-router-dom'
import * as URL from '@components/interfaceURL.js'
import { cpus } from 'os';
import { get,DELETE,post,put } from '@components/axios.js';

class Paper extends React.Component {
  constructor(){
    super()
    this.state = {
      pathList : ['出卷'],
      visibleChangeModal : false,//修改框是否显示
      localCounter : 0,
      data:[],
      curSelectPaper : {
        id:0,
        name:'',
        describe:'',
        subjectId:0,
        difficulty:0,
        needTime:0,
        passScore:0,
        totalScore:0,
        usufruct:0,
        subjectName:''
      },
    }
  }



  //提交
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        post(URL.add_paper,{
          name:values.name,
          subjectId:values.subjectId,
          needTime:values.need_time,
          describe:values.describe,
          usufruct:values.usufruct,
          difficulty:values.difficulty,
          totalScore:values.total_score,
          passScore:values.pass_score,
          creator:localStorage.getItem("userName"),
        }).then((res)=>{
          if(res.status==0){
            this.getPaperData();
          
          }
        })
      }
    })
    
  }

  getPaperData(){
    get(URL.get_papers).then((res)=>{
      if(res.status==0){
          this.setState({data:res.data});
      }
    })   
  }

  componentDidMount(){
    this.getPaperData();
  }

   //确认修改
   changeOk(){
    this.props.form.validateFieldsAndScroll(['Nname', 'Ntotal_score','Nneed_time','Ndescribe','Nusufruct','Npass_score','Ndifficulty'],(err, values) => {
      if (!err) {
        put(URL.change_paper,{
          id:this.state.curSelectPaper.id,
          name:values.Nname,
          needTime:values.Nneed_time,
          describe:values.Ndescribe,
          usufruct:values.Nusufruct,
          difficulty:values.Ndifficulty,
          totalScore:values.Ntotal_score,
          passScore:values.Npass_score,
        }).then((res)=>{
          if(res.status==0){
            this.getPaperData();
          }
        })
      }
    });
    this.setState({visibleChangeModal:false})
  }


   //删除
   deletePaper(id){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_paper,id)
        .then((res)=>{
          if(res.status==0)
          { 
            this.getPaperData();
          }       
        }) 
      },
    });

  }

   //取消修改
   changeCancel(){
    this.setState({visibleChangeModal:false})
  }

  changePaper(item){
    this.setState({curSelectPaper:item,visibleChangeModal:true})
  }

 

  render(){
    //验证
    const { getFieldDecorator } = this.props.form;

    //表单项布局
    const formItemLayout = {
      labelCol: {
        sm: { span: 12 },
      },
      wrapperCol: {
        sm: { span: 12 },
      },
    };

    const formItemLayoutTop = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 6 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 18 }
      },
    }

    //科目信息
    let subjectArr = [];
    if(this.props.subjectinfo.subjectArr) {
      subjectArr = this.props.subjectinfo.subjectArr.map((item)=>{
        return (
          <Option value={item.id} key={item.id}>{item.name}</Option>
        )
      })
    }

    return (
      <div>
        <BreadcrumbCustom pathList={this.state.pathList}></BreadcrumbCustom>
        <div className="choose-questions-content" style={{ background: '#ECECEC', padding: '0px' }}>
          <Form onSubmit={this.handleSubmit.bind(this)} className="ant-advanced-search-form">
            <Row>
              <Col span={8}>
              <FormItem
                  label="试卷名称"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('name',{
                     rules: [{ required: true, message: '请输入试卷名称'}]})(
                     <Input style={{width:250}} ></Input>
                  )}
                </FormItem>
                <FormItem
                  label="试卷描述"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('describe')(
                     <TextArea  autosize={{ minRows: 4, maxRows: 10 }} style={{width:400}} ></TextArea>
                  )}
                </FormItem>   
              </Col>
              <Col span={5}>
              <FormItem
                  label="科目"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('subjectId',{
                     rules: [{ required: true, message: '请选择科目'}]})(
                    <Select style={{ width: 120 }} >
                      {subjectArr}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="考试时间"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('need_time') 
                  ( <InputNumber style={{ width: 120 }}  min={0} />
                  )}
                </FormItem>
              </Col>
              <Col span={3} >
              <FormItem
                  label="难度"
                  {...formItemLayoutTop}
                  style={{marginLeft:-100}}
                >
                  {getFieldDecorator('difficulty',{initialValue:0})(
                    <Select style={{ width: 120 }} >
                      <Option value={0}>初级</Option>
                      <Option value={1}>中级</Option>
                      <Option value={2}>高级</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="谁可以用"
                  {...formItemLayoutTop} 
                  style={{marginLeft:-100}}               
                >
                  {getFieldDecorator('usufruct',{initialValue:0})(
                    <Select style={{ width: 150 }} >
                      <Option value={0}>所有本科目老师</Option>
                      <Option value={1}>只有我</Option>
                    </Select>
                  )}
                </FormItem>                 
                           
              </Col>
              <Col span={4} >
              <FormItem
                  label="满分"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('total_score',{ 
                    rules: [{ required: true, message: '请填写试卷总分'}],
                    initialValue:100})
                  ( <InputNumber  min={0} />
                  )}
                </FormItem>
                <FormItem
                  label="及格分数"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('pass_score',{ initialValue:60})(
                        <InputNumber  min={0} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem
            >
              <Row>
                  <Col span={22} style={{paddingRight : '250px'}}>
                    <Button type="primary" htmlType="submit" className="f-r m-r-20 " style={{ marginBottom:'50px'}}>生成试卷</Button>
                  </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
        <List
        className="demo-loadmore-list"
        size="large"
        pagination={{
          pageSize: 6,
        }}
        dataSource={this.state.data}
        renderItem={(item) =>{
          let difficulty='初级'
          if(item.difficulty==1){difficulty='中级'} else if(item.difficulty==2){difficulty='高级'}
          return (     
          <List.Item actions={[<Button  type="primary"><Link to={`/main/add_paper/choose_question/${item.id}`}>添加试题</Link></Button>,<Button  onClick={this.changePaper.bind(this,item)}>修改试卷</Button>, <Button type="danger" onClick={this.deletePaper.bind(this,item.id)}>删除</Button>]}>
              <List.Item.Meta         
                title={"试卷名称:"+item.name}
                description={"试卷描述:"+item.describe}
              />
                 <List.Item.Meta  style={{marginLeft:-400}}        
                title={"科目:"+item.subjectName}              
              />
                <List.Item.Meta  style={{marginLeft:-400}}        
                title={"目标总分:"+item.totalScore}              
              />
                <List.Item.Meta  style={{marginLeft:-400}}        
                title={"难度:"+difficulty}              
              />
          </List.Item>
        )}}
      /> 

      <Modal
      title="修改试卷"
      visible={this.state.visibleChangeModal}
      onCancel={this.changeCancel.bind(this)}
      footer={null}
       >  
            <Form onSubmit={this.changeOk.bind(this)} className="ant-advanced-search-form">
              <FormItem
                  label="试卷名称"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('Nname',{
                     rules: [{ required: true, message: '请输入试卷名称'}],
                    initialValue:this.state.curSelectPaper.name})(
                     <Input style={{width:250}} ></Input>
                  )}
                </FormItem>
                <FormItem
                  label="试卷描述"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('Ndescribe',{  initialValue:this.state.curSelectPaper.describe})(
                     <TextArea  autosize={{ minRows: 4, maxRows: 10 }} style={{width:400}} ></TextArea>
                  )}
                </FormItem> 
                 <FormItem
                  label="科目"
                  {...formItemLayoutTop}
                >
                  <span>{this.state.curSelectPaper.subjectName}</span>
                </FormItem>        
                <FormItem
                  label="考试时间(分钟)"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('Nneed_time',{  initialValue:this.state.curSelectPaper.needTime}) 
                  ( <InputNumber style={{ width: 120 }}  min={0} />
                  )}
                </FormItem>
              <FormItem
                  label="难度"
                  {...formItemLayoutTop}                 
                >
                  {getFieldDecorator('Ndifficulty',{
                     initialValue:this.state.curSelectPaper.difficulty})(
                    <Select style={{ width: 120 }} >
                      <Option value={0}>初级</Option>
                      <Option value={1}>中级</Option>
                      <Option value={2}>高级</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="谁可以用"
                  {...formItemLayoutTop} 
              
                >
                  {getFieldDecorator('Nusufruct',{
                      initialValue:this.state.curSelectPaper.usufruct})(
                    <Select style={{ width: 150 }} >
                      <Option value={0}>所有本科目老师</Option>
                      <Option value={1}>只有我</Option>
                    </Select>
                  )}
                </FormItem>                                          
              <FormItem
                  label="满分"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('Ntotal_score',{ 
                    rules: [{ required: true, message: '请填写试卷总分'}],
                    initialValue:this.state.curSelectPaper.totalScore})
                  ( <InputNumber  min={0} />
                  )}
                </FormItem>
                <FormItem
                  label="及格分数"
                  {...formItemLayoutTop}
                >
                  {getFieldDecorator('Npass_score',{ initialValue:this.state.curSelectPaper.passScore})(
                        <InputNumber  min={0} />
                  )}
                </FormItem>
               <FormItem
            >
            </FormItem>
            <Row>
                <Col span={24}>
                  <Button type="primary" className="f-r" htmlType="submit">
                    确定
                  </Button>
                  <Button type="primary" className="f-r m-r-20" onClick={this.changeCancel.bind(this)}>
                    取消
                  </Button>
                </Col>
              </Row>
          </Form>
      </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        subjectinfo: state.subjectinfo
    }
}

export default connect(
    mapStateToProps
)(Form.create()(Paper))
