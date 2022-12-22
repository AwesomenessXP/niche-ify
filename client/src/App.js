import { useState, useEffect } from 'react';
import { accessToken, logout } from './spotify';
import {GetUserPlaylists} from './searchPlaylist'

function App() {
  //initialize states
  const [token, setToken] = useState('');

  // everytime user access localhost:3000 (sign in), set the token
  useEffect(() => {
    setToken(accessToken);
  }, []);

  console.log(`token: ${token}`)

  /* if no token, show login, if token, show logout */
  return (
    <div>
      {!token ? 
          <a href="http://localhost:8000/login">
            Log in to Spotify
          </a>
        : (
          <>
            <GetUserPlaylists token={token} />
            <button onClick ={logout}>Log Out</button>
          </>
        )
      }
    </div>
  )
}

export default App;
