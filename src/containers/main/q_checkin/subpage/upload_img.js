//单选题
import React from 'react';
import {post} from '@components/axios.js'
import { Form,Input,Select,Icon,Radio,Row,Col,Button,Modal,InputNumber,Upload,message  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import * as URL from '@components/interfaceURL.js'

class UploadImg extends React.Component {
  constructor(){
    super();
    this.state = {
     previewVisible: false,
     previewImage: '',
     fileList : [],
     show:true, 
    } 
    this.onFileChange=this.onFileChange.bind(this);
    this.handleCancel=this.handleCancel.bind(this);
    this.handlePreview=this.handlePreview.bind(this);
  }
  
  handleCancel(){
    this.setState({ previewVisible: false });
  }

  handlePreview(file){
    this.setState({
      previewImage: file.response.data,
      previewVisible: true,
    });
  };

  onFileChange(info){
    const fileList=[];
    const urlList=[];
    info.fileList.map((item)=>{
          fileList.push({
            uid:item.uid,
            status:item.status,
            url:item.response.data,
          });
          urlList.push(item.response.data);
    })
    this.setState({fileList});
    this.props.addImgUrl(urlList);
  }
  componentUpdate(){
      this.setState({
        show:false,
      },()=>{this.setState({show:true,})})
  }

componentWillReceiveProps(nextprops){
  if(this.props.update!=nextprops.update){
    this.componentUpdate();
  }
}
  


  render(){
    //验证
    const { previewVisible, previewImage, fileList,show } = this.state;
    const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

    
const props = {
  action: 'http://localhost:8000/question/img',
  accept: 'image/*',
  name: 'file',
  listType:"picture-card",
  withCredentials:true,
  beforeUpload(file, fileList) {    //提前判断图片类型和大小限制
    for(let i = 0; i < fileList.length; i++){
      let imgType = fileList[i].type;
      if (imgType !== 'image/jpeg' && imgType !== 'image/png' && _this.state.radioTypeValue == 0){
          message.error('所选文件存在非.png .jpg文件');
          return false;
      }else if(imgType !== 'image/jpeg' && imgType !== 'image/png' && imgType !== 'image/gif'){
        message.error('所选文件存在非.png .jpg .gif文件');
        return false;
      }
    }
    if (file.size / 1024 / 1024 > 5) {
      message.error(`${file.name} 文件大于5MB，无法上传`);
      return false;
    }
  }
}
    return(
      <div>
        {show?
     <Upload
     {...props}      
          onPreview={this.handlePreview}
          onChange={this.onFileChange}
          // onRemove={this.onFileRemove}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>:''  }    
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }

}


export default UploadImg

