import React, { Component, Fragment } from 'react'
import { Card, Radio, Tag, Input, Statistic, Row, Col, Button, Form } from 'antd'
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
      batchId:undefined
    }
  }

  componentDidMount() {
    let id = this.props.match.params.batchId;
    const api = 'http://localhost:8000/exam/batch/' + id + '/start';
    get(api).then((res) => {
      if (res.status == 0) {
        this.setState({
          list: res.data.data,
          countDown: res.data.countDown,
          batchId:id
        })
        this.interval = setInterval(() => this.monitor(), 60 *1000);
      }
    })
  }

  monitor() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        post('http://localhost:8000/exam/batch/' + this.state.batchId + '/monitor', {
          records: this.packageFormToObject(values)
        });
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        post('http://localhost:8000/exam/batch/' + this.state.batchId + '/submit', {
          records: this.packageFormToObject(values)
        }).then((res) => {
          
        })
      }
    });
  }

  packageFormToObject(values){
    let arr = [];
        for (let i in values) {
          let paperRecord = {};
          paperRecord.sequence = i;
          paperRecord.reply = values[i];
          arr.push(paperRecord);
        }
    return arr;
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    let paper = [];

    this.state.list.map((item, index) => {
      paper.push(questionShow(item, index))
    })

    function onFinish() {

    }

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
                initialValue: isEmpty(record.reply) ? '' : record.reply
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
                initialValue: isEmpty(record.reply) ? '' : record.reply
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

    return (
      <div style={{ background: '#ECECEC', padding: 30 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Countdown style={{ position: 'fixed' }} title={'距离考试结束还有'} value={Date.now() + this.state.countDown} onFinish={onFinish} />
          </Col>
        </Row>
        <div style={{ width: '60%', margin: 'auto', minWidth: 500 }}>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            {paper}
            <Card style={{ marginTop: 30 }}>
              <Button icon="check" htmlType="submit" type="primary" style={{ float: 'right' }}>交卷</Button>
            </Card>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(Index)