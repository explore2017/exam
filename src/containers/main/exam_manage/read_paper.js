import React, { Component, Fragment } from 'react'
import { Card, Radio, Tag, Input, Statistic, Row, Col, Button, Form, InputNumber, Icon, message,Modal,Checkbox,Breadcrumb  } from 'antd'
import { get, post } from "@components/axios";
import { Link } from 'react-router-dom';
const Countdown = Statistic.Countdown;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;

class ReadPaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      countDown: undefined,
      visible:false
    }
    this.handleSubmit=this.handleSubmit.bind(this);
  }
  

  componentWillMount() {
    let id = this.props.match.params.batchStudentId;
    const api = 'http://localhost:8000/exam/read_paper/' + id ;
    get(api).then((res) => {
      if (res.status == 0) {
        this.setState({
          list: res.data.data,
        })
      } 
    })
  }

 

  componentWillUnmount() {

  }



  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
            let id = this.props.match.params.batchStudentId;
          post('http://localhost:8000/exam/read_paper/' +id , {
            records: this.packageFormToObject(values)
          }).then((res) => {
            if (res.status == 0) {
              this.props.history.push(`/main/exam_manage/exam_details/${this.props.match.params.examId}/${this.props.match.params.batchId}`);
            }
          })
        }
      });
  }

  packageFormToObject(values) {
    let arr = [];
    for (let i in values) {
      let paperRecord = {};
      paperRecord.sequence = i;
      paperRecord.score = values[i];
      arr.push(paperRecord);
    }
    return arr;
  }


  handleCancel(){
    this.setState({
      visible: false,
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    const formItemLayoutTop = {
        labelCol: {
          sm: { span: 24 },
          md: { span: 6 }
        },
        wrapperCol: {
          sm: { span: 24 },
          md: { span: 18 }
        },
      }
  

    let paper = [];
  
    this.state.list.map((item, index) => {
      paper.push(questionShow(item, index))
    });

    function isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    }

    function questionShow(record, index) {
      const item = record.question;
      let selects = []
      if (item.questionTypeId === 0) {
        let single = []
        let nextOptionCode = 'A'.charCodeAt(0);
        if (item.selects !== null && item.selects !== undefined && item.selects !== '') {
          selects = item.selects.split("&&&");
          for (var i = 0; i < selects.length; i++) {
            single.push(
              <Radio  key={i} style={{ display: 'block' }} className="selects" style={{ marginLeft: 0, display: 'block' }} value={String.fromCharCode(nextOptionCode)}>
                {String.fromCharCode(nextOptionCode) + "." + selects[i]}
              </Radio>)
            nextOptionCode = nextOptionCode + 1;
          }
        }
        return (
          <Card id="1" key={item.id} bordered={false} style={{ width: "100%" }} >
            <div className="question-single">
              <Tag color="blue">第{index + 1}题</Tag>
              <div className="content">
                {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
              </div>     
                  <RadioGroup value={isEmpty(record.reply) ? '' : record.reply} disabled={true}>
                    {single}
                  </RadioGroup>
                <div className="content" >
            {"正确答案："+item.answer}  
            <FormItem
            {...formItemLayoutTop}
             label="得分">
                {getFieldDecorator(String(record.sequence), {
                   rules: [{ required: true, message: '得分不能为空！'}],
                  initialValue: isEmpty(record.score) ? 0 : record.score
                })(<InputNumber  precision={1} min={0} max={record.singleScore}   style={{width:"5%"}}>
                </InputNumber> )}
             </FormItem>         
           </div>
              <div> 
           </div>
              <div>
              </div>
            </div>
          </Card>)
      } else if (item.questionTypeId === 1) {
          let answer='';
          if(item.answer==0){
            answer='正确';
          }else{
            answer='错误';
          }
        return (<Card  key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag color="blue">第{index + 1}题</Tag>
            <div className="content">
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>       
                <RadioGroup value={isEmpty(record.reply) ? '' : record.reply} disabled={true} >
                  <Radio className="selects" style={{ display: 'block' }} value="0">正确</Radio>
                  <Radio className="selects" style={{ display: 'block' }} value="1">错误</Radio>
                </RadioGroup>
            <div className="content" >
            {"正确答案："+answer}  
            <FormItem
            {...formItemLayoutTop}
             label="得分">
                {getFieldDecorator(String(record.sequence), {
                  rules: [{ required: true, message: '得分不能为空！'}],
                  initialValue: isEmpty(record.score) ? 0 : record.score
                })(<InputNumber  precision={1} min={0} max={record.singleScore}   style={{width:"5%"}}>
                </InputNumber> )}
             </FormItem>           
           </div>
          </div>
        </Card>)
      } else if (item.questionTypeId === 2) {
        let answer=[]
        let multiple = [];
        let nextOptionCode = 'A'.charCodeAt(0);
        if (item.selects !== null && item.selects !== undefined && item.selects !== '') {
          selects = item.selects.split("&&&");
          for (var i = 0; i < selects.length; i++) {
            multiple.push(<div key={nextOptionCode} className="selects">
              <Checkbox  value={String.fromCharCode(nextOptionCode)}> {String.fromCharCode(nextOptionCode) + "." + selects[i]}</Checkbox>
              <br />
            </div>)
            nextOptionCode = nextOptionCode + 1;
          }
        }
        if(!isEmpty(record.reply)){
            answer=record.reply.split(',')
        }
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag color="blue">第{index + 1}题</Tag>
            <div className="content">
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>
                <Checkbox.Group disabled={true} value={answer}  >
                  {multiple}
                </Checkbox.Group>
            <div className="content" >
            {"正确答案："+item.answer}  
            <FormItem
            {...formItemLayoutTop}
             label="得分">
                {getFieldDecorator(String(record.sequence), {
                   rules: [{ required: true, message: '得分不能为空！'}],
                  initialValue: isEmpty(record.score) ? 0 : record.score
                })(<InputNumber  precision={1} min={0} max={record.singleScore}   style={{width:"5%"}}>
                </InputNumber> )}
             </FormItem>          
           </div>
          </div>
        </Card>)
      } else if (item.questionTypeId === 3) {
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag color="blue">第{index + 1}题</Tag>
            <div className="content">
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>
            <div className="content" >             
                  <Input value={isEmpty(record.reply) ? '' : record.reply} disabled={true} style={{ width: "5%" }} ></Input>
            </div>
            <div className="content" >
            <FormItem
            {...formItemLayoutTop}
             label="得分">
                {getFieldDecorator(String(record.sequence), {
                   rules: [{ required: true, message: '得分不能为空！'}],
                  initialValue: isEmpty(record.score) ? 0 : record.score
                })(<InputNumber  precision={1} min={0} max={record.singleScore}   style={{width:"5%"}}>
                </InputNumber> )}
             </FormItem>            
           </div>
          </div>
        </Card>)
      } else {
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag color="blue">第{index + 1}题</Tag>
            <div className="content">
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>
            <div className="content" >
                  <TextArea value={isEmpty(record.reply) ? '' : record.reply} disabled={true} autosize={{ minRows: 10, maxRows: 20 }}></TextArea>
              <div className="content" >
            <FormItem
            {...formItemLayoutTop}
             label="得分">
                {getFieldDecorator(String(record.sequence), {
                   rules: [{ required: true, message: '得分不能为空！'}],
                  initialValue: isEmpty(record.score) ? 0: record.score
                })(<InputNumber  precision={1} min={0} max={record.singleScore}   style={{width:"5%"}}>
                </InputNumber> )}
             </FormItem>        
           </div>
            </div>
          </div>
        </Card>)
      }
    }

    return(<div>
          <Breadcrumb>
        <Breadcrumb.Item >考试管理</Breadcrumb.Item>  
        <Breadcrumb.Item ><Link to={`/main/exam_manage/query_exam`}>我的考试</Link></Breadcrumb.Item>
        <Breadcrumb.Item ><Link to={`/main/exam_manage/exam_details/${this.props.match.params.examId}`}>考试批次</Link></Breadcrumb.Item>   
        <Breadcrumb.Item ><Link to={`/main/exam_manage/exam_details/${this.props.match.params.examId}/${this.props.match.params.batchId}`}>批次详情</Link></Breadcrumb.Item> 
        <Breadcrumb.Item >阅卷</Breadcrumb.Item>    
        </Breadcrumb>
        <div>
        {paper}  
        </div>
        <Row>
        <Col span={12}>
        </Col>
        <Col span={12}>
        <Button onClick={this.handleSubmit} type="primary" >提交</Button>
        </Col>
        </Row>  
     
 </div>
    )

  }
}

export default Form.create()(ReadPaper)