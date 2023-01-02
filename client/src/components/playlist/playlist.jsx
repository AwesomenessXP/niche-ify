import { useState, useEffect, useRef } from 'react';
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

  async function getRelatedArtists() {
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
      i++;
      return {
        artistName: artistsName[i],
        artistID: artistsID[i],
        relatedArtists: await artistsRelatedArtists.artists
      };
      
    });

    let relatedArtists = await Promise.all(promises);
    console.log(relatedArtists.length)
    // get follow count
    const followerPromise = relatedArtists.map(async (artist) => {
      const { artistID } = artist;
      const artistFollowers = (await spotifyApi.getArtist(artistID)).followers.total;
      artist.followCount = artistFollowers;
      return artist;
    });
    
    // contraints: number of API requests made in 30s
    // for each artistID, check if they HAVE any related artists (greater than 0)
    // if they have related artists:
    // outer loop: for every artist in array -> fetch array of related artists - O(n)
    //             - COMPARE current artist with related artists -> save smallest artist
    // nested loop: compare least popular artist with all related artists - O(n)
    // ----- repeat nested loops until criteria met ----------- O(n)
    // let criteria = 10k followers
    // for (artists in playlist) { O(n)
    //   smallest_artist = current artist
    //   while (smallest_artist > criteria) { O(n)
    //     fetch related artists - O(1)
    //     compare current artist with smallest_artist - O(1) (max # of related artists is 20)
    //     save new smallest current artist
    //   }
    //   return smallest artist;
    // }// for

    // (greedy method): while the number of followers is less than criteria,
    //                continue fetching related artist data
    // Summary:
    // call API to get how many followers each artist have
    // find the artist with smallest number of followers
    // check if the artist meets the criteria (lets say <= 10k)
    // if no artists meet criteria, return the original artist (array.length = 0)

    const followers = await Promise.all(followerPromise);

    const replace2Niche = await followers.map((artist) => {
      const { artistName, artistID, relatedArtists, followCount } = artist;
      let smallestArtist = {
        artistName: artistName,
        artistID: artistID,
        followCount: followCount
      }
      
      if (relatedArtists.length > 0) {
        relatedArtists.forEach(relatedArtist => {
          if (smallestArtist.followCount > relatedArtist.followers.total) {
            smallestArtist = {
              artistName: relatedArtist.name,
              artistID: relatedArtist.id,
              followCount: relatedArtist.followers.total
          }}
        })
      }
      return smallestArtist;
    });

    const nicheArtists = await Promise.all(replace2Niche);
    nicheArtists.forEach(nicheArtist => {
      console.log(nicheArtist)
    })
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