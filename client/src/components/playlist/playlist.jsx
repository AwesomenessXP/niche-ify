/**
 * 
 * @param {string} playlistName 
 * @param {Array} playlistTracks 
 * @returns 
 */
export const ShowOnePlaylist = () => {
  const name = localStorage.getItem('selected_name');
  const tracks = JSON.parse(localStorage.getItem(name));
  return (
    <div>
      <h1>{name}</h1>
      {/* display all tracks from the playlist */}
      {tracks.map(track => {
          return (
            <div key={track.track.id}>
              <h3>
                {track.track.name} - {track.track.artists[0].name}
              </h3>
              <hr/>
            </div>
          )
        })
      }
  </div>
  )
}