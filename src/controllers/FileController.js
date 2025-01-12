import { ResponseCode, ResponseMessage, HttpStatus } from '../common/GlobalConstants.js';
import ResponseDTO from '../models/ResponseDTO.js';

class FileController {
  constructor(fileService) {
    this.fileService = fileService;
  }

  async handleFileUpload(context) {
    try {
      const file = context.getRequest().file;
      if (!file) {
        return ResponseDTO.businessError(ResponseCode.ERROR, '没有文件被上传');
      }

      const result = await this.fileService.uploadFile(file);
      return ResponseDTO.success(result);
    } catch (err) {
      context.error(`文件上传错误: ${err.message}`);
      return ResponseDTO.serverError(err.message);
    }
  }

  async handleFileDelete(context) {
    try {
      const { fileKey } = context.getParams();
      const result = await this.fileService.deleteFile(fileKey);
      return ResponseDTO.success(result);
    } catch (err) {
      context.error(`文件删除错误: ${err.message}`);
      return ResponseDTO.serverError(err.message);
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
      return ResponseDTO.success(result);
    } catch (err) {
      context.error(`获取文件URL错误: ${err.message}`);
      return ResponseDTO.serverError(err.message);
    }
  }
}

export default FileController; 