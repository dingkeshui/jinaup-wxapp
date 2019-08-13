<template>
	<!-- 订单详情 -->
  <div class="wrap">
      <div class="container">

			<div class="remind" v-if="orderMain.processStatus ===1 && timeResult">
        <img src="/static/images/remindIcon.png" alt>
        <p>
          请在
          <span>{{minute}}:{{second}}</span>内付款，时间结束后订单将会被取消。
        </p>
        <!-- <p>
          提交订单后
          <span>30:00</span>内未付款，订单已取消
        </p> -->
      </div>

		<div class="state" style="margin-top:10px;">
			<p class="stateText" v-if="orderMain.processStatus ===1 && timeResult">待付款</p>
			<p class="stateText" v-if="orderMain.processStatus ===2">待发货</p>
			<p class="stateText" v-if="orderMain.processStatus ===3">待收货</p>
			<p class="stateText" v-if="orderMain.processStatus ===5 && !timeResult">已取消</p>
      <p class="stateText" v-if="orderMain.processStatus ===6">已退款</p>
			<p class="stateText" v-if="orderMain.processStatus ===9">交易完成</p>

      <div class="orderNumber_Box">
        <p class="orderNumber">
          订单编号 :
          <span>{{orderMain.orderNumber}}</span>
          <span class="copy" @click="copyClick(orderMain.orderNumber)">复制</span>
        </p>
        <p class="orderNumber" v-if="orderMain.processStatus ===3">
          付款时间 :
          <span>{{orderMain.payTime2}}</span>
        </p>
        <p class="orderNumber" v-if="orderMain.processStatus ===9">
          收货时间 :
          <span>{{orderMain.deliveryTime2}}</span>
        </p>

      </div>
      <!-- <p class="orderNumber" v-if="detailData.processStatus===2||detailData.processStatus===3">
        付款时间 :
        <span v-for="(item,index) in payTimes" :key="index">{{item}}</span>
      </p>
      <p class="orderNumber" v-if="!detailData.processStatus===1">
        收货时间 :
        <span></span>
      </p> -->
    </div>

    	<!-- 地址	 -->
		<div class="addr" style="margin-top:10px;" v-if="orderMain.receivingMethod === 1">
			<div class="addr-left" @click="goNav">
				<div class="addrname">
					<img src="/static/images/adress.png" alt="">
					<span>{{orderMain.storeAddressDetail}}</span>
				</div>
				<p v-if="orderMain.distance">商家距离您{{orderMain.distance}}</p>
			</div>
			<div class="phone" style="height:45px;line-height:4px;">
        <span style="width:5px;height:9px;color:#999DA2;">></span>
				<!-- <img src="../img/phone.png" alt="" @click="goContact"> -->
			</div>
		</div>

    <div class="addressBox" v-if="orderMain.receivingMethod == 2">
      <div class="addressDiv">
        <div class="div1">
          <div class="topdiv1">
            <span class="mgr10">{{orderMain.consignee}}</span>
            <span>{{orderMain.consigneePhone}}</span>
          </div>
          <div class="footdiv1">
            <img class="locationIcon" src="/static/images/locationIcon.png" alt>
            <div>{{orderMain.addressDetail}}</div>
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
      <p class="OrderTime" @click="goShop">
        <span>{{orderMain.storeName}}</span>
      </p>
      <div class="shop">
        <dl>
          <dt>
            <img :src="orderMain.productPicture" alt mode="aspectFit">
          </dt>
          <dd>
            <p class="txt">{{orderMain.title}}</p>
            <!-- <p class="size">
              规格:
              <span>XL</span>
            </p> -->
            <p class="price">
              ￥
              <span>{{orderMain.currentPrice}}</span>
              <span>x{{orderMain.buyNum}}</span>
            </p>
            <p>
              <div v-if="orderMain.processStatus>1" @click="showModel = true" class="refundBut">
                <span>申请退款</span>
              </div>
            </p>
          </dd>
        </dl>
        <!-- <template v-if="detailData.processStatus==5||detailData.processStatus==1||item.productType==1"></template>
        <template v-else>
          <div v-if="item.buyerRefundStatus>0" class="refundSpan">已申请退款</div>
        </template> -->
        <!-- <div v-if="orderMain.processStatus == 5" class="refundSpan">已申请退款</div>
        <div class="refundBtnBox" v-if="orderMain.processStatus == 2 || orderMain.processStatus == 3 || orderMain.processStatus == 9" @click.stop="applyRefund">
          <p>申请退款</p>
        </div> -->
        <!-- 商家二维码 -->
        <!-- <div class="qrcode" v-if="orderMain.receivingMethod === 1"> -->
        <div class="qrcode" v-if="orderMain.receivingMethod == 1 && (orderMain.processStatus ==2 || orderMain.processStatus ==3 || orderMain.processStatus ==4 ||orderMain.processStatus ==5||orderMain.processStatus ==9)">
          <div class="p"><p>商家二维码</p><p>有效日期:{{orderMain.expiryStartDate2}}-{{orderMain.expiryEndDate2}}</p> </div>
          <div class="codeimg" v-show="!showModal">
            <canvas  class="img1" canvas-id="canvas">
              <!-- <cover-image class="img2" src="./img/code.png" v-if="orderMain.qrcodeIsUse == 1"></cover-image> -->
              <cover-image class="img2" src="/static/images/code.png" v-if="orderMain.qrcodeIsUse == 1"></cover-image>
            </canvas>
            <!-- <img src="../img/code@2x.png" alt="" class="img2" v-if="orderMain.qrcodeIsUse === 1"> -->
          </div>
        </div>

      </div>
      <ul>
        <li v-if="orderMain.receivingMethod == 2">
          <p>运费</p>
          <p>
            ￥
            <span>{{orderMain.freight}}</span>
          </p>
        </li>
        <li>
          <p>支付方式</p>
          <p>
            <!-- <span v-if="orderMain.payChannel===1">微信</span> -->
            <span>微信</span>支付
          </p>
        </li>
        <li>
          <p>订单总计</p>
          <p>
            ￥
            <span>{{orderMain.totalAmount}}</span>
          </p>
        </li>
        <li v-if="orderMain.rid">
          <p>红包</p>
          <p>
            -￥
            <span>{{orderMain.redEnvelopeAmount}}</span>
          </p>
        </li>
        <li>
          <p>实付金额</p>
          <p>
            ￥
            <span>{{orderMain.payAmount}}</span>
          </p>
        </li>
      </ul>

    </div>

		<div class="service">
      <p
        class="payment"
        @click.stop="payment(orderMain)"
        v-if="orderMain.processStatus===1"
      >去付款</p>
			<p
        class="customer_service"
        @click.stop="goContact"
      >联系商家</p>
      <p
        class="customer_service"
        @click.stop="goLogistics"
        v-if="orderMain.receivingMethod==2 && (orderMain.processStatus===3 || orderMain.processStatus===9)"
      >物流详情</p>
      <p
			class="confirm_receipt"
      v-if="orderMain.processStatus===3"
      @click.stop="ensure()"
      >确认收货</p>

    </div>
	</div>
  <!-- 联系商家弹出框 -->
    <div class="modal" v-if="showModal" @click.stop="closeModal">
      <div class="modalContent">
        <img src="../img/close2.png" alt="" @click.stop="closeModal">
        <div class="successBox">
          <img src="../img/success2.png" alt="">
        </div>
        <p class="text">商家电话</p>
        <p class="phone">{{orderMain.storePhone}}</p>
        <button class="call" @click.stop="handleCall(orderMain.storePhone)">拨打电话</button>
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

<script type="text/javascript">
import {getMicroOrderInfo, getPrepayId, confirmReceipt} from '@/pages/b/api/index'
import store from '@/store/index.js'
var qrCodeJs = require("@/utils/qrCode.js")
export default {
	data () {
		return {
      storeId:'',
      showModal: false,
      isShowScanedCode: false,
      orderMain: '',
      orderCreateTime:'',
      orderNumber: '',
      storeName: '',
      title: '',
      minute: 29,
      second: 59,
      timeResult: '',
      timer: null,
      latitude: '',
      longitude:'',
      showModel:false
		}
  },
  async onLoad (params) {
    // console.log(params)
    // this.orderCreateTime = params.time
    this.orderNumber = params.number
    // this.storeName = params.name
    // this.name = params.title

    if (params.scanCode == 200) {
      this.isShowScanedCode = true
    }
    this.getOrderDetail()
  },
  onShow () {
    this.getOrderDetail()
    this.timeResult = this.func(this.orderCreateTime)
    if (!this.timeResult){
      // 此时订单已取消,重新请求该页面
      this.getOrderDetail()
      return
    }
    clearInterval(this.timer)
    this.setTime()
  },
  methods: {
    // 获取订单详情
    async getOrderDetail () {
      const that = this
      let res = await getMicroOrderInfo({orderNumber:that.orderNumber})
      console.log('订单详情', res)
      if (res.data.res_code === 1){
        that.orderCreateTime = res.data.result.createTime
        that.storeName = res.data.result.storeName
        that.name = res.data.result.title
        that.storeId = res.data.result.storeId
        wx.getLocation({
		     	type: 'wgs84',
		     	async success (info) {
		    		// console.log('获取的当前位置经纬度',info)
		    		that.latitude = info.latitude
            that.longitude = info.longitude

            // 店铺距离处理
            res.data.result.distance = that.space(res.data.result.latitude, res.data.result.longitude, that.latitude, that.longitude)
				    if (res.data.result.distance < 0.1 || res.data.result.distance == '<100米') {
				    		res.data.result.distance = '<100米'
				    } else {
				    	res.data.result.distance = `${Number(res.data.result.distance).toFixed(1)}km`
				    }
            that.getOrderInfo(res)
		     	},
          fail(){
            res.data.result.distance = null
            that.getOrderInfo(res)
          }
		    })

      }
    },
    getOrderInfo(res){
      let that= this
      // 有效期时间戳处理
      res.data.result.expiryStartDate2 = that.formatDate1(res.data.result.expiryStartDate)
      res.data.result.expiryEndDate2 = that.formatDate1(res.data.result.expiryEndDate)
      res.data.result.payTime2 = that.formatDate(res.data.result.payTime)
      res.data.result.deliveryTime2 = that.formatDate(res.data.result.deliveryTime)
      console.log('orderMain',that.orderMain)
      that.orderMain = res.data.result
      that.orderMain.storeName = that.storeName
      that.orderMain.name = that.title
      // qrCodeJs.api.draw(that.$store.state.requsetUrl+that.orderMain.qrCodeUrl, 'canvas', 140, 140)
      qrCodeJs.api.draw(that.orderMain.qrCodeUrl, 'canvas', 140, 140)
      console.log('自提订单二维码',that.orderMain.qrCodeUrl)

      that.orderMain.createTime = this.formatDate(that.orderMain.createTime)
    },
    // 导航
		goNav () {
			let that = this
			wx.getLocation({ //获取当前经纬度
    	  type: 'gcj02', //返回可以用于wx.openLocation的经纬度,官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
    	  success: function (res) {  //因为这里得到的是你当前位置的经纬度,使用微信内置地图查看位置
    	    var latitude = res.latitude
    	    var longitude = res.longitude
    	    wx.openLocation({        //所以这里会显示你当前的位置
    	      latitude: that.orderMain.latitude, //要去的纬度-地址
    	      longitude: that.orderMain.longitude,//要去的经度-地址
    	      address: `${that.orderMain.storeAddressDetail}`,
    	      name:`商家距离您${that.orderMain.distance}`
    	      // scale: 28
    	    })
    	  }
    	})
		},
    // 跳页
    goShop(){
      wx.navigateTo({
        url:'/pages/b/b_shopInfo/b_shopGoods/main?id='+this.storeId
      })
    },
    // 点击联系商家，显示模态框
    goContact () {
      this.showModal = true
    },
    // 去付款
    async payment (item) {
      console.log('去付款订单列表页')
      let that = this
      const result = await getPrepayId({
        orderNumber: item.orderNumber,
        payChannel: item.payChannel,
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
            console.log("支付成功", res)
            var detail = item
            wx.redirectTo({
              url:
             "/pages/b/b_pay/b_payResult/main?price=" + item.totalAmount + "&number=" + item.orderNumber +"&time=" + result.data.systemTime + "&isok=" + 1
            })
          },
          fail: () => {
            // var item = that.orderMain
            console.log("支付失败")
            // wx.redirectTo({
            //   url:
            //     "/pages/b/b_pay/b_payResult/main?price=" + item.totalAmount +
            //     "&number=" + item.orderNumber +
            //     "&time=" + result.data.systemTime +
            //     "&isok=" + 2
            // })

            // wx.navigateBack({
            //   delta: 1
            // })
          }
        })
      } else {
        wx.showToast({
          title: result.data.message?result.data.message:'下单失败',
          icon: "none",
          duration: 1000
        })
      }
    },
    // 关闭模态框
    closeModal () {
      this.showModal = false
    },
    // 打电话
    handleCall (item) {
      let that = this
      wx.makePhoneCall({
        // phoneNumber: that.orderMain.storePhone
        phoneNumber: item
      })
    },
    // 物流详情
    goLogistics () {
      console.log('物流详情',this.orderMain)
      let {logisticsCompanyCode, logisticsNumber, logisticsCompany, consigneePhone} = this.orderMain
      wx.navigateTo({
        url: `/pages/b/b_order/b_orderLogistics/main?com=${logisticsCompanyCode}&num=${logisticsNumber}&phone=${consigneePhone}&company=${logisticsCompany}`
      })
    },
    // 确认收货
    ensure () {
      const that = this
      wx.showModal({
        title: '温馨提示',
        content: '是否确认收货',
        success: async (result) => {
          if (result.confirm) {
            const res = await confirmReceipt({
              orderNumber: that.orderNumber
            })
            console.log('确认收货', res)
            if (res.data.res_code == 1){
              // wx.navigateTo({ url:'/pages/myorder/successfulTrade/main' })
               wx.showToast({
                title: '确认收货成功',
                icon: 'none'
              })
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showToast({
                title: res.data.message?res.data.message:'操作失败！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
      })
    },
    // 复制快递单号
    copyClick (num) {
      wx.setClipboardData({
		    data: num.toString(),
		    success(res) {
		      wx.showToast({
		        title: "复制成功", //提示的内容,
		        icon: "none" //图标,
		      })
		    }
		  })

    },

    // 订单剩余支付时间计算
    func(createTime) {
      let newTime = new Date()
      let temp = newTime - createTime
      console.log('时间差', temp)
      if (temp >= 1800000) {
        return false
      } else {
        let residue = 1800000 - temp
        let m = parseInt(residue / 1000 / 60 % 60)
        m = m < 10 ? '0' + m : m
        let s = parseInt(residue / 1000 % 60)
        s = s < 10 ? '0' + s : s
        this.minute = m
        this.second = s
        return true
      }
    },
    // 倒计时
    setTime() {
      let that = this
      that.timer = setInterval(function() {
        that.second--
        if (that.second == 0 && that.minute == 0) {
          that.timeResult = false
          // 此时订单取消,重新请求该页面
          clearInterval(that.timer)
          that.getOrderDetail()
          return
        }
        if (that.second == 0) {
          that.second = 59
          that.minute--
          if (that.minute == 0) {
            that.timeResult = false
            // 此时订单取消,重新请求该页面
            clearInterval(that.timer)
            that.getOrderDetail()
            return
          }
        }
        if (that.second < 10) that.second = "0" + that.second
      }, 1000)
    },

    // 时间戳过滤成日期格式
    formatDate(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    },
    formatDate1(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '.' + MM + '.' + d;
    },
    // 基于经纬度计算两地之间的距离
    space(lat1, lng1, lat2, lng2) {
      console.log(lat1, lng1, lat2, lng2)
      var radLat1 = lat1 * Math.PI / 180.0
      var radLat2 = lat2 * Math.PI / 180.0
      var a = radLat1 - radLat2
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
      s = s * 6378.137
			s = Math.round(s * 10000) / 10000
			// s = s < 1? '<1' : s.toFixed(2)
      return s  // 单位千米
    }

    // 扫码二维码
    // scanCode () {
    //   wx.scanCode({
    //     success: (res) => {
    //       console.log(res)
    //       wx.showToast({
		//         title: "扫码成功",
		//       })
    //       this.isShowScanedCode = true
    //     },
    //     // 扫码失败
    //     fail: () => {
    //       wx.navigateTo({
    //         url: `/pages/b/b_order/b_orderMain/errScanCode/main`
    //       })
    //     }
    //   })
    // }
  }
}
</script>

<style type="text/css">
	/* 地址 */
	.addr{
		padding: 30rpx 40rpx 28rpx 40rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow:0px 1px 0px 0px rgba(246,246,246,1);
		background-color: #fff;
	}
	.addr .addr-left{
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.addr .addr-left .addrname{
		display: flex;
		align-items: center;
	}
	.addr .addr-left img{
		width:26rpx;
		height:32rpx;
	}
	.addr .addr-left span{
    font-size:18px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(50,58,69,1);
    line-height:25px;
		margin-left: 10rpx;

		width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
	}
	.addr .addr-left p{
		font-size:28rpx;
		color:rgba(153,157,162,1);
		padding-left: 36rpx;
	}
	.addr .phone{
		width: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.addr .phone img{
		width:22px;
		height:27px;
	}
.wrap{
  /* height: 100%; */
  width: 100%;
  position: relative;
}


/* 弹出联系商家模态框 */
.modal{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 99999;
  background:rgba(0,0,0,.4);
}
.modal .modalContent{
  /* height: 582rpx; */
  width: 620rpx;
  margin: 50% auto;
  background:rgba(255,255,255,1);
  opacity: 1;
  border-radius:8px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 62rpx 0;
  align-items: center;
}
.modalContent>img{
  position: absolute;
  width: 68rpx;
  height: 68rpx;
  right: 0;
  top: -120rpx;
}
.successBox{
  width: 124rpx;
  height: 124rpx;
}
.successBox img{
  width: 124rpx;
  height: 124rpx;
}
.modalContent .text{
  font-size:36rpx;
  font-family:PingFangSC-Medium;
  font-weight:bold;
  color:rgba(50,58,69,1);
  margin: 32rpx 0;
}
.modalContent .phone{
  font-size:60rpx;
  font-family:DINAlternate-Bold;
  font-weight:bold;
  color: #FC5D7B;
  margin-bottom: 48rpx;
}
.modalContent .call{
  width:412rpx;
  height:88rpx;
  line-height: 88rpx;
  background:rgba(93,154,252,1);
  border-radius:7px 7px 7px 7px;
  font-size:36rpx;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color: #FFFFFF;
}

/* 主体内容 */
.container {
  width: 100%;
  background: #f3f7f7;
  padding-bottom: 84px;
}

/* 申请退款 */
.refundBtnBox{
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
/* 固定 */
.service{
	width: 100%;
	height: 128rpx;
	background-color: #fff;
	position: fixed;
	bottom: 0;
	display: flex;
	justify-content:flex-end;
	align-items: center;
	padding: 34rpx 42rpx;
	box-sizing: border-box;
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
  /* display: flex; */
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

/* 商家二维码 */
.wrap merchandiseNews .qrcode{
  /* height:400rpx; */
  width: 100%;
}
.qrcode .p{
  /* width:70px; */
  height:20px;
}
.qrcode .p p:first-child{
  float: left;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(50,58,69,1);
  line-height:20px;
  padding-left: 20px;
}
.qrcode .p p:last-child{
  float: right;
  font-size:11px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(252,93,123,1);
  height:20px;
  padding-right: 14px;
}
.qrcode .codeimg{
  width: 140px;
  height: 140px;
  margin: 23px auto;
  /* margin-bottom: 23px; */
  box-sizing: border-box;
  position: relative;
}
.qrcode .codeimg .img1{
  width: 140px;
  height: 140px;
  /* position: absolute; */
  /* left:50%;
  top: 50%;
  transform: translate(-50%,-50%); */
}
.qrcode .codeimg .img2{
  width: 140px;
  height: 140px;
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
  /* top: -20px;
  left: -20px; */
  /* z-index: 999; */
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
  .refundBut{
    text-align: right;
    margin-top: 10px;
  }
  .refundBut span{
    display: inline-block;
    padding: 5px 10px;
    border:1px solid #BBBBBB;
    border-radius: 5px;
  }
</style>
