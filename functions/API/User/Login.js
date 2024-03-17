const logger = require("firebase-functions/logger");
const express = require("express");
const {getUserByEmail} = require("../../models/firestore/users");
const {getToken} = require("../../models/firebase_functions");

// eslint-disable-next-line new-cap
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    logger.info(`User ${req.body.email} logged in.`);
    const firestoreUser = await getUserByEmail(req.body.email);
    if (firestoreUser) {
      if (firestoreUser.loginCheck(req.body.password)) {
        const token = getToken(firestoreUser);
        res.status(200).json({"token": token});
      } else {
        res.status(401).send("Incorrect password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
