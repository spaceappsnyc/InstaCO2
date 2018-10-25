import React, { Component } from 'react';
import Score from './Score';
import RadarChart from './RadarChart';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class Callback extends Component {
  constructor() {
    super();
    this.state = { images: [], analyzed: [] };
    this.calculateScore = this.calculateScore.bind(this);
    this.getLevel = this.getLevel.bind(this);
  }

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
          .then(() => console.log(this.state))
          .catch(err => console.log(err));
      })
      .catch(console.error.bind(console));
  }

  calculateScore(images) {
    if (!images.length) {
      return;
    } else {
      const total = images.reduce((sum, image) => {
        if (image.footPrint) sum += image.footPrint.value;
        return sum;
      }, 0);
      return total / images.length;
    }
  }

  getLevel(score) {
    let level = '';
    if (score < 1) level = 'level_4';
    else if (score < 5) level = 'level_3';
    else if (score < 7) level = 'level_2';
    else if (score < 10) level = 'level_1';
    else level = 'level_0';
    $('#level').addClass(level);
  }

  render() {
    const score = this.calculateScore(this.state.analyzed);
    const finishedAnalyzing = this.state.analyzed.length > 0;
    if (finishedAnalyzing) {
      this.getLevel(score);
      setTimeout(() => {
        this.getLevel(score);
      }, 2000);
    }
    const btnStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      margin: '20px',
    };

    return (
      <div className="callback_page box">
        {/* <h1>Your Score: {this.calculateScore(this.state.images)}</h1> */}
        <div id="level" className="">
          {finishedAnalyzing && (
            <div
              style={{
                paddingTop: '180px',
                backgroundColor: 'rgb(173, 239, 246)',
              }}
            >
              <Score score={score} />
              <RadarChart analyzedImages={this.state.analyzed} />
            </div>
          )}
          <Button variant="contained" style={btnStyles} to="/" component={Link}>
            Back
          </Button>
        </div>
      </div>
    );
  }
}
