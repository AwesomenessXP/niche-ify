require('dotenv').config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

//init variables
const DB_NAME = 'spotify_user_data';

// connect to mongodb
exports.connectToDB = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to server!');
  const database = client.db(DB_NAME); 
  const collection = database.collection('playlists');
  const findResult = await collection.find({}).toArray();
  return {
    resultLength: findResult.length,
    collection: collection
  };
}

// write to mongodb
exports.writeToDB = async (collection, playlistData, userEmail) => {
  try {
    // write to DB
    console.log('Writing to DB...')
    const playlists = await collection.insertOne({
      playlists: playlistData, user_email: userEmail
    });
    return playlists
  }
  catch (e) {
    console.log('Did not connect to DB :(');
    return false;
  }
  finally {
    await client.close();
  }
}
