import { useEffect, useState} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { accessToken} from './components/auth/spotify';
import { Login } from './components/auth/login';
import { PlaylistPage } from './components/routes/playlistPage';


function App() {
  //initialize states
  const [token, setToken] = useState(null);

  // everytime user access localhost:3000 (sign in), set the token
  useEffect(() => {
    setToken(accessToken);
  }, []);

  console.log(`token: ${token}`)

  /* if no token, show login, if token, show logout */
  return (
    <Routes>
      <Route path="/playlist/*" element={ 
        <PlaylistPage token={token} />
      } />
        <Route path='/' element={!token ? <Login /> :
        <Navigate replace to='/playlist'/> 
      } />     
    </Routes>  
  )
}

export default App;
