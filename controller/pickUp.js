require('dotenv').config();
const User = require('../model/User');
const Role = require('../model/Role');
const jenisSampah = require('../model/jenisSampah');
const statusPickUp = require('../model/statusPickUp');
const pickUp = require('../model/pickUp');
const { Op } = require('sequelize');
const key = process.env.TOKEN_SECRET_KEY;
const jwt = require('jsonwebtoken');


const makeOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);
        const {
            sampah
        } = req.body

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const Sampah = await jenisSampah.findOne({
            where:{
                nameSampah: sampah
            }
        })

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if (loggedUser.role.nameRole != "CUSTOMER") {
            const error = new Error("Akun anda tidak dapat membuat orderan");
            error.statusCode = 403;
            throw error;
        }

        if(Sampah == undefined) {
            const error = new Error(`Jenis Sampah ${sampah} belum ada`);
            error.statusCode = 404;
            throw error;
        }

        const currentOrder = await pickUp.create({
            idCustomer: loggedUser.idUser,
            idSampah: Sampah.idSampah
        });

        const Status = await statusPickUp.findOne({
            where:{
                idStatus: currentOrder.idStatus
            }
        })

        res.status(200).json({
            status: "success",
            message: "Make Order Successfull!",
            order:{
                idOrder:currentOrder.idPickUp,
                namaCustomer: loggedUser.fullName,
                status: Status.nameStatus,
                jenisSampah: sampah 
            }
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        })
    }
}

const seeOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const orderListData = await pickUp.findAll({
            where: {
                idStatus: 1
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if (loggedUser.role.nameRole != "DRIVER") {
            const error = new Error("List ini tidak dapat diakses oleh akun anda");
            error.statusCode = 403;
            throw error;
        }

        const orderList = orderListData.map(order => {
            return {
              idPickUp: order.idPickUp,
              nameStatus: order.statusPickUp.nameStatus,
              namaSampah: order.jenisSampah.nameSampah,
              nameCustomer: order.Customer.fullName
            }
          });

        res.status(200).json({
            status: "success",
            message: "Successfully Fetch Order List",
            orderList
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        })
    }
}

const historyOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);
        const {status} = req.params;

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const historyListData = await pickUp.findAll({
            where: {
                [Op.or]: [
                    {
                        idCustomer: loggedUser.idUser
                    },
                    {
                        idDriver: loggedUser.idUser
                    }
                ]
                
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'Driver',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'cancelUser',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        const historyList = historyListData.map(order => {
            return {
              idPickUp: order.idPickUp,
              nameStatus: order.statusPickUp.nameStatus,
              namaSampah: order.jenisSampah.nameSampah,
              nameCustomer: order.Customer.fullName,
              namaDriver: order.Driver ? order.Driver.fullName : undefined,
              berat_kg: order.berat_kg ? order.berat_kg : undefined,
              harga: order.harga ? order.harga : undefined,
              Cancel: {
                cancelBy: order.cancelUser ? order.cancelUser.fullName : undefined,
                cancelReason: order.cancelReason ? order.cancelReason : undefined
              }
            }
        });

        res.status(200).json({
            status: "success",
            message: `Successfully fetch History Order`,
            historyList
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        })
    }
}

const historyOrderByStatus = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);
        const {status} = req.params;

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const Status = await statusPickUp.findOne({
            where: {
                nameStatus: status
            }
        });

        if(Status == undefined){
            const error = new Error(`Status ${status} belum ada`);
            error.statusCode = 404;
            throw error;
        };

        const historyListData = await pickUp.findAll({
            where: {
                idStatus: Status.idStatus,
                [Op.or]: [
                    {
                        idCustomer: loggedUser.idUser
                    },
                    {
                        idDriver: loggedUser.idUser
                    }
                ]
                
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'Driver',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'cancelUser',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        const historyList = historyListData.map(order => {
            return {
              idPickUp: order.idPickUp,
              nameStatus: order.statusPickUp.nameStatus,
              namaSampah: order.jenisSampah.nameSampah,
              nameCustomer: order.Customer.fullName,
              namaDriver: order.Driver ? order.Driver.fullName : undefined,
              berat_kg: order.berat_kg ? order.berat_kg : undefined,
              harga: order.harga ? order.harga : undefined,
              Cancel: {
                cancelBy: order.cancelUser ? order.cancelUser.fullName : undefined,
                cancelReason: order.cancelReason ? order.cancelReason : undefined
              }
            }
        });

        res.status(200).json({
            status: "success",
            message: `Successfully fetch History Order Status ${status}`,
            historyList
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        })
    }
}

const detailOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);
        const {idOrder} = req.params;

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const currentOrder = await pickUp.findOne({
            where: {
                idPickUp: idOrder
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'Driver',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder == null){
            const error = new Error("Orderan tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder.idCustomer != loggedUser.idUser && currentOrder.idDriver !=  loggedUser.idUser){
            const error = new Error("Orderan ini tidak dapat diakses oleh akun anda");
            error.statusCode = 403;
            throw error;
        }

        res.status(201).json({
            status: "success",
            message: "Order Detail",
            order:{
                idOrder:currentOrder.idPickUp,
                namaCustomer: currentOrder.Customer.fullName,
                namaDriver: currentOrder.Driver ? currentOrder.Driver.fullName : " ",
                status: currentOrder.statusPickUp.nameStatus,
                jenisSampah: currentOrder.jenisSampah.nameSampah,
                cancelBy: currentOrder.cancelBy,
                cancelReason: currentOrder.cancelReason
            }
        })


    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        })
    }    
}

const takeOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);
        const {idOrder} = req.params;

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const currentOrder = await pickUp.findOne({
            where: {
                idPickUp: idOrder
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder == null){
            const error = new Error("Orderan tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if (loggedUser.role.nameRole != "DRIVER") {
            const error = new Error("Akun anda tidak dapat mengambil orderan");
            error.statusCode = 403;
            throw error;
        }

        if (currentOrder.idStatus!=1) {
            const error = new Error("Orderan telah diambil oleh driver lain atau dicancel");
            error.statusCode = 400;
            throw error;
        }

        currentOrder.idDriver = loggedUser.idUser;
        currentOrder.idStatus = 2;

        await currentOrder.save();
        await currentOrder.reload();

        res.status(200).json({
            status: "success",
            message: "Order Successfull!",
            order:{
                idOrder:currentOrder.idPickUp,
                namaCustomer: currentOrder.Customer.fullName,
                namaDriver: loggedUser.fullName,
                status: currentOrder.statusPickUp.nameStatus,
                jenisSampah: currentOrder.jenisSampah.nameSampah 
            }
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        })
    }    
}

const updateOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);
        const {idOrder} = req.params;

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const currentOrder = await pickUp.findOne({
            where: {
                idPickUp: idOrder
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'Driver',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder == null){
            const error = new Error("Orderan tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder.idDriver != loggedUser.idUser && loggedUser.role.nameRole != "DRIVER"){
            const error = new Error("Akun anda tidak mengakses orderan ini");
            error.statusCode = 403;
            throw error;
        }

        if (currentOrder.idStatus != 2){
            const error = new Error("Terdapat kesalahan dalam orderan. Pastikan Status Dalam 'MENUJU'");
            error.statusCode = 400;
            throw error;
        }

        currentOrder.idStatus = 3;

        await currentOrder.save();
        await currentOrder.reload();


        res.status(200).json({
            status: "success",
            message: "Updating Status to PENGECEKAN",
            order:{
                idOrder:currentOrder.idPickUp,
                namaCustomer: currentOrder.Customer.fullName,
                namaDriver: currentOrder.Driver.fullName,
                status: currentOrder.statusPickUp.nameStatus,
                jenisSampah: currentOrder.jenisSampah.nameSampah 
            }
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        })
    }
}

const finishOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);
        const {idOrder} = req.params;
        const {
            harga, berat
        } =  req.body;

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const currentOrder = await pickUp.findOne({
            where: {
                idPickUp: idOrder
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer'
                },
                {
                    model: User,
                    as: 'Driver',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder == null){
            const error = new Error("Orderan tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder.idDriver != loggedUser.idUser && loggedUser.role.nameRole != "DRIVER"){
            const error = new Error("Akun anda tidak mengakses orderan ini");
            error.statusCode = 403;
            throw error;
        }

        if (currentOrder.idStatus != 3){
            const error = new Error("Terdapat kesalahan dalam orderan. Pastikan Status Dalam 'PENGECEKAN'");
            error.statusCode = 400;
            throw error;
        }

        await currentOrder.Customer.increment('saldo', { by: harga });

        currentOrder.idStatus = 4;
        currentOrder.harga = harga;
        currentOrder.berat_kg = berat

        await currentOrder.save();
        await currentOrder.reload();

        res.status(200).json({
            status: "success",
            message: "Finish the Order",
            order:{
                namaCustomer: currentOrder.Customer.fullName,
                namaDriver: loggedUser.fullName,
                status: currentOrder.statusPickUp.nameStatus,
                jenisSampah: currentOrder.jenisSampah.nameSampah,
                harga: currentOrder.harga,
                berat: currentOrder.berat_kg + ' Kg'
            }
        })


    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        })
    }    
}

//not yet
const cancelOrder = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        let token;
        if(authorization !== null & authorization.startsWith("Bearer ")){
            token = authorization.substring(7); 
        }else{  
            const error = new Error("Perlu Login");
            error.statusCode = 403;
            throw error;
        }
      
        const decoded = jwt.verify(token, key);

        const {
            reason
        } = req.body;

        const {idOrder} = req.params;

        const loggedUser = await User.findOne({
            where: {
                idUser: decoded.Id,
            },
            include: {
              model: Role,
              attributes: ['nameRole']
            }
        });

        const currentOrder = await pickUp.findOne({
            where: {
                idPickUp: idOrder
            },
            include: [
                {
                    model:  statusPickUp,
                    attributes: ['nameStatus']
                },
                {
                    model: jenisSampah,
                    attributes: ['nameSampah']
                },
                {
                    model: User,
                    as: 'Customer',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'Driver',
                    attributes: ['fullName']
                },
                {
                    model: User,
                    as: 'cancelUser',
                    attributes: ['fullName']
                }
            ]
        });

        if(loggedUser == null){
            const error = new Error("Akun anda tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder == null){
            const error = new Error("Orderan tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        if(currentOrder.idCustomer != loggedUser.idUser && currentOrder.idDriver !=  loggedUser.idUser){
            const error = new Error("Orderan ini tidak dapat diakses oleh akun anda");
            error.statusCode = 403;
            throw error;
        }

        if (currentOrder.statusPickUp.nameStatus == "CANCEL") {
            const error = new Error("Orderan telah dicancel sebelumnya");
            error.statusCode = 400;
            throw error;
        }

        if(currentOrder.statusPickUp.nameStatus == "SELESAI") {
            const error = new Error("Orderan telah selesai. Tidak dapat dicancel");
            error.statusCode = 400;
            throw error;
        }

        currentOrder.cancelBy = loggedUser.idUser;
        currentOrder.cancelReason = reason;
        currentOrder.idStatus = 5;
        
        await currentOrder.save();
        await currentOrder.reload();

        res.status(200).json({
            status: "success",
            message: "Order canceled successfully",
            order:{
                idOrder:currentOrder.idPickUp,
                namaCustomer: currentOrder.Customer.fullName,
                namaDriver: currentOrder.Driver ? currentOrder.Driver.fullName : " ",
                status: currentOrder.statusPickUp.nameStatus,
                jenisSampah: currentOrder.jenisSampah.nameSampah,
                cancel:{
                    cancelBy: currentOrder.cancelUser.fullName,
                    cancelReason: currentOrder.cancelReason
                }
            }
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        })
    }    
}

module.exports = {makeOrder, seeOrder, historyOrder, historyOrderByStatus, detailOrder, takeOrder, updateOrder, finishOrder, cancelOrder}