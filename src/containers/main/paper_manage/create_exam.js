import React from 'react'
import { Form,Input,Select,Row,Col,Button,DatePicker,Radio,Modal,Table, InputNumber   } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import { connect } from 'react-redux'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import httpServer from '@components/httpServer.js'
import * as URL from '@components/interfaceURL.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
import { get,post  } from '@components/axios.js';
import ShowPaper from '../paper_manage/show_paper.js'
moment.locale('zh-cn');

class CreateExam extends React.Component {
  constructor(){
    super()
    this.state = {
      pathList : ['考试管理','创建考试'],//面包屑路径
      classId : 0,
      levelId : 0,
      paperList : [],
      paperModel:0,
      showId:-1,      //用来展示的paper的Id
      paperId:'',
        difficulty:0,
        singeKeyPoint:'',
        judgeKeyPoint:'',
        multipleKeyPoint:'',
        shortKeyPoint:'',
        completionKeyPoint:'',
        analysisPoint:'',
      visibleChangeModal:false,         //展示试卷
      visiblePaperModal:false,          //切换出卷模式
      visibleDesginModal:false,  
    }
    this.havePaperName = 0;
    this.choosePaper=this.choosePaper.bind(this);
    this.randomPaper=this.randomPaper.bind(this);
  }

  //选择班级
  handleChange(value) {
    this.classId = value;
    this.havePaperName ++;
    if(this.havePaperName == 2) {
      this.havePaperName = 0;
    
    }
  }



  //表单提交
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        httpServer({
          url : URL.create_exam
        },{
          className : 'CreateTestImpl',
          classId : values.classId,
          paperId : values.paperId,
          startTime : values.startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime : values.endTime.format('YYYY-MM-DD HH:mm:ss'),
          examName : values.examName,
        })
      }
    });
  }

  choosePaper(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      get(URL.get_subject_papers,{
        classId:values.classId
      }).then((res)=>{
        if(res.status==0){
          this.setState({
            paperList:res.data,
            visibleChangeModal:true,
          });         
        }
      })
      }
    });
  }

  confirmPaper(record){
        this.setState({
          paperId:record.id,
          visibleChangeModal:false,
        })
  }

  randomPaper(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      let describe= JSON.stringify({
          singeNumber:values.singeNumber?singeNumber:0,
          singeKeyPoint:this.state.singeKeyPoint,
          judgeNumber:values.judgeNumber?judgeNumber:0,
          judgeKeyPoint:this.state.judgeKeyPoint,
          multipleNumber:values.multipleNumber?multipleNumber:0,
          multipleKeyPoint:this.state.multipleKeyPoint,
          completionNumber:values.completionNumber?completionNumber:0,
          completionKeyPoint:this.state.completionKeyPoint,
          shortNumber:values.shortNumber?shortNumber:0,
          shortKeyPoint:this.state.shortKeyPoint,
          analysisNumber:values.analysisNumber?analysisNumber:0,
          analysisKeyPoint:this.state.analysisKeyPoint,   
        })
      post(URL.add_random_papers,{
        subjectId:values.classId,
        totalScore:values.paperScore,
        difficulty:this.state.difficulty,
        describe:describe, 
      }).then((res)=>{
        if(res.status==0){
          this.setState({
            paperId:res.data.id,
            visibleDesginModal:false,
          });         
        }
      })
      }
      this.setState({ visibleDesginModal:false});
    });
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


    const columns = [{
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '试卷描述',
      dataIndex: 'describe',
      key: 'describe',
      width: 600
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>         
          <Button onClick={()=>{
            this.setState({
             showId:record.id,
              visiblePaperModal:true,
            })
          }}>预览试卷</Button>        
          <Button style={{marginLeft:20}} type="primary" onClick={this.confirmPaper.bind(this,record)} >选择</Button>
        </span>
      ),
    }];


    //班级信息
    let classtArr = [];
    if(this.props.classinfo.classArr) {
      classtArr = this.props.classinfo.classArr.map((item)=>{
        return (
          <Option value={item.id} key={item.id}>{item.name}</Option>
        )
      })
    }

    return(
      <div>
        <BreadcrumbCustom pathList={this.state.pathList}></BreadcrumbCustom>
        <div className="change-password-content">
          <Form onSubmit={this.handleSubmit.bind(this)}>

            <FormItem
              {...formItemLayout}
              label="班级"
            >
              {getFieldDecorator('classId', {
              rules: [{ required: true, message: '请选择班级！'}],
            })(
                <Select style={{ width: '100%' }} onChange={this.handleChange.bind(this)}>
                  {classtArr}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="考试名称"
            >
              {getFieldDecorator('examName', {
              rules: [{ required: true, message: '考试名称不能为空'}],
            })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="级别"
            >
              {getFieldDecorator('level',{
                initialValue:0
              })(
                <Select  style={{ width: '100%' }} >
                  <Option value={0}>初级</Option>
                  <Option value={1}>中级</Option>
                  <Option value={2}>高级</Option>
                </Select>
              )}
            </FormItem >
            <FormItem 
            {...formItemLayout}
              label="出卷模式"
            >
            <RadioGroup onChange={((e)=>{this.setState({paperModel:e.target.value,paperId:''})}).bind(this)} buttonStyle="solid" defaultValue={0} >
           <RadioButton value={0}>指定试卷</RadioButton>
           <RadioButton value={1}>随机出卷</RadioButton>
           </RadioGroup>
            </FormItem>
           {(this.state.paperModel==0)&&<FormItem
              {...formItemLayout}
              label="试卷编号"
            >  
             <Input value={this.state.paperId} disabled={true} style={{ width: 430}} placeholder="请选择试卷"></Input> 
             <Button type="primary" style={{marginTop:0,marginLeft:20}} onClick={this.choosePaper} >选择试卷</Button>
              </FormItem> }
              {(this.state.paperModel==1)&&<FormItem
              {...formItemLayout}
              label="设计试卷"
            >  
             <Input value={this.state.paperId} disabled={true} style={{ width: 430}} placeholder="请设计试卷"></Input> 
             <Button type="primary" style={{marginTop:0,marginLeft:20}} onClick={()=>{this.setState({visibleDesginModal:true})}} >设计试卷</Button>
              </FormItem> }
            <FormItem
              {...formItemLayout}
              label="开始时间"
            >
              {getFieldDecorator('startTime')(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择时间"
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="结束时间"
            >
              {getFieldDecorator('endTime')(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择时间"
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <Row>
              <Col span={12} offset={4}>
                <Button type="primary" htmlType="submit" className="f-r">确定</Button>
              </Col>
            </Row>
          </Form>
          <Modal
              title="选择试卷"
              visible={this.state.visibleChangeModal}
              footer={null}
              width={1000}
            onCancel={()=>{
              this.setState({
                visibleChangeModal:false
              })
            }}
          >
           <Table
              rowKey="id"
              columns={columns}
              dataSource={this.state.paperList}         
            />
          </Modal>
          <Modal
        width={1000}
         visible={this.state.visiblePaperModal}
         onCancel={()=>{this.setState({visiblePaperModal:false})}}
         destroyOnClose={true}
         footer={null}
        >
             <ShowPaper paperId={this.state.showId}/>
        </Modal>
        <Modal
        title="设计试卷"
        width={1000}
         visible={this.state.visibleDesginModal}
         onCancel={()=>{this.setState({visibleDesginModal:false})}}
         destroyOnClose={true}
         onOk={this.randomPaper}
         cancelText="取消"  
         okText="确定"
        >
         <Form >
         <FormItem
             {...formItemLayoutTop}
              label="试卷分数:"
            >
             {getFieldDecorator('paperScore',{initialValue:100})(
            <InputNumber min={0} ></InputNumber>)}
            <span style={{marginLeft:20}}>试卷难度：</span>
            <Select defaultValue={0} onChange={(value)=>{this.setState({
                 difficulty:value
            })}} style={{width:140,marginLeft:0}}>
                     <Option value={0}>简单</Option>
                     <Option value={1}>中等</Option>
                     <Option value={2}>困难</Option>
            </Select>
            </FormItem>
         <FormItem
             {...formItemLayoutTop}
              label="单选题数量:"
            >
             {getFieldDecorator('singeNumber',{initialValue:0})(
            <InputNumber min={0} ></InputNumber>)}
            <span style={{marginLeft:20}}>知识点：</span>              
            <Input  onChange={(e)=>this.setState({singeKeyPoint:e.target.value})} style={{width:150,marginLeft:0}}></Input>
            </FormItem>
            <FormItem
             {...formItemLayoutTop}
              label="判断题数量:"
            >
             {getFieldDecorator('judgeNumber',{initialValue:0})(
            <InputNumber min={0} ></InputNumber>)}
            <span style={{marginLeft:20}}>知识点：</span>
            <Input onChange={(e)=>this.setState({judgeKeyPoint:e.target.value})} style={{width:150,marginLeft:0}}></Input>
            </FormItem>
            
            <FormItem
             {...formItemLayoutTop}
              label="多选题数量:"
            >
             {getFieldDecorator('multipleNumber',{initialValue:0})(
            <InputNumber min={0} ></InputNumber>)}
            <span style={{marginLeft:20}}>知识点：</span>
            <Input onChange={(e)=>this.setState({multipleKeyPoint:e.target.value})} style={{width:150,marginLeft:0}}></Input>
            </FormItem>
            <FormItem
             {...formItemLayoutTop}
              label="填空题数量:"
            >
             {getFieldDecorator('completionNumber',{initialValue:0})(
            <InputNumber min={0} ></InputNumber>)}
            <span style={{marginLeft:20}}>知识点：</span>
            <Input onChange={(e)=>this.setState({completionKeyPoint:e.target.value})} style={{width:150,marginLeft:0}}></Input>
            </FormItem>
            <FormItem
             {...formItemLayoutTop}
              label="简答题数量:"
            >
             {getFieldDecorator('shortNumber',{initialValue:0})(
            <InputNumber min={0} ></InputNumber>)}
            <span style={{marginLeft:20}}>知识点：</span>
     
            <Input onChange={(e)=>this.setState({shortKeyPoint:e.target.value})} style={{width:150,marginLeft:0}}></Input>
            </FormItem>
            <FormItem
             {...formItemLayoutTop}
              label="分析题数量:"
            >
             {getFieldDecorator('analysisNumber',{initialValue:0})(
            <InputNumber min={0}></InputNumber>)}
            <span style={{marginLeft:20}}>知识点：</span>
            <Input onChange={(e)=>this.setState({analysisPoint:e.target.value})} style={{width:150,marginLeft:0}}></Input>
            </FormItem>      
</Form>
            
        </Modal>    
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

export default connect(
    mapStateToProps
)(Form.create()(CreateExam))
