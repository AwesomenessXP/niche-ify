const Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();

/**
 * 
 * @param {string} playlistName 
 * @param {Array} playlistTracks 
 * @returns 
 */
export const ShowOnePlaylist = () => {
  const name = localStorage.getItem('selected_name');
  const tracks = JSON.parse(localStorage.getItem('selected_playlist'));

  let artistsID = tracks.map(track => track.track.artists[0].id);
  let uniqueArtists = new Set(artistsID);
  uniqueArtists = Array.from(uniqueArtists);
  uniqueArtists = uniqueArtists.slice(0, 50);

  function getRelatedArtists() {
    uniqueArtists.forEach(async (artist) => {
      const relatedArtists = await spotifyApi.getArtistRelatedArtists(artist);
      console.log(relatedArtists);
    })
  }

  return (
    <div>
      <h1>{name}</h1>
      <button onClick={() => getRelatedArtists()}>NICHE-IFY</button>
      {/* display all tracks from the playlist */}
      {tracks.map(track => {
        return (
          <div key={track.track.id}>
            <h3>
              {track.track.name} - {track.track.artists[0].name}
            </h3>
            <hr/>
          </div>
        )})
      }
  </div>
  )
}