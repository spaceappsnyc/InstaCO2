import React, { Component } from 'react';

export default class Analysis extends Component {
  render() {
    const { images } = this.props;
    return (
      <div>
        {images.map(image => {
          return <img src={image} />;
        })}
      </div>
    );
  }
}
