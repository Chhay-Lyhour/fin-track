const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);
async function test() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', uri.replace(/:[^:@]+@/, ':****@'));
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    const db = client.db('fintrack');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.close();
  }
}
test();
