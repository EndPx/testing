const Role = require('../model/Role');
const User = require('../model/User');
const pickUp = require('../model/pickUp');
const jenisSampah = require('../model/jenisSampah');
const statuspickUp = require ('../model/statusPickUp');
const dropOff = require ('../model/dropOff');
const bankSampah = require ('../model/bankSampah');

const connect_db = require('./connect_db');
const Chat = require('../model/chat');

const role_user = [
    {nameRole: "CUSTOMER"},
    {nameRole: "DRIVER"}
]

const jenis_sampah = [
    {nameSampah: "PLASTIK"},
    {nameSampah: "LOGAM"},
    {nameSampah: "KERTAS"},
    {nameSampah: "KACA"}
]

const status_pickUp = [
    {nameStatus: "MENCARI"},
    {nameStatus: "MENUJU"},
    {nameStatus: "PENGECEKAN"},
    {nameStatus: "SELESAI"},
    {nameStatus: "CANCEL"}
]

//membuat relasi antar tabel user dan role
Role.hasMany(User, {foreignKey: 'idRole'});
User.belongsTo(Role, {foreignKey: 'idRole'});

pickUp.belongsTo(statuspickUp, {
    foreignKey: 'idStatus'
});

pickUp.belongsTo(jenisSampah, {
    foreignKey: 'idSampah'
});

// Customer User-->PickUp
User.hasMany(pickUp, {
    foreignKey: 'idCustomer'
});
  
  // Customer pickUp-->User
pickUp.belongsTo(User, {
    as: 'Customer',
    foreignKey: 'idCustomer'
});
  
  // Driver User-->PickUp
User.hasMany(pickUp, {
    foreignKey: 'idDriver'
});
  
  // Driver pickUp-->User
pickUp.belongsTo(User, {
    as: 'Driver',
    foreignKey: 'idDriver'
});

// Driver User-->PickUp
User.hasMany(pickUp, {
    foreignKey: 'cancelBy'
});
  
  // Driver pickUp-->User
pickUp.belongsTo(User, {
    as: 'cancelUser',
    foreignKey: 'cancelBy'
});

Chat.belongsTo(User, {
    as: 'messageUser',
    foreignKey: 'messageBy'
});

User.hasMany(Chat, {
    as: 'messageUser',
    foreignKey: 'messageBy'
});

const association = async() => {
    try {
        // await connect_db.sync({force: true});
        // await Role.bulkCreate(role_user);
        // await jenisSampah.bulkCreate(jenis_sampah);
        // await statuspickUp.bulkCreate(status_pickUp);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association;