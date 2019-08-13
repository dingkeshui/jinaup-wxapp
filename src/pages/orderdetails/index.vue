<template>
  <div class="container">
    <div class="remind" v-if="detailData.processStatus==1">
      <img src="/static/images/remindIcon.png" alt>
      <p v-if="timeout>'00:00'">
        请在
        <span>{{timeout}}</span>内付款，时间结束后订单将会被取消。
      </p>
      <p v-else>
        提交订单后
        <span>30:00</span>内未付款，订单已取消
      </p>
    </div>
    <div class="state">
      <p class="stateText" v-if="detailData.processStatus===1&&!cancelOeder">待付款</p>
      <p class="stateText" v-if="detailData.processStatus===2">待发货</p>
      <p class="stateText" v-if="cancelOeder&&detailData.processStatus===1">超时取消</p>
      <p class="stateText" v-if="detailData.processStatus===3">待收货</p>
      <div class="orderNumber_Box">
        <p class="orderNumber">
          订单编号 :
          <span>{{detailData.orderId}}</span>
        </p>
        <p class="copy" @click="copyOrderNumber(detailData.orderId)">复制</p>
      </div>
      <p class="orderNumber" v-if="detailData.processStatus===2||detailData.processStatus===3">
        付款时间 :
        <span v-for="(item,index) in payTimes" :key="index">{{item}}</span>
      </p>
      <p class="orderNumber" v-if="!detailData.processStatus===1">
        收货时间 :
        <span></span>
      </p>
    </div>
    <div class="addressBox">
      <div class="addressDiv">
        <div class="div1">
          <div class="topdiv1">
            <span class="mgr10">{{detailData.consignee}}</span>
            <span>{{detailData.consigneePhone}}</span>
          </div>
          <div class="footdiv1">
            <img class="locationIcon" src="/static/images/locationIcon.png" alt>
            <div>{{detailData.addressDetail}}</div>
          </div>
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
    <div class="merchandiseNews">
      <p class="OrderTime">
        <span v-for="(item,index) in createTimes" :key="index">{{item}}</span>
      </p>
      <div class="shop" v-for="(item,index) in detailData.products" :key="index" @click="go2Detail(item.pid)">
        <dl>
          <dt>
            <img :src="item.mainImgUrl" alt>
          </dt>
          <dd>
            <p class="txt">{{item.productTitle}}</p>
            <p class="size">
              规格:
              <span>{{item.skuName}}</span>
            </p>
            <p class="price">
              ￥
              <span>{{item.salesPrice}}</span>
              <span>x{{item.productNumber}}</span>
            </p>
          </dd>
        </dl>
        <template v-if="detailData.processStatus==5||detailData.processStatus==1||item.productType==1"></template>
        <template v-else>
          <div v-if="item.buyerRefundStatus>0" class="refundSpan">已申请退款</div>
        </template>
        <div @click="showModel=true" class="refundBtnBox" v-if="detailData.processStatus===2||detailData.processStatus===3">
            <p>申请退款</p>
        </div>
      </div>
      <ul>
        <li>
          <p>运费</p>
          <p>
            ￥
            <span>{{detailData.totalDeliveryMoney}}</span>
          </p>
        </li>
        <li
          v-if="!cancelOeder&&detailData.processStatus===1||detailData.processStatus===2||detailData.processStatus===3"
        >
          <p>税</p>
          <p>
            ￥
            <span>{{detailData.totalTaxationAmount}}</span>
          </p>
        </li>
        <li v-if="detailData.totalDiscountAmount">
          <p>优惠金额</p>
          <p>
            ￥
            <span>{{detailData.totalDiscountAmount}}</span>
          </p>
        </li>
        <li v-if="detailData.processStatus===2||detailData.processStatus===3">
          <p>支付方式</p>
          <p>
            <span v-if="detailData.payChannel===1">微信</span>
            <span v-else>支付宝</span>支付
          </p>
        </li>
        <li>
          <p>订单总计</p>
          <p>
            ￥
            <span>{{detailData.totalAmount}}</span>
          </p>
        </li>
        <li v-if="detailData.processStatus===2||cancelOeder||detailData.processStatus===3">
          <p>实付金额</p>
          <p>
            ￥
            <span>{{detailData.totalAmount}}</span>
          </p>
        </li>
      </ul>
      <div class="service">
        <p
          class="customer_service"
          v-if="detailData.logisticsCode"
          @click.stop="goLogistics"
        >物流详情</p>
        <p
          class="customer_service"
          v-if="detailData.processStatus===2||detailData.processStatus===3"
          @click.stop="goContact"
        >联系客服</p>
        <p
          class="confirm_receipt"
          v-if="!detailData.processStatus===1||detailData.processStatus===3"
          @click="sureFun"
        >确认收货</p>
        <p
          class="payment"
          @click="payment"
          v-if="detailData.processStatus===1&&!cancelOeder && timeout>'00:00'"
        >去付款</p>
      </div>
    </div>
    <!-- 下载App模态框 -->
    <div v-if="showModel" class="model flex flexcenter" catchtouchmove="ture">
      <div class="modelmain">
        <img class="img3" src="/static/images/close.png" @click="showModel = false">
        <img class="img2 mgb10" src="/static/images/jina.png">
        <div class="text">请在客服对话回复“1”</div>
        <div class="text mgb10">下载APP</div>
        <div class="butBox">
          <button class="but" open-type="contact"></button>
          打开客服会话
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { formatTimeout } from "@/utils/index.js";

export default {
  data() {
    return {
      shopState: "",
      timeout: "",
      cancelOeder: false,
      showModel:false
    };
  },
  computed: {
    ...mapState({
      detailData: state => state.shopDetail.detailData,
      createTimes: state => state.shopDetail.createTimes,
      payTimes: state => state.shopDetail.payTimes,
      allMoney: state => state.shopDetail.allMoney
    })
  },
  methods: {
    goLogistics(){
      console.log('物流详情',this.detailData)
      let {logisticsCode, logisticsCompany, consigneePhone, logisticsCompanyCode} = this.detailData;
      wx.navigateTo({ url: `/pages/logistics/main?com=${logisticsCompanyCode}&num=${logisticsCode}&phone=${consigneePhone}&company=${logisticsCompany}` });
    },
    ...mapActions({
      getDatail: "shopDetail/getDatail"
    }),
    //前往地址页面
    goShopping() {
      wx.navigateTo({
        url: "../shoppingadress/main"
      });
    },
    // 跳商品详情
    go2Detail(id){
      wx.navigateTo({ url: '/pages/go2detail/main?id='+id });
    },
    //复制订单编号
    copyOrderNumber(id) {
      wx.setClipboardData({
        data: id,
        success(res) {
          wx.showToast({
            title: "已复制订单编号到剪切板", //提示的内容,
            icon: "none" //图标,
          });
        }
      });
    },
    sureFun(){
      console.log('確認收貨')
      wx.showModal({
          title: '温馨提示',
          content: '是否确认收获',
          success: async (result) => {
            if (result.confirm) {
              let result = await ensureOrder({subOrderId: this.detailData.orderId})
              console.log('result',result)
              if (result.data.res_code == 1){
                wx.navigateTo({ url: '/pages/myorder/successfulTrade/main' });
              } else {
                wx.showToast({
                  title: result.data.message?result.data.message:'操作失敗！',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          }
      })
    },
    //去支付
    payment() {
      // console.log("this.createTimes....", this.detailData);
      wx.navigateTo({
        // url: '/pages/myorder/settlement/main?orderId='+this.orderId
        url:
          "/pages/myorder/settlement/main?orderId=" +
          this.detailData.orderId +
          "&totalAmount=" +
          this.detailData.totalAmount +
          "&createTime=" +
          this.detailData.createTime
      });
    },
    // 去客服
    goContact() {
      wx.navigateTo({
        url: "/pages/artificial/main"
      });
    }
  },
  onLoad: function(options) {
    this.orderId = options.orderId;
    this.orderType = options.orderType;
  },
  async onShow() {
    await this.getDatail({ orderType: this.orderType, orderId: this.orderId });
    console.log('获取详情',this.detailData)
    this.timer = setInterval(() => {
      let timeout = this.detailData.createTime + 30 * 60 * 1000 - +new Date();
      this.timeout = formatTimeout(timeout);
    }, 1000);
  },

  onHide() {
    clearInterval(this.timer);
  }
};
</script>
<style scoped>
.container {
  width: 100%;
  background: #f3f7f7;
}
.refundBtnBox,
.service {
  width: 100%;
  padding-bottom: 22rpx;
  display: flex;
  justify-content: flex-end;
}
.refundBtnBox p {
  margin-right: 24rpx;
  width: 160rpx;
  height: 60rpx;
  font-size: 28rpx;
  text-align: center;
  color: rgba(50, 58, 69, 1);
  line-height: 60rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 8rpx;
  border: 1px solid rgba(187, 187, 187, 1);
}
.customer_service {
  margin-right: 24rpx;
  width: 160rpx;
  height: 60rpx;
  font-size: 28rpx;
  text-align: center;
  color: rgba(50, 58, 69, 1);
  line-height: 60rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 8rpx;
  border: 1px solid rgba(187, 187, 187, 1);
}
.confirm_receipt {
  margin-right: 24rpx;
  width: 160rpx;
  height: 60rpx;
  font-size: 28rpx;
  text-align: center;
  line-height: 60rpx;
  border-radius: 8rpx;
  border: 1px solid #fc5d7b;
  color: #fc5d7b;
}
.payment {
  margin-right: 24rpx;
  width: 160rpx;
  height: 60rpx;
  font-size: 28rpx;
  text-align: center;
  line-height: 60rpx;
  border-radius: 8rpx;
  border: 1px solid #fc5d7b;
  color: #fc5d7b;
}
.remind {
  width: 100%;
  height: 74rpx;
  background: #fff6f6;
  display: flex;
}
.remind img {
  width: 28rpx;
  height: 30rpx;
  padding: 22rpx 0 0 34rpx;
}
.remind p {
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(72, 72, 72, 1);
  line-height: 74rpx;
  margin-left: 10rpx;
}
.remind p span {
  color: #fc5d7b;
}
.state {
  width: 719rpx;
  margin-left: 18rpx;
  margin-top: 20rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  padding-bottom: 26rpx;
}
.stateText {
  width: 108px;
  height: 50rpx;
  font-size: 36rpx;
  font-family: PingFangSC-Medium;
  font-weight: bolder;
  color: rgba(50, 58, 69, 1);
  line-height: 50rpx;
  padding: 22rpx 0 0 30rpx;
}
.orderNumber_Box {
  width: 100%;
  display: flex;
}
.orderNumber {
  height: 34rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(50, 58, 69, 1);
  line-height: 34rpx;
  padding: 18rpx 0 0 30rpx;
}
.copy {
  width: 74rpx;
  height: 34rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 6rpx;
  border: 1px solid rgba(252, 93, 123, 1);
  font-size: 22rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(252, 93, 123, 1);
  line-height: 34rpx;
  text-align: center;
  margin: 18rpx 0 0 30rpx;
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

.merchandiseNews {
  width: 719rpx;
  margin-left: 18rpx;
  margin-top: 20rpx;
  border-radius: 6px;
  /* padding-bottom: 34rpx; */
  background: #fff;
}
.OrderTime {
  width: 300px;
  font-size: 30rpx;
  font-family: PingFangSC-Medium;
  font-weight: bolder;
  color: rgba(50, 58, 69, 1);
  line-height: 42rpx;
  padding: 38rpx 0 38rpx 30rpx;
}
.OrderTime span {
  display: inline-block;
  padding-right: 10rpx;
  font-size: 30rpx;
  font-family: PingFangSC-Medium;
  font-weight: bolder;
  color: rgba(50, 58, 69, 1);
  line-height: 42rpx;
}
.shop dl {
  display: flex;
}
.shop dl dt {
  width: 220rpx;
  height: 100%;
}
.shop dl dd {
  flex: 1;
}
.shop dl dt img {
  width: 180rpx;
  height: 180rpx;
  padding: 16rpx 20rpx;
}
.txt {
  height: 68rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(72, 72, 72, 1);
  line-height: 34rpx;
  padding: 12rpx 24rpx 0 0;
}
.size {
  /* width:110rpx; */
  height: 28rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(153, 157, 162, 1);
  line-height: 28rpx;
  padding: 25rpx 0 0 0;
}
.price {
  height: 34rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(50, 58, 69, 1);
  line-height: 34rpx;
  padding: 25rpx 9rpx 0 0;
}
.price span:nth-child(2) {
  float: right;
  padding-right: 18rpx;
}
.merchandiseNews ul {
  width: 100%;
}
.merchandiseNews ul li {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 76rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(50, 58, 69, 1);
  line-height: 76rpx;
}
.merchandiseNews ul li p:nth-child(1) {
  padding: 0 24rpx;
}

.merchandiseNews ul li p:nth-child(2) {
  padding-right: 24rpx;
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
.refundSpan{
  font-size: 12px;
  text-align: right;
  padding: 0px 10px;
  color: #aaa;
}
.model{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 20;
    background-color: rgba(0,0,0,0.4);
  }
  .modelmain{
    background-color: #fff;
    position: relative;
    width: 70vw;
    padding: 10px;
    margin: 0px auto;
    text-align: center;
    border-radius: 10px;
  }
  .modelmain .img2{
    width: 60px;
    height: 60px;
    border-radius: 5px;
  }
  .modelmain .text{
    font-weight: bold;
  }
  .butBox{
    position: relative;
    background-color: #33D6C5;
    color: #fff;
    height: 40px;
    line-height: 40px;
    width: 200px;
    border-radius: 10px;
    margin: 10px auto;
  }
  .butBox .but{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .img3{
    position: absolute;
    top: -40px;
    right: 0px;
    width: 30px;
    height: 30px;
  }
</style>
