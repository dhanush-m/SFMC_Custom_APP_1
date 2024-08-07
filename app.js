const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/login', (req, res) => {
  const authUrl = `${process.env.AUTH_URL}?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(process.env.TOKEN_URL, null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI
      }
    });

    const { access_token, refresh_token } = response.data;
    
    // Here you would typically store these tokens securely
    // For this example, we'll just render them
    res.render('success', { access_token, refresh_token });
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.render('error', { message: 'Failed to authenticate' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});