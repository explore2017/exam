import React from 'react'
import {Row,Col,Input, Icon, InputNumber,Radio,Button,Card,Tag,Checkbox } from 'antd'
import { get,DELETE,post,put } from '@components/axios.js';
import * as URL from '@components/interfaceURL.js'
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
      }        
    }
    this.questionShow=this.questionShow.bind(this);
    this.handleChangeScore=this.handleChangeScore.bind(this);
  }
  
  getPaperQuestion(){
    get(URL.get_paper_question,{paperId:10})
    .then((res)=>{
      if(res.status==0){    
        this.setState({questionArr:res.data});
      }
    })
  }

  handleChangeScore(score,id){
      put(URL.change_paper_question,{
        paperId:10,
        questionId:id,
        singleScore:score,
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

  componentDidMount(){
    this.getPaperQuestion();
  }


  render(){
   let questionCard=[];
   if(this.state.questionArr.length!==0){
    this.state.questionArr.map((item,index)=>{
           questionCard.push(this.questionShow(item,index));
     })
   }
 
   
    return( 
      <div>
       {questionCard}
      </div>    
    )
  }
}
export default ChooseQuestion;
