// connect to mongodb
const { writeToDB } = require('../db/mongoDB');

// import spotify
const Spotify = require('spotify-web-api-node');
const spotifyApi = new Spotify();

exports.requestItems = async (
  token,
  client,
  collection,
  itemData,
  resultLength,
  total,
  limit,
  items,
  userEmail,
  name,
  id
) => {
  // set spotify token
  spotifyApi.setAccessToken(token);

  let allItems = [];
  let isValidConnection = false;
  if (resultLength === 0) { // when the DB is empty..
    //first, check the total to see HOW many playlists the user has
    if (total > limit) {
      // paginate api requests
      for (let i = 0; i < Math.ceil(total / limit); i++){
        // change which request to make
        if (items == "playlists") {
          const playlistToAdd = (await spotifyApi.getUserPlaylists({
            limit: limit,
            offset: limit * i
          })).body;
          // add chunk of playlists to array
          playlistToAdd.items.map(item => allItems.push(item));
        }
        else {
          const tracksToAdd = (await spotifyApi.getPlaylistTracks(id, {
            limit: limit,
            offset: limit * i
          })).body;
          // add chunk of playlists to array
          tracksToAdd.items.map(item => allItems.push(item));
        }
      }
    }
    else {
      // when there is no offset, add playlist data
     allItems = itemData.items;
    }
  
    // write to DB
    const written =
      items == "tracks" ?
        await writeToDB(client, collection, allItems, userEmail,name) :
        await writeToDB(client, collection, allItems, userEmail);

    console.log(`written: ${written}`)
    await written ?
      isValidConnection = true :
      console.log("Unable to write to DB :(");
  }// if
  else if (!resultLength && !collection) {
    console.log('Unable to write to DB :(');
  }// else if
  else {
    console.log('Playlists already inserted!');
    isValidConnection = true;
  }// else

  return {
    validConnection: isValidConnection,
    items: allItems
  };
}
