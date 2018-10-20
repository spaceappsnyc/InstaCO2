const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const ejs = require('ejs');
const axios = require('axios');

process.env.INSTAGRAM_CLIENT_ID = '080eb63008dd41d0bcd80a1d6208d372';
process.env.INSTAGRAM_CLIENT_SECRET = '1e770397bfce4aafbc8f5ef0563066b8';
process.env.INSTAGRAM_REDIRECT_URI =
  'http://localhost:3000/api/auth/instagram/callback';

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
  try {
    let resp = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: req.query.code,
      }
    );

    res.send(resp.data);
  } catch (ex) {
    next(ex);
  }
});

const index = path.join(__dirname, '../public/index.html');
app.get('/', async (req, res) => {
  res.render(index, { token: req.query.token });
});

app.listen(3000, () => {
  console.log(`listening on port 3000..`);
});
