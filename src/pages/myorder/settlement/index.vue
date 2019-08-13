<template>
  <div class="wrap">
    <div class="infoBox">
      <img class="img2 mgr5" src="/static/images/ding.svg" alt="">
      <span class="mgr5">请在</span>
      <span class="on" v-if="minute=='结'" id="minute">{{minute}}</span>
      <span v-if="minute!='结'">
        <span class="on" id="minute">{{minute>9?minute:'0'+minute}}</span>
        <span class="on">:</span>
      </span>
      <span class="mgr5 on" v-if="second=='结'" id="second">{{second}}</span>
      <span class="mgr5 on" v-else id="second">{{second}}</span>
      <span>内付款，时间结束后订单将会被取消</span>
    </div>
    <div class="money">
      <div class="paymoney">
        订单应付金额
        <span>（含邮）</span>
      </div>
      <div class="payprice">{{totalAmount}}</div>
      <div class="paydescribe">
        订单总计:
        <span>￥{{totalAmount}}</span>
      </div>
    </div>
    <button class="gopay" @click="gopay">去付款</button>
  </div>
</template>

<script>
import {goPayOrder} from "@/api/index"
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      minute: 29,
      second: 59,
      createTime: "",
      totalAmount: "",
      orderId: "",
      timer:''
    };
  },
  computed: {
    ...mapState({
      items: state => state.settlement.items,
      payway: state => state.settlement.payway
    })
  },
  methods: {
    ...mapMutations({
      updateState: "settlement/updateState"
    }),
    radioChange(e) {
      this.updateState({ val: e.target.value });
    },
    async gopay() {
      let that = this
      let result = await goPayOrder({payChannel:1,orderNumber:that.orderId,platform:4})
      if (result.data.res_code == 1) {
        wx.requestPayment({
          timeStamp: result.data.result.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
          nonceStr: result.data.result.nonceStr, //随机字符串，长度为32个字符以下,
          package: result.data.result.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
          signType: "MD5", //签名算法，暂支持 MD5,
          paySign: result.data.result.sign, //签名,具体签名方案参见小程序支付接口文档,
          success: res => {
            console.log("支付成功", res);
            wx.reLaunch({
              url: "/pages/myorder/cashDetails/main?price="+that.totalAmount+'&number='+that.orderId+'&isok='+1
            });
          },
          fail: () => {
            console.log("支付失败");
            wx.reLaunch({
              url: "/pages/myorder/cashDetails/main?price="+that.totalAmount+'&number='+that.orderId+'&isok='+2
            });
          },
          complete: () => {}
        });
      } else {
        wx.showToast({
          title:result.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    setTime(){
      let that = this;
      console.log('进入计时')
      clearInterval(this.timer)
      this.timer = setInterval(function() {
        that.second--
        if (that.second == 0 && that.minute == 0) {
          that.minute = "结";
          that.second = "束";
          clearInterval(this.timer);
        }
        if (that.second == 0) {
          that.second = 59;
          that.minute--;
        }
        if (that.second < 10) that.second = "0" + that.second;
        // if (that.second < 10) that.second = "0" + that.second;
        that.minute = that.minute;
        that.second = that.second;
      }, 1000);
    }
  },
  onLoad(val) {
    let that = this;
    that.totalAmount = val.totalAmount;
    that.createTime = val.createTime;
    that.orderId = val.orderId;
    var data = new Date().getTime();
    var data2 = new Date(val.createTime.replace(/-/g,"/")).getTime();
    console.log("data...", data,val.createTime, data2, data - data2);
    var cTime = data - data2;
    var time = 30 * 60 * 1000;
    if (cTime < time){
      console.log('待付款',time-cTime)
      let num1 = parseInt((time-cTime)/1000/60)
      let num2 = parseInt(((time-cTime)/1000)%60)
      console.log(num1,num2)
      that.minute = num1
      that.second = num2
      that.setTime()
    } else {
      console.log('')
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f3f7f7;
}
.top {
  width: 100%;
  height: 72rpx;
  display: flex;
  font-size: 24rpx;
  background: #fff6f6;
  color: #484848;
}
.top_djs {
  display: flex;
}
.top_djs p:first-child {
  width: 10%;
}
.top_djs p:nth-child(2) {
  width: 13%;
}
.top_djs p:nth-child(3) {
  width: 77%;
}
.top .img2 {
  width: 10%;
  width: 28rpx;
  height: 30rpx;
  margin-top: 20rpx;
  margin-left: 34rpx;
  margin-right: 6rpx;
}
.top .heicolor {
  color: #fc5d7b;
  width: 50px;
  text-align: center
}
.top p {
  width: 90%;
  line-height: 72rpx;
}
.money {
  width: 94%;
  height: 320rpx;
  background: #fff;
  border-radius: 12rpx;
  margin: 0 auto;
  text-align: center;
  margin-top: 22rpx;
}
.money .paymoney {
  width: 420rpx;
  height: 44rpx;
  font-size: 32rpx;
  color: #323a45;
  line-height: 44rpx;
  margin: 0 auto;
  margin-top: 38rpx;
}
.money .payprice {
  width: 122rpx;
  height: 64rpx;
  font-size: 56rpx;
  color: #fc5d7b;
  font-weight: bold;
  line-height: 64rpx;
  margin: 0 auto;
  margin-top: 26rpx;
  margin-bottom: 34rpx;
}
.money .paydescribe {
  width: 208rpx;
  height: 34rpx;
  font-size: 24rpx;
  margin: 0 auto;
  color: #484848;
  margin-top: 10rpx;
}
.payway {
  width: 94%;
  height: 203rpx;
  background: #fff;
  margin: 0 auto;
  margin-top: 20rpx;
}
.payway div {
  width: 100%;
  height: 100rpx;
  box-shadow: 0px 1px 0px 0px rgba(246, 246, 246, 1);
}
.zfb {
  width: 100%;
  height: 100rpx;
  display: flex;
}
.zfb image {
  width: 10%;
  height: 100%;
}
.zfb .payimg {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  margin-top: 28rpx;
  margin-left: 8rpx;
}
.zfb .chooseimg {
  width: 40rpx;
  height: 40rpx;
  margin-top: 20rpx;
  margin-right: 48rpx;
}
.zfb p {
  width: 80%;
  height: 100%;
  font-size: 28rpx;
  line-height: 40rpx;
  margin-top: 30rpx;
  margin-left: 10rpx;
}
.gopay {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 110rpx;
  color: #fff;
  border-radius: 0;
  line-height: 110rpx;
  background: linear-gradient(
    217deg,
    rgba(248, 99, 103, 1) 0%,
    rgba(251, 37, 121, 1) 100%
  );
}
.infoBox{
  line-height: 35px;
  background:rgba(255,246,246,1);
  font-size: 12px;
  padding: 0px 10px;
  display: flex;
  align-items: center;
  color: #484848;
}
.mgr5{
  margin-right: 5px;
}
.on{
  color: #fc5d7b;
}
.infoBox img{
  width: 15px;
  height: 15px;
}
</style>
