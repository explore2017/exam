
import axios from "axios";
import qs from "qs";
import {Modal,message} from 'antd'

axios.defaults.withCredentials=true;

// 创建axios默认请求
axios.defaults.baseURL = "http://localhost:8000";
// 配置超时时间
axios.defaults.timeout = 100000;
// 配置请求拦截
axios.interceptors.request.use(config => {
  // config.setHeaders([
  //   // 在这里设置请求头与携带token信息
  // ]);
  return config;
});
// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
 
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

function successState(res) {
    //这里可以隐藏loading
    //统一判断后端返回的错误码
    if(res.data.status == "0"){
      if(res.data.msg) {
        message.success(res.data.msg);
      }
    }
    else {
      if(res.data.msg) {
        Modal.error({
          title: '出错了',
          content: res.data.msg,
          okText : '确定'
        });
      }
      else {
        Modal.error({
          title: '出错了',
          content: '服务器开小差了~请稍后再试',
          okText : '确定'
        });
      }
  
    }
  }
  
  function errorState(response) {
    //这里可以隐藏loading
    console.log(response)
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
      return response
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }else{
      Modal.error({
        title: '提示',
        content: "网络异常，请稍后再试",
      });
    }
  
  }

 export function get(url,params){
    let promise = new Promise(function(resolve, reject) {
        axios.get(url,{params:params}).then((res) => {
          successState(res)
          resolve(res.data)
        }).catch((response) => {
          errorState(response)
          reject(response)
        })   
      })
      return promise
  }
  export function post(url,data){
    let promise = new Promise(function(resolve, reject) {
        axios.post(url,data).then((res) => {
          successState(res)
          resolve(res.data)
        }).catch((response) => {
          errorState(response)
          reject(response)
        })   
      })
      return promise
  }
  export function DELETE(url,id,params){
    let promise = new Promise(function(resolve, reject) {
        axios.delete(url+id,{params:params}).then((res) => {
          successState(res)
          resolve(res.data)
        }).catch((response) => {
          errorState(response)
          reject(response)
        })   
      })
      return promise
  }
  export function put(url,data){
    let promise = new Promise(function(resolve, reject) {
        axios.put(url,data).then((res) => {
          successState(res)
          resolve(res.data)
        }).catch((response) => {
          errorState(response)
          reject(response)
        })   
      })
      return promise
  }