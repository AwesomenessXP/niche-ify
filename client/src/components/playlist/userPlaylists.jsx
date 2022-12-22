import axios from 'axios';
import { PlaylistTrack } from './playlistTrack';

/**
 * Get user playlists after redirecting from auth
 * @param {string} playlistID 
 * @param {string} playlistName
 * @returns 
 */
export const UserPlaylist = ({
  listOfPlaylists,
  setPlaylistName,
  setPlaylistTracks,
  token}) => {
  
  // fetch all songs from a specific playlist given the id
  const getPlaylistTracks = (playlistID, playlistName) => {
    axios({
      method: 'get',
      baseURL: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      headers: `Authorization: Bearer ${token}`,
      params: {limit: 20}
    })
      .then(res => {
        // add logic for paginating API response if more than 50 tracks
        setPlaylistTracks(res.data.items);
        setPlaylistName(playlistName);
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h1>Choose a playlist to niche-ify:</h1>
      {/* display all of the user's playlists */}
      {listOfPlaylists.map(playlist => {
        return ( 
          <div>
            <PlaylistTrack
              playlist={playlist}
              getPlaylistTracks={getPlaylistTracks}
            />
          </div>
      )})}
    </div>
  )
}