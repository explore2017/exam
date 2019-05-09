import React, { Component } from 'react'
import {Statistic} from 'antd'
const Countdown = Statistic.Countdown;
class DaoJiShi extends Component{
    constructor(props) {
        super(props);
        this.state = {
          countDown: undefined,        
        }
      }
      componentWillMount(){
          console.log(this.props)
          this.setState({
              countDown:this.props.time
          })
      }

      shouldComponentUpdate(){
          if(this.state.countDown!=undefined){
              return false;
          }
      }
render(){
    return ( <Countdown style={{ position: 'fixed' }} title={'距离考试结束还有'} value={Date.now() + this.state.countDown} onFinish={this.props.onFinish()} />)
}


}
export default DaoJiShi