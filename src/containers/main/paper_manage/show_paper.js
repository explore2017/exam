import React from 'react'
import {Row,Col,Input, Icon,Anchor,Select, InputNumber,Radio,Button,Card,Tag,Checkbox,Form,Table,Divider, Modal } from 'antd'
import { get,DELETE,post,put } from '@components/axios.js';
const { Link } = Anchor;
import * as URL from '@components/interfaceURL.js'
const { TextArea } = Input;
import Title from 'antd/lib/typography/Title';
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ShowPaper extends React.Component {
    constructor(){
        super()
        this.state = {
          questionArr:[],      
        }
        this.questionShow=this.questionShow.bind(this);
      }
  getPaperQuestion(){
        get(URL.get_paper_question,{paperId:this.props.match.params.paperId})
        .then((res)=>{
          if(res.status==0){ 
            this.setState({questionArr:res.data.question});
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
                return(<Card id="1" key={item.id}  bordered={false} style={{width:"100%"}} >     
              <div className="question-single">
                 <Tag>第{index+1}题</Tag>
                 <div className="content">
                 {item.content+"("+item.title+"，"+item.defaultScore+"分)"}       
                 </div>
                 <RadioGroup  >
                  {single}
                 </RadioGroup>
                   <div>
                   </div>
             </div>
                </Card>) 
            }else if(item.questionTypeId===1){          
              return(<Card key={item.id}  bordered={false} style={{width:"100%"}} >     
              <div className="question-single">
                 <Tag>第{index+1}题</Tag>
                 <div className="content">
                 {item.content+"("+item.title+"，"+item.defaultScore+"分)"}       
                 </div>
                 <RadioGroup >
                 <Radio className="selects" style={{display: 'block'}}  value="0">正确</Radio>
                 <Radio className="selects" style={{display: 'block'}}  value="1">错误</Radio>
                 </RadioGroup>                 
             </div>
                </Card>) 
            }else if(item.questionTypeId===2){
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
           
             return(<Card key={item.id}  bordered={false} style={{width:"100%"}} >     
             <div className="question-single">
                <Tag>第{index+1}题</Tag>
                <div className="content">
                {item.content+"("+item.title+"，"+item.defaultScore+"分)"}       
                </div>
              <Checkbox.Group  > 
               {multiple}
              </Checkbox.Group>                

            </div>
               </Card>) 
           
            }else if(item.questionTypeId===3) {
              return(<Card key={item.id} bordered={false} style={{width:"100%"}} >     
              <div className="question-single">
                 <Tag>第{index+1}题</Tag>
                 <div className="content">
                 {item.content+"("+item.title+"，"+item.defaultScore+"分)"}                
                 </div>
                   <div className="content" >
                   <Input style={{width:"10%"}} ></Input>   
                   </div>

             </div>
                </Card>) 
            }else {
                return(<Card key={item.id} bordered={false} style={{width:"100%"}} >     
              <div className="question-single">
                 <Tag>第{index+1}题</Tag>
                 <div className="content">
                      {item.content+"("+item.title+"，"+item.defaultScore+"分)"}                 
                 </div>
                   <div className="content" >
                   <TextArea autosize={{ minRows: 10, maxRows: 20 }}    ></TextArea>   
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
              <div id="content" style={{background:"#AAAAAA"}}> 
               <Anchor getContainer={() => document.getElementById('content')} > 
               <Link  href="#1" title="Basic demo" /> 
               </Anchor>                    
              <div class="paper">
              <Title style={{textAlign:"center"}} level={2}>timu</Title>
              <Divider ></Divider>          
              {questionCard}                    
               </div>                                  
              </div> 
             )
           }
}

export default ShowPaper ;