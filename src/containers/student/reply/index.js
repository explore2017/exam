import React, { Component, Fragment } from 'react'
import { Card, Radio, Tag, Input, Statistic, Row, Col, Button, Form, Spin, Icon, message,Modal,Checkbox } from 'antd'
import { get, post } from "@components/axios";
const Countdown = Statistic.Countdown;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      countDown: undefined,
      batchId: undefined,
      loading: true,
      finished: false,
      visible:false
    }
  }

  componentWillMount() {
    let id = this.props.match.params.batchId;
    const api = 'http://localhost:8000/exam/batch/' + id + '/start';
    post(api).then((res) => {
      if (res.status == 0) {
        this.setState({
          list: res.data.data,
          countDown: res.data.countDown,
          batchId: id,
          loading: false
        })
        this.interval = setInterval(() => this.monitor(false), 60 * 1000);
      } else {
        this.setState({
          finished: true
        })
      }
    })
  }

  monitor(isInitiative) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        post('http://localhost:8000/exam/batch/' + this.state.batchId + '/monitor', {
          records: this.packageFormToObject(values)
        }).then((res) => {
          if (isInitiative) {
            message.success('临时保存成功');
          }
        });
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      visible:true
    })
  }

  submit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        post('http://localhost:8000/exam/batch/' + this.state.batchId + '/submit', {
          records: this.packageFormToObject(values)
        }).then((res) => {
          if (res.status == 0) {
            this.setState({
              finished: true
            })
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
      //多选
      if(values[i] instanceof Array){
        let arr = values[i];
        //加上字符串后数组自动转为,分割的字符串
        paperRecord.reply=arr+'';
      }else{
        paperRecord.reply = values[i];
      }
      arr.push(paperRecord);
    }
    return arr;
  }

  renderFinishedState(){
    let questions = [];
    this.props.form.validateFields((err, values) => {
      if (!err) {
          this.packageFormToObject(values).map((item)=>{
            let reply = (item.reply).trim();
            if(typeof reply == "undefined" || reply == null || reply == ""){
              questions.push(<Button key={item.sequence} style={{marginRight:10}}>{item.sequence+1}</Button>)
            }else{
              questions.push(<Button key={item.sequence} style={{marginRight:10}} type='primary'>{item.sequence}</Button>)
            }
          })
      }
    })
    return(
      questions
    )
  }

  onFinish() {
    this.submit();
  }

  handleOk(){
    this.submit();
  }

  handleCancel(){
    this.setState({
      visible: false,
    });
  }

  render() {

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
      let selects = []
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
                {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
              </div>
              <FormItem>
                {getFieldDecorator(String(record.sequence), {
                  initialValue: isEmpty(record.reply) ? '' : record.reply
                })(
                  <RadioGroup>
                    {single}
                  </RadioGroup>
                )}
              </FormItem>
              <div>
              </div>
            </div>
          </Card>)
      } else if (item.questionTypeId === 1) {
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag>第{index + 1}题</Tag>
            <div className="content">
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>
            <FormItem>
              {getFieldDecorator(String(record.sequence), {
                initialValue:isEmpty(record.reply) ? '' : record.reply
              })(
                <RadioGroup >
                  <Radio className="selects" style={{ display: 'block' }} value="0">正确</Radio>
                  <Radio className="selects" style={{ display: 'block' }} value="1">错误</Radio>
                </RadioGroup>
              )}
            </FormItem>
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
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>
            <FormItem>
              {getFieldDecorator(String(record.sequence), {
                initialValue: isEmpty(record.reply) ? '' : record.reply.split(',')
              })(
                <Checkbox.Group  >
                  {multiple}
                </Checkbox.Group>
              )}
            </FormItem>
          </div>
        </Card>)
      } else if (item.questionTypeId === 3) {
        return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
          <div className="question-single">
            <Tag>第{index + 1}题</Tag>
            <div className="content">
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>
            <div className="content" >
              <FormItem>
                {getFieldDecorator(String(record.sequence), {
                  initialValue: isEmpty(record.reply) ? '' : record.reply
                })(
                  <Input style={{ width: "10%" }} ></Input>
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
              {item.content + "(" + item.title + "，" + record.singleScore + "分)"}
            </div>
            <div className="content" >
              <FormItem>
                {getFieldDecorator(String(record.sequence), {
                  initialValue: isEmpty(record.reply) ? '' : record.reply
                })(
                  <TextArea autosize={{ minRows: 10, maxRows: 20 }}></TextArea>
                )}
              </FormItem>
            </div>
          </div>
        </Card>)
      }
    }

    if (this.state.finished) {
      return (
        <div style={{ textAlign: "center" }}>
          <p><Icon style={{ fontSize: 34, marginTop: 100 }} type="smile" /></p>
          <h2>考试已提交</h2>
        </div>
      )
    } else if (!this.state.loading) {
      return (
        <div style={{ background: '#ECECEC', padding: 30 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Countdown style={{ position: 'fixed' }} title={'距离考试结束还有'} value={Date.now() + this.state.countDown} onFinish={() => this.onFinish()} />
            </Col>
          </Row>
          <div style={{ width: '60%', margin: 'auto', minWidth: 500 }}>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              {paper}
              <Card style={{ marginTop: 30 }}>
                <Button icon="check" htmlType="submit" type="primary" style={{ float: 'right', marginLeft: 20 }}>交卷</Button>
                <Button icon="save" type="primary" onClick={() => this.monitor(true)} style={{ float: 'right' }}>临时保存</Button>
              </Card>
            </Form>
          </div>
          <Modal
            title="提示"
            visible={this.state.visible}
            onOk={()=>this.handleOk()}
            onCancel={()=>this.handleCancel()}
            okText='确认提交'
            cancelText='取消'
          >
            {this.renderFinishedState()}
          </Modal>
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