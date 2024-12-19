import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

class FileController {
  constructor(fileService, logger) {
    this.fileService = fileService;
    this.logger = logger;
  }

  async handleFileUpload(req, res) {
    try {
      if (!req.file) {
        return res.json(formatResponse(
          ResponseCode.ERROR,
          '没有文件被上传'
        ), HttpStatus.BAD_REQUEST);
      }
      const result = await this.fileService.uploadFile(req.file);
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        result
      ));
    } catch (err) {
      this.logger.error(`文件上传错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }

  async handleFileDelete(req, res) {
    try {
      const { fileKey } = req.params;
      const result = await this.fileService.deleteFile(fileKey);
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        result
      ));
    } catch (err) {
      this.logger.error(`文件删除错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }

  async handleGetFileUrl(req, res) {
    try {
      const { fileKey } = req.params;
      const { expiresIn } = req.query;
      const result = await this.fileService.getSignedUrl(
        fileKey,
        parseInt(expiresIn) || 3600
      );
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        result
      ));
    } catch (err) {
      this.logger.error(`获取文件URL错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }
}

export default FileController; 