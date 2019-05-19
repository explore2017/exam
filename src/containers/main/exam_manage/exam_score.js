import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form, InputNumber } from 'antd';
import {Row,Col,Select,Input,Table, Tag,Button,Modal,Statistic} from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;
const FormItem =Form.Item
import {put,get} from '@components/axios.js';
import axios from "axios";
import * as URL from '@components/interfaceURL.js';
import { Link  } from 'react-router-dom';


class ExamScore extends React.Component {
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
      pass_score:0,
      visibleModal : false,//修改框是否显示
    }
    this.searchKey = "1";//搜索  1名字 2学号  3班级
    this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
    this.searchContent = ""; //搜索内容
  }

  //得到数据
  getExamScore(){
    get(URL.get_exam_score,{examId:this.props.match.params.examId})
    .then((res)=>{
      if(res.status==0){
        let pass_score=0;
        res.data.some((item)=>{
          pass_score=item.passScore;
          return true;
        })
        this.setState({
          pass_score:pass_score,
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
        if(item.sno!=null){
          if(item.sno.indexOf(value)!=-1){
              newData.push(item);
            }
         }                      
       } else if(this.searchKey==2){
        if(item.name!=null){
          if(item.name.indexOf(value)!=-1){
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
 handleChangePassscore(e){
  e.preventDefault();
  this.props.form.validateFields((err, values) => {
   if(!err){
     put(URL.change_exam,{
       id:this.props.match.params.examId,
       passScore:values.pass_score,
     }).then((res)=>{
       if(res.status==0){
         this.setState({visibleModal:false})
         this.getExamScore();
       }
     })
   }
  })
 }

 exportScore(){
   let url='http://localhost:8000/exam/score/export?examId='+this.props.match.params.examId
   window.location.href=url;

 }



  componentWillMount(){
    this.getExamScore();
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
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => `${index + 1}`,
    },{
      title: '学号',
      dataIndex: 'sno',
    },{
      title: '姓名',
      dataIndex: 'name',   
    },{
      title: '成绩',
      dataIndex: 'exam.score',    
    },{
      title: '状态',
      dataIndex: 'exam.status',
      render:(text,record) =>{
        if(text==4){
          return <Tag color="red">缺考</Tag>
        }
        if(record.exam.score>=this.state.pass_score){
          return <Tag color="green">及格</Tag>
        }else{
          return <Tag color="orange">不及格</Tag>
        }
      }
    },{
      title: '开始考试时间',
      dataIndex: 'exam.startTime',
    },{
      title: '交卷时间',
      dataIndex: 'exam.submitTime',
    }];

    let localeObj = {
      emptyText: '暂无数据'
    }

    return(
      <div>
        <BreadcrumbCustom pathList={['考试管理','考试成绩查看']}></BreadcrumbCustom>
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
                <Option value={1}>学号</Option>
                <Option value={2}>姓名</Option>
              </Select>
              <Button type="primary" style={{marginRight:20}} className="f-r"><Link to='/main/exam_manage/query_exam'>返回</Link></Button>
              <Button type="primary" onClick={()=>this.setState({visibleModal:true})} style={{marginRight:10}} className="f-r">设置及格分数</Button>
              <Statistic style={{marginRight:20}} className="f-r" title="及格分数" value={this.state.pass_score} precision={1} />
              <Button type="primary" className="f-l" onClick={this.showAllQuestion.bind(this)}>全部成绩</Button>
              <Button type="primary" style={{marginLeft:20}} className="f-l" onClick={this.exportScore.bind(this)}>导出成绩</Button>
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
            title="设置及格分数"
            visible={this.state.visibleModal}      
            onCancel={()=>this.setState({visibleModal:false})}
            cancelText="取消"  
            okText="确定"
            onOk={this.handleChangePassscore.bind(this)}
          > 
          <Form >
          <FormItem
            {...formItemLayout}
            label="及格分数"
          >
               {getFieldDecorator('pass_score', {
              rules: [{ required: true, message: '及格分数不能为空！'}],
              initialValue:this.state.pass_score
            })(
                <InputNumber min={0} precision={1}  />
              )}
          </FormItem>
          </Form>
          </Modal>
      </div>
    )
  }
}



export default Form.create()(ExamScore)
