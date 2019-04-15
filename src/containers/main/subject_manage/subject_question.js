import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form } from 'antd';
import {Row,Col,Select,Input,Table, Icon, Divider,Button,Modal } from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;
import {put,post,get,DELETE} from '@components/axios.js';
import * as URL from '@components/interfaceURL.js'


class SubjectQuestion extends React.Component {
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
      visibleChangeModal : false,//修改框是否显示
      curSelectQuestion : {
        id:0,
        name:'',
      },
      QuestionName:'',
    }
    this.searchKey = "1";//搜索  1名字 2学号  3班级
    this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
    this.searchContent = ""; //搜索内容
  }

  //得到数据
  getQuestionDate(){
    get(URL.get_subject_question,{subjectId:this.props.match.params.subjectId})
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
     this.state.initialData.map((item)=>{ //筛选的条件
       if(this.searchKey==1){
        if(item.content!=null){
          if(item.content.indexOf(value)!=-1){
              newData.push(item);
            }
         }                      
       } else if(this.searchKey==2){
        if(item.title!=null){
          if(item.title.indexOf(value)!=-1){
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
    this.getQuestionDate();
  }

  //删除
  deleteQuestion(record){
    confirm({
      title: '你确定删除吗？',
      content:'删除题目可能会造成试卷无法使用!',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_question,record.id)
        .then((res)=>{
          if(res.status==0)
          { 
           this.getQuestionDate();
          }       
        }) 
      },
    });

  }
  

  //搜索类型选择
  handleChange(value) {
    this.searchKey = value;
  }

  //点击所有科目
  showAllQuestion(){
    this.turnStatus === "NORMAL";
    this.state.pagination.current = 1;//当前页置为第一页
  this.setState({
    data:this.state.initialData
  })
  }

  //点击搜索
  searchQuestion(value) {
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
      title: '题目编号',
      dataIndex: 'id',
    },{
      title: '题目类型',
      dataIndex: 'title',
    },{
      title: '题目内容',
      dataIndex: 'content',
      width:500
    },{
      title: '题目答案',
      dataIndex: 'answer',
    },{
      title: '题目难度',
      dataIndex: 'difficulty',
    },{
      title: '知识点',
      dataIndex: 'key_point',
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.deleteQuestion.bind(this,record)}>删除</Button>
        </span>
      ),
    }];

    let localeObj = {
      emptyText: '暂无数据'
    }

    return(
      <div>
        <BreadcrumbCustom pathList={['科目管理','试题管理']}></BreadcrumbCustom>
        <div className="class-manage-content">
          <Row>
            <Col span={24}>
              <Search
                className="f-r"
                placeholder="请输入关键字"
                onSearch={this.searchQuestion.bind(this)}
                enterButton
                style={{ width: 200 }}
              />
              <Select className="f-r m-r-20" defaultValue={1} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                <Option value={1}>题目内容</Option>
                <Option value={2}>题目类型</Option>
              </Select>
              <Button type="primary" className="f-l" onClick={this.showAllQuestion.bind(this)}>所有题目</Button>
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



export default SubjectQuestion
