import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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

export default class HomeProfile extends Component {
    constructor(props){
      super (props);
      this.state = {
        loading: this.props.Load,
        data_post: this.props.myPost,
      }
    }

    componentDidUpdate() {
      console.log(this.props.myPost)
    }

    render() {
        const { loading, user, data_post } = this.state

        return (
          <div className="container-fluid">
              <p>{JSON.stringify(this.props.myPost)}</p>
              <p>{this.props.Load}</p>
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
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                  </div>
                                  <div className="col-lg-11 col-10 text-left">
                                    <h5>Simon</h5>
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
                                  asd
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

if (document.getElementById('home-profile')) {
    ReactDOM.render(<HomeProfile />, document.getElementById('home-profile'));
}
