const express = require("express");

const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
const dbpath = path.join(__dirname, "goodreads.db");
let db = null;

const initilizeDbAndServer = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server running http://localhost:3000");
    });
  } catch (e) {
    console.log(`db error ${e.message}`);
    process.exit(1);
  }
};

initilizeDbAndServer();

app.get("/date", (request, response) => {
  const date = new Date();
  response.send(date);
});

app.get("/books/:bookid/", async (request, response) => {
  const { bookid } = request.params;
  const query = `select * from book where book_id=${bookid};`;

  const dbresponse = await db.all(query);
  response.send(dbresponse);
});
