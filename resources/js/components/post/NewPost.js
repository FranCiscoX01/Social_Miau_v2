import React, { Component } from 'react';
import axios from 'axios'
import './FilePost.css'
import {
  Button,
  Modal,
  Input,
  Avatar,
  Divider,
  Upload,
  message,
  Col,
  notification,
} from 'antd';

import {
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

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
  return { dataFile: file.uid, folder: '/post' }
}

export default class NewPost extends Component {
    constructor(props) {
      super (props)
      this.state = {
        visible: false,
        p_description: '',
        fileList: [],
        loading: false,
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        token: this.props.userToken,
        cache_fileList: null,
      }
      this.showModal = this.showModal.bind(this)
      this.handleOk = this.handleOk.bind(this)
      this.handleCancel = this.handleCancel.bind(this)
      this.handleFileChange = this.handleFileChange.bind(this)
      this.handlePictureCancel = this.handlePictureCancel.bind(this)
      this.handleRemove = this.handleRemove.bind(this)
      this.handlePreview = this.handlePreview.bind(this)
      this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    }

    showModal() {
      this.setState({
        visible: true,
      })
    }

    handleOk(e) {
      // console.log(this.state.cache_fileList);
      const headers = {
        'Authorization': 'Bearer ' + this.state.token
      }
      axios.post('/api/post/save', {
        text: this.state.p_description,
        image: this.state.cache_fileList,
      },
      {
        headers: headers,
      })
      .then(response => {
        // console.log(response)
        this.props.getPosts()
        return(
          notification.open({
            message: response.data.error ? 'Error' : 'Success',
            description:
              response.data.error ? response.data.error : response.data.success,
            icon: response.data.error ? <CloseCircleOutlined style={{ color: '#FF0040' }} /> : <CheckCircleOutlined style={{ color: '#74DF00' }} />,
          })
        )
      })
      .catch(error => {
        // console.log(error)
        return(
          notification.open({
            message: 'Error',
            description:
              'Some error on Server',
            icon: <CloseCircleOutlined style={{ color: '#FF0040' }} />,
          })
        )
      })

      this.setState({
        visible: false,
        fileList: [],
        cache_fileList: null,
        p_description: '',
      })
    }

    handleCancel(e) {
      // console.log(e);
      const headers = {
        'Authorization': 'Bearer ' + this.state.token
      }
      const file = this.state.cache_fileList

      axios.post('/api/picture-post/delete', file, {
        headers: headers,
      })
      .then(response => {
        // console.log(response)
      })
      .catch(error => {
        // console.log(error)
      })
      this.setState({
        visible: false,
        fileList: [],
        cache_fileList: null,
        p_description: '',
      })

    }

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

    handleDescriptionChange(event) {
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({ [nam]: val })
      event.preventDefault()
    }

    componentWillReceiveProps(prevProps, prevState) {
      // console.log(prevProps)
      const userToken = prevProps.userToken
      this.setState({ token: userToken })
    }

    render() {

        const { p_description, previewVisible, previewImage, fileList, previewTitle } = this.state;
        const headers = {
          'Authorization': 'Bearer ' + this.state.token
        }

        const uploadButton = (
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
          </div>
        )

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 text-right">
                      <Button type="primary" shape="round" onClick={this.showModal}>New Post</Button>
                    </div>
                    <div className="col-12">
                      <Modal
                        title="New Post"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                      >
                        <div className="row">
                          <div className="col-lg-1 col-2">
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                          </div>
                          <div className="col-lg-11 col-10 text-left">
                            Simon
                          </div>
                          <div className="col-12 mt-2">
                            <Divider orientation="left">Text</Divider>
                            <TextArea
                              placeholder="Your post text"
                              autoSize
                              style={{ borderRadius: '15px' }}
                              name="p_description"
                              value={p_description}
                              onChange={this.handleDescriptionChange}
                            />

                            <Divider orientation="right">Image</Divider>
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
                        </div>
                      </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('new-post')) {
    ReactDOM.render(<NewPost />, document.getElementById('new-post'));
}
