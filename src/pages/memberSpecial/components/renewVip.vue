<template>
	<div>
		<image id="topimg" mode="widthFix" class="topimg" :src="imgInfo.imgUrl"></image>
		<div class="listBox">
			<div class="itemBox2" v-for="(item,index) in list" :key="index" @click="goPage(item)">
				<div class="item">
					<div class="imgBox2">
						<image class="img" lazy-load :src="item.mainImgUrl" mode="aspectFit"></image>
					</div>
					<div class="titleBox2">{{item.title}}</div>
					<div class="footBox flex">
						<div class="span1 flex1">￥{{item.salesPrice}}</div>
						<div class="but">立即购买</div>
					</div>
				</div>
			</div>
		</div>
		<template v-if="loginUserinfo.userType">
			<div @click="goshare" :class="['divBut','center',{'iPhoneX':iPhoneXFun}]">
				<div>一键邀请<Login v-if="!isLogin" @loginFun="loginFun" /></div>
			</div>
		</template>
		<template v-else>
			<div @click="changTop" :class="['divBut','center',{'iPhoneX':iPhoneXFun}]">
				<div>一键开通<Login v-if="!isLogin" @loginFun="loginFun" /></div>
			</div>
		</template>
	</div>
</template>

<script type="text/javascript">
import { getMemberTopic,getMemberGoodsTopic,getUser } from '@/api/index'
import Login from "@/components/user/login"; //组件

export default {
	data(){
		return {
			imgInfo:'',
			pageIndex:1,
			list:[],
			noMore:false,
			loginUserinfo:''
		}
	},
	components:{
		Login
	},
	onReachBottom(){
    	console.log('滚动加载',this.noMore)
    	if(!this.noMore){
    		this.pageIndex++
    		this.getList()
    		this.onshowFun()
    	}
  	},
	onLoad(e){
		console.log('会员中心',e)
		this.noMore = false
		this.pageIndex = 1
	    this.getImg()
	},
	async onShow() {
		this.onshowFun()
	},
	computed:{
		iPhoneXFun(){
			return this.$store.state.iPhoneX
		}
	},
	methods:{
		loginFun(){
			this.onshowFun()
		},
		onshowFun(){
			const loginResult = wx.getStorageSync('loginResult')
		    if(loginResult){
		    	this.isLogin = true
		      this.loginUserinfo = loginResult.userInfo
		    } else {
		    	this.isLogin = false
		      this.loginUserinfo = {
		        userType:0
		      }
		    }
		},
		changTop(){
			if(!this.isLogin){
				return
			}
			const query = wx.createSelectorQuery()
			query.select('#topimg').boundingClientRect(function(res){
				console.log('res',res)
				if(res.height){
					wx.pageScrollTo({
						scrollTop:res.height
					})
				}
			})
			query.exec()
		},
		async getImg(){
			let res = await getMemberTopic({type:0})
			console.log('体验会员专题图片',res)
			if (res.data.res_code==1) {
				this.imgInfo = res.data.result
				this.getList()
			} else {

			}
		},
		//url解析
	    getQueryString(url) { 
	      if(url) { 
	          url=url.substr(url.indexOf("?")+1); //字符串截取，比我之前的split()方法效率高 
	      } 
	      var result = {}, //创建一个对象，用于存name，和value 
	      queryString =url || location.search.substring(1), //location.search设置或返回从问号 (?) 开始的 URL（查询部分）。 
	      re = /([^&=]+)=([^&]*)/g, //正则，具体不会用 
	      m; 
	      while (m = re.exec(queryString)) { //exec()正则表达式的匹配，具体不会用 
	          result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]); //使用 decodeURIComponent() 对编码后的 URI 进行解码 
	      } 
	      return result; 
	    },
		// 去分享
	    goshare () {
	    	if(!this.isLogin){
	    		return
	    	}
	      wx.navigateTo({
	        url: "/pages/specialShare/main?type=2&uiType=3"
	      });
	    },
		async getList(){
			console.log('参数',this.sild,this.uiType)
			let res = await getMemberGoodsTopic({tid:this.imgInfo.tid,pageIndex:this.pageIndex})
			console.log('会员专题商品',res)
			if (res.data.res_code==1) {
				this.list = this.list.concat(res.data.result)
				if (res.data.result.length<20) {
					this.noMore = true
				}
			} else {

			}
		},
		goPage (item) {
			console.log('跳页',item)
			wx.navigateTo({
	            url: "/pages/go2detail/main?id=" + item.pid
	        });
		}
	}
}
</script>

<style type="text/css" scoped>
	.topimg{
		width: 100%;
	}
	.listBox{
		background-color: rgba(255,249,239,1);
		padding-bottom: 55px;
	}
	.span1{
		color: #FC5D7B;
		font-size: 22px;
		margin-right: 5px;
	}
	.span2{
		color: #484848;
		font-size: 12px;
		text-decoration: line-through;
	}
	.itemBox2{
		width: 100vw;
		box-sizing: border-box;
		padding: 5px 5px;
	}
	.item{
		width: 100%;
		border-radius: 5px;
		background-color: #fff;
	}
	.imgBox2{
		width: 100%;
		height: 44.17vw;
		position: relative;
	}
	.imgBox2 .img{
		width: 100%;
		height: 44.17vw;
	}
	.titleBox2{
		color: #333333;
		font-size: 16px;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		padding: 5px;
	}
	.footBox{
		padding: 5px;
	}
	.but{
		color: #fff;
		align-items: center;
		display: flex;
		border-radius: 3px;
		background-color: #D5AD88;
		padding: 0px 10px;
		font-size: 14px;
	}
	.divBut{
		position: fixed;
		bottom: 70px;
		width: 200px;
		background-color: #FFEAA8;
		color: #926031;
		height: 40px;
		line-height: 40px;
		border-radius:20px;
		left: 50%;
		margin-left: -100px;
	}
	.divBut.iPhoneX{
		bottom: 120px;
	}
	.divBut>div{
		position: relative;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
	}
</style>