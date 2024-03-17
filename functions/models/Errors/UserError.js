/**
 * Error class for user errors
 * @class
 * @extends Error
 */
class UserError extends Error {
  /**
   * @param {string} code - Error code
   * @param {string} message - Error message
   */
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

module.exports = UserError;
