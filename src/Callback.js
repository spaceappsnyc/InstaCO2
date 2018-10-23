import React, { Component } from 'react';
import Analysis from './Analysis';
import RadarChart from './RadarChart';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class Callback extends Component {
  constructor() {
    super();
    this.state = { images: [], analyzed: [] };
  };

  componentDidMount() {
    axios
      .get('/api/images')
      .then(response => response.data)
      .then(images => {
        this.setState({ images });
        axios
          .post('/api/analyze', { images })
          .then(response => response.data)
          .then(analyzed => this.setState({ analyzed }))
          .catch(err => console.log(err))
      })
  };

  calculateScore(images) {
    const total = images.reduce((sum, image) => {
      if (image.footPrint) sum += image.footPrint.value;
      return sum;
    }, 0);
    return total / images.length;
  };

  getLevel(score) {
    let level = '';
    if (score < 1) level = 'level_4';
    else if (score < 5) level = 'level_3';
    else if (score < 7) level = 'level_2';
    else if (score < 10) level = 'level_1';
    else level = 'level_0';
    $('#level').addClass(level);
  };

  render() {
    const score = this.calculateScore(this.state.analyzed);
    const finishedAnalyzing = this.state.analyzed.length > 0;
    if (finishedAnalyzing) {
      this.getLevel(score)
      setTimeout(() => {
        this.getLevel(score)
      }, 2000)
    }
    const btnStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      margin: '20px'
    }

    return (
      <div class="callback_page box">
        {/* <h1>Your Score: {this.calculateScore(this.state.images)}</h1> */}
        <div id="level" class="">
          {finishedAnalyzing && (
            <div style={{ paddingTop: '180px', backgroundColor: 'rgb(173, 239, 246)' }} >
              <RadarChart
                analyzedImages={this.state.analyzed}
              />
            </div>
          )}
          <Button
            variant="contained"
            style={btnStyles}
            to="/"
            component={Link}
          >
            Back
          </Button>
        </div>
      </div >
    );
  }
}
