import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form } from 'antd';
import {Row,Col,Select,Input,Table, Icon, Divider,Button,Modal,Tag} from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import {put,get,DELETE} from '@components/axios.js';
import { connect } from 'react-redux'
import * as URL from '@components/interfaceURL.js'


class QueryTeacher extends React.Component {
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
      curSelectTeacher : {
        id:0,
        name:'',
        subjectId:'',
        password:'',
        username:'',
      },
      subjectArr:this.props.subjectinfo.subjectArr||[],
      subject:[],                                       //科目信息
    }
    this.addSubject=this.addSubject.bind(this);  //增加学科
    this.searchKey = "1";//搜索  1名字 2编号  3学科
    this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
    this.searchContent = ""; //搜索内容
  }

  //得到数据
  getPageDate(){
    get(URL.get_teacher)
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
        if(item.id==value){
          newData.push(item);
        }
       } else if(this.searchKey==3){ 
         if(item.subjectId!==null){
          if(item.subjectId.indexOf(value)!=-1){        
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

//Tag点击
handleTagClick(index){
  const newSubject= JSON.parse(JSON.stringify(this.state.subject))
  newSubject.splice(index,1);
  this.setState({
    subject:newSubject
  })
}
//添加科目
addSubject(){
  this.props.form.validateFields((err, values) => {
   this.state.subjectArr.map((item)=>{
     if(item.id===values.subject&&this.state.subject.indexOf(item)==-1){
      this.setState({
        subject:[...this.state.subject,item]
       })
     }
   })
  }
  )
}


  componentWillMount(){
    this.getPageDate();
  }

  //删除
  deleteClass(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_teacher,record.id)
        .then((res)=>{
          if(res.status==0)
          { 
           this.getPageDate();
          }       
        })
  
      },
    });

  }
  
    
  //点击修改
  changeClass(record){
    //给科目赋值
     let subject=[];
     if(record.subjectId !== null && record.subjectId !== undefined && record.subjectId !== ''){ //判断是否为空
      let subjectStr=record.subjectId.split(",");
      this.state.subjectArr.map((item)=>{
        for(var i=0;i<subjectStr.length;i++){
          if(subjectStr[i]==item.name){
            subject.push(item);
          }
        }
      })
     }
    
  
    
    //TODO : 第一次点击this.state.curSelectTeacher为空
    this.setState({curSelectTeacher : record,subject:subject})
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
        let subjectId="";
        this.state.subject.map((item)=>{
          if(subjectId==="")
          {
            subjectId=item.id
          }
          else{
            subjectId+=","+item.id
          }       
        })               
        put(URL.change_teacher,{
         id:this.state.curSelectTeacher.id,
         password:values.password,
         name:values.name,        
         subjectId:subjectId,   
        }).then((res)=>{
          if(res.status==0){
            this.getPageDate();
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
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },{
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '科目',
      dataIndex: 'subjectId',
      key: 'subjectId',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.deleteClass.bind(this,record)}>删除</Button>
          <Divider type="vertical" />
          <Button size="small" onClick={this.changeClass.bind(this,record)}>修改</Button>
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
        <BreadcrumbCustom pathList={['老师管理','查询老师']}></BreadcrumbCustom>
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
              <Select className="f-r m-r-20" defaultValue="1" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                <Option value={1}>姓名</Option>
                <Option value={2}>编号</Option>
                <Option value={3}>学科</Option>
              </Select>
              <Button type="primary" className="f-l" onClick={this.showAllClass.bind(this)}>所有教师</Button>
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
            title="修改老师"
            visible={this.state.visibleChangeModal}
            footer={null}
            onCancel={this.changeCancel.bind(this)}
          >
            <Form onSubmit={this.changeOk.bind(this)}>
            <FormItem
              {...formItemLayout}
              label="用户名"
            >
             <span>{this.state.curSelectTeacher.username}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('password', {
              rules: [{ required: true, message: '名字不能为空！'}],
              initialValue:this.state.curSelectTeacher.password
            })(
                <Input.Password  />
              )}
            </FormItem>
              <FormItem
                {...formItemLayout}
                label="姓名"
              >
              {getFieldDecorator('name',{
                rules: [{ required: true, message: '密码不能为空！'}],
                initialValue : this.state.curSelectTeacher.name
              })(
                <Input />
              )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="编号"
              >
                <span>{this.state.curSelectTeacher.id}</span>
              </FormItem>
              <FormItem
            {...formItemLayout}
              label="科目"
            >          
              {getFieldDecorator('subject')(
                <Select size='default' style={{ width: 300 }}>               
                   {subject}
                </Select>
              )}
            <Button type="primary" style={{marginTop:0,marginLeft:0}} onClick={this.addSubject}  >增加学科</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已选科目"
            >         
             {this.state.subject.map((item,index)=>{
               return <Tag color="blue" key={item.id} onClick={this.handleTagClick.bind(this,index)}>{item.name}</Tag>
             })}    
            </FormItem>
           
              <Row>
                <Col span="24">
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
      subjectinfo: state.subjectinfo
    }
}

export default connect(
    mapStateToProps
)(Form.create()(QueryTeacher))
