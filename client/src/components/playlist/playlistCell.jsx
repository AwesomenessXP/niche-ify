import axios from 'axios';
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
    let artistsIDs = tracks.map(track => track.track.artists[0].id);
    artistsIDs = new Set(artistsIDs);
    artistsIDs = Array.from(artistsIDs);

    //------------------- GET ALL ARTISTS ---------------------------------
    const promises = artistsIDs.map(async (artist) => {

      const related = await spotifyApi.getArtistRelatedArtists(artist);
      const relatedArtists =  await related.artists;
      const artistData = await spotifyApi.getArtist(artist);
      const followers = await artistData.followers.total;
      
      // returns an Artist object w/ data to be used in the algorithm
      return new Artist (
        await artistData.name,
        await artistData.id,
        await relatedArtists,
        await followers,
      );
    });

    const followers = await Promise.all(promises);

    // look for artists with < 20k followers
    const CRITERIA = 10000;

    // ------------------ NICHE-IFY ARTISTS ------------------------------------

    // get each artist's related artists
    const replace2Niche = followers.map(async (artist) => {
      // keep searching for artists until the criteria is met
      while (artist.followCount > CRITERIA && artist.relatedArtists.length > 0) {
        // filter through the array and find least popular artist
        console.log("outer loop");
        let replaced = false;
        for (let i = 0; i < artist.relatedArtists.length; i++) {
          console.log('inner loop');
          const { followers, name, id } = artist.relatedArtists[i];
          const total = followers.total;
          // if the related artist is smaller, save that
          if (artist.followCount > total) {
            artist = new Artist(name, id, [], total);
            replaced = true;
          }
        }// for

        // stop searching if the artist is smaller than all of their related artists
        if (!replaced) break;

        // then set the smallest artist's relatedArtists
        // USE BACKOFF-RETRY STRAT HERE
        const delay = (time) => new Promise(resolve => setTimeout(resolve, time));
        const artistRef = JSON.parse(JSON.stringify(artist));
        const getResource = async () => {
          let related;
          try {
            // related = await spotifyApi.getArtistRelatedArtists(artistRef.artistID);
            related = await axios({
              method: 'get',
              baseURL: `https://api.spotify.com/v1/artists/${artistRef.artistID}/related-artists`,
              headers: `Authorization: Bearer ${token}`,
            });
          } catch (e) {
            console.log("ERROR: too many requests!:")
            console.log(e);
            await delay(10);
            await getResource(); // keep spamming until you get a response
          }
          return await related.data.artists;
        }

        artist.relatedArtists = await getResource();
        
        // ********* IN CASE OF ERROR, UNCOMMENT *****************
        // const related = await spotifyApi.getArtistRelatedArtists(artist.artistID);
        // artist.relatedArtists = await related.artists;
      }// while

      return artist;
    });

    // Update playlist tracks here:
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