const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const jwt = require("jsonwebtoken");
const {User} = require("../models/users");

/**
 * Initialize the firebase admin SDK
 */

if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Get the firestore database
 * @type {firestore.Firestore}
 */
const db = admin.firestore();

/**
 * Get the authentication service
 * @type {auth.Auth}
 */
const auth = admin.auth();

/**
 * get the token for the user
 * @param {User} user the user object
 * @return {string} the jwt token
 */
function getToken(user) {
  const payload = {
    uuid: user.uuid,
    email: user.email,
  };
  const token = jwt.sign({payload}, "ursrobot", {expiresIn: "1h"});
  logger.debug(`token: ${token}`);
  return token;
}

/**
 * verify the token
 * @param {string} token the jwt token
 * @return {boolean} true if the token is valid, false otherwise
 */
function verifyToken(token) {
  try {
    const jwtPayload= jwt.verify(token, "ursrobot");
    logger.debug(`jwtPayload: ${jwtPayload}`);
    return true;
  } catch (e) {
    return false;
  }
}


module.exports = {
  db,
  auth,
  getToken,
  verifyToken,
};
