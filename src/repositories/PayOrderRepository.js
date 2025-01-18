import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { PayOrderDTO, OrderStatus } from '../models/PayOrderDTO.js';
import config from '../resource/application.js';

class PayOrderRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.payOrderCollectionId = config.database.payOrderCollectionId;
  }

  /**
   * 创建支付订单
   * @param {PayOrderDTO} orderData - 订单数据
   * @returns {Promise<PayOrderDTO>} 创建的订单信息
   */
  async createOrder(orderData) {
    try {
      // 设置订单ID
      orderData.order_id = ID.unique();
      
      const order = await this.databases.createDocument(
        this.databaseId,
        this.payOrderCollectionId,
        orderData.order_id,
        {
          ...orderData
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any())
        ]
      );

      return PayOrderDTO.fromJSON(order);
    } catch (error) {
      throw new Error(`创建订单失败: ${error.message}`);
    }
  }

  /**
   * 更新订单状态
   * @param {string} orderId - 订单ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<PayOrderDTO>} 更新后的订单信息
   */
  async updateOrder(orderId, updateData) {
    try {
      const updatedOrder = await this.databases.updateDocument(
        this.databaseId,
        this.payOrderCollectionId,
        orderId,
        updateData
      );

      return PayOrderDTO.fromJSON(updatedOrder);
    } catch (error) {
      throw new Error(`更新订单失败: ${error.message}`);
    }
  }

  /**
   * 获取用户的订单列表
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量
   * @param {number} offset - 偏移量
   * @returns {Promise<Array<PayOrderDTO>>} 订单列表
   */
  async getUserOrders(userId, limit = 25, offset = 0) {
    try {
      const orders = await this.databases.listDocuments(
        this.databaseId,
        this.payOrderCollectionId,
        [
          Query.equal('user_id', userId),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('create_time')
        ]
      );

      return orders.documents.map(order => PayOrderDTO.fromJSON(order));
    } catch (error) {
      throw new Error(`获取用户订单列表失败: ${error.message}`);
    }
  }

  /**
   * 根据订单ID获取订单详情
   * @param {string} orderId - 订单ID
   * @returns {Promise<PayOrderDTO|null>} 订单信息
   */
  async getOrderById(orderId) {
    try {
      const order = await this.databases.getDocument(
        this.databaseId,
        this.payOrderCollectionId,
        orderId
      );

      return order ? PayOrderDTO.fromJSON(order) : null;
    } catch (error) {
      throw new Error(`获取订单详情失败: ${error.message}`);
    }
  }

  /**
   * 获取用户最近的订单
   * @param {string} userId - 用户ID
   * @returns {Promise<PayOrderDTO|null>} 最近的订单信息
   */
  async getLatestOrder(userId) {
    try {
      const orders = await this.databases.listDocuments(
        this.databaseId,
        this.payOrderCollectionId,
        [
          Query.equal('user_id', userId),
          Query.orderDesc('create_time'),
          Query.limit(1)
        ]
      );

      return orders.documents.length > 0 
        ? PayOrderDTO.fromJSON(orders.documents[0]) 
        : null;
    } catch (error) {
      throw new Error(`获取最近订单失败: ${error.message}`);
    }
  }

  /**
   * 取消订单
   * @param {string} orderId - 订单ID
   * @returns {Promise<PayOrderDTO>} 更新后的订单信息
   */
  async cancelOrder(orderId) {
    try {
      const updatedOrder = await this.databases.updateDocument(
        this.databaseId,
        this.payOrderCollectionId,
        orderId,
        {
          order_status: OrderStatus.CANCELLED,
          pay_transaction_status: OrderStatus.CANCELLED
        }
      );

      return PayOrderDTO.fromJSON(updatedOrder);
    } catch (error) {
      throw new Error(`取消订单失败: ${error.message}`);
    }
  }
}

export default PayOrderRepository; 