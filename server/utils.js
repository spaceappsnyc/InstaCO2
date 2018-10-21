const Clarifai = require('clarifai');
const clarifai = new Clarifai.App({
  apiKey: 'd3fc32cb4fbd4d20a8dc057208d6ce4f'
})
const carbonRegistery = require('./fakeCarbonData.json')

const mapCarbonDataToImageUrls = (response) => (
  response.outputs.map(output => {
    const image = {
      url: output.input.data.image.url
    }
    output.data.concepts.forEach(concept => {
      const footPrint = carbonRegistery[concept.name];
      if (footPrint) image.footPrint = { name: concept.name, value: footPrint.value };
    })
    return image;
  })
)

const uploadImages = async (imageInputs) => {
  return clarifai.models.initModel({
    id: Clarifai.GENERAL_MODEL,
    version: "aa7f35c01e0642fda5cf400f543e7c40"
  })
    .then(generalModel => generalModel.predict(imageInputs))
    .catch(err => console.log(err))
}

const formatImageUrls = (imageUrlArr) => imageUrlArr.map(url => ({ url }));

const analyzeImages = (imageUrlArr) => (
  uploadImages(formatImageUrls(imageUrlArr))
    .then(response => mapCarbonDataToImageUrls(response))
    .catch(err => console.log(err))
)

module.exports = analyzeImages;