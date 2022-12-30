/**
 * 
 * @param {Array} playlist 
 * @param {Array} getPlaylistTracks 
 * @returns single cell containing playlist info and name
 */
export const PlaylistTrack = ({ playlist, getPlaylistTracks}) => {
  return (
    <div>
      <label key={playlist.id}>{playlist.name}</label>
      <button onClick={async() =>
        await getPlaylistTracks(playlist.id, playlist.name)}
      >
        Pick
      </button>
      <hr/>
    </div>
  )
}