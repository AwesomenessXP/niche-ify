export const ShowOnePlaylist = ({playlistName, playlistTracks}) => {
  return (
    <div>
      <h1>{playlistName}</h1>
      {playlistTracks.map(track => {
          return (
            <div>
              <h3 key={track.track.id}>
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