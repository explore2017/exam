import React from 'react'
import { Menu, Icon, Button } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//actions
import * as subjectinfoActions from '../../actions/subjectinfo'
import * as classinfoActions from '../../actions/classinfo'

//路由组件
import { Route,Link,Switch  } from 'react-router-dom';

//头部条
import HeaderBar from './header_bar'

//首页
import Homepage from './homepage/index.js'

// 试题录入
import QCheckin from './q_checkin/index.js';

//出卷
import ChooseQuestions from './add_paper/subpage/choose_question';
import Paper from './add_paper/index.js';
//试题库和科目
import QuerySubject from './subject_manage/index.js'
import SubjectQuestion from './subject_manage/subject_question.js'

//成绩查询
import ScoreSearch from './score_search/index.js';

//学生管理组件
import AddStudent from './student_manage/add_student'
import QueryStudent from './student_manage/query_student'

//教师管理
import AddTeacher from './teacher_manage/add_teacher';
import QueryTeacher from './teacher_manage/query_teacher';

//班级管理
import AddClass from './class_manage/add_class.js';
import QueryClass from './class_manage/query_class.js';
import ClassDetail from './class_manage/class_detail.js';

//考试管理组件
import CreateExam from './exam_manage/create_exam.js';
import QueryExam from './exam_manage/query_exam.js';
import ExamDetails from './exam_manage/exam_details';
import BatchDetails from './exam_manage/batch_details';
import ReadPaper from './exam_manage/read_paper.js';
import ExamScore from './exam_manage/exam_score';

//个人中心
import ChangePassword from './personal_center/change_password';

import httpServer from '@components/httpServer.js'
import * as URL from '@components/interfaceURL.js'
import { get } from '@components/axios.js';

class Main extends React.Component {
	constructor(){
		super();
		this.state = {
			defaultOpenKeys : [],//菜单默认打开项
			defaultSelectedKeys : [],//菜单默认选择项
			openKeys: [],//菜单打开项
			subjectArr:[],//科目数组
			roleSet :0,
		}
		this.rootSubmenuKeys = ['q_checkin', 'student_manage','teacher_manage','exam_manage','personal_center','class_manage'];
	}

	//根据路由判断 用户选择了菜单中的哪一项
	whoIsChecked(){
		if(this.props.location.pathname.indexOf('/main/q_checkin') != -1) {//试题录入
			this.setState({defaultOpenKeys : ['q_checkin']})
			this.setState({openKeys : ['q_checkin']})
			let arr = this.props.location.pathname.split('/');
			let str = arr[arr.length-2] + '_' + arr[arr.length-1];
			this.setState({defaultSelectedKeys : [str]})
		}
		else if(this.props.location.pathname.indexOf('/main/choose_questions') != -1) {//试题查询
			this.setState({defaultSelectedKeys : ['choose_questions']})
		}
		else if(this.props.location.pathname.indexOf('/main/score_search') != -1) {//成绩查询
			this.setState({defaultSelectedKeys : ['score_search']})
		}
		else if(this.props.location.pathname.indexOf('/main/student_manage') != -1) {//学生管理
			this.setState({defaultOpenKeys : ['student_manage']})
			this.setState({openKeys : ['student_manage']})
			let arr = this.props.location.pathname.split('/');
			let str = arr[arr.length-1];
			this.setState({defaultSelectedKeys : [str]})
		}
		else if(this.props.location.pathname.indexOf('/main/teacher_manage') != -1) {//教师管理
			this.setState({defaultOpenKeys : ['teacher_manage']})
			this.setState({openKeys : ['teacher_manage']})
			let arr = this.props.location.pathname.split('/');
			let str = arr[arr.length-1];
			this.setState({defaultSelectedKeys : [str]})
		}
		else if(this.props.location.pathname.indexOf('/main/class_manage') != -1) {//班级管理
			this.setState({defaultOpenKeys : ['class_manage']})
			this.setState({openKeys : ['class_manage']})
			let arr = this.props.location.pathname.split('/');
			let str = arr[arr.length-1];
			this.setState({defaultSelectedKeys : [str]})
		}
		else if(this.props.location.pathname.indexOf('/main/exam_manage') != -1) {//考试管理
			this.setState({defaultOpenKeys : ['exam_manage']})
			this.setState({openKeys : ['exam_manage']})
			let arr = this.props.location.pathname.split('/');
			let str = arr[arr.length-1];
			this.setState({defaultSelectedKeys : [str]})
			if(this.props.location.pathname.indexOf('query_exam') != -1) {
				this.setState({defaultSelectedKeys : ['query_exam']})
			}
		}
		else if(this.props.location.pathname.indexOf('/main/personal_center') != -1) {//个人中心
			this.setState({defaultOpenKeys : ['personal_center']})
			this.setState({openKeys : ['personal_center']})
			let arr = this.props.location.pathname.split('/');
			let str = arr[arr.length-1];
			this.setState({defaultSelectedKeys : [str]})
		}
	}

	componentWillMount(){
		//判断用户是否已经登录
		if(!localStorage.getItem("userName")||!(localStorage.getItem("role")==0||localStorage.getItem("role")==1)) {
			this.props.history.push('/login');//跳转至登录页
		}

		this.setState({roleSet : localStorage.getItem("role")})

		//获取科目信息
		get(URL.get_subject)	
		.then((res)=>{
			this.setState({subjectArr : res.data})
			//状态存储
			this.props.subjectinfoActions.setSubjectInfo({
				subjectArr: this.state.subjectArr
			})
		})

		//获取班级信息
		get(URL.get_class_info)
    .then((res)=>{
			let classes=[];
			res.data.map((item)=>{
				classes.push(item.class);
			})
			//状态存储
			this.props.classinfoActions.setClassInfo({
				classArr: classes
			})
    })

		//菜单选择情况
		this.whoIsChecked();
	}

	//点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁。
  onOpenChange(openKeys) {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

	render(){
		return(
			<div>
				<div id="leftMenu">
					{/* <img className="logo" src="/sxt_exam/lqw/images/logo.jpg"/> */}
					<img className="logo" src={require("@assets/images/pencil.svg")}/>
					<div>
		        <Menu
		          mode="inline"
							defaultOpenKeys={this.state.defaultOpenKeys}
							defaultSelectedKeys={this.state.defaultSelectedKeys}
							openKeys={this.state.openKeys}
        			onOpenChange={this.onOpenChange.bind(this)}
		        >
							<Menu.Item  key={"q_checkin"}>				
				    	<Link to={"/main/q_checkin/"}>
							<Icon type="form" />
						  <span>试题录入</span>	
							</Link>
					    </Menu.Item>
							<Menu.Item key="choose_questions">
								<Link to="/main/add_paper">
			            <Icon type="profile" />
			            <span>生成试卷</span>
								</Link>
		          </Menu.Item>
		          {/* <Menu.Item key="score_search">
								<Link to="/main/score_search">
			            <Icon type="search" />
			            <span>成绩查询</span>
								</Link>
		          </Menu.Item> */}
							<Menu.Item key="subject_manage">
								<Link to="/main/subject">
			            <Icon type="read" />
			            <span>科目管理</span>
								</Link>
		          </Menu.Item>
							<SubMenu key="student_manage" title={<span><Icon type="usergroup-add" /><span>学生管理</span></span>}>
									<Menu.Item key="add_student"><Link to="/main/student_manage/add_student">添加学生</Link></Menu.Item>
									<Menu.Item key="query_student"><Link to="/main/student_manage/query_student">查询学生</Link></Menu.Item>
							</SubMenu>
							{
								this.state.roleSet == '1' ? <SubMenu key="teacher_manage" title={<span><Icon type="user-add" /><span>教师管理</span></span>}>
									<Menu.Item key="add_teacher"><Link to="/main/teacher_manage/add_teacher">添加教师</Link></Menu.Item>
									<Menu.Item key="query_teacher"><Link to="/main/teacher_manage/query_teacher">查询教师</Link></Menu.Item>
								</SubMenu> :
								''
							}
							<SubMenu key="class_manage" title={<span><Icon type="layout" /><span>班级管理</span></span>}>
								<Menu.Item key="add_class"><Link to="/main/class_manage/add_class">添加班级</Link></Menu.Item>
								<Menu.Item key="query_class"><Link to="/main/class_manage/query_class">查询班级</Link></Menu.Item>
							</SubMenu>
							<SubMenu key="exam_manage" title={<span><Icon type="desktop" /><span>考试管理</span></span>}>
								<Menu.Item key="create_exam"><Link to="/main/exam_manage/create_exam">创建考试</Link></Menu.Item>
								<Menu.Item key="query_exam"><Link to="/main/exam_manage/query_exam">我的考试</Link></Menu.Item>
							</SubMenu>
							<SubMenu key="personal_center" title={<span><Icon type="user" /><span>个人中心</span></span>}>
								<Menu.Item key="change_password"><Link to="/main/personal_center/change_password">修改密码</Link></Menu.Item>
							</SubMenu>
		        </Menu>
		      </div>
				</div>
				<div id="rightWrap">
					<HeaderBar></HeaderBar>
					<div className="right-box">
						<Switch>
							{/* 主页 */}
							<Route path="/main/homepage" component={Homepage}/>

							{/* 试题录入 */}
							<Route path="/main/q_checkin" component={QCheckin}/>
							<Route path="/main/add_paper/choose_question/:paperId/:subjectId/:totalScore" component={ChooseQuestions}/>
							<Route path="/main/add_paper" component={Paper}/>
							{/* <Route path="/main/score_search" component={ScoreSearch}/> */}

							{/* 学生管理 */}
							<Route path="/main/student_manage/add_student" component={AddStudent}/>
							<Route path="/main/student_manage/query_student" component={QueryStudent}/>

							{/* 教师管理 */}
							<Route path="/main/teacher_manage/add_teacher" component={AddTeacher}/>
							<Route path="/main/teacher_manage/query_teacher" component={QueryTeacher}/>

							{/* 班级管理 */}
							<Route path="/main/class_manage/query_class/detail/:classId" component={ClassDetail}/>
							<Route path="/main/class_manage/add_class" component={AddClass}/>
							<Route path="/main/class_manage/query_class" component={QueryClass}/>

							{/* 考试管理 */}
							<Route path="/main/exam_manage/exam_details/:examId/:batchId/:batchStudentId" component={ReadPaper}/>					
							<Route path="/main/exam_manage/create_exam" component={CreateExam}/>
							<Route path="/main/exam_manage/exam_details/:examId/:batchId" component={BatchDetails}/>
							<Route path="/main/exam_manage/exam_details/:examId" component={ExamDetails}/>
							<Route path="/main/exam_manage/query_exam" component={QueryExam}/>
							<Route path="/main/exam_manage/exam_score/:examId" component={ExamScore}/>
               
								 {/*科目管理 */}
							<Route path="/main/subject/:subjectId" component={SubjectQuestion}/>
							<Route path="/main/subject" component={QuerySubject}/>
					
							{/* 个人中心 */}
							<Route path="/main/personal_center/change_password" component={ChangePassword}/>

						</Switch>
          </div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
    return {
        subjectinfo: state.subjectinfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        subjectinfoActions: bindActionCreators(subjectinfoActions, dispatch),
				classinfoActions: bindActionCreators(classinfoActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)
