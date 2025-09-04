const { MongoClient } = require('mongodb');
const config = require('./config/config');

const uri = config.mongoose.url;
const client = new MongoClient(uri, config.mongoose.options);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('CRM_Database'); // thay bằng tên database thật
  }
  return db;
}

function getCollection(name) {
  if (!db) throw new Error('Database chưa kết nối');
  return db.collection(name);
}

module.exports = { connectDB, getCollection };
