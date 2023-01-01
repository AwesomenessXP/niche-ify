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

  function getRelatedArtists() {
    // get list of all artists
    let artistsID = tracks.map(track => track.track.artists[0].id);
    // remove dupes
    let uniqueArtists = new Set(artistsID);
    uniqueArtists = Array.from(uniqueArtists);
    // get all related artists
    let related = [];
    uniqueArtists.forEach(async (artist) => {
      const relatedArtists = await spotifyApi.getArtistRelatedArtists(artist);
      // console.log(relatedArtists);
      related.push(await relatedArtists);
    });
    console.log(related);
  }

  /* display all tracks from the playlist */
  return (
    <div>
      <h1>{name}</h1>
      <button onClick={() => getRelatedArtists()}>NICHE-IFY</button>
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