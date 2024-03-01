const Sequelize = require('sequelize');

const DB_Name = "db_bank_sampah";
const DB_USERNAME = "root";
const DB_PASSWORD = "";

//connect to database
//Sequelize(nama_db, username_db, password_db, {option})
const connect_db = new Sequelize(DB_Name, DB_USERNAME, DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql"
})

module.exports = connect_db;