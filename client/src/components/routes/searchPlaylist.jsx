import { useEffect, useState } from "react"
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';

import { UserPlaylist } from "../playlist/userPlaylists";
import { ShowOnePlaylist } from '../playlist/showOnePlaylist';

/**
 * 
 * @param {string} token access spotify endpoints
 * @returns either user playlists, or specific playlist (when chosen)
 */
export const GetUserPlaylists = ({ token }) => {
  // initialize all states
  const [listOfPlaylists, setListOfPlaylists] = useState([{}]);
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistName, setPlaylistName] = useState('');

  // happens any time the token is updated/modified
  // fetches all of the user's playlists and stores them
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