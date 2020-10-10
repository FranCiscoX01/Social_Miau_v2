import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import MostLikedCard from './menu/MostLikedCard'
import MostLovedCard from './menu/MostLovedCard'

import ReactApexChart from "react-apexcharts";

import { Statistic, Card, Result, Avatar } from 'antd';
import {
  UserOutlined,
  LikeOutlined,
  FileTextOutlined,
  StarOutlined,
  LikeTwoTone,
  HeartTwoTone,
  StarTwoTone,
} from '@ant-design/icons';

class Dashboard extends Component {
    constructor(props) {
      super(props);
      this.state = {
        //defauilt value of the time
        time: moment().format('LTS'),
        token: '',
        user: {},
        user_img: '',
        num_like: 0,
        like_load: false,
        data_like: {},
        num_love: 0,
        love_load: false,
        data_love: {},

        chart_like: [],
        chart_love: [],
        chart_date: [],

        series:
        [
          {
            name: 'Likes',
            data: []
          },
          {
            name: 'Loves',
            data: []
          }
        ],
        options: {
          chart: {
            height: 350,
            type: 'area'
          },
          colors: ['#008FFB', '#E3004C'],
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: []
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
        },
      };
      this.getUserLogin = this.getUserLogin.bind(this)
      this.getDataDashboard = this.getDataDashboard.bind(this)
      this.getMostLikedPost = this.getMostLikedPost.bind(this)
      this.getMostLovedPost = this.getMostLovedPost.bind(this)
      this.chartStadistics = this.chartStadistics.bind(this)
    }

    getUserLogin() {
      this.setState({
        like_load: true,
        love_load: true,
      })

      axios.get('/user/login')
      .then(response => {
        // console.log(response.data.user)
        this.setState({
          user: response.data.user,
          user_img: response.data.user.picture_data.url,
          token: response.data.user.api_token,
        })
        this.getMostLikedPost()
        this.getMostLovedPost()
        this.getDataDashboard()
      })
      .catch(error => {
        // console.log(error)
      })

    }

    getDataDashboard() {
      var likes = [];
      var loves = [];
      var dates = [];
      let clone_s = this.state.series.slice(); // clone the array

      const user = this.state.user
      const headers = {
        'Authorization': 'Bearer ' + this.state.token
      }
      axios.get(`/api/dashboard/${user.id}`, {
        headers: headers
      })
      .then(response => {
        // console.log(response)
        response.data.forEach(function(elem) {
          // console.log(elem)
          if (elem.status_id == 4) {
            likes.push(elem.count_like)
          } else if (elem.status_id == 5) {
            loves.push(elem.count_like)
            console.log("es 5");
          }
          dates.push(elem.created_at)
        });

        clone_s[0].data = likes
        clone_s[1].data = loves

        this.setState({
          series: clone_s,
          options: {
            xaxis: {
              categories: dates
            }
          },
        })

        this.chartStadistics()
      })
      .catch(error => {
        // console.log(error)
      })
    }

    chartStadistics() {
      return(
        <div className="col-12 text-center" style={{ width: '900px' }}>
          <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={350}/>
        </div>
      )
    }

    getMostLikedPost() {
      let me = this;
      let num = 0
      const user = this.state.user
      const headers = {
        'Authorization': 'Bearer ' + user.api_token
      }
      axios.get(`/api/dashboard/most-liked/${user.id}`, {
        headers: headers
      })
      .then(response => {
        // console.log(response)
        response.data.forEach(function(data, index) {
          // console.log(data)
          if (data.likes_post > num) {
            num = data.likes_post
            me.setState({ data_like: data })
          }
        });
        this.setState({
          num_like: num,
          like_load: false,
        })
      })
      .catch(error => {
        // console.log(error)
      })
    }

    getMostLovedPost() {
      let me = this;
      let num = 0
      const user = this.state.user
      const headers = {
        'Authorization': 'Bearer ' + user.api_token
      }
      axios.get(`/api/dashboard/most-loved/${user.id}`, {
        headers: headers
      })
      .then(response => {
        // console.log(response)
        response.data.forEach(function(data, index) {
          // console.log(data)
          if (data.likes_post > num) {
            num = data.likes_post
            me.setState({ data_love: data })
          }
        });
        this.setState({
          num_love: num,
          love_load: false,
        })
      })
      .catch(error => {
        // console.log(error)
      })
    }

    componentWillMount() {
      this.getUserLogin()
    }

    componentDidMount() {
      this.clock = setInterval(() => {
        this.setState({
          time: moment().format('LTS')
        })
      }, 1000)
    }

    componentWillUnmount() {
      clearInterval(this.clock);
    }

    render() {

       const { user, user_img, num_like, num_love, like_load, love_load, data_like, data_love } = this.state

        return (
            <div className="container-fluid">
                <div className="row">
                  <div className="col-12 text-right">
                    <h3 className="">{this.state.time}</h3>
                  </div>
                </div>
                <div className="row">
                  { this.chartStadistics() }
                </div>

                { /* Like */ }
                <MostLikedCard
                  User={user}
                  UserImage={user_img}
                  DataPost={data_like}
                  Likes={num_like}
                  Loadind={like_load}
                />

                { /* Love */ }
                <MostLovedCard
                  User={user}
                  UserImage={user_img}
                  DataPost={data_love}
                  Loves={num_love}
                  Loadind={love_load}
                />

            </div>
        );
    }
}

export default Dashboard
