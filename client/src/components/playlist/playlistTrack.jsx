import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * Display a single cell containing a playlist
 * When "pick" button is clicked, show that playlist's tracks
 * @param {Array} playlist 
 * @param {Array} getPlaylistTracks 
 * @returns single cell containing playlist info and name
 */
export const PlaylistTrack = ({ playlist, token}) => {
  // return all songs from a specific playlist given the id
  const getPlaylistTracks = async (playlistID, playlistName) => {
    if (token != null) {
      try {
        // get all playlist tracks using playlist id (returns tracks)
        const playlistTrackData =
          await axios.get(
            `/playlist_tracks?token=${token}`+
            `&id=${playlistID}`+
            `&name=${playlistName}`
          );
        
        const playlistTrack = await playlistTrackData.data[0].playlist_tracks;
        
        // store the current playlist in localStorage, data persists after refresh
        localStorage.setItem (
          'selected_playlist',
          JSON.stringify(await playlistTrack)
        );
        
        localStorage.setItem (
          `selected_name`,
          playlistName
        );  
      } catch (e) {
        console.error(e);
      }
    }
    window.location.reload();
  }
  
  return (
    <div>
      <label key={playlist.id}>{playlist.name}</label>
      <Link to={`nicheify_${playlist.name}`}>
        <button onClick={() =>
        getPlaylistTracks(playlist.id, playlist.name)}
        > Pick
        </button>
      </Link>
      <hr />
    </div>
  )
}