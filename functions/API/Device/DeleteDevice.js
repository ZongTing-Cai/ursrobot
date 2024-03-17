const logger = require("firebase-functions/logger");
const express = require("express");
const {getDeviceByUUID, deleteDevice} = require("../../models/firestore/device");
const authenticateToken = require("../../models/authenticateToken");

// eslint-disable-next-line new-cap
const router = express.Router();


router.delete("/:uuid", authenticateToken, async (req, res) => {
  const deviceUUID = req.params.uuid;
  const device = await getDeviceByUUID(deviceUUID);
  if (device === null) {
    logger.error(`Device not found: ${deviceUUID}`);
    res.status(404).send("Device not found");
  } else {
    try {
      await deleteDevice(device.uuid);
      res.status(200).send(`Device ${deviceUUID} deleted`);
    } catch (error) {
      logger.error(`Error deleting device: ${deviceUUID}`);
      res.status(500).send("Error deleting device");
    }
  }
});

module.exports = router;
