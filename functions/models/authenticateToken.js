const jwt = require("jsonwebtoken");
const {logger} = require("firebase-functions/v2");
const {getUserByUUID} = require("./firestore/users");

// 用middleware驗證token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    logger.debug("authHeader: ", authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    logger.debug("token: ", token);
    if (token == null) return res.sendStatus(401); // 如果没有token，返回401
    const jwtPayload = jwt.verify(token, "ursrobot");
    logger.debug("jwtPayload: ", jwtPayload);
    const user = await getUserByUUID(jwtPayload["payload"]["uuid"]);
    if (user) {
      req.user = user;
      next();
    } else {
      return res.sendStatus(403);
    }
  } catch (error) {
    logger.error("error: ", error);
    return res.sendStatus(403);
  }
};

module.exports = authenticateToken;
