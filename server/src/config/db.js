require("dotenv").config();

const mysql = require("mysql2");

const db = mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Connected to MySQL");
  } catch (err) {
    console.error("MySQL connection failed", err);
  }
})();

module.exports = db;
