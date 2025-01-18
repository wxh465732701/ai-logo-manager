import { WorkDTO, WorkFeatureDTO } from '../models/WorkDTO.js';
import WorkRepository from '../repositories/WorkRepository.js';
import WorkFeatureRepository from '../repositories/WorkFeatureRepository.js';
import { ResponseDTO } from '../models/ResponseDTO.js';

class WorkService {
  constructor() {
    this.workRepository = new WorkRepository();
    this.workFeatureRepository = new WorkFeatureRepository();
  }

  /**
   * 创建作品
   * @param {string} userId - 用户ID
   * @param {Object} data - 作品数据
   * @param {WorkFeatureDTO} data.featureData - 作品特征数据
   * @param {WorkDTO} data.workDTO - 作品基本信息
   * @returns {Promise<ResponseDTO>}
   */
  async createWork(userId, { featureData, workDTO }) {
    try {
      // 1. 创建作品特征
      const createdFeature = await this.workFeatureRepository.createFeature(featureData);

      // 2. 创建作品基本信息
      workDTO.work_feature_id = createdFeature.feature_id;
      const createdWork = await this.workRepository.createWork(workDTO);

      return new ResponseDTO(true, '作品创建成功', {
        work_id: createdWork.work_id,
        feature_id: createdFeature.feature_id,
        brand_name: createdFeature.brand_name,
        create_time: createdWork.create_time
      });

    } catch (error) {
      console.error('创建作品失败:', error);
      return new ResponseDTO(false, `创建作品失败: ${error.message}`);
    }
  }

  /**
   * 获取用户作品数量
   * @param {string} userId - 用户ID
   * @returns {Promise<number>}
   */
  async getUserWorkCount(userId) {
    try {
      const works = await this.workRepository.getUserWorks(userId);
      return works.length;
    } catch (error) {
      console.error('获取用户作品数量失败:', error);
      throw new Error(`获取用户作品数量失败: ${error.message}`);
    }
  }
}

export default new WorkService(); 