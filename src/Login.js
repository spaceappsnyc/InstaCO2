import React, { Component } from 'react';
import axios from 'axios';
import { Grid, CircularProgress } from '@material-ui/core';

export default class Login extends Component {
  constructor() {
    super();
    this.state = { images: [] };
    // this.onLogin = this.onLogin.bind(this)
  }

  componentDidMount() {
    axios
      .get('/api/images')
      .then(response => response.data)
      // .then(images => console.log(images))
      .catch(console.error.bind(console));
  }

  // onLogin(e) {

  //   axios
  //     .get('/api/auth/instagram')
  //     .then(resp => {
  //       this.setState({ images: resp.data });
  //     })
  //     .catch(console.error.bind(console));
  // }

  render() {
    return (
      <Grid item>
        <div className="login_page box">
          <a href="/api/auth/instagram" className="login_button" />
        </div>
      </Grid>
    );
  }
}
