import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form } from 'antd';
import {Row,Col,Select,Input,Table, Icon, Divider,Button,Modal,InputNumber} from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import {put,get,DELETE} from '@components/axios.js';
import * as classinfoActions from '../../../actions/classinfo'
import { connect } from 'react-redux'
import * as URL from '@components/interfaceURL.js'
import { Link  } from 'react-router-dom';
import { bindActionCreators } from 'redux';


class QueryClass extends React.Component {
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
      curSelectClass : {
        id:0,
        name:'',
        subjectId:0,
        teacherId:0,
        classNo:'',
        number:0,
        subjectName:'',
        className:'',
      },
      subjectArr:this.props.subjectinfo.subjectArr||[],                                   //科目信息
    }

    this.searchKey = "1";//搜索  1名字 2课程号 3学科
    this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
    this.searchContent = ""; //搜索内容
  }

  //得到数据
  getClassDate(){
    get(URL.get_class_info)
    .then((res)=>{
      if(res.status==0){
        this.setState({
          initialData:res.data,
          data:res.data,     
        });
        let classes=[];
        res.data.map((item)=>{
          classes.push(item.class);
        })
        //状态存储
        this.props.classinfoActions.setClassInfo({
          classArr: classes
        })
      }    
    })
  }

  //得到搜索的数据
  getSearchData(value){
     let newData=[];
     this.state.initialData.map((item)=>{
       if(this.searchKey==1){                  //筛选的条件
       if(item.class.name==value){
         newData.push(item);
       }
       }else if(this.searchKey==2){
        if((item.class.classNo.toString()).indexOf(value)!=-1){
          newData.push(item);
        }
       } else if(this.searchKey==3){ 
         if(item.subjectName!==null){
          if((item.subject.name.toString()).indexOf(value)!=-1){        
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

  componentWillReceiveProps(nextProps){
    if(nextProps.subjectinfo.subjectArr){
      this.setState({subjectArr:nextProps.subjectinfo.subjectArr});
    }
}



  componentWillMount(){
      this.getClassDate();
  
  }

  //删除
  deleteClass(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_class,record.class.id)
        .then((res)=>{
          if(res.status==0)
          { 
           this.getClassDate();
          }       
        })
  
      },
    });

  }
  
    
  //点击修改
  changeClass(record){
    //TODO : 第一次点击this.state.curSelectTeacher为空
    this.setState({curSelectClass : record})
    const {form}=this.props;
    //重新设置修改模态框中三个选项的值
    form.setFieldsValue({'name': record.name});
    this.setState({visibleChangeModal:true})
  }

  //取消修改
  changeCancel(){
    this.setState({visibleChangeModal:false})
  }

  //确认修改
  changeOk(){
    this.setState({visibleChangeModal:false})

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {            
        put(URL.change_class,{
         id:this.state.curSelectClass.id,
         name:values.name,        
         subjectId:values.subject,   
        }).then((res)=>{
          if(res.status==0){
            this.getClassDate();
          }
        })     
      }
    });

  }

  //搜索类型选择
  handleChange(value) {
    this.searchKey = value;
  }

  //点击所有班级
  showAllClass(){
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
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
 

  render(){
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '班级',
      dataIndex: 'class.name',
      key: 'name',
    },{
      title: '班级号',
      dataIndex: 'class.classNo',
      key: 'classNo',
    },{
      title: '科目',
      dataIndex: 'subject.name',
      key: 'subjectName',
    }, {
      title: '老师',
      dataIndex: 'teacherName',
      key: 'teacherName',
    }, {
      title: '班级人数',
      dataIndex: 'class.number',
      key: 'number',
    },{
      title: '班级详情',
      key: 'details',
      render: ( record) => (
        <span>
          <Button size="small">
          <Link
              to={`/main/class_manage/query_class/detail/${record.class.id}`}
            >查看班级详情</Link>
          </Button>
        </span>
      ),
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.deleteClass.bind(this,record)}>删除</Button>
          <Divider type="vertical" />
          <Button size="small" onClick={this.changeClass.bind(this,record.class)}>修改</Button>
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

    let subject = [];
    this.state.subjectArr.map((item)=>{
      subject.push(
        <Option key={item.id} value={item.id}>{item.name}</Option>
      )
    })
  

    return(
      <div>
        <BreadcrumbCustom pathList={['班级管理','我的班级']}></BreadcrumbCustom>
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
                <Option value={1}>班级名称</Option>
                <Option value={2}>班级号</Option>
                <Option value={3}>科目</Option>
              </Select>
              <Button type="primary" className="f-l" onClick={this.showAllClass.bind(this)}>所有班级</Button>
            </Col>
          </Row>
          <div className="m-t-20">
            <Table
              rowKey={record=>record.class.id}
              columns={columns}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              locale={localeObj}
              onChange={this.handleTableChange.bind(this)}
            />
          </div>
          <Modal
            title="修改班级"
            visible={this.state.visibleChangeModal}
            footer={null}
            onCancel={this.changeCancel.bind(this)}
          >
            <Form onSubmit={this.changeOk.bind(this)}>

              <FormItem
                {...formItemLayout}
                label="班级名称"
              >
              {getFieldDecorator('name',{
                rules: [{ required: true, message: '班级名称不能为空！'}],
                initialValue : this.state.curSelectClass.name
              })(
                <Input />
              )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="班级号"
              >
                <span>{this.state.curSelectClass.classNo}</span>
              </FormItem>
              <FormItem
            {...formItemLayout}
              label="科目"
            >          
              {getFieldDecorator('subject',{
                rules: [{ required: true, message: '科目不能为空！'}],
                initialValue : this.state.curSelectClass.subjectId
              })(
                <Select size='default' style={{ width: 300 }}>               
                   {subject}
                </Select>
              )}
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
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      subjectinfo: state.subjectinfo,
      classinfo:state.classinfo,

    }
}

function mapDispatchToProps(dispatch) {
  return {
      classinfoActions: bindActionCreators(classinfoActions, dispatch),
  }
}

export default connect(
    mapStateToProps,mapDispatchToProps
)(Form.create()(QueryClass))
