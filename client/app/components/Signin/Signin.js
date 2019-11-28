import React, { Component } from 'react';

import { setInStorage } from '../../utils/storage';

import { signIn } from '../../utils/AccountAPI';

import Loading from '../App/Loading';

class Signin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            msg: '',
            isLoading: false
        }
        this.updateUsername = this.updateUsername.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.submit = this.submit.bind(this);
    }

    updateUsername(username) {
        this.setState({
            username
        });
    }

    updatePassword(password) {
        this.setState({
            password
        });
    }

    submit(e) {
        e.preventDefault();
        this.setState({ isLoading: true });

        const { username, password } = this.state;
        signIn(username, password)
        .then(json => {
            if (json.success) {
                setInStorage('the_main_app', {
                  username: json.username,
                  token: json.token,
                  role: json.role
                });
                this.props.onSignin(json.username, json.token, json.role);
            } else {
              this.setState({
                msg: json.message,
                isLoading: false
              });
            }
        });
    }

    render() {
        const { username, password, msg, isLoading } = this.state;
        return (
          <>
            {isLoading && (
              <Loading/>
            )}
            <form className="signin-container">
              <div className="form-group">
                <input 
                className="form-control"
                type="text" 
                value={username} 
                onChange={e => this.updateUsername(e.target.value)} placeholder="Username"/>
              </div>
              <div className="form-group">
                <input 
                className="form-control"
                type="password" 
                value={password} 
                onChange={e => this.updatePassword(e.target.value)} placeholder="Password"/>
              </div>
              <button 
              className="btn btn-danger btn-lg"
              onClick={e => this.submit(e)}>Log in</button>
            </form>
            {msg && (
              <div>{msg}</div>
            )}
          </>
        )
    }
}

export default Signin;