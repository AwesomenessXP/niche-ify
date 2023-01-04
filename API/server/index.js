// set up server
const express = require('express');
require('dotenv').config();
const querystring = require('node:querystring');
const axios = require('axios');
const PORT = process.env.PORT || 8000;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// import spotify
const Spotify = require('spotify-web-api-node');

// import mongodb
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// import spotify api
const spotifyApi = new Spotify();

// use cors, extract data from body
app.use(cors());
app.use(bodyParser.json());

// connect to mongodb
const {
  connectToDB,
  readFromDB,
} = require('../db/mongoDB');

const { requestItems } = require('./requestSpotifyData');

// send user's data and playlists
app.get('/playlists', async (req, res) => {
  // init: make api req to spotify 
  const { token } = req.query;
  spotifyApi.setAccessToken(token);
  const playlistData = (await spotifyApi.getUserPlaylists({limit: 50})).body;
  const userEmail = (await spotifyApi.getMe()).body.email;

  // write to DB once
  await client.connect();
  const { resultLength, collection } = await connectToDB(client, 'all_playlists');
  const { limit, total } = playlistData;

  const { validConnection } = await requestItems(
    token,
    client,
    collection,
    playlistData,
    resultLength,
    total,
    limit,
    "playlists",
    userEmail,
  );

  // after validating data, read from DB
  const readAllPlaylists = await readFromDB(client, collection);
  
  readAllPlaylists && validConnection ?
    res.send(await readAllPlaylists) :
    res.send('Unable to fetch playlists');

  await client.close();
});

// send user playlist tracks to client
app.get('/playlist_tracks', async (req, res) => {
  // in query params, get playlist id 
  const { token, id, name } = req.query;
  spotifyApi.setAccessToken(token);

  // get all playlist tracks
  const playlistTrackData = (spotifyApi.getPlaylistTracks(id)).body;
  const userEmail = (await spotifyApi.getMe()).body.email;

  // write once to DB
  await client.connect();
  const { resultLength, collection } = await connectToDB(
    client,
    'playlist_tracks',
    name
  );
  const { limit, total } = playlistTrackData;

  const { validConnection } = await requestItems(
    token,
    client,
    collection,
    playlistTrackData,
    resultLength,
    total,
    limit,
    "tracks",
    userEmail,
    name,
    id
  );

  // after validating data, read from DB
  const readPlaylistTracks = await readFromDB(client, collection, name);

  readPlaylistTracks && validConnection ?
    res.send(await readPlaylistTracks) :
    res.send('Unable to fetch playlists');

  await client.close();

});

// generate random code for the state
const generateRandomString = length => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

// REVIEW:
/**
 * GET: retrieves or reads resources
 * POST: creates resources
 * PUT: updates resources
 * DELETE: deletes resources
 */

// endpoint that redirects to spotify page for user authentication
app.get('/login', (req, res) => {

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'user-read-private user-read-email'+
    ' playlist-read-collaborative ' + 
    ' playlist-read-private ';

  const queryParams = querystring.stringify({
    client_id: process.env.CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.REDIRECT_URI, // redirects to "/callback"
    state: state,
    scope: scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});
// endpoint that fetches access token and refresh token 
// on success, redirect to client 
app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.REDIRECT_URI
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${process.env.CLIENT_ID}:`+
        `${process.env.CLIENT_SECRET}`).toString('base64')}`,
    },
  })
  .then(response => {
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;

      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
        expires_in,
      });

      // we can access the query params on client side through the URL
      res.redirect(`http://localhost:3000/?${queryParams}`); 

    } else {
      res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
    }
  })
  .catch(error => {
    res.send(error);
  });
});

// endpoint that fetches new access token from spotify, send to client
// client will request this endpoint when old access token expires
app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query; // get "refresh_token" from query string

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${process.env.CLIENT_ID}:`+
        `${process.env.CLIENT_SECRET}`).toString('base64')}`,
    },
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});