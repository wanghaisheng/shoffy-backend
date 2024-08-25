const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://admin:teblU23jwfhlMaTX@shofy.cgnql.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to server");

    // Select the database
    const database = client.db("test");
    // Select the collection
    const collection = database.collection("testCollection");

    // Create a document to insert
    const doc = { name: "Test User", email: "test@example.com" };

    // Insert the document
    const result = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);