import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import TrackedPlayer from './models/TrackedPlayer';

export const collections: {players?: mongoDB.Collection<TrackedPlayer>} = {};

export async function connectToDatabase() {
  // Pulls in the .env file so it can be accessed from process.env. No path as .env is in root, the default location
  dotenv.config();

  // Create a new MongoDB client with the connection string from .env
  const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

  // Connect to the cluster
  await client.connect();

  // Connect to the database with the name specified in .env
  const db = client.db(process.env.DB_NAME);

  // Apply schema validation to the collection
  await applySchemaValidation(db);

  // Connect to the collection with the specific name from .env, found in the database previously specified
  const playersCollection = db.collection<TrackedPlayer>(
    process.env.PLAYERS_COLLECTION_NAME!
  );

  // Persist the connection to the Players collection
  collections.players = playersCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${playersCollection.collectionName}`
  );
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Player model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongoDB.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'tag', 'lastNotifiedMatchId', 'playerId'],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: 'string',
          description: "'name' is required and is a string",
        },
        tag: {
          bsonType: 'tag',
          description: "'tag' is required and is a number",
        },
        playerId: {
          bsonType: 'string',
          description: "'playerId' is required and is a string",
        },
        lastNotifiedMatchId: {
          bsonType: 'string',
          description: "'lastNotifiedMatchId' is required and is a string",
        },
        channelIds: {
          bsonType: 'array',
          description: "'channelIds' is required and is an array",
        },
        updatedAt: {
          bsonType: 'date',
          description: "'updatedAt' is required and is a date",
        },
        sessionRR: {
          bsonType: 'number',
          description: "'sessionRR' is required and is a number",
        },
        stats: {
          bsonType: 'object',
          description: "'stats' is required and is an object",
        },
      },
    },
  };

  // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db
    .command({
      collMod: process.env.PLAYERS_COLLECTION_NAME,
      validator: jsonSchema,
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.PLAYERS_COLLECTION_NAME!, {
          validator: jsonSchema,
        });
      }
    });
}
