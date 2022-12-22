import { useEffect, useState } from "react"
import axios from 'axios';
import { UserPlaylist } from "./userPlaylists";
import { ShowOnePlaylist } from './showOnePlaylist';

import { Routes, Route, Navigate } from 'react-router-dom';

// 
export const GetUserPlaylists = ({ token }) => {
  const [listOfPlaylists, setListOfPlaylists] = useState([{}]);
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    axios({
      method: 'get',
      baseURL: 'https://api.spotify.com/v1/me/playlists',
      headers: `Authorization: Bearer ${token}`,
    })
      .then(res => {
        console.log(res.data);
        setListOfPlaylists(res.data.items);
      })
      .catch(err => console.error(err));
  }, [token]);

  return ( 
    <Routes>
      <Route path={`/nicheify_${playlistName}`} element={<ShowOnePlaylist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
        />
        }
      />
      <Route path="*" element={!playlistTracks ? <UserPlaylist
          listOfPlaylists={listOfPlaylists}
          setPlaylistName={setPlaylistName}
          setPlaylistTracks={setPlaylistTracks}
          token={token}
        /> :
          <Navigate to={`/nicheify_${playlistName}`}
        />
        }
      />
    </Routes>
  )
}