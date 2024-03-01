const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");

const User = connect_db.define("users",{
  idUser:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  userName:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  fullName:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  saldo:{
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: true,
  }, 
  profilePicture:{
    type: Sequelize.TEXT,
    allowNull: true,
  },
})

module.exports = User;