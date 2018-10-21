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
        console.log(resp);
        this.setState({ images: resp.data });
        //console.log(this.state);
      })
      .catch(console.error.bind(console));
  }

  render() {
    return (
      <div>
        {this.state.length ? (
          <Analysis images={this.state.images} />
        ) : (
          <button onClick={this.onLogin}>Sign in to Instagram</button>
        )}
      </div>
    );
  }
}
