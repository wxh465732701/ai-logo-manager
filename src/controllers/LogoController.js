import { ResponseDTO } from '../models/ResponseDTO.js';
import LogoService from '../services/LogoService.js';

class LogoController {
  /**
   * 生成Logo
   * @param {Object} req - Express请求对象
   * @param {Object} res - Express响应对象
   */
  async generateLogo(req, res) {
    try {
      const {
        brand_name,
        industry,
        style,
        colors
      } = req.body;

      // 验证必要参数
      if (!brand_name) {
        return res.json(new ResponseDTO(false, '品牌名称不能为空'));
      }

      const response = await LogoService.generateLogo({
        brandName: brand_name,
        industry,
        style,
        colors: colors || [[0, 0, 0]] // 默认黑色
      });

      res.json(response);
    } catch (error) {
      console.error('生成Logo接口错误:', error);
      res.json(new ResponseDTO(false, '生成Logo失败'));
    }
  }
}

export default new LogoController(); 