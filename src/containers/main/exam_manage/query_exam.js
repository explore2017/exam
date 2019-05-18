import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form } from 'antd';
import {Row,Col,Select,Input,Table, Icon, Divider,Button,Modal,InputNumber} from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import {put,get,DELETE} from '@components/axios.js';
import * as URL from '@components/interfaceURL.js'
import { Link  } from 'react-router-dom';


class QueryExam extends React.Component {
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
      curSelectExam : {
   
      },                       
    }

    this.searchKey = "1";//搜索 
    this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
    this.searchContent = ""; //搜索内容
  }

  //得到数据
  getExamDate(){
    get(URL.get_manage_exam)
    .then((res)=>{
      if(res.status==0){
        this.setState({
          initialData:res.data,
          data:res.data,     
        });
      }    
    })
  }

  //得到搜索的数据
  getSearchData(value){
     let newData=[];
     console.log(value)
     this.state.initialData.map((item)=>{
       if(this.searchKey==1){ 
        if(item.exam.name!==null){                 //筛选的条件
       if(item.exam.name.indexOf(value)!=-1){
         newData.push(item);
       }
     }
       }else if(this.searchKey==2){
        if(item.class.name!==null){   
        if(item.class.name.indexOf(value)!=-1){
          newData.push(item);
        }
     } 
       }else if(this.searchKey==3){
        if(item.teacher.name!==null){  
        if(item.teacher.name.indexOf(value)!=-1){
          newData.push(item);
        }
    }
       } else if(this.searchKey==4){ 
         if(item.subject.name!==null){
          if(item.subject.name.indexOf(value)!=-1){        
            newData.push(item);
          }
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
      this.getExamDate();
  
  }

  //删除
  deleteExam(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_manage_exam,record.exam.id)
        .then((res)=>{
          if(res.status==0)
          { 
           this.getExamDate();
          }       
        })
  
      },
    });

  }
  
    

  //搜索类型选择
  handleChange(value) {
    this.searchKey = value;
  }

  //点击所有考试
  showAllExam(){
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
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '考试名称',
      dataIndex: 'exam.name',
    },{
      title: '考试班级',
      dataIndex: 'class.name',
    },,{
        title: '考试科目',
        dataIndex: 'subject.name',
      },{
      title: '老师',
      dataIndex: 'teacher.name',
    }, {
      title: '报名开始时间',
      dataIndex: 'exam.startTime',
    }, {
        title: '报名结束时间',
        dataIndex: 'exam.endTime',
      },{
      title: '考试详情',
      render: ( record) => (
        <span>
          <Button size="small" >
          <Link
              to={`/main/exam_manage/exam_details/${record.exam.id}`}
            >查看考试详情</Link>
          </Button>
          <Divider type="vertical" />
          <Button size="small" >
          <Link
              to={`/main/exam_manage/exam_score/${record.exam.id}`}
            >查看考试成绩</Link>
          </Button>
        </span>
      ),
    }, {
      title: '操作',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.deleteExam.bind(this,record)}>删除</Button>
          <Divider type="vertical" />
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

  

    return(
      <div>
        <BreadcrumbCustom pathList={['考试管理','我的考试']}></BreadcrumbCustom>
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
                <Option value={1}>考试名称</Option>
                <Option value={2}>班级名称</Option>
                <Option value={3}>老师名称</Option>
                <Option value={3}>科目名称</Option>
              
              </Select>
              <Button type="primary" className="f-l" onClick={this.showAllExam.bind(this)}>所有考试</Button>
            </Col>
          </Row>
          <div className="m-t-20">
            <Table
              rowKey={(record)=>(record.exam.id)}
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


export default Form.create()(QueryExam)
