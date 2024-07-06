// backend/database.js
const mysql = require('mysql2');
require('dotenv').config();

function connectToDatabase() {
  // create a new MySQL connection
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error);
    } else {
      console.log('Connected to MySQL database!');
    }
  });

  return connection;
}

const connection = connectToDatabase();
module.exports = connection;
