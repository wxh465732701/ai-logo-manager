import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';
import { VipType } from '../common/GlobalConstants.js';

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

      const userExtend = await this.userExtendService.updateUserBase(userId, notifyStatus, lastViewedPage);
      
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { userExtend }
      ));
    } catch (err) {
      context.error(`更新用户基本信息失败: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }
}

export default UserExtendController; 