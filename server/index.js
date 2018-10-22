require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const ejs = require('ejs');
const axios = require('axios');
const request = require('request');
const analyzeImages = require('./utils');
const port = process.env.PORT || 3000;

//TODO: think of a better way to do this ha
let imageList;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/api/images', (req, res, next) => {
  res.json(imageList);
});

app.post('/api/analyze', (req, res, next) => {
  analyzeImages(req.body.images)
    .then(images => res.json(images))
    .catch(next)
});

app.get('/api/auth/instagram', (req, res, next) => {
  const url = `https://api.instagram.com/oauth/authorize/?client_id=${
    process.env.INSTAGRAM_CLIENT_ID
    }&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&response_type=code`;
  res.redirect(url);
});

app.get('/api/auth/instagram/callback/', async (req, res, next) => {
  // const tokenReq = {
  //   client_id: process.env.INSTAGRAM_CLIENT_ID,
  //   client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
  //   grant_type: 'authorization_code',
  //   redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
  //   code: req.query.code,
  // };

  // axios.post('https://api.instagram.com/oauth/access_token', tokenReq)
  //   .then(response => response.data)
  //   .then(data => .log("DATA", data))
  //   .catch(next)
  try {
    console.log('secret', process.env.INSTAGRAM_CLIENT_SECRET)
    console.log('id', process.env.INSTAGRAM_CLIENT_ID)
    console.log('uri', process.env.INSTAGRAM_REDIRECT_URI)
    const tokenReq = {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code: req.query.code,
    };

    var options = {
      url: 'https://api.instagram.com/oauth/access_token',
      method: 'POST',
      form: tokenReq,
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        const token = JSON.parse(body)['access_token'];
        axios
          .get(
            `https://api.instagram.com/v1/users/self/media/recent?access_token=${token}`
          )
          .then(resp => {
            const imagesUrlArray = resp.data['data'].map(
              img => img['images']['standard_resolution']['url']
            );
            const index = path.join(__dirname, '../public/index.ejs');
            imageList = imagesUrlArray;
            res.render(index);
          })
          .catch(next);
      }
      else {
        console.log('whoops there was an error!')
        console.log(body)
        // console.log(response.statusCode)

        next(error)
      }
    }
    request(options, callback);
  }
  catch (ex) {
    next(ex);
  }
});

const index = path.join(__dirname, '../public/index.ejs');
app.get('/', async (req, res) => {
  res.render(index, { images: 'holder' });
});

app.listen(port, () => {
  console.log(`listening on port 3000..`);
});
