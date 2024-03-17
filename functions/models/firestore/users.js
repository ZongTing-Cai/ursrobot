const {db} = require("../firebase_functions");
const logger = require("firebase-functions/logger");
const {User} = require("../users");
const UserError = require("../Errors/UserError");

/**
 * 從資料庫取得使用者資料
 * @param {string} name
 * @return {Promise<User|null>}
 */
async function getUserByName(name) {
  const users = await db.collection("users").where("name", "==", name).get();
  if (users.empty) {
    logger.warn(`User ${name} not found`);
    return null;
  }
  const firestoreUser = users.docs[0].data();
  logger.debug(`User data: ${JSON.stringify(firestoreUser)}`);
  return new User({...firestoreUser});
}

/**
 * 從Firestore資料庫中獲取用戶資料。
 * @param {string} userEmail 用戶的電子郵件地址，用作檢索用戶資料的唯一標識。
 * @return {Promise<User>} 當從Firestore資料庫中成功獲取用戶資料時，返回一個包含用戶資料的Promise對象。
 */
async function getUserByEmail(userEmail) {
  const users = await db.collection("users")
      .where("email", "==", userEmail).get();
  try {
    if (users.empty === false) {
      logger.info(`User data retrieved: ${JSON.stringify(users.docs[0].data())}`);
      return new User({...users.docs[0].data()});
    } else {
      logger.info(`No user found with email: ${userEmail}`);
      return null;
    }
  } catch (error) {
    logger.error(`Error getting user data: ${error}`);
    throw error; // 將錯誤向上拋出，以便進行錯誤處理
  }
}


/**
 * 從Firestore資料庫中獲取用戶資料。
 * @param {string} uuid 用戶的uuid，用作檢索用戶資料的唯一標識。
 * @return {Promise<User>} 當從Firestore資料庫中成功獲取用戶資料時，返回一個包含用戶資料的Promise對象。
 */
async function getUserByUUID(uuid) {
  const userRef = db.collection("users").doc(uuid);
  const userDoc = await userRef.get();
  if (userDoc.exists) {
    logger.info(`User data retrieved: ${JSON.stringify(userDoc.data())}`);
    return new User({...userDoc.data()});
  } else {
    logger.info(`No user found with uuid: ${uuid}`);
    return null;
  }
}

/**
 * 將用戶資料保存到Firestore資料庫。
 * @param {CreateUser} userData 用戶資料。
 * @return {Promise<void>} 當用戶資料保存到Firestore資料庫時，返回一個Promise對象。
 */
async function createUser(userData) {
  const userRef = db.collection("users").doc(userData.uuid);
  if (await getUserByEmail(userData.email) !== null) {
    const errorCode = "auth/email-already-exists";
    const errorMessage = "The email address is already in use by " + "another account.";
    throw new UserError(errorCode, errorMessage);
  } else {
    logger.info(`Creating user, User data: 
    ${userData.toJSObject()}`);
    await userRef.set(userData.toJSObject());
    logger.info(`User ${userData.email} created.`);
  }
}

/**
 * 將更新用戶資料保存到Firestore資料庫。
 * @param {string} uuid 用戶的uuid。
 * @param {User} userData 用戶資料。
 * @return {Promise<void>} 當用戶資料保存到Firestore資料庫時，返回一個Promise對象。
 */
async function updateUser(uuid, userData) {
  const userRef = db.collection("users").doc(uuid);
  logger.info(`Updating user, User data: 
  ${userData.toJSObject()}`);
  await userRef.update(userData.toJSObject());
  logger.info(`User ${userData.email} updated.`);
}

/**
 * 從Firestore資料庫中刪除用戶資料。
 * @param {string} uuid 用戶的uuid。
 * @return {Promise<void>} 當用戶資料從Firestore資料庫中成功刪除時，返回一個Promise對象。
 */
async function deleteUser(uuid) {
  const userRef = db.collection("users").doc(uuid);
  await userRef.delete();
  logger.info(`User ${uuid} deleted.`);
}

module.exports = {
  getUserByName, getUserByEmail, createUser, updateUser,
  deleteUser, getUserByUUID,
};
