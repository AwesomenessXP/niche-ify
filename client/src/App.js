import { useState, useEffect } from 'react';
import './App.css';

function App() {
  //initialize states
  const [data, setData] = useState('');

  // get client id from server
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    console.log(accessToken);
    console.log(refreshToken);
  }, []);

  /* if no token, show login, if token, show logout */
  return (
    <a href='http://localhost:8000/login'>
      Login to Spotify
    </a>
  )
}

export default App;
