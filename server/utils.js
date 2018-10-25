require('dotenv').config();
const Clarifai = require('clarifai');
const clarifai = new Clarifai.App({ apiKey: process.env.CLARIFAI_KEY });
const carbonRegistery = require('./fakeCarbonData.json');

const BATCH_SIZE = 32;

const mapCarbonDataToImageUrls = response =>
  response.outputs.map(output => {
    const image = {
      url: output.input.data.image.url,
    };
    output.data.concepts.forEach(concept => {
      const footPrint = carbonRegistery[concept.name];
      if (footPrint)
        image.footPrint = { name: concept.name, value: footPrint.value };
    });
    return image;
  });

const uploadImages = async imageInputs =>
  clarifai.models
    .initModel({
      id: Clarifai.GENERAL_MODEL,
      version: 'aa7f35c01e0642fda5cf400f543e7c40',
    })
    .then(generalModel => generalModel.predict(imageInputs))
    .catch(err => console.log(err));

const formatImageUrls = imageUrlArr => imageUrlArr.map(url => ({ url }));

const analyzeBatch = batch =>
  uploadImages(formatImageUrls(batch))
    .then(response => mapCarbonDataToImageUrls(response))
    .catch(err => console.log(err));

const groupIntoBatches = imageUrlArr => {
  const copy = imageUrlArr.slice();
  const batches = [];
  while (copy.length > 0) {
    batches.push(copy.splice(0, BATCH_SIZE));
  }
  return batches;
};

const analyzeImages = imageUrlArr => {
  //group urls into efficiently processed sizes
  const batches = groupIntoBatches(imageUrlArr);

  return Promise.all(batches.map(batch => analyzeBatch(batch)))
    .then(analyzedBatches =>
      analyzedBatches.reduce((allImages, batch) => allImages.concat(batch))
    )
    .catch(err => console.log(err));
};

module.exports = analyzeImages;
