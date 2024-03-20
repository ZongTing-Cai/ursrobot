const bcrypt = require("bcrypt");
const {logger} = require("firebase-functions/v2");
const saltRounds = 10; // 加密強度
const {v4: uuidv4} = require("uuid");


/**
 * 代表一個用戶的類別，用於創建用戶並加密用戶密碼。
 * @class
 */
class CreateUser {
  /**
   * 創建一個用戶實例。
   * @param {string} name 用戶的名字。
   * @param {string} email 用戶的電子郵件地址。
   * @param {string} password 用戶的密碼。
   * @param {string} phone 用戶的電話號碼。
   */
  constructor(name, email, password, phone) {
    this.uuid = uuidv4();
    this.name = name;
    this.email = email;
    this.password = this.encryptPassword(password); // 加密密碼
    this.phone = phone;
  }

  /**
   * 使用bcrypt對密碼進行加密。
   * @param {string} password 要加密的密碼。
   * @return {string} 加密後的密碼。
   */
  encryptPassword(password) {
    if (password === undefined) {
      return "";
    }
    // 同步方式加密密碼
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * 將用戶實例轉換為JSON字符串。
   * @return {string} 代表用戶實例的JSON字符串。
   */
  toJSON() {
    return JSON.stringify({
      uuid: this.uuid,
      name: this.name,
      email: this.email,
      password: this.password, // 注意：這將是加密後的密碼
      phone: this.phone,
    });
  }

  /**
   * 將用戶實例轉換為JavaScript物件。
   * @return {Object} 代表用戶實例的JavaScript物件。
   */
  toJSObject() {
    return {
      uuid: this.uuid,
      name: this.name,
      email: this.email,
      password: this.password, // 注意：這將是加密後的密碼
      phone: this.phone,
    };
  }
}

/**
 * 代表一個用戶的類別。
 */
class User {
  /**
   * 創建一個用戶實例。
   * @param {string} uuid 用戶的唯一標識符。
   * @param {string} name 用戶的名字。
   * @param {string} email 用戶的電子郵件地址。
   * @param {string} password 用戶的密碼。
   * @param {string} phone 用戶的電話號碼。
   */
  constructor({uuid, name, email, password, phone}) {
    this.uuid = uuid;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }

  /**
   * 登入檢查。
   * @param {string} plainPassword 用戶的明文密碼。
   * @return {boolean} 返回比較結果。
   */
  loginCheck(plainPassword) {
    return this.comparePassword(plainPassword);
  }

  /**
   * 比較提供的密碼是否與用戶的加密密碼相匹配。
   * @param {string} candidatePassword 提供的密碼。
   * @return {boolean} 返回比較結果。
   */
  comparePassword(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
  }

  /**
   * 將用戶實例轉換為JSON字符串。
   * @return {string} 代表用戶實例的JSON字符串。
   */
  toJSON() {
    return JSON.stringify({
      uuid: this.uuid, name: this.name, email: this.email, phone: this.phone,
    });
  }

  /**
   * 將用戶實例轉換為JavaScript物件。
   * @return {Object} 代表用戶實例的JavaScript物件。
   */
  toJSObject() {
    return {
      uuid: this.uuid, name: this.name, email: this.email, phone: this.phone,
    };
  }

  /**
   * 更新用戶資料。
   * @param {Object} updateObject 用於更新用戶資料的物件。
   */
  update(updateObject) {
    for (const key in this) {
      if (key === "uuid") {
        continue;
      }
      if (updateObject[key] !== undefined) {
        logger.debug(`更新用戶資料：${key} = ${updateObject[key]}`);
        this[key] = updateObject[key];
      }
    }
    logger.debug(`更新後的用戶資料：${this.toJSON()}`);
  }
}


module.exports = {CreateUser, User};
