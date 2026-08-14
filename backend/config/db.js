// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "teltec_database",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   }

//   console.log("Connected to MySQL database");
// });

// module.exports = db;

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;