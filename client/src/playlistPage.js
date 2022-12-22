import { GetUserPlaylists } from './searchPlaylist';
import { logout } from './spotify';

import { Routes, Route } from 'react-router-dom';

// after user auth, go to this page
export const PlaylistPage = ({ token }) => {
  return (
    <div>
      <Routes>
        <Route path='*'
          element={<GetUserPlaylists token={token} />}/>
      </Routes>
      
      <button onClick ={logout}>Log Out</button>
    </div>
  )
}