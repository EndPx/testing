const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");
const User = require("./User");
const pickUp = require("./pickUp");

const Chat = connect_db.define("chat",{
    idChat:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    idPickUp:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: pickUp,
            key: 'idPickUp'
        }
    },
    message:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    messageBy:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'idUser'
        }
    }
})

module.exports = Chat;