const { MongoClient } = require('mongodb');
const config = require('./config/config');

const uri = config.mongoose.url;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    // Lấy tên database từ URI
    const dbName = uri.split('/').pop().split('?')[0];
    db = client.db(dbName);
  }
  return db;
}

function getCollection(name) {
  if (!db) throw new Error('Database chưa kết nối');
  return db.collection(name);
}

module.exports = { connectDB, getCollection };
