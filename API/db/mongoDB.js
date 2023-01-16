require('dotenv').config();

//init variables
const DB_NAME = 'spotify_user_data';

// connect to mongodb
exports.connectToDB = async (client, collectionName, playlistName) => {
  try {
    console.log('Connected to server!');
    const database = await client.db(DB_NAME);
    const collection = await database.collection(collectionName);

    let findResult;
    if (playlistName != undefined) {
      findResult = await collection.find({
        playlist_name: playlistName
      }).toArray();
    }
    else {
      findResult = await collection.find({}).toArray();
    }

    return {
      resultLength: findResult.length,
      collection: collection
    };
  }
  catch (e) {
    await client.close();
    return {
      resultLength: false,
      collection: false
    };
  }

}

// write to mongodb
exports.writeToDB = async (client, collection, playlistData, userEmail,
  playlistName) => {
  try {
    // write to DB
    let items;
    console.log('Writing to DB...');
    if (playlistName == undefined) {
      items = await collection.insertOne({
        playlists: playlistData,
        user_email: userEmail,
      });
    }// if
    else {
      items = await collection.insertOne({
        playlist_tracks: playlistData,
        user_email: userEmail,
        playlist_name: playlistName
      });
    }
    console.log('Successfully written!');
    return items;
  }
  catch (e) {
    await client.close();
    return false;
  }
}

// read from mongodb
exports.readFromDB = async (client, collection, playlistName) => {
  try {
    console.log('Reading from DB...');
    let query;
    if (playlistName != undefined) {
      query = await collection.find({ playlist_name: playlistName }).toArray();
    }
    else {
      query = await collection.find({}).toArray();
    }
    console.log('Successfully read!');
    return query;
  }
  catch (e) {
    await client.close();
    console.log('Did not connect to DB :(');
    return false;
  }
}