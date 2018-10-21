const testImages = require('./fake.json');

const Clarifai = require('clarifai');
const clarifai = new Clarifai.App({
  apiKey: 'd3fc32cb4fbd4d20a8dc057208d6ce4f'
})
const carbonData = require('./fakeCarbonData.json')

const utils = {
  getScore: function (urlList) {
    let totalScore = 0;
    while (urlList.length >= 32) {
      this.uploadImages(urlList.splice(0, 32))
        .then(response => totalScore += utils.processConcepts(response))
        .catch(err => {
          console.log(err);
        })
    }
    return this.uploadImages(urlList)
      .then(response => totalScore += utils.processConcepts(response))
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
      console.log(output.data.concepts);
      return sum + this.calculateFootPrint(output.data.concepts)
    }, 0)
  },
}

const test = [
  "https://scontent.cdninstagram.com/vp/2a102590dafd9807c34c8510fe926d57/5C5C7F85/t51.2885-15/sh0.08/e35/p640x640/40635976_2191636417749002_1357417031531943918_n.jpg",
  "https://scontent.cdninstagram.com/vp/9d7d0e5ff9002a8558091bcb5fb8a150/5C67899D/t51.2885-15/sh0.08/e35/p640x640/41625913_280390986134005_5253521062110671027_n.jpg",
  "https://scontent.cdninstagram.com/vp/99f262cad5a2ec47da0638e382e937a3/5C46F6C8/t51.2885-15/sh0.08/e35/p640x640/40836822_158422395064494_8725047609059167618_n.jpg",
  "https://scontent.cdninstagram.com/vp/452c9c0c8e21e27eb91bbbceea727267/5C51D201/t51.2885-15/sh0.08/e35/s640x640/31905949_1815871291803880_7223556541381607424_n.jpg",
  "https://scontent.cdninstagram.com/vp/f6e49363c96fa6d61ac68f18d733453a/5C4419B9/t51.2885-15/sh0.08/e35/s640x640/31855330_1973764642873638_8814990912670138368_n.jpg",
  "https://scontent.cdninstagram.com/vp/837584a0e6f45c09038708fbb5f8faad/5C432723/t51.2885-15/sh0.08/e35/s640x640/31709198_2089755707960187_2622153765582536704_n.jpg",
  "https://scontent.cdninstagram.com/vp/b3aed49a9a98479dfc8d60896fa37383/5C669A23/t51.2885-15/sh0.08/e35/s640x640/31745581_467121637039439_1192681258111467520_n.jpg",
  "https://scontent.cdninstagram.com/vp/4b08193a087a6f459493bac2282d7621/5C57B738/t51.2885-15/sh0.08/e35/s640x640/31270289_409701236108433_3793109124900716544_n.jpg",
  "https://scontent.cdninstagram.com/vp/e07bbc7c485649a5213dd17f3bfbedea/5C42C473/t51.2885-15/sh0.08/e35/s640x640/31556405_240515133359824_2373769927044628480_n.jpg",
  "https://scontent.cdninstagram.com/vp/9092986c0a85240481cb06e7b962b9fa/5C42BC29/t51.2885-15/sh0.08/e35/s640x640/29717833_119240528928198_8171014502834241536_n.jpg",
  "https://scontent.cdninstagram.com/vp/f6d7f103fca1ff4a547ba7ac4cb9eced/5C576F5C/t51.2885-15/sh0.08/e35/s640x640/29715398_167154087323264_5168112337432870912_n.jpg",
  "https://scontent.cdninstagram.com/vp/628987820e019b11ffbd8bde7e7f87ec/5C8A72F6/t51.2885-15/sh0.08/e35/s640x640/29737050_236954523535993_270293377247870976_n.jpg",
  "https://scontent.cdninstagram.com/vp/0e7e383001c2e095957f6f7b2fa4b008/5C869D73/t51.2885-15/sh0.08/e35/s640x640/27580834_346191912534742_2198393222504382464_n.jpg",
  "https://scontent.cdninstagram.com/vp/28914cf4796c9704c175678ad3a06300/5C532B0C/t51.2885-15/sh0.08/e35/s640x640/27574327_155885188538820_6261507532347408384_n.jpg",
  "https://scontent.cdninstagram.com/vp/77d7aef6dd9121c5e04c9e26e50502c3/5C450197/t51.2885-15/sh0.08/e35/s640x640/27579984_1933962749966905_4212192066341437440_n.jpg",
  "https://scontent.cdninstagram.com/vp/e59095d7d2f636652bb6560e703771ce/5C4C8D34/t51.2885-15/sh0.08/e35/s640x640/27892809_144452056252208_703203373192577024_n.jpg",
  "https://scontent.cdninstagram.com/vp/bdf986a6830bdde34c5beedf486e9f1f/5C668D8F/t51.2885-15/sh0.08/e35/s640x640/27582307_1999832393604139_1736588529133158400_n.jpg",
  "https://scontent.cdninstagram.com/vp/d40584758e79957d08ef08a3a36a903e/5C4893EA/t51.2885-15/sh0.08/e35/s640x640/27891780_163377687641838_4444169881427902464_n.jpg",
  "https://scontent.cdninstagram.com/vp/5dcddf31668c2acda3610118c4977075/5C4CA330/t51.2885-15/sh0.08/e35/s640x640/23735409_341278976347625_7191285376890175488_n.jpg",
  "https://scontent.cdninstagram.com/vp/63532dfd6c5c353a9c288084adddf871/5C596572/t51.2885-15/sh0.08/e35/s640x640/23735294_507194306315727_5305812716974243840_n.jpg"
];
utils.getScore(test)
  .then(score => console.log(score))

module.exports = utils;