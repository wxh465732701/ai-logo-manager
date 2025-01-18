import { PayOrderDTO, GoodsType, OrderStatus } from '../models/PayOrderDTO.js';
import { DefaultGoods } from '../models/GoodsDTO.js';
import PayOrderRepository from '../repositories/PayOrderRepository.js';
import UserExtendRepository from '../repositories/UserExtendRepository.js';
import { ResponseDTO } from '../models/ResponseDTO.js';
import { VipStatus, VipType } from '../common/GlobalConstants.js';
import { ID } from 'node-appwrite';
import { decodeNotificationPayload, decodeTransaction, isDecodedNotificationSummaryPayload } from "app-store-server-api";

class PayOrderService {
  constructor() {
    this.payOrderRepository = new PayOrderRepository();
    this.userExtendRepository = new UserExtendRepository();
  }

  /**
   * 获取商品配置
   * @param {string} goodsName - 商品名称
   * @returns {Object|null} 商品配置信息
   */
  getGoodsConfig(goodsName) {
    return DefaultGoods[goodsName] || null;
  }

  /**
   * 创建支付订单
   * @param {string} userId - 用户ID
   * @param {Object} orderInfo - 订单信息
   * @param {string} orderInfo.goodsName - 商品名称
   * @returns {Promise<ResponseDTO>}
   */
  async createOrder(userId, orderInfo) {
    try {
      // 获取商品配置
      const goodsConfig = this.getGoodsConfig(orderInfo.goodsName);
      if (!goodsConfig) {
        return new ResponseDTO(false, '无效的商品名称');
      }

      // 创建订单数据
      const orderData = new PayOrderDTO({
        user_id: userId,
        order_amount: goodsConfig.amount,
        order_discount: goodsConfig.discount,
        goods_name: goodsConfig.description,
        goods_type: goodsConfig.goods_type,
        order_time: new Date(),
      });

      // 验证订单数据
      const validation = orderData.validate();
      if (!validation.isValid) {
        return new ResponseDTO(false, `订单数据验证失败: ${validation.errors.join(', ')}`);
      }

      // 保存订单
      const createdOrder = await this.payOrderRepository.createOrder(orderData);

      return new ResponseDTO(true, '订单创建成功', {
        order_id: createdOrder.order_id,
        order_amount: createdOrder.order_amount,
        order_discount: createdOrder.order_discount,
        final_amount: createdOrder.order_amount - createdOrder.order_discount,
        goods_name: createdOrder.goods_name,
        goods_type: createdOrder.goods_type,
        order_time: createdOrder.order_time
      });
    } catch (error) {
      console.error('创建订单失败:', error);
      return new ResponseDTO(false, `创建订单失败: ${error.message}`);
    }
  }

  /**
   * 处理iOS支付回调通知
   * @param {Object} payload - 支付回调数据
   * @returns {Promise<ResponseDTO>}
   */
  async handleApplePayNotification(payload) {
    try {
      // 解码通知数据
      const decodedPayload = await decodeNotificationPayload(payload.signedPayload);
      
      // 不处理摘要通知
      if (isDecodedNotificationSummaryPayload(decodedPayload)) {
        return new ResponseDTO(true, 'Summary notification ignored');
      }

      // 解码交易信息
      const transactionInfo = await decodeTransaction(decodedPayload.data.signedTransactionInfo);
      
      // 查找对应的订单
      const order = await this.payOrderRepository.getOrderByTransactionId(transactionInfo.originalTransactionId);
      if (!order) {
        return new ResponseDTO(false, 'Order not found');
      }

      // 根据通知类型处理订单状态
      switch (decodedPayload.notificationType) {
        case 'DID_RENEW':
          // 续订成功
          await this.handleRenewalSuccess(order, transactionInfo);
          break;
        
        case 'REFUND':
          // 退款
          await this.handleRefund(order);
          break;
        
        case 'EXPIRED':
          // 订阅过期
          await this.handleExpiration(order);
          break;

        case 'DID_CHANGE_RENEWAL_STATUS':
          // 更新续订状态
          if (decodedPayload.subtype === 'AUTO_RENEW_DISABLED') {
            await this.handleAutoRenewalDisabled(order);
          }
          break;
      }

      return new ResponseDTO(true, 'Notification processed successfully');
    } catch (error) {
      console.error('处理iOS支付回调失败:', error);
      return new ResponseDTO(false, `处理iOS支付回调失败: ${error.message}`);
    }
  }

  /**
   * 处理续订成功
   * @param {PayOrderDTO} order - 订单信息
   * @param {Object} transactionInfo - 交易信息
   */
  async handleRenewalSuccess(order, transactionInfo) {
    try {
      // 1. 更新订单状态
      const updateData = {
        order_status: OrderStatus.PAID,
        pay_transaction_status: OrderStatus.PAID,
        pay_time: new Date(),
        pay_transaction_id: transactionInfo.originalTransactionId,
        pay_transaction_time: new Date(transactionInfo.purchaseDate)
      };
      await this.payOrderRepository.updateOrder(order.order_id, updateData);

      // 2. 更新用户会员信息
      const expiresDate = new Date(transactionInfo.expiresDate);
      const vipType = order.goods_type === GoodsType.MONTHLY ? VipType.MONTH : VipType.YEAR;
      
      await this.userExtendRepository.updateUserExtend(order.user_id, {
        vip_status: VipStatus.OPEN,
        vip_type: vipType,
        vip_start_time: new Date(transactionInfo.purchaseDate),
        vip_end_time: expiresDate
      });

    } catch (error) {
      console.error('处理续订成功失败:', error);
      throw new Error(`处理续订成功失败: ${error.message}`);
    }
  }

  /**
   * 处理退款
   * @param {PayOrderDTO} order - 订单信息
   */
  async handleRefund(order) {
    try {
      // 1. 更新订单状态
      const updateData = {
        order_status: OrderStatus.REFUNDED,
        pay_transaction_status: OrderStatus.REFUNDED
      };
      await this.payOrderRepository.updateOrder(order.order_id, updateData);

      // 2. 更新用户会员信息
      await this.userExtendRepository.updateUserExtend(order.user_id, {
        vip_status: VipStatus.NO_OPEN,
        vip_type: VipType.NONE,
        vip_end_time: new Date() // 立即结束会员
      });

    } catch (error) {
      console.error('处理退款失败:', error);
      throw new Error(`处理退款失败: ${error.message}`);
    }
  }

  /**
   * 处理订阅过期
   * @param {PayOrderDTO} order - 订单信息
   */
  async handleExpiration(order) {
    try {
      // 1. 更新订单状态
      const updateData = {
        order_status: OrderStatus.EXPIRED,
        pay_transaction_status: OrderStatus.EXPIRED
      };
      await this.payOrderRepository.updateOrder(order.order_id, updateData);

      // 2. 更新用户会员信息
      await this.userExtendRepository.updateUserExtend(order.user_id, {
        vip_status: VipStatus.NO_OPEN,
        vip_type: VipType.NONE
      });

    } catch (error) {
      console.error('处理订阅过期失败:', error);
      throw new Error(`处理订阅过期失败: ${error.message}`);
    }
  }

  /**
   * 处理取消自动续订
   * @param {PayOrderDTO} order - 订单信息
   */
  async handleAutoRenewalDisabled(order) {
    const updateData = {
      auto_renew_status: 0
    };

    await this.payOrderRepository.updateOrder(order.order_id, updateData);
  }

  /**
   * 验证iOS支付收据
   * @param {string} orderId - 订单ID
   * @param {string} transactionId - 交易ID
   * @param {boolean} sandbox - 是否为沙盒环境
   * @returns {Promise<ResponseDTO>}
   */
  async verifyApplePayment(orderId, transactionId, sandbox = false) {
    try {
      const api = sandbox ? sandBoxApi : productApi;
      const response = await api.getTransactionInfo(transactionId);
      
      const transaction = await decodeTransaction(response.signedTransactionInfo);
      
      if (transaction.bundleId !== APP_BUNDLE_ID) {
        return new ResponseDTO(false, 'Invalid bundle ID');
      }

      // 1. 获取订单信息
      const order = await this.payOrderRepository.getOrderById(orderId);
      if (!order) {
        return new ResponseDTO(false, '订单不存在');
      }

      // 2. 更新订单状态
      const updateData = {
        order_status: OrderStatus.PAID,
        pay_transaction_status: OrderStatus.PAID,
        pay_time: new Date(),
        pay_transaction_id: transactionId,
        pay_transaction_time: new Date(transaction.purchaseDate)
      };
      await this.payOrderRepository.updateOrder(orderId, updateData);

      // 3. 更新用户会员信息
      const expiresDate = new Date(transaction.expiresDate);
      const vipType = order.goods_type === GoodsType.MONTHLY ? VipType.MONTH : VipType.YEAR;
      
      await this.userExtendRepository.updateUserExtend(order.user_id, {
        vip_status: VipStatus.OPEN,
        vip_type: vipType,
        vip_start_time: new Date(transaction.purchaseDate),
        vip_end_time: expiresDate
      });

      return new ResponseDTO(true, '支付验证成功', {
        expiresDate: transaction.expiresDate
      });
    } catch (error) {
      console.error('验证iOS支付失败:', error);
      return new ResponseDTO(false, `验证iOS支付失败: ${error.message}`);
    }
  }
}

export default new PayOrderService(); 