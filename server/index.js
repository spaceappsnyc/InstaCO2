const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const ejs = require('ejs');
const axios = require('axios');
const request = require('request');
const utils = require('./utils');
const PORT = process.env.PORT || 3000;

//set environment variables from .env

try {
  Object.assign(process.env, require('../.env'));
} catch (ex) {
  console.log(ex);
}

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/api/auth/instagram', (req, res, next) => {
  const url = `https://api.instagram.com/oauth/authorize/?client_id=${
    process.env.INSTAGRAM_CLIENT_ID
  }&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&response_type=code`;
  res.redirect(url);
});

app.get('/api/auth/instagram/callback/', async (req, res, next) => {
  console.log('callbackkk');
  try {
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
        console.log('callback2');
        axios
          .get(
            `https://api.instagram.com/v1/users/self/media/recent?access_token=${token}`
          )
          .then(resp => {
            const imagesUrlArray = resp.data['data'].map(
              img => img['images']['standard_resolution']['url']
            );
            utils.getScore(imagesUrlArray).then(score => console.log(score));
            res.json(imagesUrlArray);
          })
          .catch(next);
      }
    }
    request(options, callback);
  } catch (ex) {
    next(ex);
  }
});

const index = path.join(__dirname, '../public/index.html');
app.get('/', async (req, res) => {
  res.render(index, { token: req.query.token });
});

app.listen(PORT, () => {
  console.log(`listening on port 3000..`);
});
