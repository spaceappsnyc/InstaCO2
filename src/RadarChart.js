import React, { Component } from 'react';
import Radar from 'react-d3-radar';

export default class RadarChart extends Component {
  gatherCarbonValues = (analyzedImages) => {
    return analyzedImages.reduce((values, image) => {
      if (image.footPrint) {
        const { name, value } = image.footPrint;
        if (!values[name]) {
          values[name] = value;
        }
        else values[name] += value;
      }
      return values;
    }, {})
  }
  render = () => {

    const carbonValues = this.gatherCarbonValues(this.props.analyzedImages);

    //determine largest value to properly size chart
    const maxValue = Object.values(carbonValues).reduce((a, b) => a > b ? a : b);
    const formattedVariables = Object.keys(carbonValues)
      .map(name => ({
        key: name,
        label: name[0].toUpperCase().concat(name.slice(1))
      }));


    return (
      <Radar
        width={300}
        height={300}
        padding={70}
        domainMax={maxValue}
        onHover={(point) => {
          if (point) {
            console.log('hovered over a data point');
          } else {
            console.log('not over anything');
          }
        }}
        data={{
          variables: formattedVariables,
          sets: [{
            key: 'username',
            label: 'IG Username',
            values: carbonValues
          }]
        }}

      />
    )
  }
}