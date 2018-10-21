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
    console.log('Images', images)
    const total = images.reduce((sum, image) => {
      if (image.footPrint) sum += image.footPrint.value;
      return sum
    }, 0)
    console.log("Total", total)
    return total / images.length
  }

  getLevel(score) {
    let level = '';
    if (score < 1) level = 'level_4'
    else if (score < 5) level = 'level_3'
    else if (score < 7) level = 'level_2'
    else if (score < 10) level = 'level_1'
    else if (score < 15) level = 'level_0'
    $('#level').addClass(level);
  }

  render() {
    const score = this.calculateScore(this.state.images);
    console.log("Score:", score)
    setTimeout(() => {
      this.getLevel(score)
    }, 2000)

    return (
      <div class="callback_page box">
        {/* <h1>Your Score: {this.calculateScore(this.state.images)}</h1> */}
        <div id="level" class=""></div>
      </div>
    );
  }
}
