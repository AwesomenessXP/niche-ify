import { useState, useEffect } from 'react';
import './App.css';
import { accessToken } from './spotify';

function App() {
  //initialize states
  const [token, setToken] = useState('');

  // everytime user access localhost:3000 (sign in), set the token
  useEffect(() => {
    setToken(accessToken);
  }, []);

  /* if no token, show login, if token, show logout */
  return (
    <div>
      {!token ? 
        <a href="http://localhost:8000/login">
          Log in to Spotify
        </a>
        : 
        <h1>Logged in!</h1>
      }
    </div>
  )
}

export default App;
