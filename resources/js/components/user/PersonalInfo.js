import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
  Input,
  Button,
  Spin,
  Space,
  Upload,
  notification,
 } from 'antd';

import {
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

// Picture Upload
 function getBase64(img, callback) {
   const reader = new FileReader();
   reader.addEventListener('load', () => callback(reader.result));
   reader.readAsDataURL(img);
 }

 function beforeUpload(file) {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
     message.error('You can only upload JPG/PNG file!');
   }
   const isLt2M = file.size / 1024 / 1024 < 2;
   if (!isLt2M) {
     message.error('Image must smaller than 2MB!');
   }
   return isJpgOrPng && isLt2M;
 }

 function setDataUploadFile(file) {
   return { dataFile: file.uid, folder: '/profile' }
 }

export default class PersonalInfo extends Component {
    constructor(props){
      super (props)
      this.state = {
        loading: false,
        cache_user: {},
        edit_user: {},
        fileList: [],
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        cache_fileList: null,
      }
      this.getUserLogin = this.getUserLogin.bind(this)
      this.handleChangeInput = this.handleChangeInput.bind(this)
      this.onResetClick = this.onResetClick.bind(this)
      this.onSubmitPersonInfo = this.onSubmitPersonInfo.bind(this)

      // Picture Upload
      this.handleFileChange = this.handleFileChange.bind(this)
      this.handlePictureCancel = this.handlePictureCancel.bind(this)
      this.handleRemove = this.handleRemove.bind(this)
      this.handlePreview = this.handlePreview.bind(this)
    }

    getUserLogin() {
      axios.get('/user/login')
      .then(response => {
        // console.log(response)
        this.setState({
          cache_user: response.data.user,
          edit_user: response.data.user
        })
        this.setState({ loading: false })
      })
      .catch(error => {
        // console.log(error)
      })
    }

    handleChangeInput(event) {
      let v = event.target.value
      let n = event.target.name
      this.setState(prevState => ({
        edit_user: {
          ...prevState.edit_user,
          [n]: v
        }
      }))
    }

    onResetClick() {
      const cache = this.state.cache_user
      this.setState({ edit_user: cache })
    }

    onSubmitPersonInfo() {
      const user = this.state.edit_user
      const cache_fileList = this.state.cache_fileList
      const headers = {
        'Authorization': 'Bearer ' + user.api_token
      }
      axios.post('/api/profile/presonal-info/update', {
        form_data: user,
        picture_user: cache_fileList != null ? cache_fileList.response : null
      }, {
        headers: headers
      })
      .then(response => {
        // console.log(response)
        this.getUserLogin()
        return(
          notification.open({
            message: response.data.error ? 'Error' : 'Success',
            description:
              response.data.error ? response.data.error : 'Change Saved',
            icon: response.data.error ? <CloseCircleOutlined style={{ color: '#FF0040' }} /> : <CheckCircleOutlined style={{ color: '#74DF00' }} />,
          })
        )
      })
      .catch(error => {
        console.log(error)
      })
    }

    // Picture Upload
    handlePictureCancel() {
      this.setState({ previewVisible: false })
    }

    async handlePreview(file) {
      let src = file.url;
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      })

      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });

      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow.document.write(image.outerHTML);
    }

    handleFileChange({fileList, file}) {
      this.setState({ fileList })
      this.setState({ cache_fileList: file })
      // console.log(file)
    }

    handleRemove(file) {
      // console.log(file)
      const headers = {
        'Authorization': 'Bearer ' + this.state.token
      }
      axios.post('/api/picture-post/delete', {
        file: file,
        folder: '/post',
      }, {
        headers: headers,
      })
      .then(response => {
        // console.log(response)
      })
      .catch(error => {
        // console.log(error)
      })
    }

    componentWillMount() {
      this.setState({ loading: true })
      this.getUserLogin()
    }

    componentDidMount() {

    }

    render() {
        const { loading, edit_user, previewVisible, previewImage, fileList, previewTitle } = this.state

        const headers = {
          'Authorization': 'Bearer ' + this.state.edit_user.api_token
        }

        const uploadButton = (
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
          </div>
        )

        return (
            <div className="container-fluid">
              { loading
                ?
                  <div className="row">
                    <div className="col-12 text-center">
                      <Spin size="large" tip="Loading..." />
                    </div>
                  </div>
                :
                  <div className="row">
                    <div className="col-lg-4 col-12">
                      <h2>Image</h2>
                        <Upload
                          name="post"
                          listType="picture-card"
                          fileList={fileList}
                          headers={headers}
                          data={setDataUploadFile}
                          action="/api/picture-post"
                          beforeUpload={beforeUpload}
                          onChange={this.handleFileChange}
                          onPreview={this.handlePreview}
                          onRemove={this.handleRemove}
                        >
                          {fileList.length > 0 ? null : uploadButton}
                        </Upload>
                    </div>
                    <div className="col-lg-8 col-12">
                      <h2>Personal Information</h2>
                      <form method="POST">
                        <div className="form-group">
                          <label>Name</label>
                          <Input placeholder="Name" name="name" value={edit_user.name} onChange={this.handleChangeInput} />
                        </div>

                        <div className="form-group">
                          <label>Last Name</label>
                          <Input placeholder="Last Name" name="last_name" value={edit_user.last_name} onChange={this.handleChangeInput} />
                        </div>

                        <div className="form-group">
                          <label>NickName</label>
                          <Input placeholder="NickName" name="nick_name" value={edit_user.nick_name} onChange={this.handleChangeInput} />
                        </div>

                        <div className="form-group">
                          <label>Phone</label>
                          <Input placeholder="Phone" name="phone_number" value={edit_user.phone_number} onChange={this.handleChangeInput} />
                        </div>

                        <div className="form-group">
                          <label>Address</label>
                          <Input placeholder="Address" name="address" value={edit_user.address} onChange={this.handleChangeInput} />
                        </div>

                        <div className="form-group">
                          <label>Email</label>
                          <Input placeholder="Email" name="email" value={edit_user.email} disabled />
                        </div>

                        <div className="form-group text-right">
                          <Space size="middle">
                            <Button type="dashed" onClick={() => {this.onResetClick()}} >
                              Reset
                            </Button>
                            <Button type="primary" shape="round" onClick={() => {this.onSubmitPersonInfo()}} >
                              Save Change
                            </Button>
                          </Space>
                        </div>
                      </form>
                    </div>
                  </div>
              }
            </div>
        );
    }
}

if (document.getElementById('personal-info')) {
    ReactDOM.render(<PersonalInfo />, document.getElementById('personal-info'));
}
