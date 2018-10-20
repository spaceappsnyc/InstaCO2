import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Login extends Component {
  constructor() {
    super();
    this.state = { user: '' };
  }

  render() {
    return (
      <div>
        <a href="/api/auth/instagram">Sign in to Instagram</a>
      </div>
    );
  }
}
