import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * 
 * @param {Array} playlist 
 * @param {Array} getPlaylistTracks 
 * @returns single cell containing playlist info and name
 */
export const PlaylistTrack = ({ playlist, token}) => {
  
    //fetch all songs from a specific playlist given the id
  const getPlaylistTracks = async (playlistID, playlistName) => {
    if (token != null) {
      try {
        // get all playlist tracks using playlist id (returns tracks)
        const playlistTrackData =
          await axios.get(
            `/playlist_tracks?token=${token}&id=${playlistID}&name=${playlistName}`
          );
        
        const playlistTrack = await playlistTrackData.data[0].playlist_tracks
      
        // before setting playlist, check if the track is in localStorage
        // if (localStorage.getItem(playlistName) === null) {
          localStorage.setItem('selected_playlist', JSON.stringify(await playlistTrack));
        // }
        // save the playlist the user selected
        localStorage.setItem(`selected_name`, playlistName);  

      } catch (e) {
        console.error(e);
      }
    }
    window.location.reload();
  }
  
  return (
    <div>
      <label key={playlist.id}>{playlist.name}</label>
      <Link to={`nicheify_${playlist.name}`}><button onClick={() =>
        getPlaylistTracks(playlist.id, playlist.name)}
      >
        Pick
        </button></Link>
      <hr />
    </div>
  )
}