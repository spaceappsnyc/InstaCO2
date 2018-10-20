import React, { Component } from 'react';
import axios from 'axios';
import { HashRouter, Route } from 'react-router-dom';
import { render } from 'react-dom';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact to="/" component={Login} />
        </div>
      </HashRouter>
    );
  }
}

render(<App />, document.getElementById('root'));
