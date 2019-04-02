import React from 'react'
import {Row,Col,Input,Progress, Icon,Select, InputNumber,Radio,Button,Card,Tag,Checkbox,Form,Table,Divider, Modal } from 'antd'
import { get,DELETE,post,put } from '@components/axios.js';
import { Link } from 'react-router-dom';
import * as URL from '@components/interfaceURL.js'
import { Breadcrumb } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
 class ChooseQuestion extends React.Component {
  constructor(){
    super()
    this.state = {
      questionArr:[],
      question:{
        id:0,
        questionTypeId:0,     // 0 选择题 1 判断题 2 多选题 3 填空题  4 简答题 5 分析题
        content:'',
        title:'',
        selects:'',
        answer:'',
        difficulty:0,
        subjectId:0,
        keyPoint:'',
        defaultScore:'',
      },
      difficulty:{
        primary:0,
        secondary:0,
        higher:0,
      },
      realScore:0,
      selectData:[],
      visibleChangeModal: false,//查询结果是否显示      
    }
    this.questionShow=this.questionShow.bind(this);
    this.handleChangeScore=this.handleChangeScore.bind(this);
    this.searchQuestion=this.searchQuestion.bind(this);
    this.changeCancel=this.changeCancel.bind(this);
  }
  
  getPaperQuestion(){
    get(URL.get_paper_question,{paperId:this.props.match.params.paperId})
    .then((res)=>{
      if(res.status==0){
         let score=0;
         let primary=0;
         let secondary=0;
         let higher=0;
        res.data.question.map((item,index)=>{
          item.sequence=index+1;
          if(item.difficulty==1){
            item.difficulty="中等";
            secondary++;
          }else if(item.difficulty==2){
            item.difficulty="困难";
            higher++;
          }else{
            item.difficulty="简单";
            primary++;
          }
        })
        const sum=primary+secondary+higher;
        if(sum!=0){
          this.setState({
            difficulty:{
              primary: parseInt((primary/sum)*100),
              secondary: parseInt((secondary/sum)*100),
              higher: parseInt((higher/sum)*100),
            }
          })
         
        }
        res.data.paperCompose.map((item)=>{
          score+=item.singleScore;
       })
        this.setState({
          questionArr: res.data.question,
          realScore:score,
        });
      }
    })
  }

  handleChangeScore(score,id){
      put(URL.change_paper_question,{
        paperId:this.props.match.params.paperId,
        questionId:id,
        singleScore:score,
      }).then((res)=>{
        if(res.status==0){
          this.getPaperQuestion()
        } 
  })
  }

  questionShow(item,index){
    let selects=[]
    if(item.questionTypeId===0){
       let single=[]
       let nextOptionCode = 'A'.charCodeAt(0);
      if(item.selects!==null&&item.selects!== undefined &&item.selects!==''){   
        selects=item.selects.split("&&&");
        for(var i=0;i<selects.length;i++){
          single.push(
            <Radio key={i} style={{display: 'block'}} className="selects" value={String.fromCharCode(nextOptionCode)}>
            {String.fromCharCode(nextOptionCode)+"."+selects[i]}
            </Radio>)
          nextOptionCode=nextOptionCode+1;
        }           
      }
        return(<Card key={item.id} title={item.title} bordered={false} style={{width:"100%"}} >     
      <div className="question-single">
         <Tag>第{index+1}题</Tag>
         <div className="content">
              {item.content}
         </div>
         <RadioGroup disabled={true} defaultValue={item.answer}>
          {single}
         </RadioGroup>
           <div className="content" >
             {"答案："+item.answer}
           </div>
           <div> <span style={{marginLeft:"1000px"}}>分数:
           <InputNumber  onChange={value =>this.handleChangeScore(value,item.id)} min={0} defaultValue={item.defaultScore?item.defaultScore:0} style={{width:"5%"}}>
           </InputNumber> 
           </span>
           </div>
     </div>
        </Card>) 
    }else if(item.questionTypeId===1){
      let answer=""
      if(item.answer==0){answer="正确"} else {answer="错误"}
      return(<Card key={item.id} title={item.title} bordered={false} style={{width:"100%"}} >     
      <div className="question-single">
         <Tag>第{index+1}题</Tag>
         <div className="content">
              {item.content}
         </div>
         <RadioGroup disabled={true} defaultValue={item.answer}>
         <Radio  value="0">正确</Radio>
         <Radio  value="1">错误</Radio>
         </RadioGroup>
           <div className="content" >
             {"答案："+answer}
           </div>
           <div> <span style={{marginLeft:"1000px"}}>分数:
           <InputNumber  onChange={value =>this.handleChangeScore(value,item.id)} min={0} defaultValue={item.defaultScore?item.defaultScore:0} style={{width:"5%"}}>
           </InputNumber> 
           </span>
           </div>
     </div>
        </Card>) 
    }else if(item.questionTypeId===2){
      let answer=[];
      let multiple=[];
      let nextOptionCode = 'A'.charCodeAt(0);
     if(item.selects!==null&&item.selects!== undefined &&item.selects!==''){   
       selects=item.selects.split("&&&");
       for(var i=0;i<selects.length;i++){
         multiple.push(<div key={nextOptionCode} className="selects">
            <Checkbox   value={String.fromCharCode(nextOptionCode)}> {String.fromCharCode(nextOptionCode)+"."+selects[i]}</Checkbox>
            <br />
         </div>)
         nextOptionCode=nextOptionCode+1;
       }           
     }
     if(item.answer!==null&&item.answer!== undefined &&item.answer!==''){
      answer=item.answer.split(",");
     }
     return(<Card key={item.id} title={item.title} bordered={false} style={{width:"100%"}} >     
     <div className="question-single">
        <Tag>第{index+1}题</Tag>
        <div className="content">
             {item.content}
        </div>
      <Checkbox.Group disabled={true} defaultValue={answer}> 
       {multiple}
      </Checkbox.Group>
          <div className="content" >
            {"答案："+item.answer}           
          </div>
          <div> <span style={{marginLeft:"1000px"}}>分数:
           <InputNumber  onChange={value =>this.handleChangeScore(value,item.id)} min={0} defaultValue={item.defaultScore?item.defaultScore:0} style={{width:"5%"}}>
           </InputNumber> 
           </span>
           </div>
    </div>
       </Card>) 
   
    }else {
      return(<Card key={item.id} title={item.title} bordered={false} style={{width:"100%"}} >     
      <div className="question-single">
         <Tag>第{index+1}题</Tag>
         <div className="content">
              {item.content}
         </div>
           <div className="content" >     
           </div>
           <div> <span style={{marginLeft:"1000px"}}>分数:
           <InputNumber  onChange={value =>this.handleChangeScore(value,item.id)} min={0} defaultValue={item.defaultScore?item.defaultScore:0} style={{width:"5%"}}>
           </InputNumber> 
           </span>
           </div>
     </div>
        </Card>) 
    }
  }

  searchQuestion(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {     
        get(URL.get_question_condition,{
          subjectId:this.props.match.params.subjectId,
          difficulty:values.difficulty,
          questionTypeId:values.questionTypeId,
          keyPoint:values.keyPoint,
        }).then((res)=>{
              if(res.status==0){
                res.data.map((item)=>{                 
                  if(item.difficulty==1){
                    item.difficulty="中等"
                  }else if(item.difficulty==2){
                    item.difficulty="困难"
                  }else{
                    item.difficulty="简单"
                  }
                })
                this.setState({
                  selectData:res.data,
                  visibleChangeModal:true
                });
                
              }
        })
      }
    });
  }

  componentDidMount(){
    this.getPaperQuestion();
  }

  delectQuestion(record){
      DELETE(URL.delete_paper_question,this.props.match.params.paperId,
        {sequence:record.sequence-1})
      .then((res)=>{
        if(res.status==0){
          this.getPaperQuestion();
        }
      })
  }

changeCancel(){
  this.setState({visibleChangeModal: false});
}

addQuestion(record){
  post(URL.add_paper_question,{
    paperId:this.props.match.params.paperId,
    questionId:record.id,
    singleScore:record.defaultScore,
  }).then((res)=>{
    if(res.status==0){
      this.getPaperQuestion();
    }
  })
}



handleChangeSequence(operand,record){
  put(URL.change_paper_sequence,{
  paperId:this.props.match.params.paperId,
  questionId:record.id,
  questionNum:operand,
  sequence:record.sequence-1
  }).then(()=>{
      this.getPaperQuestion();
  })
}


  render(){
   let questionCard=[];
   if(this.state.questionArr.length!==0){
    this.state.questionArr.map((item,index)=>{
           questionCard.push(this.questionShow(item,index));
     })
   }
   const { getFieldDecorator } = this.props.form;


   const columns1 = [{
    title: '顺序',
    dataIndex: 'sequence',
    key: 'sequence',
  },{
    title: '题目类型',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '难度',
    dataIndex: 'difficulty',
    key: 'difficulty',
  },{
    title: '知识点',
    dataIndex: 'keyPoint',
    key: 'keyPoint',
  },{
    title: '题干',
    dataIndex: 'content',
    key: 'content',
    width: 450
  },{
    title: '分值',
    key: 'score',
    render: (text, record) => (
      <span>
       <InputNumber  onChange={value =>this.handleChangeScore(value,record.id)} min={0} defaultValue={record.defaultScore?record.defaultScore:0}  style={{width:"20%"}}></InputNumber>
      </span>
    ),
  }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="danger" size="small" onClick={this.delectQuestion.bind(this,record)} >删除</Button>
          <Divider type="vertical" />
          <Button size="small" onClick={this.handleChangeSequence.bind(this,0,record)}>上移</Button>
          <Divider type="vertical" />
          <Button size="small" onClick={this.handleChangeSequence.bind(this,1,record)}>下移</Button>
        </span>
      ),
    }];
    const columns2 = [{
      title: '题目类型',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
    },{
      title: '知识点',
      dataIndex: 'keyPoint',
      key: 'keyPoint',
    },{
      title: '题干',
      dataIndex: 'content',
      key: 'content',
    },{
      title: '默认分值',
      dataIndex: 'defaultScore',
      key: 'score',
    }, {
        title: '操作',
        key: 'action',
        render: (record) => (
          <span>          
            <Button type="primary" onClick={this.addQuestion.bind(this,record)} >添加</Button>
          </span>
        ),
      }];

   
    return( 
      <div>
        <Breadcrumb>
        <Breadcrumb.Item ><Link to={`/main/add_paper`}>生成试卷</Link></Breadcrumb.Item>
        <Breadcrumb.Item >添加试题</Breadcrumb.Item>     
        </Breadcrumb>  
          <Button type="primary" className="f-r m-r-20" ><Link to={`/main/add_paper`}>保存</Link></Button>
        <div >
        <Form onSubmit={this.searchQuestion} layout="inline">
          <Form.Item
            label="题目类型:"
          >
          {getFieldDecorator('questionTypeId',{initialValue:-1})( 
          <Select  style={{ width: 120 }} >
            <Option value={-1} >全部</Option>
            <Option value={0}>单选题</Option>
            <Option value={1} >判断题</Option>
            <Option value={2}>多选题</Option>
            <Option value={3}>填空题</Option>
            <Option value={4}>简答题</Option>
            <Option value={5}>分析题</Option>
            </Select>)}        
          </Form.Item>
          <Form.Item
            label="难度:"
          >
                  {getFieldDecorator('difficulty',{initialValue:-1})( 
                     <Select style={{ width: 120 }} >
                     <Option value={-1}>全部</Option>
                     <Option value={0}>初级</Option>
                     <Option value={1}>中级</Option>
                     <Option value={2}>高级</Option>
                     </Select>)}    
          </Form.Item>
          <Form.Item
            label="知识点:"
          >
                  {getFieldDecorator('keyPoint')( 
                     <Input/>)}    
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">查找</Button>
          </Form.Item>
          <Form.Item style={{marginLeft:"50px"}} >
          <h3>{"试卷分数:"+this.state.realScore+"/"+this.props.match.params.totalScore}</h3>
          </Form.Item>  

          <Form.Item style={{marginLeft:"50px"}} label="简单" >
          <Progress strokeColor="#33FF33" type="circle" percent={this.state.difficulty.primary} width={80} />
          </Form.Item> 
          <Form.Item style={{marginLeft:"50px"}} label="中等" >
          <Progress   type="circle" percent={this.state.difficulty.secondary} width={80} />
          </Form.Item> 
          <Form.Item style={{marginLeft:"50px"}} label="困难" >
          <Progress strokeColor="#FF3333" type="circle" percent={this.state.difficulty.higher} width={80} />
          </Form.Item> 

     
        </Form>      
        </div>
        <div>
        <Table
              rowKey="id"
              columns={columns1}
              dataSource={this.state.questionArr}            
            />
        </div> 
        <Modal  width={800}
                title="查询结果"
                visible={this.state.visibleChangeModal}
                footer={null}
                onCancel={this.changeCancel}
                >
                    <Table
              rowKey="id"
              columns={columns2}
              dataSource={this.state.selectData}         
            />
          </Modal>  
      </div>    
    )
  }
}
export default  Form.create()(ChooseQuestion);
