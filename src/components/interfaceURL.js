/*
let baseUrl = "/sxt_exam/Servlet";
//管理员登录
export const  login = baseUrl;
//得到科目信息
export const subject_info = baseUrl;
//得到班级信息
export const get_class_info = baseUrl;
//得到知识点
export const knowledge_point = baseUrl;
//提交题目信息（试题录入）
export const q_checkin = baseUrl;
//出卷
export const paper_info = baseUrl;

//成绩查询
export const search_score = baseUrl;

//查询所有学生（得到一页数据）
export const get_student = baseUrl;
//查询学生（模糊搜索）
export const search_student = baseUrl;
//删除学生
export const delete_student = baseUrl;
//修改学生
export const change_student = baseUrl;
//添加学生
export const add_student = baseUrl;

//查询班级学生（得到一页数据）
export const get_class = baseUrl;
//查询班级（模糊搜索）
export const search_class = baseUrl;
//删除班级
export const delete_class = baseUrl;
//修改班级
export const change_class = baseUrl;
//添加班级
export const add_class = baseUrl;

//查询教师（得到一页数据）
export const get_teacher = baseUrl;
//查询教师（模糊搜索）
export const search_teacher = baseUrl;
//修改老师
export const change_teacher = baseUrl;
//删除老师
export const delete_teacher = baseUrl;
//添加老师
export const add_teacher = baseUrl;

//创建考试
export const create_exam = baseUrl;

//查询试卷（得到一页数据）
export const get_papers = baseUrl;

//获取工号
export const get_manager_id = baseUrl;

//设置阅卷老师
export const set_teacher = baseUrl;

//获取所有的试卷
export const get_all_papers = baseUrl;

//获取主观题题目以及学生答案
export const get_stu_answer = baseUrl;

//提交主观题学生答案
export const submit_score = baseUrl;

//搜索试卷
export const search_papers = baseUrl;

//修改密码
export const change_password = baseUrl;

//自动阅卷
export const auto_read = baseUrl;

//得到试卷编号
export const get_paperId = baseUrl;

*/




export const get_subject_papers = "paper/class";

export const student_login="/student/login";
//管理员登录
export const  login = "/student/login";
//得到科目信息
export const subject_info = "/subject/allSubject";
//得到班级信息
export const get_class_info = "/class/allclass";
//得到知识点
export const knowledge_point = "data/knowledgePoint.json";
//提交题目信息（试题录入）
export const add_question = "/question";

export const get_question_condition = "/question/condition";

//出卷
export const add_paper = "paper";
//随机出卷
export const add_random_papers = "paper/random";

export const get_paper_score = "paper/details/score";

export const delete_paper = "paper/";

export const change_paper = "paper";

export const get_paper_question="paper/details"

export const change_paper_question="paper/details"

export const delete_paper_question = "paper/details/";

export const add_paper_question="paper/details"

export const change_paper_sequence="paper/change_sequence"



//成绩查询
export const search_score = "data/search_score.json";

//查询所有学生（得到一页数据）
export const get_student = "manage/students";
//查询学生（精确搜索）
export const search_student = "teacher/searchstudent";
//删除学生
export const delete_student = "manage/deleteStudent/";
//修改学生
export const change_student = "manage/reviseStudent";
//添加学生
export const add_student = "manage/insertStudent";

//查询班级学生（得到一页数据）
export const get_class = "class/detail";
//查询班级（模糊搜索）
export const search_class = "data/search_class.json";
//删除班级
export const delete_class = "class/deleteclass/";
//删除班级学生
export const delete_class_student = "class/deletestudent/";
//修改班级
export const change_class = "class/reviseclass";
//添加班级
export const add_class = "class/addclass";
//添加班级
export const add_class_student = "class/addstudent";
// 获取个人所属班级
export const my_class = "student/myClass";

//查询教师（得到一页数据）
export const get_teacher = "/manage/Teachers";
//查询教师（模糊搜索）
export const search_teacher = "data/search_teacher.json";
//修改老师
export const change_teacher = "/manage/reviseTeacher?";
//删除老师
export const delete_teacher = "/manage/deleteTeacher/";
//添加老师
export const add_teacher = "/manage/insertTeacher?";

//创建考试
export const create_exam = "exam";

//老师获得考试
export const get_manage_exam = "exam";

//老师获得考试批次
export const get_exam_batch = "exam/batch";

//老师添加考试批次
export const add_exam_batch = "exam/batch";

//删除考试
export const delete_manage_exam= "exam/";

//查询试卷（得到一页数据）
export const get_papers = "paper";

//获取工号
export const get_manager_id = "data/get_manager_id.json";

//设置阅卷老师
export const set_teacher = "data/set_teacher.json";

//获取所有的试卷
export const get_all_papers = "data/get_all_papers.json";

//获取主观题题目以及学生答案
export const get_stu_answer = "data/get_stu_answer.json";

//提交主观题学生答案
export const submit_score = "data/submit_score.json";

//搜索试卷
export const search_papers = "data/search_papers.json";

//修改密码
export const change_password = "data/change_password.json";

//自动阅卷
export const auto_read = "data/auto_read.json";

//得到试卷编号
export const get_paperId = "data/get_paperId.json";


/*
import httpServer from '@components/httpServer.js'
import * as URL from '@components/interfaceURL.js'
*/
