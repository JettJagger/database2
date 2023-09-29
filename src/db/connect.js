//imports sequalize libary 
const {Sequelize} = require("sequelize");

require("dotenv").config();

//establishes the connection to the database 
const SQLconnection = new Sequelize(process.env.SQL_URI);

//tests the connection to ensure the database is connected 
SQLconnection.authenticate();
console.log("Connection to DB Working");

//exports database connection functions 
module.exports = SQLconnection;