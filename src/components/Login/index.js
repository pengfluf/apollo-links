import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import { handleChangeInput } from '../../utils';

import { AUTH_TOKEN } from './constants';
import {
  SIGNUP_MUTATION,
  LOGIN_MUTATION,
} from './gql/mutations';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      login: true, // Login or SignUp? True, if the first one is correct.
      email: '',
      password: '',
      name: '',
    };

    this.setState = this.setState.bind(this);
    this._confirm = this._confirm.bind(this);
    this._saveUserData = this._saveUserData.bind(this);
    this.switchUI = this.switchUI.bind(this);
  }

  async _confirm() {
    const {
      login,
      email,
      password,
      name,
    } = this.state;
    if (login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      });
      const { token } = result.data.login;
      this._saveUserData(token);
    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        },
      });
      const { token } = result.data.signup;
      this._saveUserData(token);
    }
    this.props.history.push('/');
  }

  _saveUserData(token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }

  switchUI() {
    this.setState((prevState) => ({
      login: !prevState.login,
    }));
  }

  render() {
    const {
      login,
      email,
      password,
      name,
    } = this.state;
    return (
      <div>
        <h2>{login ? 'Login' : 'SignUp'}</h2>

        <div>
          {
            !login && (
              <input
                value={name}
                onChange={(e) =>
                  handleChangeInput('name', e.target.value, this.setState)}
                type="text"
                placeholder="Your name"
              />
            )
          }
          <input
            value={email}
            onChange={(e) =>
              handleChangeInput('email', e.target.value, this.setState)}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={(e) =>
              handleChangeInput('password', e.target.value, this.setState)}
            type="password"
            placeholder="Your password"
          />
        </div>

        <div>
          <button
            onClick={this._confirm}
          >
            {login ? 'login' : 'create account'}
          </button>
          <button
            onClick={this.switchUI}
          >
            {
              login ?
                'need to create an account?' :
                'already have an account?'
            }
          </button>
        </div>

      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  loginMutation: PropTypes.func,
  signupMutation: PropTypes.func,
};

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login);
