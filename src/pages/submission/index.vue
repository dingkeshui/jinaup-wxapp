<template>
  <div class="bigbox">
    <div class="swrap">
      <!-- 实名认证介绍 -->
      <div v-if="orderMain.isOverseas" class="toptext flex">
        <div></div>
        <div
          class="flex1"
        >订单中包含海外购商品，海关要求必须提供真实姓名和身份证号进行实名认证，且实名人与支付人必须一致，错误信息可能导致无法清关，平台保证您的信息安全，绝不对外泄露！</div>
      </div>
      <div class="addressBox"  @click="goAdd" v-if="orderMain.userAddressVo">
        <div class="addressDiv">
          <div class="div1">
            <div class="topdiv1">
              <span class="mgr10">{{orderMain.userAddressVo.consignee}}</span>
              <span>{{orderMain.userAddressVo.consigneePhone}}</span>
            </div>
            <div class="footdiv1">
              <img class="locationIcon" src="/static/images/locationIcon.png" alt>
              <div>{{orderMain.userAddressVo.addressDetail}}</div>
            </div>
          </div>
          <div class="div2">
            <img class="locationIcon" src="/static/images/jt.png">
          </div>
          <div class="messageBottom">
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="btn" @click="goAdd">+ 新增收货地址</div>
      <!-- 实名认证按钮 -->
      <template v-if="orderMain.isOverseas">
        <div class="authBox" v-if="auth">
          <span style="margin-right:10px;">{{auth.trueName}}</span>
          <span>{{auth.idNumber}}</span>
        </div>
        <div v-else class="btn" @click="goAuth">+ 新增实名认证信息</div>
      </template>
    </div>
    <div>
      <!--  货物列表 -->
      <div class="lis" v-for="(item,index) in orderMain.subOrder" :key="index">
        <p class="times">{{orderTime}}</p>
        <dl v-for="(item2,index2) in item.orderItemProductInfos" :key="index2">
          <dt>
            <img :src="item2.mainImgUrl" alt>
          </dt>
          <dd>
            <p class="name">{{item2.productTitle}}</p>
            <p class="size">规格：{{item2.skuName}}</p>
            <p class="pn">
              <span>￥{{item2.salesPrice}}</span>
              <span>X{{item2.productNumber}}</span>
            </p>
          </dd>
        </dl>
        <div class="types">
          <span>发货方式</span>
          <span>邮费：{{item.deliveryMoney}}元</span>
        </div>
        <div class="total">
          <span>订单小计</span>
          <span class="price">
            ￥
            <span class="col">{{item.totalAmount}}</span>
          </span>
        </div>
      </div>
    </div>
    <div v-if="orderMain.listCoupons" @click="showCouponFun" class="imgList">
      <div>
        <span>优惠券</span>
      </div>
      <div class="flexcenter">
        <span>{{orderMain.userCouponInfoVo?'-￥'+orderMain.userCouponInfoVo.reduction:''}}</span>
        <img style="width:15px;height:15px;" src="/static/images/jt.png" alt>
      </div>
    </div>
    <div class="imgList">
      <div>
        <img class="wx" src="/static/images/7.png" alt>
        <span>微信支付</span>
      </div>
      <img
        class="yuan"
        @click="changes"
        :src="boo?'/static/images/yuan.png':'/static/images/xzyuan.png'"
        alt
      >
    </div>
    <div class="footer">
      <div>
        <span>
          总计￥
          <span class="price">{{orderMain.mainOrder.totalAmount}}</span>
        </span>
        <span>微信支付</span>
      </div>
      <p @click="goPay">去支付</p>
    </div>
    <couponItem
      v-if="showCoupon"
      :list="orderMain.listCoupons"
      type="order"
      @choose="chooseCoupon"
      @close="closeCoupon"
    ></couponItem>
  </div>
</template>
<script>
import couponItem from "@/components/coupon";
import { payOrder,searchAuthFun,getOrderModify } from "../../api/index.js";
export default {
  data: {
    showCoupon: false,
    onCouponInfo: "",
    arr: {},
    pid: "",
    num: 1,
    total: "",
    boo: false,
    size: "默认",
    orderMain: "",
    auth: "",
    orderTime: ""
  },
  components: {
    couponItem
  },
  onShow() {
    let that = this;
    console.log("onShow", wx.getStorageSync("onAdressInfo"));
    let onAdressInfo = wx.getStorageSync("onAdressInfo");
    this.onCouponInfo = ''
    if (onAdressInfo) {
      console.log("选择了地址");
      that.changOrder();
    }
    console.log('订单下的onShow',this.orderMain)
    if (this.orderMain.userAuthInfoVo) {
      this.auth = this.orderMain.userAuthInfoVo
    } else if (this.orderMain.isOverseas) {
      that.authFun();
    }
    // that.authFun();
  },
  methods: {
    showCouponFun() {
      this.showCoupon = true;
    },
    chooseCoupon(item) {
      this.onCouponInfo = item;
      this.changOrder();
    },
    closeCoupon() {
      this.showCoupon = false;
    },
    async changOrder() {
      let that = this;
      let onAdressInfo = wx.getStorageSync("onAdressInfo");
      let postData = {};
      let trackId = wx.getStorageSync("trackId");
      postData.prepareId = that.orderMain.prepareId;
      if (onAdressInfo) {
        postData.addressId = onAdressInfo.uaid;
      }
      if (that.onCouponInfo) {
        postData.uciid = that.onCouponInfo.uciid;
      }
      let res = await getOrderModify(postData)
      if (res.data.res_code == 1) {
        that.orderMain = res.data.result;
        console.log("订单修改成功", res);
        that.onCouponInfo = ""
      } else {
        console.log("订单修改失败", res);
        that.onCouponInfo = ""
        wx.showToast({
          title: res.data.message?res.data.message:'订单修改失败',
          icon: "none",
          duration: 2000
        });
      }
    },
    // 查询是否实名认证
   async authFun() {
    console.log('进入查询是否实名认证')
      let that = this;
      let trackId = wx.getStorageSync("trackId");
      console.log(99999)
      let result = await searchAuthFun({})
      console.log('实名结果',result,trackId)
      if (result.data.res_code == 1) {
        that.auth = result.data.result;
        console.log("查询实名成", res);
      } else {
        that.auth = that.auth?that.auth:'';
        console.log("查询实名失败", res);
      }
    },
    async goPay() {
      let that = this;
      if (!that.orderMain.userAddressVo) {
        wx.showToast({
          title: "请添加收货地址",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (that.orderMain.isOverseas && !that.orderMain.userAuthInfoVo) {
        wx.showToast({
          title: "请实名认证",
          icon: "none",
          duration: 1000
        });
        return;
      }
      let trackId = wx.getStorageSync("trackId");
      let result = await payOrder({
        payChannel: "1",
        prepareId: that.orderMain.prepareId,
        platform: "4"
      });
      if (result.data.res_code == 1) {
        wx.requestPayment({
          timeStamp: result.data.result.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
          nonceStr: result.data.result.nonceStr, //随机字符串，长度为32个字符以下,
          package: result.data.result.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
          signType: "MD5", //签名算法，暂支持 MD5,
          paySign: result.data.result.sign, //签名,具体签名方案参见小程序支付接口文档,
          success: res => {
            console.log("支付成功", res, that.orderMain);
            var detail = that.orderMain;
            wx.removeStorage({
              key: 'orderMian',
              success (res) {
                console.log(res)
              }
            })
            wx.redirectTo({
              url:
                "/pages/myorder/cashDetails/main?price=" +
                detail.mainOrder.totalAmount +
                "&number=" +
                detail.mainOrder.orderNumber +
                "&isok=" +
                1
            });
          },
          fail: () => {
            var detail = that.orderMain;
            console.log("支付失败");
            wx.removeStorage({
              key: 'orderMian',
              success (res) {
                console.log(res)
              }
            })
            wx.redirectTo({
              url:
                "/pages/myorder/cashDetails/main?price=" +
                detail.mainOrder.totalAmount +
                "&number=" +
                detail.mainOrder.orderNumber +
                "&isok=" +
                2
            });
          },
          complete: () => {}
        });
      } else {
        wx.showToast({
          title: result.data.message?result.data.message:'下单失败',
          icon: "none",
          duration: 1000
        });
      }
    },
    changes() {
      this.boo = !this.boo;
    },
    goAdd() {
      // 去添加地址页面;
      wx.navigateTo({
        url: "/pages/shoppingadress/main?fromOrder=order"
      });
    },
    goAuth() {
      wx.navigateTo({
        url: "/pages/autonym/main?fromOrder=order"
      });
    }
  },
  onLoad(options) {
    console.log("ONLOAD");
    let that = this;
    that.orderMain = wx.getStorageSync("orderMian");
    console.log("orderMain222", that.orderMain);
  },
  watch: {
    orderMain(val) {
      let that = this;
      // if(val){
      //   this.
      // }
    }
  }
};
</script>
<style scoped lang='scss'>
.bogbox {
  background: #f3f7f7;
  min-height: 100%;
}
.swrap {
  width: 100%;
  background: #f3f7f7;
  min-height: 100%;
}
.btn {
  width: 96%;
  height: 56px;
  line-height: 56px;
  text-align: center;
  background: #fff;
  color: #fc5d7b;
  font-size: 16px;
  margin: 5px 2%;
}
.lis {
  width: 96%;
  margin: 5px 2%;
  background: #fff;
  margin-bottom: 10px;
  .times {
    font-size: 12px;
    padding: 5px 0;
    box-sizing: border-box;
    background: #f3f7f7;
  }
  dl {
    display: flex; // justify-content: space-between;
    dt {
      img {
        width: 90px;
        height: 90px;
        padding: 8px;
        box-sizing: border-box;
      }
    }
    dd {
      padding: 0 8px;
      box-sizing: border-box;
      font-size: 12px;
      .name {
        font-size: 14px;
      }
      .size {
        color: #999da2;
        line-height: 2;
      }
      .pn {
        display: flex;
        justify-content: space-between;
        line-height: 2;
        color: #323a45;
      }
    }
  }
  .types,
  .total {
    width: 100%;
    height: 44px;
    font-size: 14px;
    line-height: 44px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .total {
    .price {
      color: #fc5d7b;
      .col {
        font-size: 24px;
      }
    }
  }
}
.totals {
  width: 96%;
  height: 44px;
  font-size: 14px;
  line-height: 44px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  background: #fff;
  box-sizing: border-box;
  margin: 0 2% 5px 2%;
  .price {
    color: #fc5d7b;
  }
  .more {
    color: #999da2;
  }
}
.imgList {
  width: 96%;
  height: 44px;
  font-size: 14px;
  line-height: 44px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  background: #fff;
  margin: 5px 2% 5px 2%;
  div {
    display: flex;
    font-size: 14px;
    .wx {
      width: 20px;
      height: 20px;
      margin: 12px 5px 0 0px;
    }
  }
  .yuan {
    width: 20px;
    height: 20px;
    margin: 12px 10px 0 0;
  }
}
.footer {
  display: flex;
  width: 100%;
  height: 55px;
  line-height: 55px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #ccc;
  div {
    width: 70%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #fc5d7b;
    padding: 0 10px;
    box-sizing: border-box;
    .price {
      font-size: 30px;
    }
    span:nth-child(2) {
      color: #323a45;
    }
  }
  p {
    width: 30%;
    height: 55px;
    line-height: 55px;
    font-size: 18px;
    text-align: center;
    color: #fff;
    background: linear-gradient(
      217deg,
      rgba(248, 99, 103, 1) 0%,
      rgba(251, 37, 121, 1) 100%
    );
  }
}
.adressBox {
  padding: 10px;
}
.adressBox > div {
  background-color: #fff;
  padding: 5px;
}
.flex {
  display: flex;
}
.flex1 {
  flex: 1;
}
.flexcenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flexcenter span {
  color: #fc5d7b;
}
.fs12 {
  font-size: 12px;
}
.mgr5 {
  margin-right: 5px;
}
.toptext {
  font-size: 12px;
  background: rgba(255, 246, 246, 1);
  padding: 10px;
  color: #484848;
}
.authBox {
  margin: 20rpx 10px 0 10px;
  padding: 20rpx;
  background-color: #fff;
  line-height: 80rpx;
  height: 40px;
  display: flex;
  align-items: center;
}
.message {
  width: 719rpx;
  height: 168rpx;
  margin-left: 18rpx;
  margin-top: 20rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  position: relative;
}
.messageBottom {
  position: absolute;
  overflow: hidden;
  left: -21rpx;
  bottom: 2rpx;
  width: 719rpx;
  margin-left: 18rpx;
}
.messageBottom ul {
  display: flex;
}
.messageBottom ul li {
  margin-left: 15rpx;
}
.messageBottom ul li:nth-child(odd) {
  display: inline-block;
  padding: 0 10rpx;
  background: #fc5d7b;
  border: 4rpx solid #fc5d7b;
  color: #333;
  transform: skew(-50deg);
}
.messageBottom ul li:nth-child(even) {
  display: inline-block;
  padding: 0 10rpx;
  background: #5d9afc;
  border: 4rpx solid #5d9afc;
  color: #333;
  transform: skew(-50deg);
}
.NamePhone span:nth-child(1) {
  display: inline-block;
  width: 96rpx;
  height: 44rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  font-weight: bolder;
  color: rgba(50, 58, 69, 1);
  line-height: 44rpx;
  padding: 22rpx 0 0 30rpx;
}
.NamePhone span:nth-child(2) {
  display: inline-block;
  width: 102px;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: bolder;
  color: rgba(50, 58, 69, 1);
  line-height: 22px;
  padding: 22rpx 0 0 22rpx;
}
.site {
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(50, 58, 69, 1);
  line-height: 20px;
  padding: 22rpx 0 0 30rpx;
}
.locationIcon {
  width: 28rpx;
  height: 28rpx;
  padding-right: 8rpx;
  margin-top: 5rpx;
}
.addressBox{
  padding: 10px;
}
.addressDiv{
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  position: relative;
}
.div1{
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.div2{
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.topdiv1{
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.mgr10{
  margin-right: 10px;
}
.footdiv1{
  font-size: 14px;
  display: flex;
}
.footdiv1 div{
  flex: 1;
}
.bigbox{
  background: rgba(243,247,247,1);
  box-sizing: border-box;
  min-height: 100vh;
  padding-bottom: 60px;
}
</style>
