import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

class FileController {
  constructor(fileService) {
    this.fileService = fileService;
  }

  async handleFileUpload(context) {
    try {
      const file = context.getRequest().file;
      if (!file) {
        return context.getResponse().json(formatResponse(
          ResponseCode.ERROR,
          '没有文件被上传'
        ), HttpStatus.BAD_REQUEST);
      }

      const result = await this.fileService.uploadFile(file);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        result
      ));
    } catch (err) {
      context.error(`文件上传错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }

  async handleFileDelete(context) {
    try {
      const { fileKey } = context.getParams();
      const result = await this.fileService.deleteFile(fileKey);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        result
      ));
    } catch (err) {
      context.error(`文件删除错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }

  async handleGetFileUrl(context) {
    try {
      const { fileKey } = context.getParams();
      const { expiresIn } = context.getQuery();
      const result = await this.fileService.getSignedUrl(
        fileKey,
        parseInt(expiresIn) || 3600
      );
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        result
      ));
    } catch (err) {
      context.error(`获取文件URL错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }
}

export default FileController; 