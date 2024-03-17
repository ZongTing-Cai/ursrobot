const logger = require("firebase-functions/logger");
const express = require("express");
const {getDeviceByUUID} = require("../../models/firestore/device");
const authenticateToken = require("../../models/authenticateToken");

// eslint-disable-next-line new-cap
const router = express.Router();


router.get("/:uuid", authenticateToken, async (req, res) => {
  const uuid = req.params.uuid;
  const device = await getDeviceByUUID(uuid);
  if (device === null) {
    logger.error(`User not found: ${uuid}`);
    res.status(404).send("Device not found");
  } else {
    res.status(200).json(device.toJSObject());
  }
});

module.exports = router;
