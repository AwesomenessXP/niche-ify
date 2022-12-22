import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { accessToken} from './spotify';
import { Login } from './login';
import { PlaylistPage } from './playlistPage';

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
    <Routes>
      {!token ?
        <Route path='/' element={<Login />} /> :
        <Route path='*' element={<PlaylistPage token={token} />}/>
      }  
    </Routes>  
  )
}

export default App;
