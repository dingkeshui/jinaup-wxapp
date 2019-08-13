import request from '@/utils/request';
import request2 from './request';
import store from '@/store/index'
// import {url,version} from '@/pages/b/api/request';

let url = store.state.requsetUrl
let version = 1.0

console.log('store',store)

// 获取店铺信息
export let getUser = params => {
  return request.post('/api/open/user/info/only',params)
}

// 获取经营项目列表
export let getShopItemTypeList = params => {
  return request.post('api/open/store/queryBusinessItem',params)
}

// 认证商家
export let addShop = params => {
  return request.post('api/open/store/storeAttestationBase64',params)
}

// 获取店铺信息
export let getShopInfo = params => {
  return request.post('api/open/store/getStoreInfo',params)
}

// 根据id店铺信息
export let getStoreInfoByStoreId = params => {
  return request.post('api/open/store/getStoreInfoByStoreId',params)
}

// 根据id查询商品列表接口,按状态区分
// export let getStoreProductInfo = params => {
//   return request.post('api/open/product/micro/productInfo/query/list/type',params)
// }
export let getStoreProductInfo = params => {
  return request.post('api/open/product/micro/productInfo/select/noLogin/list',params)
}

// 根据id查看资质认证
export let getStoreQualification = params => {
  return request.post('api/open/store/getStoreQualification',params)
}

// 发送验证码
export let sendCode = params => {
  return request.post('api/open/store/send/code',params)
}

// 手机号认证
export let bindNumber = params => {
  return request.post('api/open/store/phoneAuthentication',params)
}

// 修改身份称号
export let changeIdNumber = params => {
  return request.post('api/open/store/editIdCard',params)
}

// 修改图片
export let changePic = params => {
  // let trackId = store.state.user.trackId
  let trackId = wx.getStorageSync('trackId')
  console.log('修改图片1',trackId,store.state.user)
  console.log('修改图片2',params)
  return new Promise((resolve, reject)=>{
    wx.uploadFile({
      url:url+'/api/open/store/editPicture/'+version,
      filePath:params.file,
      name:'file',
      header:{
        trackId:trackId
      },
      formData:{
        id:params.id,
        type:params.type
      },
      success: res => {
        resolve(JSON.parse(res.data))
      }
    })
  })
}

// 修改真实姓名
export let changeRealName = params => {
  return request.post('api/open/store/editRealName',params)
}

// 修改详细地址
export let changeAdressInfo = params => {
  return request.post('api/open/store/editStoreAddressDetail',params)
}

// 编辑店铺信息
export let changeShopInfo = params => {
  return request.post('api/open/store/editStoreAttestationBase64',params)
}

// 编辑店铺信息
export let editStoreAttestation = params => {
  return request.post('/api/open/store/editStoreAttestation',params)
}

// 修改经营项目
export let changeShopType = params => {
  return request.post('api/open/store/editStoreBusinessItem',params)
}

// 修改店铺昵称
export let changeShopName = params => {
  return request.post('api/open/store/editStoreName',params)
}

// 修改手机号
export let changeShopPhone = params => {
  return request.post('api/open/store/editStorePhone',params)
}

// 修改店铺区域
export let changeShopAdress = params => {
  return request.post('api/open/store/editStoreRegion',params)
}

// // 资质认证查看接口
// export let getShopCodeInfo = params => {
//   return request.post('api/open/store/getStoreQualification',params)
// }

// 非发货/非包邮区域
export let productMicroAreaQuery = params => {
  return request.post('api/open/product/microArea/query',params)
}

// 分类接口
export let productMicroCategoryQuery = params => {
  return request.post('api/open/micro/product/category/query',params)
}

// 商品发布
export let productMicroInfoInsert = params => {
  return request.post('api/open/product/micro/productInfo/insert',params)
}

// 商品详情接口
export let productMicroInfoDetails = params => {
  return request.post('api/open/product/micro/productInfo/query/details',params)
}

// 单店铺商品列表查询
export let productMicroInfoList = params => {
  return request.post('api/open/product/micro/productInfo/query/list',params)
}

// 商品列表状态查询
export let productMicroInfoListType = params => {
  return request.post('api/open/product/micro/productInfo/query/list/type',params)
}

// 查询推广信息
export let productMicroInfoUser = params => {
  return request.post('api/open/product/micro/productInfo/query/user',params)
}

// 商品信息更新
export let productMicroInfoUp = params => {
  return request.post('api/open/product/micro/productInfo/update',params)
}

// 获取中国区域
export let getCityInfo = params => {
  return request.post('api/open/product/ht/location/query/city',params)
}

// 生成预付单
export let advancedOrder = params => {
  return request.post('api/open/microOrder/place/microAdvancedOrder',params)
}
// 修改订单
export let editMicroOrder = params => {
  return request.post('/api/open/microOrder/editMicroOrder',params)
}
// 生成订单
export let getPrepayId = params => {
  return request.post('/api/open/microPay/wx/getPrepayId',params)
}

// 商家订单管理：小B订单管理
export let getBMicroOrderList = params => {
  return request.post('/api/open/microOrder/place/getBMicroOrderList',params)
}
// 商家确认发货
export let confirmShipment = params => {
  return request.post('/api/open/microOrder/place/confirmShipment',params)
}
// 商家确认发货
export let confirmShipmentQrCode = params => {
  return request.post('/api/open/microOrder/place/confirmShipmentQrCode',params)
}

// 用户订单列表：小C订单列表
export let getCMicroOrderList = params => {
  return request.post('/api/open/microOrder/place/getCMicroOrderList',params)
}
// 用户确认收货
export let confirmReceipt = params => {
  return request.post('/api/open/microOrder/place/confirmReceipt',params)
}

// 订单详情
export let getMicroOrderInfo = params => {
  return request.post('/api/open/microOrder/place/getMicroOrderInfo',params)
}

// 物流详情
export let queryLogistics = params => {
  return request.post('/api/open/express/query',params)
}

// 取消订单
export let cancelOrder = params => {
  return request.post('/api/open/microOrder/cancelOrder',params)
}

// 用户订单提示数
export let orderTips = params => {
  return request.post('/api/open/order/tips',params)
}

// 退款申请
// export let refundApply = params => {
//   return request.post('/api/open/microOrder/refundApply',params)
// }

// 获取所分享商品的商品详情
export let getDetail = params => {
  return request.post('/api/open/product/micro/productInfo/query/details', params)
}

// 储存商品分享信息
export let productShare = params => {
  return request.post('/api/open/product/micro/productInfo/insert/share',params)
}

// 我的分享列表
export let bProducts = params => {
  return request.post('/api/open/product/micro/share/query/list',params)
}

// // 小B首页商品列表
// export let shareListQuery = params => {
//   return request.post('/api/open/product/micro/share/query/list',params)
// }

// 小B首页商品信息
export let getIndexInfo = params => {
  return request.post('/api/open/mirco/page/home/list',params)
}

// 小B首页商品信息：小B首页无数据按照快递查找
export let getIndexInfoByDeliver = params => {
  return request.post('/api/open/mirco/page/home/deliver',params)
}

// 小B首页分类信息
export let indexCategory = params => {
  return request.post('/api/open/product/category/query',params)
}

// 服务商报名
export let serviceAdd =  params => {
  return request.post('/api/open/investment/registration/applyService',params)
}

// 验证码
export let serviceGetCode = params => {
  return request.post('/api/open/investment/registration/checkCode',params)
}

// 店主认证api
export let bShopAddPprotocol = params => {
  return request.post('/api/open/store/select/protocol',params)
}

// 服务商详情
export let registrationDetail = params => {
  return request.post('/api/open/investment/registration/detail/',params)
}