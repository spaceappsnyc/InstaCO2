import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';
import { render } from 'react-dom';
import Login from './Login';
import Callback from './Callback';
import { Grid } from '@material-ui/core';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="main-container">
          <Grid container justify="center">
            <Route exact path="/" component={Login} />
            <Route path="/api/auth/instagram/callback" component={Callback} />
          </Grid>
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('root'));
