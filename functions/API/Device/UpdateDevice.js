const logger = require("firebase-functions/logger");
const express = require("express");
const {getDeviceByUUID, updateDevice} = require("../../models/firestore/device");
const authenticateToken = require("../../models/authenticateToken");

// eslint-disable-next-line new-cap
const router = express.Router();


router.put("/:uuid", authenticateToken, async (req, res) => {
  const uuid = req.params.uuid;
  const device = await getDeviceByUUID(uuid);
  if (device === null) {
    logger.error(`Device not found: ${uuid}`);
    res.status(404).send("Device not found");
  } else {
    try {
      const data = req.body;
      device.update({
        model: data.model, version: data.version, status: data.status,
      });
      await updateDevice(device.uuid, device);
      res.status(200).json(device.toJSObject());
    } catch (error) {
      logger.error(`Error updating device: ${error}`);
      res.status(500).send("Error updating device");
    }
  }
});

module.exports = router;
