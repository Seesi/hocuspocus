import { Server } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { Redis } from "@hocuspocus/extension-redis";
import { Database } from "@hocuspocus/extension-database";
import sqlite3 from "sqlite3";
import * as Y from "yjs";

const db = new sqlite3.Database("sqldb-hocuspocus.db");
db.exec(
  "CREATE TABLE IF NOT EXISTS documents (data BLOB, name TEXT PRIMARY KEY)"
);

let logger = new Logger({
  onLoadDocument: true,
  onChange: true,
  onConnect: true,
  onDisconnect: true,
  onUpgrade: true,
  onRequest: true,
  onListen: true,
  onDestroy: true,
  onConfigure: true,
});

let redisCache = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

// Either you go with the database extension or use the onStoreDocument and onLoadDocument hocks

let database = new Database({
  // Return a Promise to retrieve data …
  fetch: async ({ documentName }) => {
    return new Promise((resolve, reject) => {
      db?.get(
        `SELECT data FROM "documents" WHERE name = $name ORDER BY rowid DESC`,
        {
          $name: documentName,
        },
        (error, row) => {
          if (error) {
            reject(error);
          }
          const data = new Uint8Array(row.data);
          resolve(data);
        }
      );
    });
  },
  // … and a Promise to store data:
  store: async ({ documentName, document }) => {
    const binaryData = Y.encodeStateAsUpdate(document);
    db?.run(
      `INSERT INTO "documents" ("name", "data") VALUES ($name, $data) ON CONFLICT(name) DO UPDATE SET data = $data`,
      {
        $name: documentName,
        $data: binaryData,
      }
    );
  },
});

const loadFromDatabase = (documentName) => {
  const row = db?.get(
    "SELECT data FROM documents WHERE name = ? ORDER BY rowid DESC",
    documentName
  );
  const data = new Uint8Array(row.data);
  return data;
};
const saveToDatabase = async (data, documentName) => {
  const binaryData = Y.encodeStateAsUpdate(data);
  db?.run(
    "INSERT INTO documents (name, data) VALUES (:name, :data) ON CONFLICT(name) DO UPDATE SET data = :data",
    {
      ":name": documentName,
      ":data": binaryData,
    },
    (error) => {
      if (error)
        console.error(
          "Error occuried whiles saving document changes #%d",
          error
        );
    }
  );
};
const server = new Server({
  name: "hocuspocus-seesi-01",
  port: 1234,
  timeout: 30000,
  debounce: 1000,
  maxDebounce: 30000,
  quiet: false,
  extensions: [logger, redisCache],
  async onStoreDocument(data) {
    // Save to database. Example:
    saveToDatabase(data.document, data.documentName);
  },

  async onLoadDocument(data) {
    return loadFromDatabase(data.documentName) || createInitialDocTemplate();
  },
  async onConnect({ documentName }) {
    console.log(`Client connected to document: ${documentName}`);
  },
});

server.listen();
