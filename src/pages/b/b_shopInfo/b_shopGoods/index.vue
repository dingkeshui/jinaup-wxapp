<template>
<!-- 我的店铺 -->
	<div class="shop-wrap" :style="{paddingTop:statusBarHeight2+'px'}">
	<!-- <scroll-view scroll-y @scrolltolower="getMore"> -->
		<!-- 上部分店铺信息 -->
		<div class="bPageTop" :style="{paddingTop:statusBarHeight+'px'}">
			<div @click="backFun" class="backIcon"><div><img src="/static/images/jt.png" style="width:15px;height:15px;"></div></div>
			<div>{{shopName}}</div>
		</div>
		<div v-if="isShowTop" class="shareText" @click="goRedShare">
			<span>{{isShowTop.amount}}元</span>红包已入账，点击分享再得一个红包
		</div>
		<div class="top-shopname">
			<div class="top-left">
				<img :src="storeInfo.headIco?storeInfo.headIco:storeImg" alt="">
			</div>
			<div class="top-right">
				<p style="line-height:18px;">{{storeInfo.storeName}}</p>
				<div class="ban">
					<div class="text">
						<span v-if="storeInfo.auditState==2"><img  alt=""> 已认证</span>
						<span style="color:#FC5D7B;border: 1rpx solid #FC5D7B;" v-if="storeInfo.isNewStore===1">新店开业</span>
					</div>
					<img src="../img/tuiguang1.png" alt="" @click="goShare" style="width:68px;height:26px;" mode="aspectFit">
				</div>
			</div>
		</div>
		<!-- 地址	 -->
		<div class="addr">
			<div class="addr-left" @click="goNav">
				<div class="addrname">
					<img src="/static/images/adress.png" alt="">
					<span>{{storeInfo.storeRegion}}{{storeInfo.storeAddressDetail}}</span>
				</div>
				<!-- <p>商家距离您{{storeInfo.distance3}}</p> -->
				<p v-if="isCan">商家距离您{{distance3?distance3:storeInfo.distance3}}</p>
			</div>
			<div class="phone">
				<img src="../img/phone.png" alt="" @click="goContact">
			</div>
		</div>
		<!-- 认证资质 -->
		<div class="authentication">
			<div class="auth-left">
				<img src="../img/zizhiicon.png" alt="">
				<span>认证资质</span>
			</div>
			<div class="auth-right" @click="goAuthentication">
				<span>查看</span>
				<img src="../img/more.png" alt="">
			</div>
		</div>

		<!-- 商品 -->
		<goods :List="storeProduct" shop="toShop" @login="loginFun" v-if="storeProduct.length"></goods>
		<!-- 若没有数据显示 -->
  	<div class="nullBox" v-else>
			<img mode="aspectFit" src="/static/images/dfh.png">
			<span>暂时没有商品哦~</span>
		</div>

		<!-- 联系电话弹出框 -->
    <div class="modal" v-if="showModal" @click="closeModal">
      <div class="modalContent">
        <img src="../img/close2.png" alt="" @click="closeModal">
        <div class="successBox">
          <img src="../img/success2.png" alt="">
        </div>
        <p class="text">商家电话</p>
        <p class="phone">{{storeInfo.servicePhone}}</p>
        <button class="call" @click="handleCall(storeInfo.servicePhone)">拨打电话</button>
      </div>
    </div>

		<div class="addMoreBox" v-if="storeProduct.length">
  	  <span v-if="hasMore" @click.stop="getMore">加载更多</span>
  	  <span v-else>没有更多啦！</span>
  	</div>
	<!-- </scroll-view> -->
	<!-- 领取红包 -->
	<template v-if="isLogin">
		<!-- 进店 -->
		<red :redEnvelopeType="2" :id="storeId" @showTop="showTop" />
		<!-- 被分享红包 -->
		<red v-if="rid" :redEnvelopeType="2" :rid="rid" :id="storeId" @showTop="showTop" />
		<!-- 注册红包 -->
		<red :redEnvelopeType="1" :id="storeId" @showTop="showTop" />
	</template>
	<!-- 登陆弹框 -->
    <div v-if="showLoginModel" class="loginModelBox" catchtouchmove="ture">
		<div class="noLoginMain">
			<div>
			  <img src="/static/images/headimg.png">
			</div>
			<div class="logintext">您还未登陆</div>
			<div class="logintext">请先登陆再进行操作</div>
			<div class="loginbutBox">
			  <div @click="showLoginModel = false">暂不登陆</div>
			  <div>立即登陆<Login v-if="!isLogin" @loginFun="loginFun" /></div>
			</div>
		</div>
    </div>
	</div>
</template>

<script type="text/javascript">
import {getStoreProductInfo,getStoreInfoByStoreId} from '@/pages/b/api/index'
import goods from '@/components/b/goods.vue'
import { getQueryString } from '@/utils/index'
import red from "@/components/red/red";
import Login from "@/components/user/login";

export default {
	data () {
		return {
			storeId:'',
			storeVo: '',
			storeInfo: '',
			storeProduct: '',
			storeProduct1: '',
			pageIndex: 1,
			showModal: false,
			isShowScanedCode: false,
			hasMore: true,
			// storeImg: '../img/jina.png',  //店铺默认头像
			storeImg: '/static/images/jina.png',  //店铺默认头像
			latitude: '',
			longitude: '',
			distance3: '',
			shopName:'店铺',
			statusBarHeight:'',
			statusBarHeight2:'',
			// 是否可以获取授权
			isCan:true,
			// 是否显示头部点击分享获取红包
			isShowTop:'',
			rid:'',
			isLogin:false,
			showLoginModel:false
		}
	},
	onLoad (options) {
		console.log('options===',options,getQueryString)
		let that = this
		Object.assign(this.$data, this.$options.data())
		that.pageIndex = 1
		this.isShowTop = ''
		this.isLogin = false
		this.storeId = ''
		this.storeProduct = []
		if(options.id){
			this.storeId = options.id
		}
		wx.getStorage({
			key:'rid',
			success(e){
				that.rid = e.data
				wx.removeStorage({
				  key: 'rid',
				  success (res) {
				  }
				})
			}
		})
		if (options.q){
			let getStr = getQueryString(decodeURIComponent(options.q))
			for(let k in getStr){
	          options[k]=getStr[k]
	        }
		    if(getStr.id){
		      	this.storeId = getStr.id
		    }
		}
		if(!this.storeId){
			wx.reLaunch({
				url:'/pages/b/b_index/main'
			})
		}
		if (options.distance) {
			this.distance3 = options.distance
		}
		wx.getSetting({
		  success(res) {
		    if (!res.authSetting['scope.userLocation']) {
		    	console.log('用户未授权地理位置')
				wx.authorize({
					scope: 'scope.userLocation',
					success () {
					  // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
					  that.getAdInfo()
					},
					fail(){
						console.log('获取授权失败')
						that.pageIndex = 1
						that.getStoreInfo()
						that.storeProduct = []
						that.getStoreProductInfo()
						that.isCan = false
					}
				})
		    } else {
		    	console.log('用户已经授权地理位置')
		    	that.getAdInfo()
		    }
		  }
		})
		wx.getSystemInfo({
		    success: res => {
		      //导航高度
		      that.statusBarHeight = res.statusBarHeight
		      that.statusBarHeight2 = res.statusBarHeight+46
		    }, fail(err) {
		      console.log(err)
		    }
		})
	},
	onShow () {
		// this.storeProduct = []
		this.showLoginModel = false
		this.loginFun()
	},
	onReachBottom() {
		this.getMore()
	},
	methods: {
		loginFun(){
			let loginResult = wx.getStorageSync('loginResult')
			if(loginResult){
				this.isLogin = true
				this.showLoginModel = false
			}else{
				this.isLogin  =false
			}
		},
		showTop(item){
			console.log('item==========================',item)
			this.isShowTop = item
		},
		goRedShare(){
			wx.navigateTo({
				url:'/pages/redShare/main'
			})
		},
		backFun(){
			let num = getCurrentPages()
			if(num.length<2){
				wx.reLaunch({url:'/pages/b/b_index/main'})
			}else{
				wx.navigateBack({
					delta:1
				})
			}
		},
		getAdInfo () {
			let that = this
			wx.getLocation({
			 	type: 'wgs84',
			 	async success (res) {
			 		console.log('获取经纬度')
					// console.log('获取的当前位置经纬度',res)
					that.latitude = res.latitude
					that.longitude = res.longitude
					that.pageIndex = 1
					that.getStoreInfo()
					that.storeProduct = []
					that.getStoreProductInfo()
			 	}
			})
		},
		// 获取店铺信息
		async getStoreInfo () {
			let that = this
			const res = await getStoreInfoByStoreId({id:that.storeId})
			console.log('店铺信息',res)
			if (res.data.res_code==1){
				console.log(1001)
				if (!this.distance3&&this.isCan) {
					let s  = that.space(res.data.result.latitude, res.data.result.longitude, that.latitude, that.longitude)
					console.log('店铺距离计算1',s)
					if (s < 0.1 || s == '<100米') {
							s = '<100米'
					} else {
						s = `${Number(s).toFixed(1)}km`
					}
					console.log('店铺距离计算2',s)
					res.data.result.distance3 = s
				}
				console.log(1002)
				res.data.result.isDistance = 1
				console.log(1003)
				that.storeInfo = res.data.result
				console.log(1004)

				that.shopName = res.data.result.storeName
			} else {
				console.log('123')
				wx.showToast({
				  title: res.data.message?res.data.message:'店铺信息获取失败',
				  icon: 'none',
				  duration: 2000
				})
			}
		},
		// 获取店铺商品
		async getStoreProductInfo () {
			let that = this
			// wx.showLoading({
		 //       title: '加载中'
		 //    })
			const res = await getStoreProductInfo({
				pageIndex: that.pageIndex,
				status:1,
				sid: that.storeId
			})
			console.log('店铺商品',res)
			if (res.data.res_code === 1) {
				res.data.result.forEach((item) => {
					item.storeVo = that.storeInfo
					// item.storeVo = that.storeVo
				})
				that.storeProduct.push(...res.data.result)
				wx.hideLoading()
			}
			else {
				that.hasMore = false
				wx.hideLoading()
			}
		},
		// 点击联系电话，显示模态框
    goContact () {
    	if(!this.isLogin){
    		this.showLoginModel = true
    		return
    	}
      this.showModal = true
    },
    // 关闭模态框
    closeModal () {
      this.showModal = false
    },
    // 打电话
    handleCall (item) {
      wx.makePhoneCall({
        phoneNumber: item
      })
		},
		// 查看资质
		goAuthentication () {
			if(!this.isLogin){
				this.showLoginModel = true
				return
			}
			let that = this
			wx.navigateTo({
				url: `/pages/b/b_shopInfo/b_shopAuthentication/main?id=${that.storeInfo.id}`
			})
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
    	      latitude: that.storeInfo.latitude, //要去的纬度-地址
						longitude: that.storeInfo.longitude,//要去的经度-地址
						address: `${that.storeInfo.storeRegion}${that.storeInfo.storeAddressDetail}`,
    	      // address:`商家距离您${that.storeInfo.distance distance3?distance3:storeInfo.distance3}Km`
    	      name:`商家距离您${that.distance3?that.distance3:that.storeInfo.distance3}`
    	      // name: `${that.storeInfo.storeRegion}${that.storeInfo.storeAddressDetail}`,
    	      // // address:`商家距离您${that.storeInfo.distance distance3?distance3:storeInfo.distance3}Km`
    	      // address:`商家距离您${that.distance3?that.distance3:that.storeInfo.distance3}`
    	      // scale: 28
    	    })
    	  }
    	})
		},
		// 下拉触底时加载更多
		getMore () {
			// console.log('到底了')
			if (!this.hasMore) return
			this.pageIndex++
			this.getStoreProductInfo()
		},
		// 推广店铺
		goShare () {
			if(!this.isLogin){
				this.showLoginModel = true
				return
			}
			let that = this
			wx.navigateTo({
				url:`/pages/b/b_shopInfo/b_shopShare/main?id=${that.storeId}`
			})
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
      return s  // 单位千米
    }
	},
	components: {
		goods,
		red,
		Login
	}
}
</script>

<style type="text/css">
/* 无更多数据 */
.addMoreBox{
  font-size: 14px;
  text-align: center;
  padding: 10px;
  color: #aaa;
}
/* 无商品 */
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
/* 大盒子 */
	.shop-wrap{
		width: 100%;
		/* height: 100%; */
		/* background:rgba(243,247,247,1); */
	}
	scroll-view{
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
	}
/* 上部分店铺信息 */
	.shop-wrap .top-shopname{
		height:120px;
		box-shadow:0px 1px 0px 0px rgba(246,246,246,1);
		display: flex;
		padding: 46rpx 40rpx;
		box-sizing: border-box;
		background-color: #fff;
	}
	.top-shopname .top-left{
		width: 148rpx;
		height: 148rpx;
		margin-right: 20rpx;
	}
	.top-shopname .top-left img{
		width: 148rpx;
		height: 148rpx;
	}
	.top-shopname .top-right{
		/* flex: 1; */
		padding-top: 10rpx;
	}
	.top-shopname .top-right p{
		width: 100%;
		height: 36rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
		font-size:16px;
		font-weight:600;
	}
	.top-shopname .top-right .ban{
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
	}
	.top-shopname .top-right .text span{
		/* width: 124rpx;
		height: 42rpx;
		line-height: 42rpx; */
		padding: 2rpx;
		border: 1rpx solid #E2BE98;
		border-radius: 4rpx;
		color: #E2BE98;
		font-size:24rpx;
		font-weight:500;
		margin-right: 12rpx;
	}
	.top-shopname .top-right img{
		width: 136rpx;
		height: 52rpx;
		float: right;
	}

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
		font-size:36rpx;
		font-weight:400;
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
	/* 认证资质 */
.authentication{
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 40rpx 40rpx 40rpx;
	box-sizing: border-box;
	background-color: #fff;
}
.authentication .auth-left img{
	width: 32rpx;
	height: 32rpx;
	margin-right: 10rpx;
}
.authentication .auth-left span{
	font-size:36rpx;
	font-weight:400;
}
.authentication .auth-right img{
	width: 10rpx;
	height: 18rpx;
	transform: rotateZ(180deg);
	margin-left: 10rpx;
}
.authentication .auth-right span{
	font-size:28rpx;
	font-weight:400;
}

/* 商品 */
.goods-item{
	margin-top: 20rpx;
}

/* 弹出联系电话模态框 */
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
.bPageTop{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	z-index: 5;
	height: 46px;
	line-height: 46px;
	text-align: center;
	background-color: #fff;
}
.bPageTop .backIcon{
	transform:rotate(180deg);
	position:absolute;
	left: 5px;
	padding: 10px;
	bottom: 0px;
	width: 20px;
	height: 30px;
}
.backIcon div{
	position: relative;
	width: 100%;
	height: 100%;
}
.backIcon img{
	position: absolute;
	/*bottom: 1px;*/
	left: 0px;
	top: 5px;
}
.shareText{
	background-color: rgba(255,246,246,1);
	color: #FC5D7B;
	height: 40px;
	line-height: 40px;
	text-align: center;
	font-size: 14px;
}
.shareText span{
	font-size: 18px;
	font-weight: bold;
}
.loginModelBox{
  background-color: rgba(0,0,0,0.4);
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  text-align: center;
}
.loginModelBox .noLoginMain{
  background-color: #fff;
  width: 70vw;
  padding: 20px 10px;
  border-radius: 10px;
}
.loginModelBox .logintext{
  font-weight: bold;
}
.loginModelBox img{
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}
.loginModelBox .loginbutBox{
  display: flex;
  margin-top: 20px;
  justify-content: center;
  font-size: 14px;
}
.loginModelBox .loginbutBox>div:nth-child(2n-1){
  color: #33D6C5;
  border:1px solid #33D6C5;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
}
.loginModelBox .loginbutBox>div:nth-child(2n){
  color: #fff;
  border:1px solid #33D6C5;
  background-color: #33D6C5;
  padding: 5px 10px;
  border-radius: 5px;
  position: relative;
}
</style>
