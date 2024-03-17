const logger = require("firebase-functions/logger");
const express = require("express");
const {CreateUser} = require("../../models/users");
const {createUser} = require("../../models/firestore/users");
const UserError = require("../../models/Errors/UserError");

// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    logger.info(`Creating user... ${req.body}`);
    const userData = new CreateUser(req.body.name, req.body.email, req.body.password, req.body.phone);
    await createUser(userData);
    res.status(201).send(`User ${userData.email} created.`);
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send("Email already exists.");
    } else {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = router;
