const Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();

/**
 * 
 * @param {string} playlistName 
 * @param {Array} playlistTracks 
 * @returns 
 */

// define an artist class
class Artist {
  constructor(artistName, artistID, followCount) {
    this.artistName = artistName;
    this.artistID = artistID;
    this.followCount = followCount;
  }
}

/**
 * Displays one playlist cell
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

    // get all related artists
    let i = -1;
    const promises = uniqueArtists.map(async (artist) => {
      const artistsRelatedArtists = await spotifyApi.getArtistRelatedArtists(artist);
      const artistFollowers = (await spotifyApi.getArtist(artist)).followers.total;
      i++;
      return {
        artistName: artistsName[i],
        artistID: artistsID[i],
        relatedArtists: await artistsRelatedArtists.artists,
        followCount: await artistFollowers,
      };
      
    });

    const followers = await Promise.all(promises);

    const replace2Niche = await followers.map((artist) => {
      const { artistName, artistID, relatedArtists, followCount } = artist;
      let smallestArtist = new Artist(artistName, artistID, followCount);

      if (relatedArtists.length > 0) {
        relatedArtists.forEach(relatedArtist => {
          const { name, id, followers } = relatedArtist;
          const totalFollowers = followers.total;
          if (smallestArtist.followCount > totalFollowers) {
            smallestArtist = new Artist(name, id, totalFollowers);
          }
        })
      }
      return smallestArtist;
    });

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