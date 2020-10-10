import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PersonalInfo from './PersonalInfo'
import UserSecurity from './UserSecurity'

import {
  Tabs,
  Card,
  Avatar,
  Button,
  Radio,
  Rate,
  Input,
  Spin,
  Empty,
  Popover
 } from 'antd';

import {
  HomeOutlined,
  SettingOutlined,
  LockOutlined,
  EditOutlined,
  EllipsisOutlined,
  LikeOutlined,
  LikeTwoTone,
  HeartOutlined,
  HeartTwoTone
} from '@ant-design/icons';


const { TabPane } = Tabs;

 class UserIndex extends Component {
    constructor(props) {
      super (props)
      this.state = {
        user: {},
        loading: false,
        data_post: [],
        user_img: '',
      }
      this.getUserLogin = this.getUserLogin.bind(this)
      this.getMyPost = this.getMyPost.bind(this)
      this.userLikedPost = this.userLikedPost.bind(this)
    }

    userLikedPost(data_post) {
      const content = (
        <div className="overflow-auto" style={{ height: '100px' }}>
          {
            data_post.map((data_post) => {
              return(
                <div key={data_post.id} className="row">
                  <div className="col-8">
                    {data_post.user_name.name}
                  </div>
                  <div className="col-4 text-right">
                    { data_post.status_id == 5
                      ?
                        <HeartTwoTone twoToneColor="#eb2f96"/>
                      :
                        <LikeTwoTone />
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      )

      return(
        <div className="col-12">
          <Popover content={content} title="Likes">
            <HeartTwoTone twoToneColor="#eb2f96"/><LikeTwoTone /> &nbsp;&nbsp;
            { data_post.length == 1
              ?
                <span>A {data_post[0].user_name.name} le ha gustado tu publicación</span>
              :
              ( data_post.length == 2
                ?
                  <span>A {data_post[0].user_name.name} y {data_post[1].user_name.name} le ha gustado tu publicación</span>
                :
                ( data_post.length >= 3
                  ?
                    <span>A {data_post[0].user_name.name} y a {data_post.length - 1} más le ha gustado tu publicación</span>
                  : null
                )
              )
            }
          </Popover>
        </div>
      )
    }

    getUserLogin() {
      axios.get('/user/login')
      .then(response => {
        // console.log(response)
        this.setState({
          user: response.data.user,
        })
        this.getMyPost(response.data.user.api_token)
      })
      .catch(error => {
        // console.log(error)
      })
    }

    getMyPost(token) {
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      axios.get('/api/profile/my-posts', {
        headers: headers
      })
      .then(response => {
        console.log(response)
        this.setState({
          data_post: response.data,
          user_img: response.data[0].picture.url
        })
        this.setState({ loading: false })
      })
      .catch(error => {
        // console.log(error)
      })
    }

    componentWillMount() {
      this.setState({ loading: true })
      this.getUserLogin()
    }

    render() {
        const { user, data_post, loading } = this.state
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                      <Tabs defaultActiveKey="1" centered>
                        <TabPane tab={ <> <HomeOutlined /> Home </> } key="1">
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
                                                  {this.userLikedPost(data_post.like)}
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
                        </TabPane>
                        <TabPane tab={ <> <SettingOutlined /> Settings </> } key="2">
                          <PersonalInfo />
                        </TabPane>
                        <TabPane tab={ <> <LockOutlined /> Security </> } key="3">
                          <UserSecurity user={user} />
                        </TabPane>
                      </Tabs>

                    </div>
                </div>
            </div>
        );
    }
}

export default UserIndex
