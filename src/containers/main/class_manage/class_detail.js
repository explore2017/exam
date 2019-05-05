import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import {Row,Col,Select,Input,Table, Button,Modal,Tooltip} from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;
import {get,DELETE,post} from '@components/axios.js';
import { connect } from 'react-redux'
import * as URL from '@components/interfaceURL.js'
import {Link} from 'react-router-dom'

class ClassDetail  extends React.Component{
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
          sno:'',
    
        }
        this.searchKey = "1";//搜索  1名字 2学号
        this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
        this.searchContent = ""; //搜索内容
        this.addStudent=this.addStudent.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
    }
   
 //得到学生数据
 getClassDate(){
    get(URL.get_class,{id:this.props.match.params.classId})
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
       if(this.searchKey==1){                  //筛选的条件
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

  componentWillReceiveProps(nextProps){

}

addStudent(){
         get(URL.search_student,
          {sno:this.state.sno})
      .then((res)=>{
        if(res.status==0){
          post(URL.add_class_student,{
            studentId:res.data.id,
            classId:this.props.match.params.classId,
            className:this.props.match.params.className,
          }).then((res)=>{
            if(res.status==0){
              this.getClassDate();
            }
          })
        }
      })
}


  componentWillMount(){
    this.getClassDate();
  }

  //删除
  deleteStudent(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_class_student,record.id,{classId:this.props.match.params.classId})
        .then((res)=>{
          if(res.status==0)
          { 
           this.getClassDate();
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

  handleInputChange(e){
      this.setState({
        sno:e.target.value
      })
  }
  
  render(){

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '学号',
      dataIndex: 'sno',
      key: 'sno',
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
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
        <BreadcrumbCustom pathList={['班级管理','我的班级','班级详情']}></BreadcrumbCustom>
        <div className="class-manage-content">
          <Row>
            <Col span={24}>
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
              <Button type="primary" className="f-r m-r-20" ><Link to={`/main/class_manage/query_class`}>返回</Link></Button>
              <Button type="primary" className="f-l" onClick={this.showAllStudent.bind(this)}>所有学生</Button>
              <Button  className="f-l m-l-60" onClick={this.addStudent}    >添加学生</Button>
              <Input placeholder="请输入学号"  style={{ width: '20%' }} onChange={this.handleInputChange} value={this.state.sno} ></Input>        
      
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
      </div>
    )
  }
}



export default ClassDetail
