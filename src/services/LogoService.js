import { OpenAI } from 'openai';
import { ResponseDTO } from '../models/ResponseDTO.js';
import config from '../resource/application.js';

class LogoService {
  constructor() {
    this.client = new OpenAI({
      baseURL: 'https://external.api.recraft.ai/v1',
      apiKey: config.recraft.apiKey,
    });
  }

  /**
   * 生成Logo图片
   * @param {Object} params - 生成参数
   * @param {string} params.prompt - 描述文本
   * @param {string} params.brandName - 品牌名称
   * @param {string} params.industry - 行业
   * @param {string} params.style - 风格
   * @param {Array<Object>} params.colors - 颜色列表
   * @returns {Promise<ResponseDTO>}
   */
  async generateLogo(params) {
    try {
      // 构建提示词
      const prompt = this.buildPrompt(params);

      // 构建生成参数
      const generateParams = {
        prompt,
        style: 'vector_illustration', // 使用矢量插图风格
        model: 'recraftv3',
        size: '1024x1024',
        extra_body: {
          controls: {
            colors: params.colors?.map(color => ({ rgb: color })) || [],
          },
          // 如果有文字，添加文字布局
          text_layout: params.brandName ? [{
            text: params.brandName.toUpperCase(),
            bbox: [[0.3, 0.7], [0.7, 0.7], [0.7, 0.8], [0.3, 0.8]]
          }] : undefined
        }
      };

      // 调用Recraft API生成图片
      const response = await this.client.images.generate(generateParams);

      if (!response?.data?.[0]?.url) {
        throw new Error('生成图片失败');
      }

      return new ResponseDTO(true, '生成成功', {
        logo_url: response.data[0].url
      });

    } catch (error) {
      console.error('生成Logo失败:', error);
      return new ResponseDTO(false, `生成Logo失败: ${error.message}`);
    }
  }

  /**
   * 构建提示词
   * @private
   */
  buildPrompt(params) {
    const parts = [
      'create a minimalist and professional logo',
      params.industry && `for a ${params.industry} company`,
      'the logo should be simple, memorable, and scalable',
      'using clean lines and modern design',
      params.style && `in ${params.style} style`,
      'suitable for business use',
      'with balanced composition',
      'avoid text unless specifically requested',
      'ensure the design is unique and distinctive'
    ].filter(Boolean);

    return parts.join(', ');
  }
}

export default new LogoService(); 