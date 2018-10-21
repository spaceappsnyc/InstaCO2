import React, { Component } from 'react';
import Analysis from './Analysis';
import axios from 'axios';

export default class Login extends Component {
  constructor() {
    super();
    this.state = { images: [] };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(e) {
    axios
      .get('/api/auth/instagram')
      .then(resp => {
        this.setState({ images: resp.data });
        console.log(resp.data);
      })
      .catch(console.error.bind(console));
  }

  render() {
    return (
      <div>
        {this.state.length ? (
          // <Analysis images={this.state.images} />
          this.state
        ) : (
          // <button onClick={this.onLogin}>Sign in to Instagram</button>
          <a href="/api/auth/instagram">Sign in to Instagram</a>
        )}
      </div>
    );
  }
}
