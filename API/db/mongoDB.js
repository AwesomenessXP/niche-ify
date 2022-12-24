require('dotenv').config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

//init variables
const DB_NAME = 'spotify_user_data';

// connect to server
module.exports = connectToDB = async () => {
  try {
    await client.connect();
    console.log('Connected to server!');
    const database = client.db(DB_NAME); 
    const collection = database.collection('playlists');
    
    // test result
    const findResult = await collection.find({}).toArray();
    if (findResult.length === 0) {
      const insertResult = await collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
      ]);
    }
    console.log('found docs: ', findResult);
  }
  catch (e) {
    console.log('Did not connect to DB :(');
  }
  finally {
    await client.close();
  }
}
