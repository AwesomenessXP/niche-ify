import { PlaylistTrack } from './playlistTrack';
import axios from 'axios';
// const Spotify = require('spotify-web-api-js');
// const spotifyApi = new Spotify();

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
  token }) => {
  
  //fetch all songs from a specific playlist given the id
  const getPlaylistTracks = async (playlistID, playlistName) => {
    // spotifyApi.setAccessToken(token);
    // let allTracks = [];
    // const playlist = (await spotifyApi.getPlaylist(playlistID));
    // // if there is more tracks than the limit (100 by default)
    // if (playlist.tracks.total > playlist.tracks.limit) {

    //   // Paginate all API requests
    //   // Divide the total number of track by the limit
    //   //        to get the number of API calls
    //   for (let i = 0; i < Math.ceil(playlist.tracks.total / playlist.tracks.limit); i++) {
    //     const trackToAdd = await spotifyApi.getPlaylistTracks(
    //       playlistID, {
    //       offset: playlist.tracks.limit * i // Offset each call by the limit * the call's index
    //     });

    //     // Push the retreived tracks into the array
    //     await trackToAdd.items.forEach((item) => allTracks.push(item));
    //   }// for
    // }
    // else {
    //   // take the current tracks and add them to the array
    //   const trackToAdd = (await spotifyApi.getPlaylistTracks(playlistID));
    //   await trackToAdd.items.forEach((item) => allTracks.push(item));
    // }// else

    // setPlaylistTracks(allTracks);
    // setPlaylistName(playlistName);

    if (token != null) {
      try {
        // get all playlist tracks using playlist id (returns tracks)
        await axios.get(`/playlist_tracks?token=${token}&id=${playlistID}&name=${playlistName}`)

        // set playlist tracks and name
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div>
      <h1>Choose a playlist to niche-ify:</h1>
      {/* display all of the user's playlists */}
      {listOfPlaylists.map(playlist => {
        return ( 
          <div key={playlist.id}>
            <PlaylistTrack
              playlist={playlist}
              getPlaylistTracks={getPlaylistTracks}
              playlistName={playlist.name}
            />
          </div>
      )})}
    </div>
  )
}