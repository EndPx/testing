const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload_file');

const { 
  postUser, loginHandler, editUserAccount, getUserByToken
} = require('../controller/user');

const {
  makeOrder, seeOrder, historyOrder, historyOrderByStatus, detailOrder, takeOrder, updateOrder, finishOrder, cancelOrder
} = require('../controller/pickUp')

const {
  sendChat, receiveChat
} = require('../controller/chat')

//Register new User
router.post("/register", postUser);

//Login user
router.post("/login", loginHandler);

//edit user
router.put("/user-account", upload.single('image'), editUserAccount);

//dapat data dari token
router.get("/user-token", getUserByToken);

//melihat detail orderan
router.get("/detail-order/:idOrder", detailOrder);

//buat order(untuk role customer)
router.post("/make-order", makeOrder);

//melihat orderan yang status mencari driver
router.get("/see-order", seeOrder);

//melihat history order
router.get("/history-order", historyOrder)

//melihat history order dari status
router.get("/history-order/:status", historyOrderByStatus)

//mengambil orderan(untuk role driver)
router.put("/take-order/:idOrder", takeOrder);

//update status to PENGECEKAN(untuk role driver)
router.put("/update-status-order/:idOrder", updateOrder);

//update status ke SELESAI(untuk role driver)
router.put("/finish-order/:idOrder", finishOrder);

//cancel order(untuk role customer dan driver)
router.put("/cancel-order/:idOrder", cancelOrder);

//kirim chat
router.post("/send-chat/:idOrder", sendChat);

//terima chat
router.get("/receive-chat/:idOrder", receiveChat);

module.exports = router;