import React, { Component, Fragment } from 'react'
import { Card, Radio, Tag, Input, Statistic, Row, Col } from 'antd'
import { get } from "@components/axios";
const Countdown = Statistic.Countdown;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      value: 1
    }
  }

  componentWillMount() {
    console.log(this.props.match.params.batchId);
    //请求开始
    const api = 'http://localhost:8000/paper/details?paperId=10';
    get(api).then((res) => {
      if (res.status == 0) {
        this.setState({
          list: res.data
        })
      }
    })
  }

  questionShow(item, singleScore, index) {
    let selects = []
    if (item.questionTypeId === 0) {
      let single = []
      let nextOptionCode = 'A'.charCodeAt(0);
      if (item.selects !== null && item.selects !== undefined && item.selects !== '') {
        selects = item.selects.split("&&&");
        for (var i = 0; i < selects.length; i++) {
          single.push(
            <Radio key={i} style={{ display: 'block' }} className="selects" style={{marginLeft:0, display: 'block'}} value={String.fromCharCode(nextOptionCode)}>
              {String.fromCharCode(nextOptionCode) + "." + selects[i]}
            </Radio>)
          nextOptionCode = nextOptionCode + 1;
        }
      }
      return (<Card id="1" key={item.id} bordered={false} style={{ width: "100%" }} >
        <div className="question-single">
          <Tag>第{index + 1}题</Tag>
          <div className="content">
            {item.content + "(" + item.title + "，" + singleScore + "分)"}
          </div>
          <RadioGroup>
            {single}
          </RadioGroup>
          <div>
          </div>
        </div>
      </Card>)
    } else if (item.questionTypeId === 1) {
      return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
        <div className="question-single">
          <Tag>第{index + 1}题</Tag>
          <div className="content">
            {item.content + "(" + item.title + "，" + singleScore + "分)"}
          </div>
          <RadioGroup >
            <Radio className="selects" style={{ display: 'block' }} value="0">正确</Radio>
            <Radio className="selects" style={{ display: 'block' }} value="1">错误</Radio>
          </RadioGroup>
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
            {item.content + "(" + item.title + "，" + singleScore + "分)"}
          </div>
          <Checkbox.Group  >
            {multiple}
          </Checkbox.Group>
        </div>
      </Card>)
    } else if (item.questionTypeId === 3) {
      return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
        <div className="question-single">
          <Tag>第{index + 1}题</Tag>
          <div className="content">
            {item.content + "(" + item.title + "，" + singleScore + "分)"}
          </div>
          <div className="content" >
            <Input style={{ width: "10%" }} ></Input>
          </div>
        </div>
      </Card>)
    } else {
      return (<Card key={item.id} bordered={false} style={{ width: "100%" }} >
        <div className="question-single">
          <Tag>第{index + 1}题</Tag>
          <div className="content">
            {item.content + "(" + item.title + "，" + singleScore + "分)"}
          </div>
          <div className="content" >
            <TextArea autosize={{ minRows: 10, maxRows: 20 }}    ></TextArea>
          </div>
        </div>
      </Card>)
    }
  }

  onChange(e) {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }



  render() {

    let paper = [];
    const deadline = Date.now() + 1000 * 60; 

    this.state.list.map((item, index) => {
      paper.push(this.questionShow(item.question, item.singleScore, index))
    })

    function onFinish() {
      console.log('finished!');
    }

    return (
      <div style={{ background: '#ECECEC', padding: 30 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Countdown style={{position:'fixed'}} title="距离考试结束还有" value={deadline} onFinish={onFinish} />
          </Col>
        </Row>
        <div style={{ width: '60%', margin:'auto' }}>
          {paper}
        </div>
      </div>
    )
  }
}

export default Index