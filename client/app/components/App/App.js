import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { getFromStorage, setInStorage } from '../../utils/storage';

import { verify, signOut } from '../../utils/AccountAPI';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import Signin from '../Signin/Signin';
import Loading from './Loading';
import IndexPages from '../IndexPages/IndexPages';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      token: '',
      role: '',
      isLoading: true
    }

    this.onSignout = this.onSignout.bind(this);
    this.onSignin = this.onSignin.bind(this);
  }

  componentDidMount() {
      // if token is set, verify
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const token = obj.token;
      // verify token
      verify(token)
      .then(json => {
        // if token verified successfully, set state name and role of user
        if (json.success) {
          this.setState({
            token,
            isLoading: false,
            username: json.sessions[0].username,
            role: json.sessions[0].role
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onSignin(username, token, role) {
    this.setState({
      username,
      token,
      role
    });
  }

  onSignout(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    signOut(this.state.token)
    .then(json => {
      if (json.success) {
        setInStorage('the_main_app', { token: '', role: '' });
        this.setState({
          username: '',
          token: '',
          isLoading: false
        });
        this.props.history.push('/');
      }
    });
  }
  
  render() {
    const { isLoading, username, token, role } = this.state;

    if (isLoading) return (
      <Loading/>
    )

    if (token) return (
      <>
      <Header
      onLogout={this.onSignout}
      role={role}
      user={username}/>
      <IndexPages
      user={username}
      role={role}/>
      <Footer/>
      </>
    )

    return (
      <Signin
      onSignin={this.onSignin}/>
    )
  }
}

export default withRouter(App);
