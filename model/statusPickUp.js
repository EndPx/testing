const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");

const statusJual = connect_db.define("statusPickUp",{
  idStatus:{
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nameStatus:{
    type: Sequelize.ENUM("MENCARI", "MENUJU", "PENGECEKAN", "SELESAI", "CANCEL"),
    allowNull: false
  }
});

module.exports = statusJual;