import axios from 'axios'
import * as URL from '@components/interfaceURL.js'

//用户登录
export const axiosLogin = function(params,success,error){
  axios.post(URL.login,params)
  .then((res)=>{
    success(res.data);
  })
  .catch(function (err) {
      error(err);
  });
}
