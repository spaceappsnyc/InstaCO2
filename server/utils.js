const Clarifai = require('clarifai');
require('dotenv').config();
const clarifai = new Clarifai.App({
  apiKey: 'd3fc32cb4fbd4d20a8dc057208d6ce4f'
})
const carbonData = require('./fakeCarbonData.json')

module.exports = {
  calculateFootPrint: (conceptList) => {
    return conceptList.reduce((sum, concept) => {
      if (carbonData[concept.name]) {
        return sum + carbonData[concept.name].value;
      } else {
        return sum;
      }
    }, 0)
  }
}