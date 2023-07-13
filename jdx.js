const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "goodreads.db");
let db = null;

const initilizationDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("http:/localhost:3000");
    });
  } catch (e) {
    console.log(`db error ${e.message}`);
    process.exit(1);
  }
};
initilizationDbAndServer();

app.get("/", async (request, response) => {
  const qu = `select * from book;`;

  dbresponse = await db.all(qu);
  response.send(dbresponse);
});
