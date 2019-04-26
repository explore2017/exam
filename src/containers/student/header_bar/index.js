import React from 'react'

import { Menu, Icon, Button } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
//路由组件
import { Link } from 'react-router-dom';

class HeaderBar extends React.Component {
  constructor(){
    super();
    this.state={
      name:''
    }
  }

  componentWillMount(){
    //如果状态管理中没有内容（用户刷新网页）
    //去取localStorage的用户名
    localStorage.getItem("user")==null?'':this.setState({
      name:JSON.parse(localStorage.getItem("user")).name
    })
  }

  handleClick(e){
    //退出
    if(e.key == 'sign_out') {
      localStorage.removeItem("userName");
      localStorage.removeItem("role");
      localStorage.removeItem("user")
    }
  }

  render(){
    return(
      <Menu
        mode="horizontal"
        onClick={this.handleClick.bind(this)}
      >
        <SubMenu title={<span><Icon type="user" />{this.state.name}</span>}>
            <Menu.Item key="sign_out"><Link to="/student/login">退出</Link></Menu.Item>
            <Menu.Item key="change_password"><Link to="/student/center/password">修改密码</Link></Menu.Item>
        </SubMenu>
      </Menu>
    )
  }

}



export default HeaderBar
