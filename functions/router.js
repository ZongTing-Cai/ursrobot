const express = require("express");
const login = require("./API/User/Login");
const createUser = require("./API/User/CreateUser");
const getUser = require("./API/User/GetUser");
const updateUser = require("./API/User/UpdateUser");
const deleteUser = require("./API/User/DeleteUser");
const createDevice = require("./API/Device/CreateDevice");
const deleteDevice = require("./API/Device/DeleteDevice");
const getDevice = require("./API/Device/GetDevice");
const updateDevice = require("./API/Device/UpdateDevice");


// eslint-disable-next-line new-cap
const router = express.Router();


router.use("/login", login);
router.use("/user", createUser);
router.use("/user", getUser);
router.use("/user", updateUser);
router.use("/user", deleteUser);
router.use("/device", createDevice);
router.use("/device", deleteDevice);
router.use("/device", getDevice);
router.use("/device", updateDevice);

module.exports = router;
