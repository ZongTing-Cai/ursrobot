const logger = require("firebase-functions/logger");
const express = require("express");
const {getUserByName} = require("../../models/firestore/users");
const authenticateToken = require("../../models/authenticateToken");

// eslint-disable-next-line new-cap
const router = express.Router();


router.get("/:name", authenticateToken, async (req, res) => {
  const name = req.params.name;
  const user = await getUserByName(name);
  if (user === null) {
    logger.error(`User not found: ${name}`);
    res.status(404).send("User not found");
  } else {
    res.status(200).json(user.toJSObject());
  }
});

module.exports = router;
