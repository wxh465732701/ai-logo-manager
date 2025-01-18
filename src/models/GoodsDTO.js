import { GoodsType } from './PayOrderDTO.js';
import { GoodsConstants } from '../common/GlobalConstants.js';

export class GoodsDTO {
  constructor(data = {}) {
    this.goods_name = data.goods_name || '';
    this.goods_type = data.goods_type || GoodsType.MONTHLY;
    this.amount = data.amount || 0;
    this.discount = data.discount || 0;
    this.description = data.description || '';
    this.status = data.status || 1;  // 1: 启用 0: 禁用
  }

  validate() {
    const errors = [];

    if (!this.goods_name) {
      errors.push('商品名称不能为空');
    }

    if (this.amount <= 0) {
      errors.push('商品金额必须大于0');
    }

    if (this.discount < 0) {
      errors.push('优惠金额不能小于0');
    }

    if (this.discount > this.amount) {
      errors.push('优惠金额不能大于商品金额');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// 预定义商品配置
export const DefaultGoods = {
  [GoodsConstants.MONTHLY_FIRST]: {
    goods_name: GoodsConstants.MONTHLY_FIRST,
    goods_type: GoodsType.MONTHLY,
    amount: 2900,
    discount: 1000,
    description: '月度会员首充优惠'
  },
  [GoodsConstants.MONTHLY_NORMAL]: {
    goods_name: GoodsConstants.MONTHLY_NORMAL,
    goods_type: GoodsType.MONTHLY,
    amount: 2900,
    discount: 0,
    description: '月度会员'
  },
  [GoodsConstants.YEARLY_FIRST]: {
    goods_name: GoodsConstants.YEARLY_FIRST,
    goods_type: GoodsType.YEARLY,
    amount: 29900,
    discount: 10000,
    description: '年度会员首充优惠'
  },
  [GoodsConstants.YEARLY_NORMAL]: {
    goods_name: GoodsConstants.YEARLY_NORMAL,
    goods_type: GoodsType.YEARLY,
    amount: 29900,
    discount: 0,
    description: '年度会员'
  }
}; 