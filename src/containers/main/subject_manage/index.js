import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form } from 'antd';
import {Row,Col,Select,Input,Table, Icon, Divider,Button,Modal } from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import {put,post,get,DELETE} from '@components/axios.js';
import { connect } from 'react-redux'
import * as URL from '@components/interfaceURL.js'
import { bindActionCreators } from 'redux'
import * as subjectinfoActions from '../../../actions/subjectinfo'
import { Link } from 'react-router-dom';

class QuerySubject extends React.Component {
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
      curSelectSubject : {
        id:0,
        name:'',
      },
      subjectName:'',
      role:0,
    }
    this.handleInputChange=this.handleInputChange.bind(this);
    this.addSubject=this.addSubject.bind(this);  //增加班级
    this.searchKey = "1";//搜索  1名字 2学号  3班级
    this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
    this.searchContent = ""; //搜索内容
  }

  //得到数据
  getSubjectDate(){
    get(URL.get_subject)
    .then((res)=>{
      if(res.status==0){
        this.setState({
          initialData:res.data,
          data:res.data,     
        })
        this.props.subjectinfoActions.setSubjectInfo({
          subjectArr: res.data
        })
      }    
    })

  }

  //得到搜索的数据
  getSearchData(value){
     let newData=[];
     this.state.initialData.map((item)=>{ //筛选的条件
       if(this.searchKey==1){
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



//添加科目
addSubject(){
  const name=this.state.subjectName
  if(name==undefined||name==null||name==''){
    Modal.error({
      title:"出错了",
      content:"科目名称为空不能"
    })
    return;
  }
   post(URL.add_subject,{
     name:this.state.subjectName
    }).then((res)=>{
       if(res.status==0){
         this.getSubjectDate();
       }
    })
}


  componentWillMount(){
    this.getSubjectDate();
    this.setState({
      role:localStorage.getItem("role")?localStorage.getItem("role"):0
    })
  }

  //删除
  deleteSubject(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_subject,record.id)
        .then((res)=>{
          if(res.status==0)
          { 
           this.getSubjectDate();
          }       
        }) 
      },
    });

  }
  
    
  //点击修改
  changeSubject(record){ 
    
    //TODO : 第一次点击this.state.curSelectTeacher为空
    this.setState({curSelectSubject : record})
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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {            
        put(URL.change_subject,{
         id:this.state.curSelectSubject.id,
         name:values.name,         
        }).then((res)=>{
          if(res.status==0){
            this.getSubjectDate();
          }
        })     
      }
    });
    this.setState({visibleChangeModal:false})
  }

  //搜索类型选择
  handleChange(value) {
    this.searchKey = value;
  }

  //点击所有科目
  showAllSubject(){
    this.turnStatus === "NORMAL";
    this.state.pagination.current = 1;//当前页置为第一页
  this.setState({
    data:this.state.initialData
  })
  }

  //点击搜索
  searchSubject(value) {
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
      subjectName:e.target.value
    })
}


  

  render(){
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '科目编号',
      dataIndex: 'id',
    },{
      title: '科目名称',
      dataIndex: 'name',
    },{
      title: '科目试题详情',
      key: 'details',
      render: ( record) => (
        <span>
          <Button size="small" >
          <Link
              to={`/main/subject/${record.id}`}
            >查看科目试题库</Link>
          </Button>
        </span>
      ),
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => {
        let role=true;
        if(this.state.role==1){
          role=false;
        }
        return(
        <span>
          <Button disabled={role} type="danger" size="small" onClick={this.deleteSubject.bind(this,record)}>删除</Button>
          <Divider type="vertical" />
          <Button  disabled={role} size="small" onClick={this.changeSubject.bind(this,record)}>修改</Button>
        </span>
      )},
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
        <BreadcrumbCustom pathList={['科目管理']}></BreadcrumbCustom>
        <div className="class-manage-content">
          <Row>
            <Col span={24}>
              <Search
                className="f-r"
                placeholder="请输入关键字"
                onSearch={this.searchSubject.bind(this)}
                enterButton
                style={{ width: 200 }}
              />
              <Select className="f-r m-r-20" defaultValue={1} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                <Option value={1}>科目名称</Option>
              </Select>
              <Button type="primary" className="f-l" onClick={this.showAllSubject.bind(this)}>所有科目</Button>
              {
               this.state.role==1?
              <Button  className="f-l m-l-60" onClick={this.addSubject}  >添加科目</Button>:''
              }  
              {
               this.state.role==1?
              <Input placeholder="请输入科目名称"  style={{ width: '20%' }} onChange={this.handleInputChange} value={this.state.subjectName} ></Input>:''
              }  
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
          <Modal
            title="修改科目信息"
            visible={this.state.visibleChangeModal}
            footer={null}
            onCancel={this.changeCancel.bind(this)}
          >
            <Form onSubmit={this.changeOk.bind(this)}>
                  
         <FormItem
         {...formItemLayout}
         label="科目编号"
         ><span>{this.state.curSelectSubject.id}</span>
         </FormItem>
         <FormItem
         {...formItemLayout}
         label="科目名称"
         >
        {getFieldDecorator('name',{
                rules: [{ required: true, message: '科目名称不能为空！'}],
                initialValue : this.state.curSelectSubject.name
              })(
                <Input/>
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
function mapStateToProps() {
  return {
      
  }
}

function mapDispatchToProps(dispatch) {
  return {
    subjectinfoActions: bindActionCreators(subjectinfoActions,dispatch),
  }
}


export default connect(mapStateToProps,
  mapDispatchToProps
)(Form.create()(QuerySubject))
