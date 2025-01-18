import { GlobalConstants } from '../common/GlobalConstants.js';

// 定义订单状态常量
export const OrderStatus = {
  UNPAID: 0,    // 未支付
  PAID: 1,      // 已支付
  CANCELLED: 2,  // 已取消
  REFUNDED: 3,   // 已退款
  EXPIRED: 4     // 已过期
};

// 定义商品类型常量
export const GoodsType = {
  MONTHLY: 0,  // 月订阅
  YEARLY: 1    // 年订阅
};

// 支付订单数据传输对象
export class PayOrderDTO {
  constructor(data = {}) {
    this.order_id = data.order_id || '';
    this.user_id = data.user_id || '';
    this.order_status = data.order_status || OrderStatus.UNPAID;
    this.order_amount = data.order_amount || 0;
    this.order_discount = data.order_discount || 0;
    this.goods_name = data.goods_name || '';
    this.order_time = data.order_time || new Date();
    this.pay_time = data.pay_time;
    this.pay_transaction_id = data.pay_transaction_id || '';
    this.pay_transaction_time = data.pay_transaction_time;
    this.pay_transaction_status = data.pay_transaction_status || OrderStatus.UNPAID;
    this.goods_type = data.goods_type || GoodsType.MONTHLY;
    this.create_time = data.create_time || new Date();
    this.update_time = data.update_time || new Date();
  }

  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push('用户ID不能为空');
    }

    if (this.order_amount <= 0) {
      errors.push('订单金额必须大于0');
    }

    if (!this.goods_name) {
      errors.push('商品名称不能为空');
    }

    if (![GoodsType.MONTHLY, GoodsType.YEARLY].includes(this.goods_type)) {
      errors.push('无效的商品类型');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      order_id: this.order_id,
      user_id: this.user_id,
      order_status: this.order_status,
      order_amount: this.order_amount,
      order_discount: this.order_discount,
      goods_name: this.goods_name,
      order_time: this.order_time.toISOString(),
      pay_time: this.pay_time ? this.pay_time.toISOString() : null,
      pay_transaction_id: this.pay_transaction_id,
      pay_transaction_time: this.pay_transaction_time ? this.pay_transaction_time.toISOString() : null,
      pay_transaction_status: this.pay_transaction_status,
      goods_type: this.goods_type,
      create_time: this.create_time.toISOString(),
      update_time: this.update_time.toISOString()
    };
  }

  static fromJSON(json) {
    return new PayOrderDTO({
      ...json,
      order_time: new Date(json.order_time),
      pay_time: json.pay_time ? new Date(json.pay_time) : null,
      pay_transaction_time: json.pay_transaction_time ? new Date(json.pay_transaction_time) : null,
      create_time: new Date(json.create_time),
      update_time: new Date(json.update_time)
    });
  }
}