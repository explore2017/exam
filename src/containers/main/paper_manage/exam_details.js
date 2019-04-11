import React from 'react'
import {Row,Col,Select,Input,Table, Button,Modal,InputNumber ,Breadcrumb,Form,DatePicker } from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import {get,DELETE,post} from '@components/axios.js';
import { connect } from 'react-redux'
import * as URL from '@components/interfaceURL.js'
import {Link} from 'react-router-dom'

class ExamDetail  extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          selectedRowKeys : [], //选择的行
          initialData:[],
          data : [],
          pagination : {
            pageSize : 10,
            current : 1,
            total : 0,
            defaultCurrent : 1,
          },   
          visibleBatchModal:false,
        }
        this.turnStatus = "NORMAL";
        this.addBatch=this.addBatch.bind(this);
    }
   
 //得到考试批次数据
 getExamBatch(){
    get(URL.get_exam_batch,{examId:this.props.match.params.examId})
    .then((res)=>{
      if(res.status==0){
        res.data.map((item,index)=>{
          item.batch.name="批次"+(index+1);
        })
        this.setState({          
          data:res.data,     
        })
      }    
    })
  }

 

  //翻页
  handleTableChange(pagination, filters, sorter){
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
  }

addBatch(e){
  e.preventDefault();
  this.props.form.validateFields(['maxNumber', 'startTime','endTime'],(err, values) => {
    if(!err){
      if(values.endTime<values.startTime){
        Modal.error({
          title: '出错了',
          content: '考试开始时间应比考试结束时间早',
        });
        return;
      }  
      let batch={
       
      }
      post(URL.add_exam_batch,{ 
        examId:this.props.match.params.examId,
        maxNumber:values.maxNumber,
        startTime:values.startTime.format('YYYY-MM-DD HH:mm'),
        endTime:values.endTime.format('YYYY-MM-DD HH:mm'),
      })
      .then(()=>{
        this.setState({visibleBatchModal:false})
        this.getExamBatch();
      }) 
  }
   })
 }


  componentWillMount(){
    this.getExamBatch();
  }

  //删除
  deleteBatch(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_class_student,record.id,{classId:this.props.match.params.classId})
        .then((res)=>{
          if(res.status==0)
          { 
           this.getExamBatch();
          }       
        })
  
      },
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

    const columns = [{
      title: '姓名',
      dataIndex: 'batch.name',
      key: 'name',
    },{
      title: '批次人数',
      dataIndex: 'number',
      key: 'number',
    },{
      title: '批次最大人数',
      dataIndex: 'batch.maxNumber',
      key: 'maxNumber',
    },{
      title: '考试开始时间',
      dataIndex: 'batch.startTime',
      key: 'startTime',
    }, {
      title: '考试结束时间',
      dataIndex: 'batch.endTime',
      key: 'endTime',
    },{
      title: '批次详情',
      key: 'details',
      render: ( record) => (
        <span>
          <Button size="small" >
          <Link
              to={``}
            >查看批次详情</Link>
          </Button>
        </span>
      ),
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.deleteBatch.bind(this,record)}>删除</Button>
        </span>
      ),
    }];



    let localeObj = {
      emptyText: '暂无数据'
    }

  
    return(
      <div>
        <Breadcrumb>
        <Breadcrumb.Item >考试管理</Breadcrumb.Item>  
        <Breadcrumb.Item ><Link to={`/main/paper_manage/query_exam`}>我的考试</Link></Breadcrumb.Item>
        <Breadcrumb.Item >考试批次</Breadcrumb.Item>   
        </Breadcrumb> 
        <div className="class-manage-content">
          <Row>
            <Col span={24}>
              <Button  className="f-r m-r-20" type="primary" onClick={()=>this.setState({visibleBatchModal:true})}>添加批次</Button>     
            </Col>
          </Row>
          <div className="m-t-20">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              locale={localeObj}
              onChange={this.handleTableChange.bind(this)}
            />
          </div>
        </div>
        <Modal
        title="添加批次"
        width={800}
         visible={this.state.visibleBatchModal}
         onCancel={()=>{this.setState({visibleBatchModal:false})}}
         destroyOnClose={true}
         onOk={this.addBatch}
         cancelText="取消"  
         okText="确定"

        >
           <FormItem
              {...formItemLayout}
              label="最大人数"
            >
              {getFieldDecorator('maxNumber', {
              rules: [{ required: true, message: '请输入人数'}],
              initialValue:0})(
              <InputNumber precision={0} min={0} ></InputNumber>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开始时间"
            >
              {getFieldDecorator('startTime',{rules: [{ required: true, message: '请选择开始时间'}]})(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择时间"
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="结束时间"
            >
              {getFieldDecorator('endTime',{rules: [{ required: true, message: '请选择结束时间'}]})(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择时间"
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
        </Modal>
      </div>
    )
  }
}



export default Form.create()(ExamDetail)
