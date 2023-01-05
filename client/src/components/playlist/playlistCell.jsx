const Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();

/**
 * 
 * @param {string} playlistName 
 * @param {Array} playlistTracks 
 * @returns 
 */

// define Artist class
class Artist {
  constructor(artistName, artistID, relatedArtists, followCount) {
    this.artistName = artistName;
    this.artistID = artistID;
    this.relatedArtists = relatedArtists;
    this.followCount = followCount;
  }
}

/**
 * Displays one playlist cell
 * When niche-ify button is clicked -> generate a new playlist for the user
 * @param {token} use token for spotify api requests
 */
export const PlaylistCell = ({ token }) => {
  spotifyApi.setAccessToken(token);

  // get the user's selected playlist and name
  const name = localStorage.getItem('selected_name');
  const tracks = JSON.parse(localStorage.getItem('selected_playlist'));

  // logic for filtering artists and displaying "nicheified" artists
  async function nicheify() {
    // get list of all artists
    let artistsID = tracks.map(track => track.track.artists[0].id);
    artistsID = new Set(artistsID);
    artistsID = Array.from(artistsID);

    let artistsName = tracks.map(track => track.track.artists[0].name);
    artistsName= new Set(artistsName);
    artistsName = Array.from(artistsName);
    // // remove dupes
    let uniqueArtists = new Set(artistsID);
      uniqueArtists = Array.from(uniqueArtists);

    //------------------- GET ALL ARTISTS ---------------------------------
    let i = -1;
    const promises = uniqueArtists.map(async (artist) => {
      const relatedArtists = (await spotifyApi
        .getArtistRelatedArtists(artist)).artists;
      
      const artistFollowers = (await spotifyApi.getArtist(artist)).followers.total;

      i++;
      // returns an Artist object w/ data to be used in the algorithm
      return new Artist(
        artistsName[i],
        artistsID[i],
        await relatedArtists,
        await artistFollowers,
      );
      
    });

    const followers = await Promise.all(promises);

    // // ------------------ NICHE-IFY ARTISTS ------------------------------------
    const replace2Niche = followers.map(async (artist) => {
      let smallestArtist = artist;

        while (smallestArtist.followCount > 20000 && smallestArtist.relatedArtists.length > 0) {
          console.log('outer loop');
          console.log(`artist: ${smallestArtist.artistName}`)
          // filter through the array and find least popular artist
          for (let i = 0; i < smallestArtist.relatedArtists.length; i++) {
            console.log('inner loop')
            const { followers, name, id } = smallestArtist.relatedArtists[i];
            const total = followers.total;
            // if the related artist is smaller, save that 
            if (smallestArtist.followCount > total) {
              smallestArtist = new Artist(name, id, [], total);
            }
          }
          
          // after finding least popular artist, set their relatedArtists
          smallestArtist.relatedArtists = (await spotifyApi.getArtistRelatedArtists(smallestArtist.artistID)).artists;
          
        }
 
    
      // console.log(`ungrateful artist: ${artistName}, follow count: ${followCount}`)
      return smallestArtist;

    });

    //Update playlist tracks here:
    const nicheArtists = await Promise.all(replace2Niche);
    nicheArtists.forEach(nicheArtist => {
      console.log(nicheArtist)
    });
  }
  /* display all tracks from the playlist */
  return (
    <div>
      <h1>{name}</h1>
      <button onClick={() => nicheify()}>NICHE-IFY</button>
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