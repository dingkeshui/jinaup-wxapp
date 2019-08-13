<template>
	<div>
		<div class="top" :style="{height:statusBarHeight+'px',paddingTop:statusBarHeight2+'px'}">
			<img class="backIcon mgr5" @click.stop="backPage" style="width:15px;height:15px;" src="/static/images/jt.png">
		</div>
		<div v-if="isShowTop" class="shareText" @click="goRedShare">
			<span>{{isShowTop.amount}}元</span>红包已入账，点击分享再得一个红包
		</div>
		<goods :List="goodsInfo" v-if="goodsInfo" @login="loginFun" :inviteCode="fromInviteCode"></goods>
		<template v-if="isLogin&&goodsInfo">
			<!-- 进店 -->
			<red :redEnvelopeType="2" :id="goodsInfo[0].sid" @showTop="showTop"/>
			<!-- 被分享红包 -->
			<red v-if="rid" :redEnvelopeType="2" :rid="rid" :id="goodsInfo[0].sid" @showTop="showTop"/>
			<!-- 注册红包 -->
			<red :redEnvelopeType="1" :id="goodsInfo[0].sid"  @showTop="showTop"/>
		</template>
	</div>
</template>

<script type="text/javascript">
import goods from '@/components/b/goods.vue'
import { getQueryString } from '@/utils/index'
import red from "@/components/red/red";
import { productMicroInfoDetails,getStoreInfoByStoreId } from '@/pages/b/api/index'

export default {
	data () {
		return {
			id:'',
			goodsInfo: '',
			latitude: '',
			longitude: '',
			statusBarHeight:0,
			statusBarHeight2:0,
			fromInviteCode:'',
			isLogin:false,
			rid:'',
			isShowTop:''
		}
	},
	components:{
		goods,
		red
	},
	onLoad(option){
		let that = this
		that.isShowTop = ''
		if(option.id){
			this.id = option.id
		} else if (option.q) {
	    	let getStr = getQueryString(decodeURIComponent(option.q))
	    	for(let k in getStr){
	          option[k]=getStr[k]
	        }
	    	if(getStr.id){
	      		this.id = getStr.id
	    	}
	    	if(getStr.fromInviteCode){
	      		this.fromInviteCode = getStr.fromInviteCode
	    	}
		}
		if (option.fromInviteCode) {
			this.fromInviteCode = option.fromInviteCode
		}
		if(!this.id){
			wx.reLaunch({
				url:'/pages/b/b_index/main'
			})
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
		console.log('this.fromInviteCode=',this.fromInviteCode)
		this.getInfo()
		wx.getSystemInfo({
		    success: res => {
		      //导航高度
		      console.log('导航高度',res.statusBarHeight+46)
		      that.statusBarHeight = res.statusBarHeight+46
		      that.statusBarHeight2 = res.statusBarHeight
		    }, fail(err) {
		      console.log(err)
		    }
		})
	},
	onShow(){
		this.loginFun()
	},
	methods:{
		loginFun(){
			let loginResult = wx.getStorageSync('loginResult')
			if(loginResult){
				this.isLogin = true
			}else{
				this.isLogin  =false
			}
		},
		goRedShare(){
			wx.navigateTo({
				url:'/pages/redShare/main'
			})
		},
		showTop(item){
			this.isShowTop = item
		},
		backPage () {
			wx.reLaunch({
				url:'/pages/b/b_index/main'
			})
		},
		async getInfo(){
			let that = this
			// 获取商品详情
			let res = await productMicroInfoDetails({pid:that.id})
			console.log('商品详情----',res)
			if (res.data.res_code === 1){
				let storeId = res.data.result.sid
				// 获取店铺信息
				let storeinfo = await getStoreInfoByStoreId({id:storeId})
				console.log('获取店铺信息----',storeinfo)
				if (storeinfo.data.res_code ==1) {
					// 获取当前经纬度
					wx.getLocation({
					 	type: 'wgs84',
					 	async success (info) {
							that.latitude = info.latitude
							that.longitude = info.longitude

							let s  = that.space(storeinfo.data.result.latitude, storeinfo.data.result.longitude, that.latitude, that.longitude)
							storeinfo.data.result.distance = s
							res.data.result.storeVo = storeinfo.data.result
							that.goodsInfo = [res.data.result]
							console.log('goodsInfo+storeVo信息',that.goodsInfo)
					 	},
					 	fail(){
					 		console.log('定位失败')
					 		storeinfo.data.result.distance = null
					 		res.data.result.storeVo = storeinfo.data.result
							that.goodsInfo = [res.data.result]
					 	}
					})
				}
			} else {
				wx.showToast({
		            title: res.data.message?res.data.message:'获取商品信息失败', //提示的内容,
		            icon: 'none' //图标,
		        })
			}
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
	}
}
</script>

<style type="text/css">
.backIcon{
	transform:rotate(180deg)
}
.top{
	box-sizing: border-box;
	padding-left: 10px;
	display: flex;
	align-items: center;
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
</style>
