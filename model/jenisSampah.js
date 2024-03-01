const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");

const jenisSampah = connect_db.define("jenisSampah",{
  idSampah:{
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nameSampah:{
    type: Sequelize.ENUM("PLASTIK", "LOGAM", "KERTAS", "KACA"),
    allowNull: false
  }
});
  
  module.exports = jenisSampah;