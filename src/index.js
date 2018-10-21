import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';
import { render } from 'react-dom';
import Login from './Login';
import Callback from './Callback';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Login} />
          <Route path="/api/auth/instagram/callback" component={Callback} />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('root'));
