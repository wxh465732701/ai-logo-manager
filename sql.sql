CREATE TABLE `magic_logo_user` (
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'mis号',
  `user_name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `user_type` int(10) NOT NULL DEFAULT '0' COMMENT '账号类型 0:普通账户',
  `source_type` int(10) NOT NULL DEFAULT '0' COMMENT '账号来源 0:ios 1:android 2:web',
  `status` int(10) NOT NULL DEFAULT '0' COMMENT '状态 0:启用 1:禁用',
  `device_id` varchar(255) NOT NULL DEFAULT null COMMENT '设备id',
  `email` varchar(255) NOT NULL DEFAULT null COMMENT '邮箱',  
  `password` varchar(255) NOT NULL DEFAULT null COMMENT '密码',
  `profile_image` varchar(255) NOT NULL DEFAULT null COMMENT '头像',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE `magic_logo_user_extend` (
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'mis号',
  `notify_status` int(10) NOT NULL DEFAULT '0' COMMENT '通知状态 0:开启 1:关闭',
  `vip_status` int(10) NOT NULL DEFAULT '0' COMMENT 'vip状态 0:未开通 1:已开通',
  `vip_type` int(10) NOT NULL DEFAULT '0' COMMENT 'vip类型 0:月订阅 1:年订阅',
  `vip_start_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'vip开始时间',
  `vip_end_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'vip结束时间',
  `last_viewed_page` varchar(255) NOT NULL DEFAULT '' COMMENT '最后查看的页面',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE `magic_logo_session` (
  `session_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'session id',
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户id',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE `magic_logo_config` (
  `config_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'config id',
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'key',
  `value` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'value',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';


CREATE TABLE `magic_logo_pay_order` (
  `order_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单id',
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'mis号',
  `order_status` int(10) NOT NULL DEFAULT '0' COMMENT '订单状态 0:未支付 1:已支付 2:已取消',
  `order_amount` int(10) NOT NULL DEFAULT '0' COMMENT '订单金额',
  `order_discount` int(10) NOT NULL DEFAULT '0' COMMENT '订单优惠金额',
  `goods_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品名称',
  `order_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '订单时间',
  `pay_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '支付时间',
  `pay_transaction_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '支付交易id',
  `pay_transaction_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '支付交易时间',
  `pay_transaction_status` int(10) NOT NULL DEFAULT '0' COMMENT '支付交易状态 0:未支付 1:已支付 2:已取消',
  `goods_type` int(10) NOT NULL DEFAULT '0' COMMENT '商品类型 0:月订阅 1:年订阅',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付订单表';


CREATE TABLE `magic_logo_work` (
  `work_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '作品id',
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'mis号',
  `work_feature_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '作品特征id',
  `work_status` int(10) NOT NULL DEFAULT '0' COMMENT '作品状态 0:未解锁 1:已解锁',
  `work_type` int(10) NOT NULL DEFAULT '0' COMMENT '作品类型 0:logo 1:banner 2:icon',
  `work_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '作品名称',
  `work_description` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '作品描述',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`work_id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品表';

CREATE TABLE `magic_logo_work_feature` (
  `feature_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'id',
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'mis号',
  `industry` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '行业',
  `brand_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '品牌名称',
  `slogan` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '品牌口号',
  `key_words` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '品牌关键词',
  `key_word_description` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '品牌关键词描述',
  `logo_style` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'logo风格',
  `logo_domain` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '域名',
  `logo_color` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'logo颜色',
  `visibility` int(10) NOT NULL DEFAULT '0' COMMENT '可见性 0:公开 1:私密',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`feature_id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品特征表';

CREATE TABLE `magic_logo_work_image` (
  `image_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片id',
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'mis号',
  `work_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '作品id',
  `image_type` int(10) NOT NULL DEFAULT '0' COMMENT '图片类型 0:png 1:svg 2:jpeg 3:gif 4:webp',
  `image_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片url',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`image_id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品图片表';

CREATE TABLE `magic_logo_work_favorite` (
  `favorite_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '收藏id',
  `user_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户id',
  `work_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '作品id',
  `create_time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  PRIMARY KEY (`favorite_id`),
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

