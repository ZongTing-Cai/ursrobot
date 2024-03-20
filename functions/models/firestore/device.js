const {db} = require("../firebase_functions");
const logger = require("firebase-functions/logger");
const {Device} = require("../device");
const DeviceError = require("../Errors/DeviceError");

/**
 * 從資料庫取得特定型號的所有設備資料
 * @param {string} model 設備型號。
 * @return {Promise<Array<Device>>} 符合型號的設備列表。
 */
async function getDevicesByModel(model) {
  const devicesQuerySnapshot = await db.collection("devices").where("model", "==", model).get();
  if (devicesQuerySnapshot.empty) {
    logger.warn(`Devices with model ${model} not found`);
    return [];
  }
  return devicesQuerySnapshot.docs.map((doc) => {
    const deviceData = doc.data();
    logger.debug(`Device data: ${JSON.stringify(deviceData)}`);
    return new Device({...deviceData});
  });
}


/**
 * 從Firestore資料庫中獲取設備資料。
 * @param {string} uuid 設備的uuid，用作檢索設備資料的唯一標識。
 * @return {Promise<Device>} 當從Firestore資料庫中成功獲取設備資料時，返回一個包含設備資料的Promise物件。
 */
async function getDeviceByUUID(uuid) {
  const deviceRef = db.collection("devices").doc(uuid);
  const deviceDoc = await deviceRef.get();
  if (deviceDoc.exists) {
    logger.info(`Device data retrieved: ${JSON.stringify(deviceDoc.data())}`);
    return new Device({...deviceDoc.data()});
  } else {
    logger.info(`No device found with uuid: ${uuid}`);
    return null;
  }
}

/**
 * 將設備資料保存到Firestore資料庫。
 * @param {CreateDevice} deviceData 設備資料。
 * @return {Promise<void>} 當設備資料保存到Firestore資料庫時，返回一個Promise物件。
 */
async function createDevice(deviceData) {
  const deviceRef = db.collection("devices").doc(deviceData.uuid);
  logger.info(`Creating device, Device data: 
    ${deviceData.toJSObject()}`);
  await deviceRef.set(deviceData.toJSObject());
  logger.info(`Device ${deviceData.model} created.`);
}

/**
 * 將更新設備資料保存到Firestore資料庫。
 * @param {string} uuid 設備的uuid。
 * @param {Device} deviceData 設備資料。
 * @return {Promise<void>} 當設備資料保存到Firestore資料庫時，返回一個Promise物件。
 */
async function updateDevice(uuid, deviceData) {
  const deviceRef = db.collection("devices").doc(uuid);
  logger.info(`Updating device, Device data: 
  ${deviceData.toJSObject()}`);
  await deviceRef.update(deviceData.toJSObject());
  logger.info(`Device ${deviceData.model} updated.`);
}

/**
 * 從Firestore資料庫中刪除設備資料。
 * @param {string} uuid 設備的uuid。
 * @return {Promise<void>} 當設備資料從Firestore資料庫中成功刪除時，返回一個Promise物件。
 */
async function deleteDevice(uuid) {
  const deviceRef = db.collection("devices").doc(uuid);
  await deviceRef.delete();
  logger.info(`Device ${uuid} deleted.`);
}

module.exports = {
  getDevicesByModel, getDeviceByUUID, createDevice, updateDevice, deleteDevice,
};
