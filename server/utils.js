const testImages = require('./fake.json');

const Clarifai = require('clarifai');
const clarifai = new Clarifai.App({
  apiKey: 'd3fc32cb4fbd4d20a8dc057208d6ce4f'
})
const carbonData = require('./fakeCarbonData.json')

const utils = {
  getScore: function (urlList) {
    let totalScore = 0;



    return this.uploadImages(urlList)
      .then(response => utils.processConcepts(response))
      .catch(err => {
        console.log(err);
      })
  },
  calculateFootPrint: function (conceptList) {
    return conceptList.reduce((sum, concept) => {
      if (carbonData[concept.name]) {
        return sum + carbonData[concept.name].value;
      } else {
        return sum;
      }
    }, 0)
  },
  uploadImages: async function (urlList) {
    const inputs = urlList.map(url => (
      { url }
    ));
    try {
      const generalModel = await clarifai.models.initModel({ id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40" })
      const response = await generalModel.predict(inputs)
      return response;
    } catch (ex) {
      console.log(ex);
    }
  },
  processConcepts: function (clarifaiResponse) {
    return clarifaiResponse.outputs.reduce((sum, output) => {
      return sum + this.calculateFootPrint(output.data.concepts)
    }, 0)
  },
}

const test = testImages.map(image => image.url);

module.exports = utils;