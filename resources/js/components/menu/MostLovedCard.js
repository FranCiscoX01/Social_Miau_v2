import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Statistic, Card, Result, Avatar, Empty } from 'antd';
import {
  UserOutlined,
  LikeOutlined,
  FileTextOutlined,
  StarOutlined,
  LikeTwoTone,
  HeartTwoTone,
  StarTwoTone,
} from '@ant-design/icons';

export default class MostLovedCard extends Component {
    render() {
        return (
            <div className="container-fluid">
              <div className="row mt-5">
                <div className="col-12">
                  <h3><em>Most Liked</em></h3>
                </div>
                <div className="col-12">
                  <Card style={{ borderRadius: '15px' }} className="shadow p-3 mb-5 bg-white">
                    <div className="row">
                      { !this.props.Loadind
                        ?
                          <>
                            <div className="col-lg-1 col-2 text-right">
                              <Avatar src={this.props.UserImage} />
                            </div>
                            <div className="col-lg-11 col-10 text-left">
                              <h5>{ this.props.User.name }</h5>
                            </div>
                          </>
                        : null
                      }
                    </div>
                    <div className="row">
                      { !this.props.Loadind
                        ?
                          ( this.props.DataPost.length === 0
                            ?
                              <div className="col-12">
                                <Empty description={false} />
                              </div>
                            :
                              ( this.props.DataPost.picture_id !== null
                                ?
                                  (this.props.DataPost.description === null
                                    ?
                                      <>
                                        <div className="col-lg-8 col-12 text-center">
                                          <img alt="example" src={this.props.DataPost.url} className="img-fluid" style={{ borderRadius: '15px' }}/>
                                        </div>
                                        <div className="col-lg-4 col-12 d-flex justify-content-center">
                                          <div className="row align-self-center">
                                            <div className="col-12 text-center">
                                              <LikeTwoTone style={{ fontSize: '60px' }} />
                                              <p>{ this.props.Loves }</p>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    :
                                      <>
                                        <div className="col-lg-4 col-md-6 col-12 justify-content-center">
                                          <p className="lead mt-2" style={{ fontSize: '20px' }}>{this.props.DataPost.description}</p>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-12 text-center">
                                          <img alt="example" src={this.props.DataPost.url} width="240" style={{ borderRadius: '15px' }}/>
                                        </div>
                                        <div className="col-lg-4 col-12 d-flex justify-content-center">
                                          <div className="row align-self-center">
                                            <div className="col-12 text-center">
                                              <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: '60px' }} />
                                              <p>{ this.props.Loves }</p>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                  )
                                :
                                  <>
                                    <div className="col-8">
                                      <p className="lead mt-2" style={{ fontSize: this.props.DataPost.description.length <= 110 ? '25px' : '20px' }}>{this.props.DataPost.description}</p>
                                    </div>
                                    <div className="col-lg-4 col-12 d-flex justify-content-center">
                                      <div className="row align-self-center">
                                        <div className="col-12 text-center">
                                          <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: '60px' }} />
                                          <p>{ this.props.Loves }</p>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                              )
                          )
                        :
                        <div className="col-12 text-center">
                          <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: '60px' }} spin />
                          <p>Loading...</p>
                        </div>
                      }
                    </div>
                  </Card>

                </div>
              </div>
            </div>
        );
    }
}

if (document.getElementById('most-loved-card')) {
    ReactDOM.render(<MostLovedCard />, document.getElementById('most-loved-card'));
}
