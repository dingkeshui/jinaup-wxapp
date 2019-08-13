<template>
<!-- 用户订单列表 -->
	<div class="b-orderWarp">
    <div class="head">
      <span
			:class="tabinfo == 0? 'active' : ''"
			@click="changeactive(0)">全部</span>
			<span
			:class="tabinfo == 1? 'active' : ''"
			@click="changeactive(1)"
			>待付款</span>
			<span
			:class="tabinfo == 2? 'active' : ''"
			@click="changeactive(2)"
			>待发货</span>
			<span
			:class="tabinfo == 3? 'active' : ''"
			@click="changeactive(3)"
			>待收货</span>
    </div>

  <!-- 有订单数据 -->
  <block v-if="orderList.length">
		<scroll-view class="main" scroll-y @scrolltolower="getMore">
			<div class="shop"  @click="goOrdermain(item)" v-for="(item,index) in orderList" :key="index" >
        <div class="state">
          <span style="font-size:28rpx;color:#323A45" class="ellipsis">{{item.storeName}}</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;" v-if="item.processStatus==1">待付款</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;" v-if="item.processStatus==2">待发货</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;" v-if="item.processStatus==3">待收货</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;" v-if="item.processStatus==5">已取消</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;" v-if="item.processStatus==6">已退款</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;" v-if="item.processStatus==9">交易完成</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img :src="item.productPicture" alt="" mode="aspectFit">
          </dd>
          <dt>
            <h3 class="titleEllipsis">{{item.title}}</h3>
            <!-- <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span> -->
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥{{item.orderAmount}}</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×{{item.buyNum}}</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共{{item.buyNum}}件商品 合计：￥
            <em>{{item.totalAmount}}</em>
          </p>
          <div class="box-btn" v-if="item.processStatus==1">
            <button style="margin-right:15rpx;background:#fff;" @click.stop="CancelOrder(item)">取消订单</button>
            <button class="go-payment" @click.stop="goPay(item)">去付款{{item.activityM}}:{{item.activityS}}</button>
          </div>
          <!-- <div v-if="item.processStatus==2">
          </div> -->
          <div class="box-btn">
            <button style="margin-right:15rpx;background:#fff;" @click.stop="goLogistics(item)" v-if="item.receivingMethod==2 && (item.processStatus===3 || item.processStatus===9)">物流详情</button>
            <button v-if="item.processStatus===3" @click.stop="ensure(item)">确认收货</button>
          </div>
          <!-- <div class="box-btn" v-if="item.processStatus==5">
          </div>
          <div class="box-btn" v-if="item.processStatus===9">
            <button style="margin-right:15rpx;background:#fff;" @click.stop="goLogistics(item)">物流详情</button>
          </div> -->
        </dl>
      </div>

      <div class="addMoreBox" v-if="orderList.length>=3">
        <span v-if="hasMore" @click.stop="getMore">加载更多</span>
        <span v-else>没有更多啦！</span>
      </div>

		</scroll-view>
  </block>

  <!-- 若无网络显示 -->
    <div class="offline" v-else-if="showOffline">
      <p>网络竟然崩溃了，请刷新重试~</p>
      <button>刷新</button>
    </div>

  <!-- 若没有数据显示 -->
  <div class="nullBox" v-else>
		<img mode="aspectFit" src="/static/images/wudingdan.png">
		<span>暂时没有订单哦~</span>
	</div>

  </div>
</template>

<script type="text/javascript">
import {getCMicroOrderList, getPrepayId, confirmReceipt, cancelOrder} from '@/pages/b/api/index'
export default {
	data () {
		return {
      minute: 29,
      second: 59,
      // createTime: "",
      times: "",
      tabinfo: 0,
      orderList: [],
      pageIndex: 1,
      pageSize: 10,
      showOffline: false,
      hasMore:true,
      timeFunData: '',
      timeFun:''
		}
  },
  onLoad (params) {
    //判断网路状态
    wx.getNetworkType({
      success: res => {
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (networkType == 'none') {
          this.showOffline = true
        }
      }
    })
    console.log(params)
    this.tabinfo = params.type
    // this.pageIndex = 1
    // this.getOrderList()
  },
  onShow() {
    this.pageIndex = 1
    this.hasMore = true
    this.orderList = []
    this.getOrderList()

  },
  created() {
    console.log('created------')
    let that = this
    if (this.orderList.length) {
      that.timeFun()
    }
  },

	methods: {
    // 获取订单列表
    async getOrderList () {
      let that = this
      wx.showLoading({
        title: '加载中'
      })
      const query = {
        state: that.tabinfo,
        pageIndex: that.pageIndex,
        pageSize: that.pageSize
      }
      const res = await getCMicroOrderList(query)
      console.log('全部订单列表', res)
      if (res.data.res_code === 1){
        wx.hideLoading()

        // 处理待付款剩余时间
        res.data.result.map((val,index)=>{
					if(val.processStatus==1){
            let time = that.func(val.createTime)
            if (time){
              console.log('待付款剩余时间',time)
              val.activityM = time.minute
              val.activityS = time.second
              val.isActiveStatus = 1

              // clearInterval(that.timeFunData)
			        that.timeFunData = setInterval(()=>{
			        	val.activityS--
			        	val.activityS = val.activityS < 10 ? '0' + val.activityS : val.activityS
						    if (val.activityS <= 0) {
						    	val.activityS = 59
						    	val.activityM--
						    	val.activityM = val.activityM < 10 ? '0' + val.activityM : val.activityM
							    if (val.activityM <= 0 && val.activityS==0) {
                    // 订单取消
                    val.isActiveStatus = 0
                    clearInterval(that.timeFunData)
                    that.getOrderList()
							    }
                  that.$set(that.orderList,index,val)
						    }
			        },1000)
            } else {
              val.isActiveStatus = 0
            }
          }
        })
        that.orderList.push(...res.data.result)

      } else {
        that.hasMore = false
        wx.hideLoading()
      }
    },
    // 订单剩余支付时间计算
    func(createTime) {
      let newTime = new Date()
      let temp = newTime - createTime
      console.log('时间差', temp)
      if (temp >= 1800000) {
        return ''
      } else {
        let residue = 1800000 - temp
        let m = parseInt(residue / 1000 / 60 % 60)
        m = m < 10 ? '0' + m : m
        let s = parseInt(residue / 1000 % 60)
        s = s < 10 ? '0' + s : s
        return {minute:m,second:s}
      }
    },
    // 倒计时
    timeFun () {
			console.log('倒计时函数开始')
			let that = this
			clearInterval(that.timeFunData)
			that.timeFunData = setInterval(()=>{
				console.log('循环开始')
				that.orderList.map((val,index) => {
					if(val.processStatus==1){
            let newTime = new Date()
            let temp = newTime - createTime
            console.log('时间差', temp)
            if (temp >= 1800000) {
              val.isActiveStatus = 0
            } else {
              val.activityS--
						  val.activityS = val.activityS < 10 ? '0' + val.activityS : val.activityS
						  if (val.activityS <= 0) {
						  	val.activityS = 59
						  	val.activityM--
						  	val.activityM = val.activityM < 10 ? '0' + val.activityM : val.activityM
							  if (val.activityM <= 0) {
                  // 订单取消
                  val.isActiveStatus = 0
                  clearInterval(that.timeFunData)
                  that.getOrderList()
							  }
                that.$set(that.orderList,index,val)
						  }
            }
					}
				})
			},1000)
    },

    // 加载更多
    async getMore () {
      if (!this.hasMore) return
      this.pageIndex ++
      this.getOrderList()
      // this.showBottom = true
    },

		changeactive (tab) {
			this.tabinfo = tab
      this.pageIndex = 1
      this.hasMore = true
      this.orderList = []
      this.getOrderList()
    },

    // 去付款
    async goPay (item) {
      console.log('去付款订单列表页')
      let that = this
      const result = await getPrepayId({
        orderNumber: item.orderNumber,
        payChannel: item.payChannel,
        // remark: item.orderRemarks,
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
            // var item = that.item
            console.log("支付失败")
            // wx.redirectTo({
            //   url:
            //     "/pages/b/b_pay/b_payResult/main?price=" + item.totalAmount +
            //     "&number=" + item.orderNumber +
            //     "&time=" + result.data.systemTime +
            //     "&isok=" + 2
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

    // 取消订单
    CancelOrder (item) {
      const that = this
      wx.showModal({
        title: '温馨提示',
        content: '是否取消订单？',
        success: async (res) => {
          if (res.confirm) {
            const res = await cancelOrder({
              orderNumber: item.orderNumber
            })
            console.log('取消订单', res)
            if (res.data.res_code === 1) {
              wx.showToast({
                title: '订单取消成功',
                icon: 'none'
              })
              that.pageIndex = 1
              that.hasMore = true
              that.orderList = []
              that.getOrderList()
            }
          }
        }
      })
    },

    // 确认收货
    ensure (item) {
      const that = this
      wx.showModal({
        title: '温馨提示',
        content: '是否确认收货',
        success: async (result) => {
          if (result.confirm) {
            const res = await confirmReceipt({
              orderNumber: item.orderNumber
            })
            console.log('确认收货', res)
            if (res.data.res_code == 1){
              // wx.navigateTo({ url:'/pages/myorder/successfulTrade/main' })
              wx.showToast({
                title: '确认收货成功',
                icon: 'none'
              })
              that.pageIndex = 1
              that.hasMore = true
              that.orderList = []
              that.getOrderList()
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

		// 跳转到商品订单详情页
		goOrdermain (item) {
			wx.navigateTo({
					url: `/pages/b/b_order/b_orderMain/main?number=${item.orderNumber}&name=${item.storeName}&title=${item.title}&time=${item.createTime}`
      })
    },

    // 跳转到物流详情页
    goLogistics (item) {
      console.log('物流详情',item)
      let {logisticsCompanyCode, logisticsNumber, logisticsCompany, consigneePhone} = item
      wx.navigateTo({
        url: `/pages/b/b_order/b_orderLogistics/main?com=${logisticsCompanyCode}&num=${logisticsNumber}&phone=${consigneePhone}&company=${logisticsCompany}`
      })
    }
  },
}
</script>

<style scoped>
/* 无更多数据 */
.addMoreBox{
  font-size: 14px;
  text-align: center;
  padding: 10px;
  color: #aaa;
}

.ellipsis{
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.titleEllipsis{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
	.b-orderWarp{
		width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f3f7f7;
		/* position: relative; */
	}
	.b-orderWarp .head {
    width: 100%;
    height: 80rpx;
    background: #fff;
    line-height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40rpx;
    box-sizing: border-box;
    font-size: 30rpx;
    position: fixed;
    top: 0;
    left: 0;
		box-shadow:0px 1px 0px 0px rgba(246,246,246,1);
  }
	.head span {
    width: 16%;
    height: 90%;
    color: #484848;
    text-align: center;
    border-bottom: 6rpx solid #fff;
  }

  .active {
    border-bottom: 6rpx solid #5D9AFC !important;
  }
  /* 无订单 */
  .nullBox{
	height: 60vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
  /* display: none; */
}
.nullBox img{
	width: 138px;
	height: 138px;
	margin-bottom: 10px;
}
.nullBox span{
	color: #999DA2;
	font-size: 16px;
}
/* 有订单数据 */
	.main {
    width: 100%;
    /* height: 100%; */
		flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 18rpx;
    box-sizing: border-box;
    margin-top: 80rpx;
		position: absolute;
		top: 0;
		bottom: 0;
		background: #f3f7f7;
    /* display: none; */
  }

  .shop {
    width: 100%;
    background: #fff;
    margin-top: 24rpx;
    border-radius: 12rpx;
  }

  .state {
    width: 100%;
    height: 74rpx;
    line-height: 74rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 24rpx;
  }

  .shop-box {
    width: 100%;
    height: 208rpx;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 12rpx 24rpx;
    /* border-bottom: 1px solid #eee; */
		box-shadow:0px 1px 0px 0px rgba(246,246,246,1);
  }

  .shop-box dd {
    width: 25%;
    height: 100%;
    background: #eee;
  }

  .shop-box dd img {
    width: 100%;
    height: 100%;
  }

  .shop-box dt {
    width: 70%;
    height: 100%;
    font-size: 28rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .shop-bot {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .balance {
    width: 100%;
		padding: 18rpx 20rpx 38rpx 0;
		box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
  }

  .balance p {
    display: flex;
    font-size: 26rpx;
    color: #484848;
		margin-bottom: 42rpx;
  }

  .balance .box-btn {
    height: 60rpx;
    display: flex;
  }

  .box-btn button {
    font-size: 28rpx;
    line-height: 60rpx;
    padding: 0 5px;
  }

  .go-payment {
    background: #FC5D7B;
    color: #fff;
  }
</style>
