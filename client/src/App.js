import { useState, useEffect } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

function App() {
  // initialize states
  const [data, setData] = useState('');
  const [token, setToken] = useState('');

  // get client id from server
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.client_id)); // rerender
  }, []);

  // check if we have token saved in local storage
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&")
        .find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      spotify.setAccessToken(token);
    }

    setToken(token);
    getData();

    async function getData() {
      const playlists = await spotify.getUserPlaylists();
      const firstPlaylist = playlists.items[0].id;
      const tracks = await spotify.getPlaylist(`${firstPlaylist}`, {limit: 100, offset: 1});
      console.log(tracks);
    }

  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  }

  const searchArtistInput = (event) => {
    console.log(event);
  }

  // params to request access token
  const CLIENT_ID = data;
  const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
  ]

  /* if no token, show login, if token, show logout */
  if (!token) {
    return (
      <button>
        <a href={
          `${AUTH_ENDPOINT}?` +
          `client_id=${CLIENT_ID}` +
          `&redirect_uri=${REDIRECT_URI}` +
          `&response_type=${RESPONSE_TYPE}` +
          `&scope=${scopes}`}>
          Login to Spotify
        </a>
      </button>
    );

  }
  else {
    return (
      <div>
        <form onSubmit={searchArtistInput}></form>
        <button onClick={logout}>Log out</button>
      </div>
    );

  }
}

export default App;
