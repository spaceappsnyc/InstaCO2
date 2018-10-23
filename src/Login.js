import React, { Component } from 'react';
import Analysis from './Analysis';
import axios from 'axios';

export default class Login extends Component {
  constructor() {
    super();
    this.state = { images: [] };
    this.onLogin = this.onLogin.bind(this)
  }

  componentDidMount() {
    axios.get('/api/images')
      .then(response => response.data)
      .then(images => console.log(images))
  }

  onLogin(e) {

    axios
      .get('/api/auth/instagram')
      .then(resp => {
        this.setState({ images: resp.data });
      })
      .catch(console.error.bind(console));
  }

  render() {

    return (
      <div class="login_page box">
        {this.state.length ? (
          // <Analysis images={this.state.images} />
          this.state
        ) : (
            // <button onClick={this.onLogin}>Sign in to Instagram</button>
            <a href="/api/auth/instagram" class="login_button">&nbsp;</a>
          )}
      </div>
    );
  }
}
