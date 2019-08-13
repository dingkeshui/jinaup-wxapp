<template>
  <div class="wrap">
    <!-- 付款成功 -->
    <div class="cash_success" v-if="boo">
      <div class="top">
        <img src="/static/images/success.svg">
        <p class="ok">付款成功</p>
        <p>努力配货中</p>
      </div>
      <ul class="bottom">
        <li>
          <p>订单编号:</p>
          <p>{{number}}</p>
        </li>
        <li>
          <p>交易时间:</p>
          <p>{{times}}</p>
        </li>
        <li>
          <p>支付方式:</p>
          <p>微信支付</p>
        </li>
        <li>
          <p>支付金额:</p>
          <p>￥{{price}}</p>
        </li>
      </ul>
      <button class="gopay" @click='goInfo'>查看订单</button>
    </div>

    <!-- 付款失败 -->
    <div class="cash_fail" v-if="!boo">
      <div class="top">
        <img src="/static/images/fail.png">
        <p class="ok">付款失败</p>
        <p>
          请在
          <span class="time">{{minute}}:{{second}}</span>内完成付款
        </p>
      </div>
      <ul class="bottom">
        <li>
          <p>订单总计:</p>
          <p>￥{{price}}</p>
        </li>
        <li>
          <p>应付金额（含邮费）:</p>
          <p class="money">￥{{price}}</p>
        </li>
      </ul>
      <div class="payway">
        <p class="payway_one">
          <img class="payimg" src="/static/images/wx.svg">
          <span>微信支付</span>
        </p>
        <radio class="chooseimg" color="#3DD9E1" :checked="true"></radio>
      </div>
      <button class="gopay" @click='gopay'>去付款</button>
    </div>

    <div class="backtostore flex">
      <div class="flex1 center" @click="goBHome">
        <div class="butDiv butDiv2">返回商城</div>
      </div>
      <div class="flex1 center" @click="showModel=true">
        <div class="butDiv butDiv3">下载APP</div>
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
import {getPrepayId} from '@/pages/b/api/index'
export default {
  data: {
    number: "",
    price: "",
    times: "",
    boo: "",
    minute: 29,
    second: 59,
    createTime: "",
    totalAmount: "",
		orderId: "",
    orderRemarks: '',
    timer: '',
    showModel:false
  },
  onLoad(options) {
    let that = this
    if (options.isok == 1) {
      that.boo = true
    } else {
      that.boo = false
      clearInterval(that.timer)
      that.setTime()
    }
    that.totalAmount = options.totalAmount
    that.createTime = options.time
    that.orderId = options.number
    that.number = options.number
		that.price = options.price
		// that.orderRemarks = options.remark
    var time = new Date()
    that.times = that.func(time.getTime())
    console.log("date", that.times)
  },
  methods: {
    goInfo(){
      wx.navigateTo({
        url:'/pages/b/b_order/b_orderMain/main?number='+this.number
      })
    },
    func(str, year, type) {
      let time = new Date(str)
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      let h = time.getHours()
      let mm = time.getMinutes()
      let s = time.getSeconds()
      let typestr = "-"
      if (type || type == "") {
        typestr = type
      }
      if (year == "day") {
        return (
          y +
          typestr +
          (m < 10 ? "0" + m : m) +
          typestr +
          (d < 10 ? "0" + d : d)
        )
      } else {
        return (
          y +
          typestr +
          (m < 10 ? "0" + m : m) +
          typestr +
          (d < 10 ? "0" + d : d) +
          " " +
          (h < 10 ? "0" + h : h) +
          ":" +
          (mm < 10 ? "0" + mm : mm) +
          ":" +
          (s < 10 ? "0" + s : s)
        )
      }
    },
    goBHome() {
      // wx.switchTab({
      //   url: "/pages/b/b_index/main"
      // })
      wx.navigateTo({
        url: '/pages/b/b_index/main'
      })
    },
    setTime() {
      let that = this
      let timer = null
      timer = setInterval(function() {
        that.second--;
        if (that.second == 0 && that.minute == 0) {
          that.minute = "结"
          that.second = "束"
          clearInterval(timer)
        }
        if (that.second == 0) {
          that.second = 59
          that.minute--
        }
        if (that.second < 10) that.second = "0" + that.second
        that.minute = that.minute
        that.second = that.second
      }, 1000)
      that.timer = timer
    },
    async gopay() {
      let that = this
      console.log('55656566',that.orderId)
      let result = await getPrepayId({
        orderNumber: that.orderId,
        payChannel: 1,
				// remark: this.orderRemarks,
				platform: 4
			})
			 console.log('生成订单---', result)
       if (result.data.res_code == 1) {
        wx.requestPayment({
          timeStamp: result.data.result.timeStamp+'', //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
          nonceStr: result.data.result.nonceStr+'', //随机字符串，长度为32个字符以下,
          package: result.data.result.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
          signType: result.data.result.signType, //签名算法，暂支持 MD5,
          paySign: result.data.result.sign, //签名,具体签名方案参见小程序支付接口文档,
          success: res => {
            console.log("支付成功", res)
            wx.redirectTo({
              url:
             "/pages/b/b_pay/b_payResult/main?price=" + that.price + "&number=" + that.orderId +"&time=" + that.createTime +"&isok=" + 1
            })
          },
          fail: () => {
            console.log("支付失败")
            wx.redirectTo({
              url:
                "/pages/b/b_pay/b_payResult/main?price=" + that.price +
                "&number=" + that.orderId +
                "&time=" + that.createTime +
                "&isok=" + 2
            })
          }
        })
      } else {
        wx.showToast({
          title: result.data.message?result.data.message:'下单失败',
          icon: "none",
          duration: 1000
        })
      }
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
  font-size: 28rpx;
  color: #999da2;
}
.payway {
  width: 100%;
  height: 100rpx;
  background: #fff;
  margin: 0 auto;
  margin-top: 20rpx;
  display: flex;
  border-top: 20rpx solid #f3f7f7;
}
.payway .payway_one {
  width: 90%;
  height: 100%;
  display: flex;
}
.payway .payway_one span {
  display: block;
  line-height: 100rpx;
}
.payway .payimg {
  width: 40rpx;
  height: 40rpx;
  margin-top: 30rpx;
  margin-left: 30rpx;
  margin-right: 14rpx;
}
.chooseimg {
  width: 10%;
  height: auto;
  margin-top: 20rpx;
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
.time {
  color: #fc5d7b;
}
.cash_success {
  width: 100%;
  height: 606rpx;
  background: #fff;
}
.cash_success .top {
  width: 100%;
  height: auto;
  text-align: center;
  font-family: PingFangSC-Medium;
  color: #000;
}
.cash_success .ok {
  font-size: 40rpx;
  margin-top: 6rpx;
}
.cash_success image {
  width: 120rpx;
  height: 120rpx;
  background: #fff;
  margin-top: 68rpx;
  margin-bottom: 26rpx;
}
.cash_success .bottom {
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding: 0 28rpx;
  box-sizing: border-box;
}
.cash_success .bottom li {
  width: 100%;
  height: auto;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.cash_success .bottom li:first-child {
  width: 100%;
  height: auto;
  margin-top: 38rpx;
}
.backtostore {
  margin-top: 180rpx;
}
.cash_fail {
  width: 100%;
  height: 572rpx;
  background: #fff;
}

.cash_fail .top {
  width: 100%;
  height: auto;
  text-align: center;
  font-family: PingFangSC-Medium;
  color: #000;
}
.cash_fail .ok {
  font-size: 40rpx;
  margin-top: 6rpx;
}
.cash_fail image {
  width: 120rpx;
  height: 120rpx;
  background: #fff;
  margin-top: 68rpx;
  margin-bottom: 26rpx;
}
.cash_fail .bottom {
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding: 0 28rpx;
  box-sizing: border-box;
}
.cash_fail .bottom li {
  width: 100%;
  height: auto;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.cash_fail .bottom li:first-child {
  width: 100%;
  height: auto;
  margin-top: 38rpx;
}
.top p:nth-child(3) {
  margin-top: 6rpx;
}
.money {
  color: #fc5d7b;
  font-size: 48rpx;
}
.butDiv{
  width: 100px;
  height: 40px;
  margin: 0px auto;
  line-height: 40px;
  border-radius: 10px;
}
.butDiv2{
  color: #33D6C5;
  border:1px solid #33D6C5;
}
.butDiv3{
  color: #fff;
  background-color: #33D6C5;
  border:1px solid #33D6C5;
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
