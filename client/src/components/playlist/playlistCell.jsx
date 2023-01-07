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
export const PlaylistCell = ({ listOfPlaylists, setListOfPlaylists, token }) => {
  spotifyApi.setAccessToken(token);

  // get the user's selected playlist and name
  const name = localStorage.getItem('selected_name');
  const tracks = JSON.parse(localStorage.getItem('selected_playlist'));

  // logic for filtering artists and displaying "nicheified" artists
  async function nicheify() {
    // get list of all artists
    let artistsIDs = tracks.map(track => track.track.artists[0].id);
    artistsIDs = new Set(artistsIDs);
    artistsIDs = Array.from(artistsIDs);

    //------------------- GET ALL ARTISTS ---------------------------------
    const promises = artistsIDs.map(async (artist) => {
      
      const related = await spotifyApi
        .getArtistRelatedArtists(artist);
      const relatedArtists = await related.artists;
      const artistData = await spotifyApi.getArtist(artist);
      const followers = await artistData.followers.total;

      
      // returns an Artist object w/ data to be used in the algorithm
      return new Artist(
        await artistData.name,
        await artistData.id,
        await relatedArtists,
        await followers,
      );
      
    });

    const followers = await Promise.all(promises);

    // look for artists with < 20k followers
    const CRITERIA = 20000; 

    // ------------------ NICHE-IFY ARTISTS ------------------------------------
    
    const replace2Niche = followers.map(async (artist) => {
      // keep searching until the criteria is met
      while (artist.followCount > CRITERIA && artist.relatedArtists.length > 0) {
        // TODO: handle infinite loop if the smallest artist doesnt meet criteria
        // filter through the array and find least popular artist
        for (let i = 0; i < artist.relatedArtists.length; i++) {
          console.log('inner loop');
          const { followers, name, id } = artist.relatedArtists[i];
          const total = followers.total;
          console.log(`Name: ${name}, followers: ${total}`);

          // if the related artist is smaller, save that
          if (artist.followCount > total) {
            artist = new Artist(name, id, [], total);
          }
        }

        // then set their relatedArtists
        const related = await spotifyApi.getArtistRelatedArtists(artist.artistID);
        artist.relatedArtists = await related.artists;
      }

      return artist;
    });

    //Update playlist tracks here:
    const nicheArtists = await Promise.all(replace2Niche);
    nicheArtists.forEach(nicheArtist => {
      console.log(nicheArtist);
    });
  }

  /* display all tracks from the playlist */
  return (
    <div>
      <h1>{name}</h1>
      <button onClick={async () => await nicheify()}>NICHE-IFY</button>
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