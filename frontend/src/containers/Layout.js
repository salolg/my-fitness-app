import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import Login from "./Login";
import RegistrationForm from "./Signup";

const { Header, Footer, Content } = Layout;

class AppLayout extends React.Component{

    render(){
      var bg=require('../static/layout.png')
        return (
          <Layout className="layout" style={{}}>
            <Header
            >
              <div className="logo" />
  
                {
                    this.props.isAuthenticated ?
                    <Menu                 
                      theme="dark"
                      mode="horizontal"
                      style={{ lineHeight: '64px', }}
                    >
                      <Menu.Item key="2" style={{float: 'left'}} >
                        <Link to="/kalendarz">Kalendarz</Link>
                      </Menu.Item>
                      <Menu.Item key="3" style={{float: 'left'}}>
                      <Link to="/statystyki">Statystyki</Link>
                      </Menu.Item>
                      <Menu.Item key="4" style={{float: 'left'}}>
                      <Link to="/edycja-profilu">Edytuj profil</Link>
                      </Menu.Item>
                      <Menu.Item key="1" style={{float: 'right'}} onClick={this.props.logout}>
                      <Link to="/">Wylogowanie</Link>
                      </Menu.Item>
                    </Menu>
                    :
                    <Menu                 
                      theme="dark"
                      mode="horizontal"
                      style={{ lineHeight: '64px', }}
                    >
                      <Menu.Item key="2">
                          <Link to="/logowanie">Logowanie</Link>
                      </Menu.Item>
                    </Menu>
                }     
                
            </Header>
            
            <Content style={{ padding: '0 50px', minHeight: "calc(110vh - 128px)",backgroundImage: "url("+bg+")", backgroundPosition: 'left',
          backgroundRepeat: 'no-repeat', backgroundColor: 'white'  }}>
                {/* {
                  this.props.isAuthenticated ? */}
                     <div
                        style={{ background: '#fff', padding: 44 }}
                        >
                        {this.props.children}
                    </div>
                  {/* :
                    <Login/>
                } */}

          </Content>
          </Layout>
      );
    }
  }
 
  const mapDispatchToProps = dispatch => {
    return {
      logout: () => dispatch(actions.logout()) 
    }
  }
  
  export default withRouter(connect(null, mapDispatchToProps)(AppLayout));
  