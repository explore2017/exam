import axios from 'axios'
import * as URL from '@components/interfaceURL.js'

//用户登录
export const axiosLogin = function(params,login_type,success,error){
  let login=URL.teacher_login;
  if(login_type==1){
    login=URL.manage_login;
  }
  axios.post(login,params)
  .then((res)=>{
    success(res.data);
  })
  .catch(function (err) {
      error(err);
  });
}
