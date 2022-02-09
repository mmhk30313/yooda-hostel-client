import React, {PureComponent} from 'react';
import { Layout, Menu, Card } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, WeiboOutlined, NotificationOutlined, BankOutlined } from '@ant-design/icons';
import './MainLayout.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Student from '../pages/student/student';
import Food from '../pages/food/food';
// import Distribution from '../pages/distribution/distribution';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
export default class MainLayout extends PureComponent {
  state = {
    collapsed: false,
    key: '/',
  };

  componentWillMount() {
    const pathname = window.location.pathname;
    // console.log({pathname});
    this.setState({
      key: pathname
    });
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
        <Router>
            <Layout>
                <Sider
                    width={200}
                    trigger={null} 
                    collapsible
                    collapsed={this.state.collapsed}
                    className="site-layout-background"
            
                >
                <div className='logo' 
                    style={{
                        textAlign: 'center', 
                        padding: 20
                    }}
                >
                    <UserOutlined /> MMHK
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[this.state.key]}
                    // defaultOpenKeys={['0']}
                    style={{borderRight: 0 }}
                    
                >
                    <Menu.Item key="/" icon={<BankOutlined />}>
                        <Link to="/">Administrator</Link>
                    </Menu.Item>
                    <Menu.Item key="/food" icon={<WeiboOutlined />}>
                        <Link to='/food'>Food Management</Link>
                    </Menu.Item>
                    <Menu.Item key="/student" icon={<UserOutlined />}>
                        <Link to='/student'>Student Management</Link>    
                    </Menu.Item>
                    {/* <Menu.Item key="/distribution" icon={<NotificationOutlined />}>
                        <Link to='/distribution'>Distribution</Link>
                    </Menu.Item> */}
                    {/* <SubMenu key="sub2" icon={<WeiboOutlined />} title="Food Management"> */}
                    {/* <Menu.Item key="5">option5</Menu.Item>
                    <Menu.Item key="6">option6</Menu.Item>
                    <Menu.Item key="7">option7</Menu.Item>
                    <Menu.Item key="8">option8</Menu.Item> */}
                    {/* </SubMenu> */}
                    {/* <SubMenu key="sub3" icon={<NotificationOutlined />} title="Distribution">
                    <Menu.Item key="9">option9</Menu.Item>
                    <Menu.Item key="10">option10</Menu.Item>
                    <Menu.Item key="11">option11</Menu.Item>
                    <Menu.Item key="12">option12</Menu.Item>
                    </SubMenu> */}
                </Menu>
                </Sider>
                <Layout style={{ padding: '0' }}>
                    <Header style={{ padding: 5, background: '#fff', borderBottom: '1px solid #ddd' }}>
                        
                        {/* <p style={{position: 'absolute', left: '25%'}}>Management</p> */}
                        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: this.toggle,
                        })}
                        
                    </Header>
                    <Content
                        className="content-layout-background"
                        style={{
                            padding: "10px 10px 0 10px",
                            margin: 0,
                            // minHeight: 580,
                        }}
                    >
                        
                            <Switch>
                                <Route exact path='/'>
                                    <div style={{hight: '50vh'}}>
                                        <Card><p style={{textAlign: 'center'}}>Admin Panel</p></Card>
                                    </div>
                                </Route>
                                <Route path='/student'>
                                    <Student/>
                                </Route>
                                <Route path='/food' component={Food} />
                                {/* <Route path='/distribution' component={Distribution} /> */}
                            </Switch>
                    </Content>
                </Layout>
        </Layout>
        </Router>
    );
  }
}
