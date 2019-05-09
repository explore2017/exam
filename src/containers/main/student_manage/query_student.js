import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'
import { Form } from 'antd';
import {Row,Col,Select,Input,Table, Icon, Divider,Button,Modal,Tag,Upload,message} from 'antd'
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import {put,get,DELETE} from '@components/axios.js';
import { connect } from 'react-redux'
import * as URL from '@components/interfaceURL.js'


class QueryStudent extends React.Component {
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
      curSelectStudent : {
        id:0,
        name:'',
        classes:'',
        password:'',
        sno:'',
      },
      classArr:this.props.classinfo.classArr||[],
      classes:[],                                       //科目信息
    }
    this.addClass=this.addClass.bind(this);  //增加班级
    this.searchKey = "1";//搜索  1名字 2学号  3班级
    this.turnStatus = "NORMAL"; //NORMAL:正常翻页   SEARCH:搜索翻页
    this.searchContent = ""; //搜索内容
  }

  //得到数据
  getPageDate(){
    get(URL.get_student)
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
       } else if(this.searchKey==3){ 
         if(item.classes!==null){
          if(item.classes.indexOf(value)!=-1){        
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
    if(nextProps.classinfo.classArr){
      this.setState({classArr:nextProps.classinfo.classArr});
    }
}

//Tag点击
handleTagClick(index){
  const newClasses= JSON.parse(JSON.stringify(this.state.classes))
  newClasses.splice(index,1);
  this.setState({
    classes:newClasses
  })
}
//添加班级
addClass(){
  this.props.form.validateFields((err, values) => {
   this.state.classArr.map((item)=>{
     if(item.id===values.classes&&this.state.classes.indexOf(item)==-1){
      this.setState({
        classes:[...this.state.classes,item]
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
  deleteStudent(record){
    confirm({
      title: '你确定删除吗？',
      okText : '确定',
      cancelText : '取消',
      onOk:()=>{
        DELETE(URL.delete_student,record.id)
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
  changeStudent(record){
    //给科目赋值
     let classes=[];
     if(record.classes !== null && record.classes !== undefined && record.classes !== ''){ //判断是否为空
      let classStr=record.classes.split(",");
      this.state.classArr.map((item)=>{
        for(var i=0;i<classStr.length;i++){
          if(classStr[i]==item.name){
            classes.push(item);
          }
        }
      })
     }   
    //TODO : 第一次点击this.state.curSelectTeacher为空
    this.setState({curSelectStudent : record,classes:classes})
    console.log(record)
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
        let classes="";
        this.state.classes.map((item)=>{
          if(classes==="")
          {
            classes=item.id
          }
          else{
            classes+=","+item.id
          }       
        })               
        put(URL.change_student,{
         id:this.state.curSelectStudent.id,
         password:values.password,
         name:values.name,        
         classes:classes,   
        }).then((res)=>{
          if(res.status==0){
            this.setState({visibleChangeModal:false})
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
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  

  render(){
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '学号',
      dataIndex: 'sno',
      key: 'sno',
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '班级',
      dataIndex: 'classes',
      key: 'classes',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.deleteStudent.bind(this,record)}>删除</Button>
          <Divider type="vertical" />
          <Button size="small" onClick={this.changeStudent.bind(this,record)}>修改</Button>
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
    const props = {
      name: 'file',
      action: 'http://localhost:8000/teacher/large_student',

      withCredentials:true,
      onChange(info) {
        if (info.file.response.status == '0') {
          message.success(info.file.response.msg);
        } else   {
          message.error("批量导入学生失败，请检查文件格式");
        }
      },
    };
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

    let classes = [];
    this.state.classArr.map((item)=>{
      classes.push(
        <Option key={item.id} value={item.id}>{item.name}</Option>
      )
    })
    return(
      <div>
        <BreadcrumbCustom pathList={['学生管理','查询学生']}></BreadcrumbCustom>
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
                <Option value={3}>班级</Option>
              </Select>
              <Button type="primary" className="f-l" onClick={this.showAllStudent.bind(this)}>所有学生</Button>
              <Upload style={{marginLeft:20}} {...props}>
    <Button>
      <Icon type="upload" />批量导入学生
    </Button>
  </Upload>
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
            title="修改学生"
            visible={this.state.visibleChangeModal}
            footer={null}
            onCancel={this.changeCancel.bind(this)}
          >
            <Form onSubmit={this.changeOk.bind(this)}>
            <FormItem
              {...formItemLayout}
              label="学号"
            >
             <span>{this.state.curSelectStudent.sno}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('password', {
              rules: [{ required: true, message: '名字不能为空！'}],
              initialValue:this.state.curSelectStudent.password
            })(
                <Input.Password  />
              )}
            </FormItem>
              <FormItem
                {...formItemLayout}
                label="姓名"
              >
              {getFieldDecorator('name',{
                rules: [{ required: true, message: '姓名不能为空！'}],
                initialValue : this.state.curSelectStudent.name
              })(
                <Input />
              )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="编号"
              >
                <span>{this.state.curSelectStudent.id}</span>
              </FormItem>
              <FormItem
            {...formItemLayout}
              label="班级"
            >          
              {getFieldDecorator('classes')(
                <Select size='default' style={{ width: 300 }}>               
                   {classes}
                </Select>
              )}
            <Button type="primary" style={{marginTop:0,marginLeft:0}} onClick={this.addClass}>增加班级</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已选班级"
            >         
             {this.state.classes.map((item,index)=>{
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
      classinfo: state.classinfo
    }
}

export default connect(
    mapStateToProps
)(Form.create()(QueryStudent))
