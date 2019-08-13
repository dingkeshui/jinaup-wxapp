<template>
	<div class="divBox">
		<web-view :src="urlStr" binderror="binderrorFun"></web-view>
		<!-- 登陆弹框 -->
		<!-- <template v-else>
		    <div v-if="showLoginModel" class="loginModelBox" catchtouchmove="ture">
		      <div class="noLoginMain">
		        <div>
		          <img src="/static/images/headimg.png">
		        </div>
		        <div class="logintext">您还未登陆</div>
		        <div class="logintext">请先登陆再进行操作</div>
		        <div class="loginbutBox">
		          <div @click="back">暂不登陆</div>
		          <div>立即登陆<Login v-if="!isLogin" @loginFun="loginFun" /></div>
		        </div>
		      </div>
		    </div>
	    </template> -->
	</div>
</template>

<script type="text/javascript">
import Login from "@/components/user/login"; //组件
import { getQueryString } from '@/utils/index'

export default {
	data () {
		return {
			str:'',
			isLogin:false,
			showLoginModel:false,
			e:''
		}
	},
	components:{
		Login
	},
	onLoad(e){
		if(e.q){
			let getStr = getQueryString(decodeURIComponent(e.q))
			for(let k in getStr){
				e[k]=getStr[k]
			}
			delete e.q
		}
		console.log('eeeeeeeee',e)
		this.e = e
		this.onLoadFun(this.e)
	},
	onShow(){
		this.onShowFun()
	},
	computed:{
		urlStr(){
			console.log('str=================',this.str)
			return this.str
		}
	},
	methods:{
		back(){
			wx.navigateBack({
				delta:1
			})
		},
		onShowFun(){
			let loginResult = wx.getStorageSync('loginResult')
			if(loginResult){
				this.isLogin = true
				this.showLoginModel = false
				this.onLoadFun(this.e)
			}else{
				this.isLogin = false
				this.showLoginModel = true
			}
		},
		loginFun(){
			console.log('登陆成')
			this.onShowFun()
		},
		onLoadFun(e){
			console.log('onLoad')
			let that = this
			if (!e.url) {
				e.url="https://h5.jinaup.com/single_topic/topic.html"
			}
			let str = e.url+'?'
			for(let i in e){
				if(i != 'url'){
					if(str.indexOf('?')!=str.length-1){
						str+= '&'+i+'='+e[i]
					}else{
						str+= i+'='+e[i]
					}
				}
			}
			let index = ''
			let pages = getCurrentPages()
			if (pages.length<=1) {
				index+='&index=1'
			}
			that.str = str+'&platform=4'+index
			// wx.getStorage({
			// 	key:'trackId',
			// 	success(res){
			// 		that.str = str+'&platform=4&trackId='+res.data+index
			// 	}

			// })
		},
		binderrorFun(){
			wx.showToast({
			  title: '加载失败,请重试',
			  icon: 'none',
			  duration: 2000
			})
		}
	}
}	
</script>

<style type="text/css" scoped>
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
.divBox{
	width: 100vw;
	height: 100vh;
}
</style>