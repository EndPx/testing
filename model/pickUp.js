const Sequelize = require("sequelize");
const connect_db = require("../util/connect_db");
const User = require('../model/User');
const jenisSampah = require('../model/jenisSampah');
const statusPickUp = require ('../model/statusPickUp');

const pickUp = connect_db.define('pickUp', {
  idPickUp: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  harga: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  berat_kg: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  idSampah: {
    type: Sequelize.INTEGER,
    references: {
      model: jenisSampah,
      key: 'idSampah'
    }
  },
  idStatus: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    references: {
      model: statusPickUp,
      key: 'IdStatus'
    }
  },
  idCustomer: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'idUser'
    }
  },
  idDriver: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'idUser'
    }
  },
  cancelBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'idUser'
    }
  },
  cancelReason: {
    type: Sequelize.TEXT,
    allowNull: true
  }
});



module.exports = pickUp;