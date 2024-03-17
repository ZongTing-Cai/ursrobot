const express = require("express");
const login = require("./API/User/Login");
const createUser = require("./API/User/CreateUser");
const getUser = require("./API/User/GetUser");
const updateUser = require("./API/User/UpdateUser");
const deleteUser = require("./API/User/DeleteUser");


// eslint-disable-next-line new-cap
const router = express.Router();


router.use("/login", login);
router.use("/user", createUser);
router.use("/user", getUser);
router.use("/user", updateUser);
router.use("/user", deleteUser);

module.exports = router;
