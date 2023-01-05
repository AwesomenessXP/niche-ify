import { useEffect, useState} from "react"
import { Routes, Route} from 'react-router-dom';
import { UserPlaylist } from "../playlist/playlistPage";
import { PlaylistCell } from '../playlist/playlistCell';
import axios from 'axios';
const Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();

/**
 * 
 * @param {string} token access spotify endpoints
 * @returns either user playlists, or specific playlist (when chosen)
 * 
 */
export const GetUserPlaylists = ({ token }) => {
  // initialize all states
  const [listOfPlaylists, setListOfPlaylists] = useState([{}]);
  spotifyApi.setAccessToken(token);
  // fetches all of the user's playlists and stores them
  useEffect(() => {
    async function getPlaylists() {
      // first check if the token exists, then call api
      if (token !== null) {
        try {
          // get all playlists followed/owned by user
          const allPlaylists = await axios.get(`/playlists?token=${token}`);
          // get user's display name
          const me = await spotifyApi.getMe();
          // filter: get playlists ONLY OWNED by the user
          const sendPlaylists = await allPlaylists.data[0].playlists
            .filter(playlist => {
              return playlist.owner.display_name === `${me.id}`;
            });

          // set the state of playlists
          setListOfPlaylists(sendPlaylists);
        } catch (e) {
          console.error(e);
        }
      }
    }
    getPlaylists();
    
  }, [token]);

  return ( 
    <Routes>
      <Route path="/*" element={<UserPlaylist
          listOfPlaylists={listOfPlaylists}
          token={token}
      />}>
        <Route path={`nicheify_${localStorage.getItem('selected_name')}`}
          element={<PlaylistCell token={token} />}
        />
      </Route>
    </Routes>
  )
}