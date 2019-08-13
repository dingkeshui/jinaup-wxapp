import request from '@/utils/request';
import request2 from '@/utils/request2';

// appInt
export let appInt = params => {
  return request.post('/api/open/init/app');
}

// 登陆接口
export let login = params => {
  return request.post('api/open/user/info/oauth', {
    ...params,
    platform: 4,
  })
}
//用户信息
export let getUser = params => {
  return request.post('/api/open/user/info/only');
}

//匹配邀请码正确的群信息
export let groupName = params => {
  return request.post('/api/open/user/info/getbycode', params);
}
//获取验证码
export let identify = phoneNumber => {
  return request.post('/api/open/user/info/send/code', {
    phoneNumber
  })
}
//获取验证码
export let voiceCode = params => {
  return request.post('/api/open/user/info/send/MontnetsVoiceSMS',params)
}
// 绑定手机号
export let bindPhone = params => {
  if (params.phoneNumber == 13261886030) {
    return request.post('/api/open/user/info/testLogin', {
      // platform: 4,
      ...params
    })
  } else {
    return request.post('/api/open/user/info/bind/phone', {
      platform: 4,
      ...params
    })
  }
}
//分类接口
export let fenlei = params => {
  return request.post('/api/open/product/category/query', params)
}
//获取用户收货地址列表
export let getAddressListData = code => {
  return request.post('/api/open/user/address/list', {
    code
  })
}

// 获取用户
export let addAddress = code => {
  return request.post('/api/open/user/address/list')
}

// 搜索数据
export let getPecommend = params => {
  return request.post('/api/open/search/query/recommend', params) //{title:'kh'}
}
//搜索数据
export let getSearch = params => {
  return request.post('/api/open/search/query', params) 
}
// 修改用户收货地址
export let changeUserAddress = userData => {
  return request.post('/api/open/user/address/editAddress', userData)
}

//添加用户收货地址
export let addNewAddress = params => {
  return request.post('/api/open/user/address/addAddress', params)
}
// 订单查询
export let FindOrder = (params) => {
  return request.post('/api/open/order/query', params)
}

//订单详情
export let getDatail = params => {
  return request.post('/api/open/order/query/detail', params)
}

//取消订单
// export let cancelOrder = params => {
//   return request.post('/api/open/order/cancel/order', params)
// }
export let cancelOrder = params => {
  return request.post('/api/open/order/cancel/orderNew', params)
}

//确认订单
export let ensureOrder = params => {
  return request.post('/api/open/order/confirm/order', params)
}

// 用户身份认证
export let identif = params => {
  return request.post('/api/open/user/auth/identify', params);
}

//分享页数据
export let shareDate = params => {
  return request.post('api/open/product/seckill/query', params)
}

// 专题分类
export let special = params => {
  return request.post('api/open/sepcial/query', {
    siid: params.siid,
    uiType:1
  })
}

// 邀请人列表
export let Invitelist = () => {
  return request.post('/api/open/user/recommender/list')
}

// 获取分类tab数据
export let getSignList = params => {
  return request.post('/api/open/product/category/query', params);
}
//获取分类下拉列表
export let listings = params => {
  return request.post('/api/open/product/category/productList', params)
}
// 用户身份认证
export let identifyBase = params => {
  return request.post('/api/open/user/auth/identityBase64', params);
}

//更新用户实名认证
export let edit = params => {
  return request.post('/api/open/user/auth/editBase64', params);
}

//查询用户是否实名
export let orsm = params => {
  return request.post('/api/open/user/auth/select');
}

//优惠券接口
export let getConponList = params => {

  return request.post('/api/open/user/coupon/userCouponInfoList', params);
}

//绑定联系人
export let bindInvite = params => {
  return request.post('/api/open/user/recommender/bind', params)
}

// 搜索数据排序
export let searchSort = params => {
  return request.post('/api/open/search/query', params)
}

// 预支付接口
// export let prePare = params => {
//   return request.post('/api/open/order/prepare', params)
// }

// 新预支付接口
export let prePare = params => {
  return request.post('/api/open/order/prepareNew', params)
}

// 支付接口
// export let payOrder = params => {
//   return request.post('/api/open/order/place/order', params);
// }
export let payOrder = params => {
  return request.post('/api/open/order/place/orderNew', params);
}
// 去支付接口
// export let goPayOrder = params => {
//   return request.post('/api/open/order/pay/order', params);
// }
export let goPayOrder = params => {
  return request.post('/api/open/order/pay/orderNew', params);
}

// 获取订单数量
export let ddNum = params => {
  return request.post('/api/open/order/tips')
}

//用户收藏商品
export let collection = params => {
  return request.post('/api/open/user/collection/product', params)
}

//用户取消收藏商品
export let failCollection = params => {
  return request.post('/api/open/user/collection/cancelProduct', params)
}

// 秒杀
export let spikes = params => {
  return request.post('/api/open/product/seckill/query', params)
}

// 获取新的产品详情
export let getDetail = params => {
  return request.post('/api/open/product/newInfo', params);
}
// 获取产品详情
// export let getDetail = params => {
//   return request.post('/api/open/product/info', params);
// }

//运费模板信息
export let sstids = params => {
  return request.post('/api/open/shipping/templates/info', params)
}

//查询单个商品下的优惠券
export let couponList = params => {
  return request.post('/api/open/product/coupon/productCouponList', params)
}

//图片转为base64
export let imgToBase64 = params => {
  return request.post('/api/open/product/image/to/base64', params)
}

//发货物流
export let kauDiInfo = params => {
  return request.post('/api/open/express/query', params)
}

// 查询是否实名认证
export let searchAuthFun = params => {
  return request.post('/api/open/user/auth/select', params)
}

//猜你喜欢
export let reLikes = params => {
return request.post('/api/open/search/query/recommend')
}

//获取中国区域
export let chinaAdress = params => {
return request.post('/api/open/product/ht/location/chinaRegion')
}

//获取中国区域
export let chinaAdress2 = params => {
return request.post('/api/open/product/ht/location/sub',params)
}

//添加商品到购物车
export let addShop = params => {
return request.post('/api/open/user/shopping/cart/add',params)
}

// 获取首页数据
export let getIndexInfo = params => {
return request.post('/api/open/page/home/list',params)
}

// 获取首页数据
export let getIndexInfoNew = params => {
return request.post('/api/open/page/home/listNew',params)
}

// 获取首页为你推荐列表
export let getIndexProductsInfo = params => {
return request.post('/api/open/page/home/products',params)
}

// 获取首页分类
export let getIndexClassInfo = params => {
return request.post('/api/open/product/category/sub',params)
}

// 获取会员专题
export let getMemberTopic = params => {
return request.post('/api/open/product/member/topic/info',params)
}

// 获取会员商品专题
export let getMemberGoodsTopic = params => {
return request.post('/api/open/product/member/topic/productList',params)
}

// 获取商品详情
export let getGoodsInfo = params => {
return request.post('/api/open/product/newInfo',params)
}

// 获取商品sku
export let getGoodsSkuInfo = params => {
return request.post('/api/open/product/sku/attrs',params)
}

// 获取商品图片
export let getGoodsImgInfo = params => {
  return request.post('/api/open/product/detailPicture',params)
}

// 获取领取优惠券
export let receiveCoupon = params => {
  return request.post('/api/open/user/coupon/obtainCoupon',params)
}

// 获取单一sku信息
// export let getOneSkuInfo = params => {
//   return request.post('/api/open/product/sku/query',params)
// }

// 新的获取单一sku信息
export let getOneSkuInfo = params => {
  return request.post('/api/open/product/sku/querySku',params)
}

// 秒杀列表
export let getSeckillList = params => {
  return request.post('/api/open/product/seckill/query',params)
}

// 秒杀列表
export let getOrderModify = params => {
  return request.post('api/open/order/prepare/modify',params)
}

// 购物车列表
export let getCarList = params => {
  return request.post('api/open/user/shopping/cart/list',params)
}

// 更改购物车产品数量
export let changeCarGoodsNum = params => {
  return request.post('api/open/user/shopping/cart/edit',params)
}

// 删除购物车产品
export let getCarGoodsDel = params => {
  return request.post('api/open/user/shopping/cart/del',params)
}

// 获取购物车数量
export let getCarGoodsNum = params => {
  return request.post('api/open/user/shopping/cart/count',params)
}

// 获取购物车价格
export let getCarGoodsMoney = params => {
  return request.post('api/open/user/shopping/cart/calculated',params)
}

// 获取弹窗
export let getShowModelList = params => {
  return request.post('api/open/product/popupPage/getPopupPageInfo',params)
}

// 新秒杀
export let getMiaoShaList = params => {
  return request.post('api/open/product/seckillProduct/query/',params)
}

// 新秒杀分页
export let getMiaoShaListMore = params => {
  return request.post('api/open/product/seckillProduct/queryMore',params)
}

// 用户分享稀释
export let shareNum = params => {
  return request.post('api/open/user/share/click/stat/add/',params)
}

// 获取红包
export let getRed = params => {
  return request.post('api/open/micro/redEnvelope/getRedEnvelope',params)
}

// 获取我的红包
export let getMyRed = params => {
  return request.post('api/open/micro/redEnvelope/getMyRedEnvelope',params)
}

// 获取订单可用红包
export let getOrderRed = params => {
  return request.post('api/open/micro/redEnvelope/getOrderRedEnvelope',params)
}

// 分享红包
export let redShare = params => {
  return request.post('api/open/micro/redEnvelope/shareRedEnvelope',params)
}

// 分享红包
export let getWxPhone = params => {
  return request.post('api/open/user/info/authorizedAccessPhone',params)
}

// 单品专题查询
export let getOneSpecial = params => {
  return request.post('api/open/product/productInfo/select/single',params)
}