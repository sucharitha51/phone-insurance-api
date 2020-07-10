const mysql = require('mysql');

//mysql db connection
const dbConnection = mysql.createConnection({
  host     :process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PWD,
  database : process.env.MYSQL_DATABASE
});
dbConnection.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConnection;