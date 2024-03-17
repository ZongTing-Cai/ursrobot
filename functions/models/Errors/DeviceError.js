/**
 * Error class for device errors
 * @class
 * @extends Error
 */
class DeviceError extends Error {
  /**
   * 建構函數，創建一個設備錯誤實例。
   * @param {string} code - 錯誤代碼
   * @param {string} message - 錯誤信息
   */
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

module.exports = DeviceError;
