import React from 'react'
import {Row,Col,Select,Input,Table, Button,Modal,Tag,Breadcrumb} from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;
import {get,DELETE,post} from '@components/axios.js';
import { connect } from 'react-redux'
import * as URL from '@components/interfaceURL.js'
import {Link} from 'react-router-dom'

class BatchDetail  extends React.Component{
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
    
        }
        this.searchKey = "1";//搜索  1名字 2学号
        this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
        this.searchContent = ""; //搜索内容
    }
   
 //得到参加的考试学生数据
 getBatchStudentData(){
    get(URL.get_batch_details,{batchId:this.props.match.params.batchId})
    .then((res)=>{
      if(res.status==0){
        this.setState({          
          initialData:res.data,
          data:res.data,     
        })
      }    
    })
  }

  //得到搜索的数据
  getSearchData(value){
     let newData=[];
     this.state.initialData.map((item)=>{
       if(this.searchKey==1){                           //筛选的条件
       if(item.name==value){
         newData.push(item);
       }
       }else if(this.searchKey==2){
        if(item.sno==value){
          newData.push(item);
        }
       } 
     })
     this.setState({data:newData});

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




  componentWillMount(){
    this.getBatchStudentData();
  }

  //删除
  deleteStudent(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_batch_student,record.student.id,{batchId:this.props.match.params.batchId})
        .then((res)=>{
          if(res.status==0)
          { 
           this.getBatchStudentData();
          }       
        })
  
      },
    });

  }
  

  //搜索类型选择
  handleChange(value) {
    this.searchKey = value;
  }

  //点击所有学生
  showAllStudent(){
    this.turnStatus === "NORMAL";
    this.state.pagination.current = 1;//当前页置为第一页
  this.setState({
    data:this.state.initialData
  })
  }

  //点击搜索
  searchClass(value) {
    if(value == "") {
      Modal.error({
        content: "搜索内容不能为空！",
        okText : '确定'
      });
      return;
    }
    this.turnStatus = "SEARCH";//把翻页状态置为搜索
    this.state.pagination.current = 1;//当前页置为第一页
    this.setState({pagination : this.state.pagination});
    this.getSearchData(value);
  }

  //选择某一行
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }


  
  render(){

    const columns = [{
      title: '学号',
      dataIndex: 'student.sno',
      key: 'sno',
    },{
      title: '姓名',
      dataIndex: 'student.name',
      key: 'name',
    }, {
      title: '状态',
      dataIndex: 'batchStudent.status',
      key: 'status',
      render: (text,record) =>{
        if(text == 0){
          return (
            <Tag color="red">未签到</Tag>
          )
        } else if (text == 1) {
          return (
            <Tag color="green">已签到</Tag>
          )
        } else if (text == 2) {
          return (
            <Tag color="blue">正在考试</Tag>
          )
        }
         else if (text == 3) {
            return (
              <Tag color="cyan">考试完成</Tag>
            )
          } else if (text == 4) {
            return (
              <Tag color="red">缺考</Tag>
            )
          } else if (text == 5) {
            return (
              <Tag color="blue">已阅卷</Tag>
            )
          }
        }
    }, {
      title: '开始考试时间',
      dataIndex: 'batchStudent.startTime',
      key: 'startTime',
    }, {
      title: '交卷时间',
      dataIndex: 'batchStudent.endTime',
      key: 'endTime',
    },{
      title: '阅卷',
      dataIndex: 'batchStudent.status',
      key: 'read',
      render: (text,record) => {
        let read=true
        if(text==3||text==5){
          read=false
        }
        return(
        <span>
        <Button disabled={read} size="small" >
          <Link
              to={`/main/exam_manage/exam_details/${this.props.match.params.examId}/${this.props.match.params.batchId}/${record.batchStudent.id}`}
            >开始阅卷</Link>
          </Button> 
        </span>)
      },
    }, {
      title: '分数',
      dataIndex: 'batchStudent.score',
      key: 'score',
    }, {  
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.deleteStudent.bind(this,record)}>删除</Button>
        </span>
      ),
    }];

    //行选择
    const rowSelection = {
      selectedRowKeys : this.state.selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };

    let localeObj = {
      emptyText: '暂无数据'
    }
   
  
    return(
      <div>
         <Breadcrumb>
        <Breadcrumb.Item >考试管理</Breadcrumb.Item>  
        <Breadcrumb.Item ><Link to={`/main/exam_manage/query_exam`}>我的考试</Link></Breadcrumb.Item>
        <Breadcrumb.Item ><Link to={`/main/exam_manage/exam_details/${this.props.match.params.examId}`}>考试批次</Link></Breadcrumb.Item>   
        <Breadcrumb.Item >批次详情</Breadcrumb.Item> 
        <Button type="primary" style={{marginLeft:850}}   onClick={this.showAllStudent.bind(this)}>所有学生</Button>  
        <Search
                className="f-r"
                placeholder="请输入关键字"
                onSearch={this.searchClass.bind(this)}
                enterButton
                style={{ width: 200 }}
              />
              <Select className="f-r m-r-20" defaultValue={1} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                <Option value={1}>姓名</Option>
                <Option value={2}>学号</Option>       
              </Select>           
        </Breadcrumb>
        <div className="class-manage-content">
          <div className="m-t-20">
            <Table
              rowKey={record=>record.batchStudent.id}
              columns={columns}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              locale={localeObj}
              onChange={this.handleTableChange.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}



export default BatchDetail
