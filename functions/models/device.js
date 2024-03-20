const {logger} = require("firebase-functions/v2");
const {v4: uuidv4} = require("uuid");

/**
 * 代表一個物聯網設備的類別。
 * @class
 */
class CreateDevice {
  /**
   * 創建一個物聯網設備實例。
   * @param {string} model 設備型號。
   * @param {string} version 設備版本。
   * @param {string} status 設備狀態。
   */
  constructor(model, version, status) {
    this.uuid = uuidv4(); // 設備的唯一標識符
    this.model = model;
    this.version = version;
    this.status = status;
  }

  /**
   * 更新設備狀態。
   * @param {string} newStatus 新的設備狀態。
   */
  updateStatus(newStatus) {
    this.status = newStatus;
    logger.debug(`設備:${this.uuid}, 狀態更新為：${this.status}`);
  }

  /**
   * 將設備實例轉換為JSON字符串。
   * @return {string} 代表設備實例的JSON字符串。
   */
  toJSON() {
    return JSON.stringify({
      uuid: this.uuid,
      model: this.model,
      version: this.version,
      status: this.status,
    });
  }

  /**
   * 將設備實例轉換為JavaScript物件。
   * @return {Object} 代表設備實例的JavaScript物件。
   */
  toJSObject() {
    return {
      uuid: this.uuid,
      model: this.model,
      version: this.version,
      status: this.status,
    };
  }
}

/**
 * 代表一個物聯網設備的類別。
 * @class
 */
class Device {
  /**
   * 創建一個物聯網設備實例。
   * @param {string} uuid 設備的唯一標識符。
   * @param {string} model 設備型號。
   * @param {string} version 設備版本。
   * @param {string} status 設備狀態。
   */
  constructor({uuid, model, version, status}) {
    this.uuid = uuid;
    this.model = model;
    this.version = version;
    this.status = status;
  }

  /**
   * 更新設備資料。
   * @param {Object} updateObject 用於更新設備資料的物件。
   */
  update(updateObject) {
    for (const key in this) {
      if (key === "uuid") {
        continue;
      }
      if (updateObject[key] !== undefined) {
        logger.debug(`更新設備資料：${key} = ${updateObject[key]}`);
        this[key] = updateObject[key];
      }
    }
    logger.debug(`更新後的設備資料：${this.toJSON()}`);
  }

  /**
   * 將設備實例轉換為JSON字符串。
   * @return {string} 代表設備實例的JSON字符串。
   */
  toJSON() {
    return JSON.stringify({
      uuid: this.uuid,
      model: this.model,
      version: this.version,
      status: this.status,
    });
  }

  /**
   * 將設備實例轉換為JavaScript物件。
   * @return {Object} 代表設備實例的JavaScript物件。
   */
  toJSObject() {
    return {
      uuid: this.uuid,
      model: this.model,
      version: this.version,
      status: this.status,
    };
  }
}


module.exports = {CreateDevice, Device};
