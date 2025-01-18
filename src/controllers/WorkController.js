import { ResponseDTO } from '../models/ResponseDTO.js';
import WorkService from '../services/WorkService.js';
import UserExtendRepository from '../repositories/UserExtendRepository.js';
import { VipStatus } from '../common/GlobalConstants.js';
import { WorkDTO, WorkFeatureDTO } from '../models/WorkDTO.js';

class WorkController {
  constructor() {
    this.userExtendRepository = new UserExtendRepository();
  }

  /**
   * 创建作品
   * @param {Object} req - Express请求对象
   * @param {Object} res - Express响应对象
   */
  async createWork(req, res) {
    try {
      const {
        industry,
        brand_name,
        slogan,
        key_words,
        key_word_description,
        logo_style,
        logo_domain,
        logo_color,
        visibility
      } = req.body;

      const userId = req.user.user_id;

      // 1. 验证必要参数
      if (!brand_name) {
        return res.json(new ResponseDTO(false, '品牌名称不能为空'));
      }

      // 2. 检查用户VIP状态和作品数量限制
      const userExtend = await this.userExtendRepository.getUserExtend(userId);
      if (!userExtend) {
        return res.json(new ResponseDTO(false, '用户信息不存在'));
      }

      // 如果不是VIP用户，检查作品数量
      if (userExtend.vip_status !== VipStatus.OPEN) {
        const workCount = await WorkService.getUserWorkCount(userId);
        if (workCount >= 1) {
          return res.json(new ResponseDTO(false, '非VIP用户只能创建一个作品，请开通VIP后继续创建'));
        }
      }

      // 3. 验证作品特征数据
      const featureData = new WorkFeatureDTO({
        user_id: userId,
        industry: industry || '',
        brand_name,
        slogan: slogan || '',
        key_words: key_words || '',
        key_word_description: key_word_description || '',
        logo_style: logo_style || '',
        logo_domain: logo_domain || '',
        logo_color: logo_color || '',
        visibility: visibility || 0
      });

      const featureValidation = featureData.validate();
      if (!featureValidation.isValid) {
        return res.json(new ResponseDTO(false, 
          `作品特征数据验证失败: ${featureValidation.errors.join(', ')}`));
      }

      // 4. 验证作品基本信息
      const workDTO = new WorkDTO({
        user_id: userId,
        work_name: brand_name,
        work_description: slogan || ''
      });

      const workValidation = workDTO.validate();
      if (!workValidation.isValid) {
        return res.json(new ResponseDTO(false, 
          `作品数据验证失败: ${workValidation.errors.join(', ')}`));
      }

      // 5. 所有验证通过，调用服务创建作品
      const response = await WorkService.createWork(userId, {
        featureData,
        workDTO
      });

      res.json(response);
    } catch (error) {
      console.error('创建作品接口错误:', error);
      res.json(new ResponseDTO(false, '创建作品失败'));
    }
  }
}

export default new WorkController(); 