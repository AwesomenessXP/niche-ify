import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        console.log("client_id: " + data.client_id);
        setData(data.client_id);
      }); // rerender
  }, []);

  const CLIENT_ID = data;
  const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "code";

  return (
    <div>
      <button>
        <a href={
          `${AUTH_ENDPOINT}?` +
          `client_id=${CLIENT_ID}` +
          `&redirect_uri=${REDIRECT_URI}`+
          `&response_type=${RESPONSE_TYPE}`}>
            Login to Spotify
          </a>
      </button>
    </div>
  );
}

export default App;
