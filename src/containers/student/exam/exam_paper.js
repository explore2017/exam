import React, { Component, Fragment } from 'react'
import { Card, Radio, Tag, Input, Statistic, Row, Col, Button, Form, Spin, Icon, message, Modal, Checkbox } from 'antd'
import { get, post } from "@components/axios";
const Countdown = Statistic.Countdown;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
import { Link  } from 'react-router-dom';



class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      countDown: undefined,
      loading: true,
      finished: false,
    }
  }

  componentWillMount() {
    let id = this.props.match.params.batchId;
    const api = 'http://localhost:8000/student/exam/paper';
    get(api,{batchId:id}).then((res) => {
      if (res.status == 0) {
        this.setState({
          list: res.data,
          loading: false,
        })
      } 
    })
  }






  packageFormToObject(values) {
    let arr = [];
    for (let i in values) {
      let paperRecord = {};
      paperRecord.sequence = i;
      //多选
      if (values[i] instanceof Array) {
        let arr = values[i];
        //加上字符串后数组自动转为,分割的字符串
        paperRecord.reply = arr + '';
      } else {
        paperRecord.reply = values[i];
      }
      arr.push(paperRecord);
    }
    return arr;
  }



  render() {

    function banMenu() {
      return false;
    }
    document.oncontextmenu = banMenu;

    const { getFieldDecorator } = this.props.form;

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
      let selects = [];
      let imgs=[];
      if(item.img!=null){
        imgs=item.img.split("&&&");
      }  
      let images=[]
      for (var i = 0; i < imgs.length; i++) {
           images.push( <img class="questionimg "  src={imgs[i]} />)
      }
      if (item.questionTypeId === 0) {
        let single = []
        let nextOptionCode = 'A'.charCodeAt(0);
        if (item.selects !== null && item.selects !== undefined && item.selects !== '') {
          selects = item.selects.split("&&&");
          for (var i = 0; i < selects.length; i++) {
            single.push(
              <Radio key={i} style={{ display: 'block' }} className="selects" style={{ marginLeft: 0, display: 'block' }} value={String.fromCharCode(nextOptionCode)}>
                {String.fromCharCode(nextOptionCode) + "." + selects[i]}
              </Radio>)
            nextOptionCode = nextOptionCode + 1;
          }
        }
        return (
          <Card id="1" key={item.id} bordered={false} style={{ width: "100%" }} >
            <div className="question-single">
              <Tag>第{index + 1}题</Tag>
              <div className="content">
              {item.content }
              {images}
           { "(" + item.title + "，" + record.singleScore + "分)"}      
              </div>
              <FormItem>
                {getFieldDecorator(String(record.sequence), {
                  initialValue: isEmpty(record.reply) ? '' : record.reply
                })(
                  <RadioGroup disabled={true}>
                    {single}
                  </RadioGroup>
                )}
              </FormItem>
              <p style={{color:'red'}}>答案：{item.answer}</p>
              <div>
              </div>
            </div>
          </Card>)
      } else if (item.questionTypeId === 1) {
          let answer='正确';
          if(item.answer==1){
            answer='错误';
          }
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag>第{index + 1}题</Tag>
            <div className="content">
            {item.content }
            {images}
           { "(" + item.title + "，" + record.singleScore + "分)"}        
            </div>
            <FormItem>
              {getFieldDecorator(String(record.sequence), {
                initialValue: isEmpty(record.reply) ? '' : record.reply
              })(
                <RadioGroup disabled={true}>
                  <Radio className="selects" style={{ display: 'block' }} value="0">正确</Radio>
                  <Radio className="selects" style={{ display: 'block' }} value="1">错误</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <p style={{color:'red'}}>答案：{answer}</p>
          </div>
        </Card>)
      } else if (item.questionTypeId === 2) {
        let multiple = [];
        let nextOptionCode = 'A'.charCodeAt(0);
        if (item.selects !== null && item.selects !== undefined && item.selects !== '') {
          selects = item.selects.split("&&&");
          for (var i = 0; i < selects.length; i++) {
            multiple.push(<div key={nextOptionCode} className="selects">
              <Checkbox value={String.fromCharCode(nextOptionCode)}> {String.fromCharCode(nextOptionCode) + "." + selects[i]}</Checkbox>
              <br />
            </div>)
            nextOptionCode = nextOptionCode + 1;
          }
        }
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag>第{index + 1}题</Tag>
            <div className="content">
            {item.content }
            {images}
           { "(" + item.title + "，" + record.singleScore + "分)"}        
            </div>
            <FormItem>
              {getFieldDecorator(String(record.sequence), {
                initialValue: isEmpty(record.reply) ? '' : record.reply.split(',')
              })(
                <Checkbox.Group disabled={true} >
                  {multiple}
                </Checkbox.Group>
              )}
            </FormItem>
            <p style={{color:'red'}}>答案：{item.answer}</p>
          </div>
        </Card>)
      } else if (item.questionTypeId === 3) {
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag>第{index + 1}题</Tag>
            <div className="content">
            {item.content }
            {images}
           { "(" + item.title + "，" + record.singleScore + "分)"}        
            </div>
            <div className="content" >
              <FormItem>
                {getFieldDecorator(String(record.sequence), {
                  initialValue: isEmpty(record.reply) ? '' : record.reply
                })(
                  <Input disabled={true} style={{ width: "10%" }} ></Input>
                )}
              </FormItem>
            </div>
          </div>
        </Card>)
      } else {
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag>第{index + 1}题</Tag>
            <div className="content">
            {item.content }
            {images}
           { "(" + item.title + "，" + record.singleScore + "分)"}        
            </div>
            <div className="content" >
              <FormItem>
                {getFieldDecorator(String(record.sequence), {
                  initialValue: isEmpty(record.reply) ? '' : record.reply
                })(
                  <TextArea disabled={true} autosize={{ minRows: 10, maxRows: 20 }}></TextArea>
                )}
              </FormItem>
            </div>
          </div>
        </Card>)
      }
    }

    if (!this.state.loading) {
      return (
        <div style={{ background: '#ECECEC', padding: 30 }}>
          <div style={{ width: '60%', margin: 'auto', minWidth: 500 }}>
            <Form >
              {paper}
              <Card style={{ marginTop: 30 }}>
                <Button  type="primary"  style={{ float: 'right' }}><Link to={`/student/exam/me`}>返回</Link></Button>
              </Card>
            </Form>
          </div>
        </div>
      )
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <p><Spin size="large" indicator={<Icon type="smile" style={{ fontSize: 34, marginTop: 100 }} spin />} /></p>
          <p>正在加载</p>
        </div>
      )
    }

  }
}

export default Form.create()(Index)