
<template>
  <!-- 提交订单 -->
  <div class="wrap">
  <div class="container">
  <block v-if="orderMain.receivingMethod==2">
    <!-- 地址 -->
    <div class="addressBox" @click="goAdd" v-if="onAdressInfo">
      <div class="addressDiv">
        <div class="div1">
          <div class="topdiv1">
            <span class="mgr10">{{onAdressInfo.consignee}}</span>
            <span>{{onAdressInfo.consigneePhone}}</span>
          </div>
          <div class="footdiv1">
            <img class="locationIcon" src="/static/images/locationIcon.png" alt>
            <div>{{onAdressInfo.addressDetail}}</div>
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
    <!-- 新增收货地址  -->
    <div class="addAddr" v-else @click="goAdd">
      <div class="addressDiv">
      + &nbsp; 新增收货地址
      </div>
    </div>
  </block>
    <!-- 商品订单 -->
    <div class="merchandiseNews">
      <p class="OrderTime">
        <span>{{orderMain.storeName}}</span>
      </p>
      <div class="shop">
        <dl>
          <dt>
            <img :src="orderMain.productPicture" alt mode="aspectFit">
          </dt>
          <dd>
            <p class="txt">{{orderMain.title}}</p>
            <p class="price">
              ￥
              <span>{{orderMain.currentPrice}}</span>
              <span>x{{orderMain.buyNum}}</span>
            </p>
          </dd>
        </dl>

      </div>
      <ul>
        <li>
          <p>
            <label>订单备注</label>
            <input type="text" placeholder="选填,请先和商家协商一致" v-model="orderRemarks">
          </p>
        </li>
        <li>
          <p>运费</p>
          <p>
            ￥
            <span>{{orderMain.freight}}</span>
          </p>
        </li>
        <li>
          <p>订单总计</p>
          <p>
            ￥
            <span>{{orderMain.totalAmount}}</span>
          </p>
        </li>
      </ul>
    </div>

    <!-- 选择红红包 -->
    <div class="chosePay" @click="showRedMian = true">
      <div class="flex1">
        <span>红包</span>
      </div>
      <div class="redMoney" v-if="orderMain.rid>0">
        -￥{{orderMain.redEnvelopeAmount}}
      </div>
      <div class="redMoney" v-else>
        暂无红包
      </div>
      <img
        class="yuan2"
        :src="'/static/images/jt.png'"
        alt
      >
    </div>

    <!-- 选择支付方式 -->
    <div class="chosePay">
      <div class="flex1">
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

    <!-- 结算 -->
		<div class="service">
			<p class="total"> <span>总计</span> <strong>￥<span>{{orderMain.payAmount}}</span></strong></p>
      <div class="service-right">
        <p class="payMethod">微信支付</p>
        <button class="goPay" @click="goPay" :disabled="boo">去付款</button>
      </div>
    </div>
	</div>
  <!-- 选择红包 -->
  <div v-if="showRedMian" class="redBox" catchtouchmove="ture" @click="showRedMian = false">
    <div class="redMian" @click.stop>
      <div class="textDiv">
        红包
      </div>
      <scroll-view scroll-y class="scrollBox">
        <div class="itemList">
          <div v-for="(item,index) in redListTime" :key="index" class="item item2" @click="chooseRed(item)">
            <div class="itemTop flex">
              <div class="imgBox">
                <img :src="item.icon?item.icon:'/static/images/jina.png'">
              </div>
              <div class="flex1 main">
                <div class="fs1 ovh">{{item.title}}</div>
                <div class="fs2 ovh">有效期至{{item.time}}</div>
              </div>
              <div>
                <div class="fs3">￥<span>{{item.amount}}</span></div>
                <div class="fs4">{{item.condition}}</div>
              </div>
            </div>
            <div class="itemFoot flex">
              <div class="flex1 left ovh">
                {{item.desc}}
              </div>
            </div>
            <img v-if="item.on" class="onImg" src="./img/on.png">
          </div>
        </div>
      </scroll-view>
      <div class="textDiv" @click="noUseRed">
        不使用红包
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import {editMicroOrder,getPrepayId} from '@/pages/b/api/index'
import {getOrderRed} from '@/api/index'
import { formatTime } from '@/utils/index'
export default {
  data() {
    return {
      isShowScanedCode: false,
      boo: false, // 控制支付方式
      orderMain: '', // 商品信息
      onAdressInfo: '', // 地址信息
      orderRemarks: '', // 订单备注
      showRedMian:false,
      redList:'',
      onRed:'',
      isCanClick:true
    }
  },
  computed:{
    redListTime(){
      if(this.redList){
        this.redList.map(val=>{
          val.time = formatTime(val.expiryEndDate,'day')
          if(val.id==this.orderMain.rid){
            val.on = true
          } else {
            val.on = false
          }
        })
      }
      return this.redList
    }
  },
  methods: {
    noUseRed () {
      this.onRed = {
        id:-1
      }
      this.changeOrder()
      this.showRedMian = false
      if(this.redListTime&&this.redListTime.length){
        this.redList.map(val=>{
          if(val.on){
            val.on = false
          }
        })
      }
    },
    chooseRed(item){
      this.onRed = item
      this.showRedMian = false
      this.changeOrder()
    },
    // 支付方式的切换
    changes() {
      this.boo = !this.boo
    },
    // 添加或修改地址信息
    goAdd() {
      wx.navigateTo({
        url: "/pages/shoppingadress/main?fromOrder=order"
      })
    },
    // 修改订单
    async changeOrder () {
      const that = this
      that.onAdressInfo = wx.getStorageSync("onAdressInfo")
      let postData = {}
      if (that.onAdressInfo) {
        that.orderMain.userAddressId = that.onAdressInfo.uaid
        postData.addressId = that.orderMain.userAddressId || null
      }
      postData.orderNumber = that.orderMain.orderNumber
      if (that.onRed) {
        postData.rid = that.onRed.id
      } else if (that.orderMain.rid) {
        postData.rid = that.orderMain.rid
      }
      console.log('修改订单的参数', postData)
      let res = await editMicroOrder(postData)
      if (res.data.res_code == 1) {
        that.orderMain = res.data.result
        console.log("订单修改成功", res)
      } else {
        console.log("订单修改失败", res)
        wx.showToast({
          title: res.data.message?res.data.message:'订单修改失败',
          icon: "none",
          duration: 2000
        })
      }
    },
    // 提交订单
    async goPay () {
      if(!this.isCanClick){
        return
      }
      console.log('点击支付')
      this.isCanClick = false
      let that = this
      if (that.orderMain.receivingMethod == 2 && !that.onAdressInfo) {
        wx.showToast({
          title: "请添加收货地址",
          icon: "none",
          duration: 1000
        })
        this.isCanClick =  true
        return
      }
      const result = await getPrepayId({
        orderNumber: that.orderMain.orderNumber,
        payChannel: 1,
        remark: this.orderRemarks,
        platform: 4
      })
      // console.log('生成订单---', result)
      if (result.data.res_code == 1) {
        console.log('生成订单成功---', result)
        wx.requestPayment({
          timeStamp: result.data.result.timeStamp+'', //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
          nonceStr: result.data.result.nonceStr+'', //随机字符串，长度为32个字符以下,
          package: result.data.result.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
          signType: result.data.result.signType, //签名算法，暂支持 MD5,
          paySign: result.data.result.sign, //签名,具体签名方案参见小程序支付接口文档,
          success: res => {
            console.log("支付成功", res, that.orderMain)
            var detail = that.orderMain
            wx.redirectTo({
              url:
             "/pages/b/b_pay/b_payResult/main?price=" + detail.totalAmount + "&number=" + detail.orderNumber +"&time=" + result.data.systemTime +"&remark=" + this.orderRemarks + "&isok=" + 1
            })
          },
          fail: () => {
            var detail = that.orderMain
            console.log("支付失败")
            wx.redirectTo({
              url:
                "/pages/b/b_pay/b_payResult/main?price=" + detail.totalAmount +
                "&number=" + detail.orderNumber +
                "&time=" + result.data.systemTime +
                "&remark=" + this.orderRemarks +
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
        this.isCanClick = true
      }
    },
    async getOrderRedFun(){
      let res = await getOrderRed({orderNumber:this.orderMain.orderNumber})
      if(res.data.res_code==1){
        this.redList = res.data.result
      }
    }
  },
  onLoad (params) {
    // 获取商品信息
    this.orderMain = wx.getStorageSync("b_orderMian")
    this.getOrderRedFun()
    this.redList = ''
    this.onRed = ''
  },
  onShow() {
    let that = this
    that.onAdressInfo = wx.getStorageSync("onAdressInfo")
    that.orderMain.onAdressInfo = that.onAdressInfo
    if (that.onAdressInfo && that.orderMain.receivingMethod == 2) {
      that.changeOrder()
    }
  }
}
</script>

<style scoped>
  .wrap{
  height: 100%;
  width: 100%;
  position: relative;
  background: #f3f7f7;
}

/* 主体内容 */
.container {
  width: 100%;
  background: #f3f7f7;
  padding-bottom: 84px;
}

/* 地址 */
.addressBox{
  padding: 10px;
  /* display: none; */
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
/* 新增收货地址 */
.addAddr {
  padding: 10px;
  height: 56px;
  line-height: 56px;
  color: #FC5D7B;
  font-size:16px;
  font-weight:600;
  padding-bottom: 0;
  /* display: none; */
}
.addAddr .addressDiv{
  justify-content: center;
}

/* 线 */
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

/* 商品订单 */
.merchandiseNews {
  width: 719rpx;
  margin-left: 18rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
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
  padding: 0 22rpx;
  display: flex;
  align-items: center;
}
.merchandiseNews ul li:nth-child(1) label{
  width: 150rpx;
}
.merchandiseNews ul li:nth-child(1) input{
  padding-left: 10rpx;
  flex: 1;
  box-sizing: border-box;
}

.merchandiseNews ul li p:nth-child(2) {
  padding-right: 24rpx;
}

/* 支付方式 */
.chosePay{
  padding: 13px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  /*justify-content: ;*/
  align-items: center;
  margin: 0 20rpx 10px 20rpx;
  border-radius:12rpx;
}
.chosePay>div{
  display: flex;
  font-size: 14px;
}
.chosePay img{
  width: 22px;
  height: 22px;
  margin-right: 5px;
  /* vertical-align: middle; */
}
.chosePay span{
  font-size:14px;
  color:rgba(50,58,69,1);
}
.chosePay .yuan{
  width: 20px;
  height: 20px;
  /* vertical-align: middle; */
}
.chosePay .yuan2{
  width: 15px;
  height: 15px;
}
/* 结算 */
.service{
	width: 100%;
	height: 128rpx;
	background-color: #fff;
	position: fixed;
	bottom: 0;
	display: flex;
	align-items: center;
  justify-content: space-between;
	padding-left: 26rpx;
	box-sizing: border-box;
  overflow: hidden;
}
.service .total {
  display: flex;
  color:#FC5D7B;
  justify-content: center;
  align-items: center;
  font-size:28rpx;
  line-height: 128rpx;
}
.service .total strong {
  margin-left: 10rpx;
  font-size:30rpx;
}
.service .total strong span{
  font-size:60rpx;
  font-family:DINAlternate-Bold;
  font-weight:bold;
}
.service .service-right{
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.service .payMethod {
  margin-right: 18rpx;
  font-size:32rpx;
}
.service .service-right .goPay {
  width: 200rpx;
  /* height: 100%; */
  font-size:36rpx;
  text-align: center;
  line-height: 128rpx;
  color:rgba(255,255,255,1);
  background:linear-gradient(217deg,rgba(248,99,103,1) 0%,rgba(251,37,121,1) 100%);
}
.redMoney{
  color: #FC5D7B;
}
.redBox{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);
  z-index: 10;
}
.scrollBox{
  height: 300px;
  padding: 10px 0px;
  box-sizing: border-box;
  background-color: rgba(243,247,247,1);
}
.redMian{
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100vw;
  background-color: #fff;
}
.redMian .textDiv{
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #484848;
  padding: 10px;
}
.itemList{
  margin: 0px 10px;
}
.item{
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 10px;
}
.itemTop{
  margin-bottom: 10px;
}
.itemTop img{
  width: 50px;
  height: 50px;
}
.itemTop .main{
  margin: 0px 10px;
  overflow: hidden;
}
.main .fs1{
  line-height: 30px;
  color: #323A45;
  font-size: 16px;
}
.main .fs2{
  color: #676767;
  font-size: 12px;
}
.fs3{
  color: #FC5D7B;
  font-size: 16px;
  line-height: 30px;
}
.fs3 span{
  font-size: 24px;
}
.fs4{
  font-size: 12px;
  color: #676767;
  text-align: right;
}
.itemFoot{
  border-top: 1px dashed #CBCBCB;
  padding-top: 10px;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
}
.itemFoot .left{
  font-size: 12px;
  color: #999DA2;
}
.ovh{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  position: relative;
}
.right{
  background-color: #FC5D7B;
  color: #fff;
  padding: 0px 15px;
  font-size: 14px;
  border-top-left-radius:2em;
  border-bottom-left-radius:2em;
}
.item2{
  position: relative;
}
.item2:after{
  content: '';
  display: inline-block;
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(243,247,247,1);
  bottom: 31px;
  left: -10px;
}
.item2:before{
  content: '';
  display: inline-block;
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(243,247,247,1);
  bottom: 31px;
  right: -10px;
}
.onImg{
  position: absolute;
  top: 0px;
  right: 0px;
  width: 20px;
  height: 20px;
}
</style>
