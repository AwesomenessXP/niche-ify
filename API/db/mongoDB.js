const { find } = require('async');

require('dotenv').config();

//init variables
const DB_NAME = 'spotify_user_data';

// connect to mongodb
exports.connectToDB = async (client) => {
  try {
    console.log('Connected to server!');
    const database = client.db(DB_NAME); 
    const collection = database.collection('all_playlists');
    const findResult = await collection.find({}).toArray();
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
exports.writeToDB = async (client, collection, playlistData, userEmail) => {
  try {
    // write to DB
    console.log('Writing to DB...')
    const playlists = await collection.insertOne({
      playlists: playlistData,
      user_email: userEmail
    });

    return playlists;
  }
  catch (e) {
    await client.close();
    return false;
  }
}

// read from mongodb
exports.readFromDB = async (client, collection) => {
  try {
    console.log('Reading from DB...');
    return await collection.find({}).toArray();
  }
  catch (e) {
    await client.close();
    console.log('Did not connect to DB :(');
    return false;
  }
}
