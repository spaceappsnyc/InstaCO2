import React, { Component } from 'react';
import Analysis from './Analysis';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';


export default class Callback extends Component {
  constructor() {
    super();
    this.state = { images: [] };
  }

  componentDidMount() {
    axios.get('/api/images')
      .then(response => response.data)
      .then(images => {
        this.setState({ images })
        axios.post('/api/analyze', { images })
          .then(response => response.data)
          .then(images => this.setState({ images }))
          .catch(err => console.log(err))
      })
  }



  calculateScore(images) {
    const total = images.reduce((sum, image) => {
      if (image.footPrint) sum += image.footPrint.value;
      return sum
    }, 0)
    return total / images.length
  }


  render() {
    return (
      <div class="callback_page">
        <h1>Your Score: {this.calculateScore(this.state.images)}</h1>
        {/* {this.state.images.length > 0 && (
          <CircularProgress />
        )} */}

      </div>
    );
  }
}
