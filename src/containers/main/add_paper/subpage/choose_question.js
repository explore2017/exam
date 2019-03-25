import React from 'react'

import {Row,Col,Input, Icon, Divider,Button,Card,Tag,InputNumber} from 'antd'
import { get,DELETE,post,put } from '@components/axios.js';
import * as URL from '@components/interfaceURL.js'
 class ChooseQuestion extends React.Component {
  constructor(){
    super()
    this.state = {
      questionArr:[],
      questionList:{
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
  }
  
  getPaperQuestion(){
    get(URL.get_paper_question,{paperId:10})
    .then((res)=>{
      if(res.status==0){
        console.log(res.data)
        this.setState({questionArr:res.data});
      }
    })
  }

  componentDidMount(){
    this.getPaperQuestion();
  }

  componentWillReceiveProps(nextProps){

  }


  render(){
   let questionCard=[];
   if(this.state.questionArr.length!==0){
    this.state.questionArr.map((item,index)=>{
      if(item.questionTypeId===0){
        questionCard.push(<Card key={item.id} title={item.title} bordered={false} style={{ width: '100%' }}>     
        <div className="question-single">
           <Tag>第{index+1}题</Tag>
           <div className="content">
                {item.content}
          </div>
       </div>
          </Card>) 
      } 
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
