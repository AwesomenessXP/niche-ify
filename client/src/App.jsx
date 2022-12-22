import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { accessToken} from './components/auth/spotify';
import { Login } from './components/auth/login';
import { PlaylistPage } from './components/routes/playlistPage';

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
