import { HttpStatus, ResponseCode, ResponseMessage } from '../common/GlobalConstants.js';

/**
 * 响应数据传输对象
 */
class ResponseDTO {
  constructor(httpStatus, code, msg, data = null) {
    this.httpStatus = httpStatus;
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  /**
   * 检查响应是否成功
   * @returns {boolean}
   */
  isSuccess() {
    return this.httpStatus === HttpStatus.OK && this.code === ResponseCode.SUCCESS;
  }

  /**
   * 转换为JSON响应格式
   * @returns {Object}
   */
  toResponse() {
    return {
      code: this.code,
      msg: this.msg,
      data: this.data
    };
  }

  /**
   * 创建成功响应
   * @param {any} data - 响应数据
   * @returns {ResponseDTO}
   */
  static success(data = null) {
    return new ResponseDTO(HttpStatus.OK, ResponseCode.SUCCESS, ResponseMessage.SUCCESS, data);
  }

  /**
   * 创建成功响应
   * @param {number} httpStatus - HTTP状态码
   * @param {number} code - 业务错误码
   * @param {string} msg - 错误信息
   * @param {any} data - 错误详细数据
   * @returns {ResponseDTO}
   */
  static businessError(code, msg, data = null) {
    return new ResponseDTO(HttpStatus.OK, code, msg, data);
  }

  /**
   * 创建错误响应
   * @param {number} httpStatus - HTTP状态码
   * @param {number} code - 业务错误码
   * @param {string} msg - 错误信息
   * @param {any} data - 错误详细数据
   * @returns {ResponseDTO}
   */
  static error(httpStatus, code, msg, data = null) {
    return new ResponseDTO(httpStatus, code, msg, data);
  }

  /**
   * 创建未授权响应
   * @param {string} message - 错误信息
   * @returns {ResponseDTO}
   */
  static unauthorized(message = 'Unauthorized') {
    return new ResponseDTO(
      HttpStatus.UNAUTHORIZED,
      ResponseCode.UNAUTHORIZED,
      ResponseMessage.UNAUTHORIZED,
      { message }
    );
  }

  /**
   * 创建服务器错误响应
   * @param {string} message - 错误信息
   * @returns {ResponseDTO}
   */
  static serverError(message = 'Internal Server Error') {
    return new ResponseDTO(
      HttpStatus.INTERNAL_ERROR,
      ResponseCode.ERROR,
      ResponseMessage.SERVER_ERROR,
      { message }
    );
  }

  /**
   * 创建未找到响应
   * @param {string} message - 错误信息
   * @returns {ResponseDTO}
   */
  static notFound(message = 'Not Found') {
    return new ResponseDTO(HttpStatus.NOT_FOUND, ResponseCode.NOT_FOUND, ResponseMessage.NOT_FOUND, { message });
  }
}

export default ResponseDTO; 
