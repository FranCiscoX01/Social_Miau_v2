import React, { Component } from 'react';
import axios from 'axios'
import Emoji from 'reactjs-emojis';
import NewPost from './NewPost'

import { Card, Avatar, Button, Radio, Rate, Input, Spin, Empty } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  LikeOutlined,
  LikeTwoTone,
  HeartOutlined,
  HeartTwoTone
} from '@ant-design/icons';

const { TextArea } = Input;

const emojis = [
  <Emoji name="confounded" size="20" />,
  <Emoji name="confused" size="20" />,
  <Emoji name="relieved" size="20" />,
  <Emoji name="smiley" size="20" />,
  <Emoji name="sunglasses" size="20" />
];



class PublicPost extends Component {
    constructor(props){
        super (props)
        this.state = {
          loading: false,
          like: false,
          love: false,
          stars: 0,
          user: {},
          data_post: [],
          like_post: [],
        }
        this.handleChangeStars = this.handleChangeStars.bind(this)
        this.getUserLogin = this.getUserLogin.bind(this)
        this.getPublicPost = this.getPublicPost.bind(this)
    }

    async Likes(data_post, status) {
      const headers = {
        'Authorization': 'Bearer ' + this.state.user.api_token
      }

      await axios.post(`/api/post/like/${data_post.id}`, {
        user: this.state.user,
        status: status
      }, {
        headers: headers
      })
      .then(res => {
        // console.log(res)
        if (data_post.like != null) {
          if (res.data.deleted) {
            data_post.like = null
          } else {
            data_post.like.status_id = res.data.result.status_id
          }
        } else {
          data_post.like = res.data
        }
      })
      .catch(err => {
        // console.log(err)
      })

      this.setState((prevState, props) => {
        return {
          like: !prevState.like
        }
      })
      if (this.state.like === false) {
        this.setState({ love: false })
      }
    }

    async Loves(data_post, status) {
      const headers = {
        'Authorization': 'Bearer ' + this.state.user.api_token
      }

      await axios.post(`/api/post/like/${data_post.id}`, {
        user: this.state.user,
        status: status
      }, {
        headers: headers
      })
      .then(res => {
        // console.log(res)
        if (data_post.like != null) {
          if (res.data.deleted) {
            data_post.like = null
          } else {
            data_post.like.status_id = res.data.result.status_id
          }
        } else {
          data_post.like = res.data
        }
      })
      .catch(err => {
        // console.log(err)
      })


      this.setState((prevState, props) => {
        return {
          love: !prevState.love
        }
      })
      if (this.state.love === false) {
        this.setState({ like: false })
      }
    }

    async handleChangeStars(e, data_post) {
      const headers = {
        'Authorization': 'Bearer ' + this.state.user.api_token
      }
      const stars = e

      await axios.post(`/api/post/stars/${data_post.id}`, {
        user: this.state.user,
        stars: stars
      }, {
        headers: headers
      })
      .then(res => {
        // console.log(res)
        if (data_post.like != null) {
          data_post.like.stars = res.data.stars
        } else {
          data_post.like = res.data
        }
        this.setState({ stars })
      })
      .catch(err => {
        // console.log(err)
      })

    }

    getUserLogin() {
      this.setState({ loading: true })
      axios.get('/user/login')
      .then(response => {
        // console.log(response)
        this.setState({ user: response.data.user })
        this.getPublicPost()
      })
      .catch(error => {
        // console.log(error)
      })
    }

    getPublicPost() {
      const headers = {
        'Authorization': 'Bearer ' + this.state.user.api_token
      }
      axios.get('/api/post/get-all', {
        headers: headers
      })
      .then(response => {
        console.log(response)
        this.setState({
          data_post: response.data,
          like_post: response.data.like
        })
        this.setState({ loading: false })
      })
      .catch(error => {
        // console.log(error)
      })
    }

    componentWillMount() {
      this.getUserLogin()
    }

    render() {
        const { loading, like, love, stars, user, data_post } = this.state

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
                  <>
                  <div className="row mb-5">
                    <NewPost userToken={user.api_token} getPosts={this.getPublicPost} />
                  </div>
                  <div className="row">
                      <div className="col-12">

                        { data_post.length > 0
                          ?
                            (
                              data_post.map((data_post) => (

                                <Card style={{ borderRadius: '15px' }} className="shadow p-3 mb-5 bg-white" key={data_post.id}>
                                  <div className="row">
                                    <div className="col-lg-1 col-2 text-right">
                                      <Avatar src={data_post.author_img.url} />
                                    </div>
                                    <div className="col-lg-11 col-10 text-left">
                                      <h5>{data_post.author.name}</h5>
                                    </div>
                                  </div>
                                  <div className="row">

                                    { data_post.picture_id !== null
                                      ?
                                        (data_post.description === null
                                          ?
                                            <div className="col-12 text-center">
                                              <img alt="example" src={data_post.picture.url} className="img-fluid" style={{ borderRadius: '15px' }}/>
                                            </div>
                                          :
                                            <>
                                            <div className="col-lg-6 col-12 justify-content-center">
                                              <p className="lead mt-2" style={{ fontSize: '20px' }}>{data_post.description}</p>
                                            </div>
                                            <div className="col-lg-6 col-12 text-center">
                                              <img alt="example" src={data_post.picture.url} width="240" style={{ borderRadius: '15px' }}/>
                                            </div>
                                            </>
                                        )
                                      :
                                        <div className="col-12">
                                          <p className="lead mt-2" style={{ fontSize: data_post.description.length <= 110 ? '25px' : '20px' }}>{data_post.description}</p>
                                        </div>
                                    }

                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-lg-1 col-2">
                                      <Button type="text" icon={data_post.like != null && data_post.like.status_id == 4 ? <LikeTwoTone /> : <LikeOutlined />}
                                        size='large'
                                        shape="circle"
                                        onClick={() => {this.Likes(data_post, 4)}}
                                      >
                                      </Button>
                                    </div>
                                    <div className="col-lg-1 col-2">
                                      <Button type="text" icon={data_post.like != null && data_post.like.status_id == 5 ? <HeartTwoTone twoToneColor="#eb2f96"/> : <HeartOutlined />}
                                        size='large'
                                        shape="circle"
                                        onClick={() => {this.Loves(data_post, 5)}}
                                      >
                                      </Button>
                                    </div>
                                    <div className="col-lg-10 col-8 text-right">
                                      <Rate tooltips={emojis} onChange={(e) => this.handleChangeStars(e, data_post)} value={data_post.like != null ? data_post.like.stars : 0} />
                                    </div>
                                  </div>
                                </Card>

                              ))
                            )
                          :
                          <div className="col-12 text-center">
                            <Empty
                              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                              imageStyle={{
                                height: 180,
                              }}
                              description={
                                <span>
                                  Ups! Posts Empty
                                </span>
                              }
                            >
                            </Empty>
                          </div>
                        }

                      </div>
                  </div>
                  </>
                }

            </div>
        );
    }
}

export default PublicPost
