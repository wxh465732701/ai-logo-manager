import { ResponseCode, ResponseMessage, HttpStatus } from '../common/GlobalConstants.js';
import ResponseDTO from '../models/ResponseDTO.js';

class UserExtendController {
  constructor(userExtendService) {
    this.userExtendService = userExtendService;
  }

  /**
   * 更新用户基本信息
   * @param {RequestContext} context - 请求上下文
   */
  async handleUpdateUserBase(context) {
    try {
      const userId = context.getUser().user_id;
      const { notifyStatus, lastViewedPage } = context.getBody();

      await this.userExtendService.updateUserBase(userId, notifyStatus, lastViewedPage);
      
      return ResponseDTO.success();
    } catch (err) {
      context.error(`更新用户基本信息失败: ${err.message}`);
      return ResponseDTO.serverError(err.message);
    }
  }
}

export default UserExtendController; 