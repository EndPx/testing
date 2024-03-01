const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");

const Role = connect_db.define("roles",{
  idRole:{
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nameRole:{
    type: Sequelize.ENUM("CUSTOMER", "DRIVER"),
    allowNull: false
  }
});

module.exports = Role;