import React, { Component } from 'react';

import './css/TabBar.css'

import { Link } from 'react-router-dom'
import { Menu, Button } from 'antd';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';

class TabBar extends Component {
    render() {
        return (
          <div className="fix-tabbar">
            <Menu
              defaultSelectedKeys={['1']}
              mode="inline"
            >
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                <Link to='/'>
                      Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                <Link to='/post'>
                      Post
                </Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                <Link to='/profile'>
                  Profile
                </Link>
              </Menu.Item>
            </Menu>
          </div>
        );
    }
}

export default TabBar
