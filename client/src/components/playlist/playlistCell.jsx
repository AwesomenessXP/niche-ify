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
    let artistsName = tracks.map(track => track.track.artists[0].name);
    // remove dupes
    let uniqueArtists = new Set(artistsID);
    uniqueArtists = Array.from(uniqueArtists);

    //------------------- GET ALL ARTISTS ---------------------------------
    let i = -1;
    const promises = uniqueArtists.map(async (artist) => {
      const artistsRelatedArtists = await spotifyApi
        .getArtistRelatedArtists(artist);
      const artistFollowers = (await spotifyApi.getArtist(artist))
        .followers.total;
      i++;
      // returns an Artist object w/ data to be used in the algorithm
      return new Artist(
        artistsName[i],
        artistsID[i],
        await artistsRelatedArtists.artists,
        await artistFollowers,
      );
      
    });

    const followers = await Promise.all(promises);

    // ------------------ NICHE-IFY ARTISTS ------------------------------------
    const replace2Niche = await followers.map((artist) => {
      const { relatedArtists } = artist;
      let smallestArtist = artist;

      // wrap the loop in a while loop
      // condition is smallestArtist.followCount > criteria

      // compare related artists with smallestArtist
      // save the smallest artist
      if (relatedArtists.length > 0) {
        relatedArtists.forEach(async relatedArtist => {
          const { name, id, followers } = relatedArtist;
          const total = followers.total;
          if (smallestArtist.followCount > total) {
            // problem: find a way to work around api rate limit (calls per 30s)
            smallestArtist = new Artist(name, id, [], total);
          }
        })
      }
      return smallestArtist;
    });

    // Update playlist tracks here:
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