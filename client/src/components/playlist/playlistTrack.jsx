/**
 * 
 * @param {Array} playlist 
 * @param {Array} getPlaylistTracks 
 * @returns single cell containing playlist info and name
 */
export const PlaylistTrack = ({ playlist, getPlaylistTracks, playlistName }) => {
  return (
    <div>
      <label key={playlist.id}>{playlist.name}</label>
      <button onClick={() =>
        getPlaylistTracks(playlist.id, playlist.name)}
      >
        Pick
      </button>
      <hr/>
    </div>
  )
}