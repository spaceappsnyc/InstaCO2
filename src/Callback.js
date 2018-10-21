import React, { Component } from 'react';
import Analysis from './Analysis';
import axios from 'axios';

export default class Callback extends Component {
  constructor() {
    super();
    this.state = { images: [] };
  }

  componentDidMount() {
    axios.get('/api/images')
      .then(response => response.data)
      .then(images => {
      })
  }


  render() {
    return (
      <div class="callback_page">
        <h1>Callback</h1>
      </div>
    );
  }
}
