const Clarifai = require('clarifai');
try {
  Object.assign(process.env, require('../.env'));
} catch (ex) {
  console.log(ex);
}
const clarifai = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY
})
const carbonRegistery = require('./fakeCarbonData.json')
console.log(process.env.CLARIFAI_KEY)

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