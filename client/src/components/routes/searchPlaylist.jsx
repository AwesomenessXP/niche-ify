import { useEffect, useState, useRef } from "react"
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserPlaylist } from "../playlist/userPlaylists";
import { ShowOnePlaylist } from '../playlist/showOnePlaylist';
const Spotify = require('spotify-web-api-js');

/**
 * 
 * @param {string} token access spotify endpoints
 * @returns either user playlists, or specific playlist (when chosen)
 * 
 */
export const GetUserPlaylists = ({ token }) => {
  // initialize spotify api wrapper
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(token);

  // initialize all states
  const [listOfPlaylists, setListOfPlaylists] = useState([{}]);
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistName, setPlaylistName] = useState('');
  const userName = useRef(null);

  // happens any time the token is updated/modified
  // fetches all of the user's playlists and stores them

  useEffect(() => {
    // get user's name
    async function getName() {
      userName.current = await spotifyApi.getMe();
    }

    // get ONLY user's playlists
    const playlists = async () => {
      const fetchPlaylists = await spotifyApi.getUserPlaylists();
      const modPlaylists = await fetchPlaylists.items.filter((playlist) => {
        return playlist.owner.display_name === `${userName.current.id}`
      });
      setListOfPlaylists(modPlaylists);
    }

    try {
      getName().then(playlists);
    } catch (e) {
      console.error(e);
    }

  });

  return ( 
    <Routes>
      <Route exact path={`nicheify_${playlistName}`} element={<ShowOnePlaylist
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
        <Navigate replace to={`nicheify_${playlistName}`} />
        }
      />
    </Routes>
  )
}