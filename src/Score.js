import React, { Component } from 'react';

export default class Score extends Component {
  state = {
    score: 0
  }
  cycleScore = score => {
    if (this.state.score < score) {
      setTimeout(() => this.setState({ score: this.state.score + 1 }), 30)
    }
  }
  render() {
    return (
      <div>
        {this.cycleScore(this.props.score)}
        <h3>{this.state.score}</h3>
      </div>
    )
  }
}
