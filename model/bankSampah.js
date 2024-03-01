const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");

const bankSampah = connect_db.define("bankSampah",{
    bankSampah:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
  })
  
  module.exports = bankSampah;