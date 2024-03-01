const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");

const dropOff = connect_db.define("dropOff",{
  idDropOff:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
})

module.exports = dropOff;