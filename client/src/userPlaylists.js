import axios from 'axios';

export const UserPlaylist = ({
  listOfPlaylists,
  setPlaylistName,
  setPlaylistTracks,
  token}) => {
  
  const getPlaylistTracks = (playlistID, playlistName) => {
    axios({
      method: 'get',
      baseURL: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      headers: `Authorization: Bearer ${token}`,
      params: {limit: 50}
    })
      .then(res => {
      // logic for paginating API response if more than 50 tracks
      setPlaylistTracks(res.data.items);
      setPlaylistName(playlistName);
      })
    .catch(err => console.error(err));
  }

  return (
    <div>
    <h1>Choose a playlist to niche-ify:</h1>
      {listOfPlaylists.map(playlist => {
        return (
          <div>
            <label key={playlist.id}>{playlist.name}</label>
            <button onClick={() =>
              getPlaylistTracks(
                playlist.id,
                playlist.name)}>
              Pick
            </button>
            <hr/>
          </div>
      )})}
    </div>
  )
}