import { ResponseDTO } from '../models/ResponseDTO.js';
import PayOrderService from '../services/PayOrderService.js';

class PayOrderController {
  /**
   * 创建支付订单
   * @param {Object} req - Express请求对象
   * @param {Object} res - Express响应对象
   */
  async createOrder(req, res) {
    try {
      const { goodsName } = req.body;
      const userId = req.user.user_id;

      if (!goodsName) {
        return res.json(new ResponseDTO(false, '缺少商品名称'));
      }

      const response = await PayOrderService.createOrder(userId, {
        goodsName
      });

      res.json(response);
    } catch (error) {
      console.error('创建订单接口错误:', error);
      res.json(new ResponseDTO(false, '创建订单失败'));
    }
  }

  /**
   * 处理iOS支付回调通知
   */
  async handleApplePayNotification(req, res) {
    try {
      const response = await PayOrderService.handleApplePayNotification(req.body);
      res.json(response);
    } catch (error) {
      console.error('处理iOS支付回调错误:', error);
      res.json(new ResponseDTO(false, '处理iOS支付回调失败'));
    }
  }

  /**
   * 验证iOS支付
   */
  async verifyApplePayment(req, res) {
    try {
      const { orderId, transactionId, sandbox } = req.body;
      
      if (!orderId || !transactionId) {
        return res.json(new ResponseDTO(false, '缺少必要参数'));
      }

      const response = await PayOrderService.verifyApplePayment(
        orderId,
        transactionId,
        sandbox
      );
      
      res.json(response);
    } catch (error) {
      console.error('验证iOS支付错误:', error);
      res.json(new ResponseDTO(false, '验证iOS支付失败'));
    }
  }
}

export default new PayOrderController(); 