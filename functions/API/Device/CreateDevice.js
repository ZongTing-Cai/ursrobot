const logger = require("firebase-functions/logger");
const express = require("express");
const {CreateDevice} = require("../../models/device"); // 修改引用路徑及類別名
const {createDevice} = require("../../models/firestore/device"); // 修改引用函式
const DeviceError = require("../../models/Errors/DeviceError"); // 修改錯誤處理類別
const authenticateToken = require("../../models/authenticateToken");


// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    logger.info(`Creating device... ${JSON.stringify(req.body)}`);
    const deviceData = new CreateDevice(req.body.model, req.body.version, req.body.status);
    await createDevice(deviceData);
    res.status(201).send(`Device ${deviceData.model} created.`);
  } catch (error) {
    if (error instanceof DeviceError) {
      // 假設 DeviceError 是針對設備創建過程中特有的錯誤
      res.status(400).send(error.message); // 使用從錯誤實例中獲取的消息
    } else {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = router;
