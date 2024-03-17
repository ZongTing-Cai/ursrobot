/**
 * 這是Firebase Cloud Functions的進入點
 */
const functions = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router");

logger.info("Firebase Admin SDK initialized.");


const app = express();
app.use(cors({origin: true}));
app.use(cookieParser());
app.use("/api", router);


exports.api = functions.onRequest({
  region: "asia-east1",
}, app);
