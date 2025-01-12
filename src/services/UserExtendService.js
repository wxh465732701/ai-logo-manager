import { UserExtendDTO } from '../models/UserInfoDTO.js';
import { NotifyStatus, VipStatus, VipType, LastViewedPage } from '../common/GlobalConstants.js';

class UserExtendService {
  constructor(userExtendRepository) {
    this.userExtendRepository = userExtendRepository;
  }

  /**
   * 获取用户扩展信息
   * @param {string} userId - 用户ID
   * @returns {Promise<UserExtendDTO>} 用户扩展信息
   */
  async getUserExtendInfo(userId) {
    if (!userId) {
      throw new Error('用户ID不能为空');
    }

    const userExtend = await this.userExtendRepository.findByUserId(userId);
    if (!userExtend) {
      // 如果不存在，创建默认的扩展信息
      return await this.createDefaultUserExtend(userId);
    }

    return userExtend;
  }

  /**
   * 创建默认的用户扩展信息
   * @param {string} userId - 用户ID
   * @returns {Promise<UserExtendDTO>} 创建的用户扩展信息
   */
  async createDefaultUserExtend(userId) {
    const userExtend = new UserExtendDTO({
      user_id: userId,
      notify_status: NotifyStatus.NO_OPEN,
      vip_status: VipStatus.NO_OPEN,
      vip_type: VipType.NONE,
      last_viewed_page: LastViewedPage.HOME,
      create_time: new Date(),
      update_time: new Date()
    });

    return await this.userExtendRepository.create(userExtend);
  }

  /**
   * 开通VIP
   * @param {string} userId - 用户ID
   * @param {number} vipType - VIP类型
   * @returns {Promise<UserExtendDTO>} 更新后的用户扩展信息
   */
  async openVip(userId, vipType) {
    if (!userId) {
      throw new Error('用户ID不能为空');
    }

    if (![VipType.MONTH, VipType.YEAR].includes(vipType)) {
      throw new Error('无效的VIP类型');
    }

    const startTime = new Date();
    const endTime = new Date();
    
    // 根据VIP类型设置结束时间
    if (vipType === VipType.MONTH) {
      endTime.setMonth(endTime.getMonth() + 1);
    } else if (vipType === VipType.YEAR) {
      endTime.setFullYear(endTime.getFullYear() + 1);
    }

    return await this.userExtendRepository.updateVipInfo(
      userId,
      VipStatus.OPEN,
      vipType,
      startTime,
      endTime
    );
  }

  /**
   * 关闭VIP
   * @param {string} userId - 用户ID
   * @returns {Promise<UserExtendDTO>} 更新后的用户扩展信息
   */
  async closeVip(userId) {
    if (!userId) {
      throw new Error('用户ID不能为空');
    }

    return await this.userExtendRepository.updateVipInfo(
      userId,
      VipStatus.NO_OPEN,
      VipType.NONE,
      null,
      null
    );
  }

  /**
   * 更新通知状态
   * @param {string} userId - 用户ID
   * @param {boolean} enabled - 是否启用通知
   * @returns {Promise<UserExtendDTO>} 更新后的用户扩展信息
   */
  async updateUserBase(userId, notifyStatus, lastViewedPage) {
    if (!userId) {
      throw new Error('用户ID不能为空');
    }

    await this.userExtendRepository.updateUserBase(userId, notifyStatus, lastViewedPage);
  }

  /**
   * 检查用户是否是VIP
   * @param {string} userId - 用户ID
   * @returns {Promise<boolean>} 是否是VIP
   */
  async isVip(userId) {
    if (!userId) {
      throw new Error('用户ID不能为空');
    }

    const userExtend = await this.getUserExtendInfo(userId);
    if (!userExtend) {
      return false;
    }

    // 检查VIP状态和有效期
    if (userExtend.vip_status !== VipStatus.OPEN) {
      return false;
    }

    const now = new Date();
    const endTime = new Date(userExtend.vip_end_time);
    return now <= endTime;
  }

  /**
   * 获取VIP剩余时间（天数）
   * @param {string} userId - 用户ID
   * @returns {Promise<number>} 剩余天数，非VIP返回0
   */
  async getVipRemainingDays(userId) {
    if (!userId) {
      throw new Error('用户ID不能为空');
    }

    const userExtend = await this.getUserExtendInfo(userId);
    if (!userExtend || userExtend.vip_status !== VipStatus.OPEN) {
      return 0;
    }

    const now = new Date();
    const endTime = new Date(userExtend.vip_end_time);
    if (now > endTime) {
      return 0;
    }

    const diffTime = endTime.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export default UserExtendService; 