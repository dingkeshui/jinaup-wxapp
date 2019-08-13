<template>
	<div class="box mybox">
		<div class="my_top_box">
			<img mode="aspectFit" style="width:100vw;height:45.89vw;" src="../img/b_my_bg.png" />
			<div class="my_top flex colfff">
				<div class="imgbox">
					<img v-if="isLogin" class="img" :src="userinfo.headUrl">
					<img v-else class="img" src="./img/my.png" @click="showLoginModel = true">
				</div>
				<div class="flex1"  v-if="isLogin">
					<div class="mgb5">
						<span class="mgr10">{{userinfo.nickName}}</span>
						<img v-if="userinfo.userLevel==1" style="width:34px;height:15.21px;" src="/static/images/my_vip1.png" alt>
						<img v-if="userinfo.userLevel==2" style="width:34px;height:15.21px;" src="/static/images/my_vip2.png" alt>
						<img v-if="userinfo.userLevel==3" style="width:34px;height:15.21px;" src="/static/images/my_vip3.png" alt>
						<img v-if="userinfo.userType==2" style="width:34px;height:15.21px;" src="/static/images/my_vip4.png" alt>
					</div>
					<div class="fs12 mgb5">
						<span class="mgr5">培训师:</span>
						<span>{{userinfo.parentName}}</span>
					</div>
					<div class="fs12 mgb5">
						<span class="mgr5">邀请码:</span>
						<span class="mgr10">{{userinfo.inviteCode}}</span>
						<span class="copySpan" @click="copyFun(userinfo.inviteCode)">复制</span>
					</div>
				</div>
				<div class="flex1 flexvcenter nologinBox" v-else @click="showLoginModel = true">
					点击登陆
				</div>
			</div>
		</div>
		<div class="mgb10 padb10 itemBox">
			<div class="pad10 flex" @click="goOrder(0)">
				<span class="flex1 titleSpan">我的订单</span>
				<span class="titleSpan2">
					<span>查看全部订单</span>
					<span>></span>
				</span>
			</div>
			<div class="flex fs12 pad10">
				<div style="position:relative;" class="flex1 flex2 flexcenter" @click="goOrder(1)">
					<span class="num" v-if="num1.length">{{num1.length}}</span>
					<!-- <span class="num" v-if="num1">{{num1}}</span> -->
					<span v-else></span>
					<img class="iconimg" src="/static/images/b_my_icon1.png" />
					<span style="color:#70757D;">待付款</span>
				</div>
				<div style="position:relative;" class="flex1 flex2 flexcenter" @click="goOrder(2)">
					<span class="num" v-if="num2.length">{{num2.length}}</span>
					<!-- <span class="num" v-if="num2">{{num2}}</span> -->
					<span v-else></span>
					<img class="iconimg" src="/static/images/b_my_icon2.png" />
					<span style="color:#70757D;">待发货</span>
				</div>
				<div style="position:relative;" class="flex1 flex2 flexcenter" @click="goOrder(3)">
					<span class="num" v-if="num3.length">{{num3.length}}</span>
					<!-- <span class="num" v-if="num3">{{num3}}</span> -->
					<span v-else ></span>
					<img class="iconimg" src="/static/images/b_my_icon3.png" />
					<span style="color:#70757D;">待收货</span>
				</div>
			</div>
		</div>
		<div class="mgb10 padb10 itemBox">
			<div class="pad10 flex">
				<span class="flex1 titleSpan">我的服务</span>
			</div>
			<div class="flex fs12 pad10 iconBox">
				<!-- <div style="position:relative;" @click="goScanCode" class="flex2 flexcenter mgb10">
					<img class="iconimg" src="/static/images/b_my_icon24.png" />
					<span style="color:#70757D;">扫一扫</span>
				</div>
				<div style="position:relative;" @click="gopage('a')" class="flex2 flexcenter mgb10">
					<img class="iconimg" src="/static/images/b_my_icon22.png" />
					<span style="color:#70757D;">订单管理</span>
				</div>
				<div style="position:relative;" @click="gopage('c')" class="flex2 flexcenter mgb10">
					<img class="iconimg" src="/static/images/b_my_icon25.png" />
					<span style="color:#70757D;">商品管理</span>
				</div> -->
				<div style="position:relative;" @click="gopage('e')" class="flex2 flexcenter mgb10">
					<img class="iconimg" src="/static/images/b_my_icon23.png" />
					<span style="color:#70757D;">我的分享</span>
				</div>
				<template v-if="showShop">
					<div style="position:relative;" @click="gopage('d')" class="flex2 flexcenter mgb10">
						<img class="iconimg" src="/static/images/b_my_icon21.png" />
						<span style="color:#70757D;">店铺管理</span>
					</div>
					<div style="position:relative;" @click="gopage('b')" class="flex2 flexcenter mgb10">
						<img class="iconimg" src="/static/images/b_my_icon26.png" />
						<span style="color:#70757D;">我的店铺</span>
					</div>
				</template>
				<template v-else>
					<div style="position:relative;" @click="gopage('f')" class="flex2 flexcenter mgb10">
						<img class="iconimg" src="/static/images/b_my_icon27.png" />
						<span style="color:#70757D;">店主认证</span>
					</div>
				</template>
				<div style="position:relative;" @click="gopage('g')" class="flex2 flexcenter mgb10">
					<img class="iconimg" src="./img/icon.png" />
					<span style="color:#70757D;">我的红包</span>
				</div>
			</div>
		</div>
		<btab onIndex="c"></btab>
		<!-- 登陆弹框 -->
		<div v-if="showLoginModel" class="loginModelBox" catchtouchmove="ture">
			<div class="noLoginMain">
				<div>
					<img src="/static/images/headimg.png">
				</div>
				<div class="text">您还未登陆</div>
				<div class="text">请先登陆再进行操作</div>
				<div class="butBox">
					<div @click="showLoginModel = false">暂不登陆</div>
					<div>立即登陆<Login v-if="!isLogin" @loginFun="loginFun" /></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import btab from '@/components/b/tab.vue'
import {getCMicroOrderList, getShopInfo, orderTips, getUser} from '@/pages/b/api/index'
import Login from "@/components/user/login"; //组件

export default {
	data () {
		return {
			userinfo:"",
			num0: '',
			num1:'',
			num2:'',
			num3:'',
			showShop: false,
			user: '',
			inviteCode: '',
			isLogin:false,
			showLoginModel:false
		}
	},
	onLoad(){

	},
	onShow () {
		this.onShowFun()
		this.showLoginModel = false
	},
	methods:{
		loginFun(){
			this.showLoginModel = false
			this.onShowFun()
		},
		// 初始化
		async onShowFun(){
			var that = this
      // let trackId = wx.getStorageSync('trackId')
			let loginResult = wx.getStorageSync('loginResult')
			if(loginResult){
				this.isLogin = true
				this.userinfo = loginResult.userInfo
			}else{
				this.isLogin = false
				return
			}
			let res = await getUser()
			console.log('获取个人信息',res.data.result)
			if (res.data.res_code === 1) {
				if(res.data.result.userType==2){
		          let tiem = new Date().getTime()
		          if(tiem>=res.data.result.expireDate){
		            res.data.result.userType=0
		          }
		        }
				that.user = res.data.result
		      	loginResult.userInfo = res.data.result
		      	wx.setStorage({
		      	  key: "loginResult",
		      	  data: loginResult
		      	})
				// console.log('user',that.user)
				if (res.data.result.userIdentity === 1) {
					this.showShop = true
				} else{
					this.showShop = false
				}
			}

	      	wx.getStorage({
		        key: "inviteCode",
		        success: function(res) {
		          that.inviteCode = res.data
		        }
			})
			console.log('获取的邀请码',that.inviteCode)

			// 获取各种订单数
    		const res0 = await getCMicroOrderList({
				state: 0,
	    	    pageIndex: 1,
	    	    pageSize: 10000
			})
			if (res0.data.res_code === 1) {
				this.num0 = res0.data.result
				console.log('获取各种订单数res0',res0)
				this.num1 = res0.data.result.filter(item => item.processStatus === 1)
				this.num2 = res0.data.result.filter(item => item.processStatus === 2)
				this.num3 = res0.data.result.filter(item => item.processStatus === 3)
				// console.log('待发货',this.num2)

				// const res = await orderTips()
				// console.log('获取订单列表各项提示数res',res)
				// this.num1 = res.data.result.pendingPaymentNumber
				// this.num2 = res.data.result.pendingDeliverNumber
				// this.num3 = res.data.result.pendingReceivingNumber
			}
		},
		// 复制功能
		copyFun(val){
			wx.setClipboardData({
		        data: val,
		        success(res) {
		          wx.showToast({
		            title: "已复制邀请码到剪切板", //提示的内容,
		            icon: "none" //图标,
		          });
		        }
		    })
		},

		gopage(item){
			if(!this.isLogin){
				this.showLoginModel = true
				return
			}
			let that = this
			switch (item) {
				case 'a':
				wx.navigateTo({
				  url: '/pages/b/b_order/b_ShopOrderList/main'
				})
				break;
				case 'b':
				wx.navigateTo({
				  url: '/pages/b/b_shopInfo/b_shopGoods/main?id='+that.user.uid
				})
				break;
				case 'c':
				wx.navigateTo({
				  url: '/pages/b/b_goodsList/main'
				})
				break;
				case 'd':
				wx.navigateTo({
				  url: '/pages/b/b_shopInfo/b_shopInfo/main'
				})
				break;
				case 'e':
				wx.navigateTo({
				  url: '/pages/b/b_shareList/main'
				})
				break;
				case 'f':
				wx.navigateTo({
				  url: '/pages/b/b_addshop/main'
				})
				break;
				case 'g':
				wx.navigateTo({
				  url: '/pages/myRed/main'
				})
				break;
			}
		},
		goOrder(e){
			if(!this.isLogin){
				this.showLoginModel = true
				return
			}
			wx.navigateTo({
			  url: '/pages/b/b_order/b_orderList/main?type='+e
			})
		},

		// 扫一扫
		// goScanCode () {
		// 	wx.scanCode({
		// 	  success: (res) => {
		// 			console.log(res)
		// 			wx.navigateTo({
		// 				url: res.result
		// 			})
		// 		},
		// 		fail: (res) => {
		// 			console.log(res)
		// 		}
		// 	})
		// }
	},
	computed:{

	},
	components:{
		btab,
		Login
	}
}
</script>

<style type="text/css" scoped>
.my_top_box{
	position: relative;
}
.my_top{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	align-items: center;
}
.my_top .imgbox{
	width: 60px;
	height: 60px;
	position: relative;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 20px;
	margin-left: 20px;
}
.copySpan{
	background:rgba(145,180,255,1);
	padding: 2px 10px;
	border-radius: 10px;
}
.mybox{
	background-color:rgba(243,247,247,1);
}
.titleSpan{
	color: #323A45;
	font-size: 15px;
}
.titleSpan2{
	color: #999DA2;
	font-size: 14px;
}
.itemBox{
	background-color: #fff;
}
.itemBox .num{
	width: 15px;
	height: 15px;
	line-height: 13px;
	color: #FC5D7B;
	border-radius: 50%;
	border:1px solid #FC5D7B;
	font-size: 10px;
	text-align: center;
	position: absolute;
	top: 0px;
	left: 50%;
	background-color: #fff;
	margin-left: 8px;
}
.iconimg{
	width: 40px;
	height: 40px;
}
.iconBox{
	flex-wrap: wrap;
}
.iconBox>div{
	width: 25%;
}
.nologinBox{
	position: relative;
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
.loginModelBox .text{
	font-weight: bold;
}
.loginModelBox img{
	width: 60px;
	height: 60px;
	margin-bottom: 20px;
}
.loginModelBox .butBox{
	display: flex;
	margin-top: 20px;
	justify-content: center;
	font-size: 14px;
}
.loginModelBox .butBox>div:nth-child(2n-1){
	color: #33D6C5;
	border:1px solid #33D6C5;
	padding: 5px 10px;
	border-radius: 5px;
	margin-right: 20px;
}
.loginModelBox .butBox>div:nth-child(2n){
	color: #fff;
	border:1px solid #33D6C5;
	background-color: #33D6C5;
	padding: 5px 10px;
	border-radius: 5px;
	position: relative;
}
</style>
