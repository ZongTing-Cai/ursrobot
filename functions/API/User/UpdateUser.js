const logger = require("firebase-functions/logger");
const express = require("express");
const {getUserByName, updateUser} = require("../../models/firestore/users");
const authenticateToken = require("../../models/authenticateToken");

// eslint-disable-next-line new-cap
const router = express.Router();


router.put("/:name", authenticateToken, async (req, res) => {
  const name = req.params.name;
  const user = await getUserByName(name);
  if (user === null) {
    logger.error(`User not found: ${name}`);
    res.status(404).send("User not found");
  } else {
    try {
      const data = req.body;
      user.update({name: data.name, email: data.email});
      await updateUser(user.uuid, user);
      res.status(200).json(user.toJSObject());
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      res.status(500).send("Error updating user");
    }
  }
});

module.exports = router;
