const logger = require("firebase-functions/logger");
const express = require("express");
const {getUserByName, deleteUser} = require("../../models/firestore/users");
const authenticateToken = require("../../models/authenticateToken");

// eslint-disable-next-line new-cap
const router = express.Router();


router.delete("/:name", authenticateToken, async (req, res) => {
  const name = req.params.name;
  const user = await getUserByName(name);
  if (user === null) {
    logger.error(`User not found: ${name}`);
    res.status(404).send("User not found");
  } else {
    try {
      await deleteUser(user.uuid, user);
      res.status(200).send(`User ${name} deleted`);
    } catch (error) {
      logger.error(`Error deleting user: ${name}`);
      res.status(500).send("Error deleting user");
    }
  }
});

module.exports = router;
