<template>
	<!-- 商家订单详情 -->
  <div class="wrap">
      <div class="container">

		<div class="state">
			<p class="stateText">待发货</p>
      <!-- <p class="stateText" v-if="detailData.processStatus===1&&!cancelOeder">待付款</p>
      <p class="stateText" v-if="detailData.processStatus===2">待发货</p>
      <p class="stateText" v-if="cancelOeder&&detailData.processStatus===1">超时取消</p>
      <p class="stateText" v-if="detailData.processStatus===3">待收货</p> -->
      <div class="orderNumber_Box">
        <p class="orderNumber">
          订单编号 :
          <span>123456789123456789</span>
        </p>
        <p class="copy" @click="copyClick(123456789123456789)">复制</p>
      </div>
			<p class="orderNumber">
        付款时间 : 2019-01-10 16:07:51
        <span></span>
      </p>
      <!-- <p class="orderNumber" v-if="detailData.processStatus===2||detailData.processStatus===3">
        付款时间 :
        <span v-for="(item,index) in payTimes" :key="index">{{item}}</span>
      </p>
      <p class="orderNumber" v-if="!detailData.processStatus===1">
        收货时间 :
        <span></span>
      </p> -->
    </div>

    <div class="addressBox">
      <div class="addressDiv">
        <div class="div1">
          <div class="topdiv1">
            <span class="mgr10">李倩倩</span>
            <span>15278383560</span>
          </div>
          <div class="footdiv1">
            <img class="locationIcon" src="/static/images/locationIcon.png" alt>
            <div>北京市朝阳区焦奥中心A座902室</div>
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
        <span>2019-01-17 17:18:50</span>
      </p>
      <div class="shop">
        <dl>
          <dt>
            <img src="/static/images/d4.png" alt>
          </dt>
          <dd>
            <p class="txt">帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</p>
            <p class="size">
              规格:
              <span>XL</span>
            </p>
            <p class="price">
              ￥
              <span>52.50</span>
              <span>x1</span>
            </p>
          </dd>
        </dl>
        <!-- <template v-if="detailData.processStatus==5||detailData.processStatus==1||item.productType==1"></template>
        <template v-else>
          <div v-if="item.buyerRefundStatus>0" class="refundSpan">已申请退款</div>
        </template> -->
        <div class="qrcode">
          <!-- 商家二维码 -->
          <p>商家二维码</p>
          <div class="codeimg">
            <img class="img1" src="/static/images/erweima.png" @click="scanCode" alt="">
            <img src="/src/pages/b/img/code@2x.png" alt="" class="img2" v-show="isShowScanedCode">
          </div>
        </div>
      </div>
      <ul>
				 <li>
          <p>支付方式</p>
          <p>
            <!-- <span v-if="detailData.payChannel===1">微信</span> -->
            <span>支付宝</span>支付
          </p>
        </li>
        <li>
          <p>运费</p>
          <p>
            ￥
            <span>0</span>
          </p>
        </li>
        <!-- <li
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
        </li> -->

        <li>
          <p>订单金额</p>
          <p>
            ￥
            <span>35</span>
          </p>
        </li>
				<li>
          <p class="orderOther">订单备注：请发正品请发正品请发正品请发正品请发正品正 请发正品请发正品请发正品请发正品请发正品正请发正品请 发正品请发正品请发正品请发正品正。</p>
        </li>
        <!-- <li v-if="detailData.processStatus===2||cancelOeder||detailData.processStatus===3">
          <p>实付金额</p>
          <p>
            ￥
            <span>{{detailData.payAllMoney}}</span>
          </p>
        </li> -->
      </ul>

    </div>

		<div class="service">
			<p
        class="customer_service"
        @click.stop="goDeliver"
      >发货</p>
      <p
        class="customer_service"
        @click.stop="goLogistics"
      >物流详情</p>
    </div>
	</div>
  <!-- 发货弹出框 -->
    <div class="modal" v-if="showModal">
      <div class="modalContent">
        <img src="../img/close2.png" alt="" @click="closeModal">
        <p class="text">发货</p>
        <div class="logistics public" @click="goChorseExpress">
					<label for="target1">物流公司</label>
					<input type="text" id="target1" placeholder="请选择物流公司">
					<img src="../img/back1.png" alt="">
				</div>
        <div class="number public">
					<label for="target2">快递单号</label>
					<input type="text" id="target2" placeholder="请输入快递单号" focus>
				</div>
        <button class="call">确认发货</button>
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
export default {
	data () {
		return {
      showModal: false,
      isShowScanedCode: false
		}
  },
  methods: {
    // 点击发货，显示模态框
    goDeliver () {
      this.showModal = true
    },
    // 关闭模态框
    closeModal () {
      this.showModal = false
    },

    // 物流详情
    goLogistics () {
      wx.navigateTo({
        url: `/pages/b/b_order/b_ShopOrderLogistics/main`
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

		// 选择快递
		goChorseExpress () {
			wx.navigateTo({
				url: '/pages/b/b_order/b_ShopChoseExpress/main'
			})
		},

    // 扫码二维码
    scanCode () {
      wx.scanCode({
        success: (res) => {
          console.log(res)
          wx.showToast({
		        title: "扫码成功",
		      })
          this.isShowScanedCode = true
        }
      })
    }
  },
  onLoad (params) {
    console.log(params)
    if (params.scanCode == 200) {
      this.isShowScanedCode = true
    }
  }
}
</script>

<style type="text/css">
.wrap{
  /* height: 100%; */
  width: 100%;
  position: relative;
}


/* 弹出发货模态框 */
.modal{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
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
  padding: 24rpx;
	box-sizing: border-box;
  align-items: center;
}
.modalContent>img{
  position: absolute;
  width: 68rpx;
  height: 68rpx;
  right: 0;
  top: -120rpx;
}
.modalContent .text{
  font-size:36rpx;
  font-family:PingFangSC-Medium;
  font-weight:bold;
  color:rgba(50,58,69,1);
}
.modalContent .public {
	width:100%;
	height:64px;
	line-height: 64rpx;
	box-shadow:0px 1px 0px 0px rgba(246,246,246,1);
	display: flex;
	/* justify-content: space-between; */
	align-items: center;
	font-size:32rpx;
	font-family:PingFangSC-Medium;
	color:rgba(50,58,69,1);
}

.modalContent .logistics img{
	float: right;
	height: 28rpx;
	width: 16rpx;
	transform: rotateZ(180deg);

}
.modalContent .public label{
	font-weight:500;
}
.modalContent .public input{
	padding-left: 44rpx;
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
  /* height: 76rpx; */
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
.merchandiseNews ul li .orderOther{
	line-height: 60rpx;
	padding-bottom: 30rpx !important;
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
.qrcode p{
  width:70px;
  height:20px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(50,58,69,1);
  line-height:20px;
  padding-left: 20px;
}
.qrcode .codeimg{
  width: 140px;
  height: 140px;
  margin: 23px auto;
  padding-bottom: 23px;
  box-sizing: border-box;
  position: relative;
}
.qrcode .codeimg .img1{
  width: 140px;
  height: 140px;
}
.qrcode .codeimg .img2{
  width: 152px;
  height: 146px;
  position: absolute;
  top: -6px;
  left: -8px;

}
</style>
