<template>
	<div>
		<div class="vipTabBox flex flexcenter" :style="{height:statusBarHeight+'px',paddingTop:wxButBoxInfo.top+'px',height:wxButBoxInfo.height+'px',lineHeight:wxButBoxInfo.height+'px',backgroundColor:bgcolor}">
			<div class="vipTab flex">
				<div :class="[{'on':onTab=='a'}]" @click="onTab='a'">VIP体验区</div>
				<!-- <div :class="[{'on':onTab=='a'}]" @click="onTab='a'">{{wxButBoxInfo.top}}</div> -->
				<div :class="[{'on':onTab=='b'}]" @click="onTab='b'">会员专区</div>
				<!-- <div :class="[{'on':onTab=='b'}]" @click="onTab='b'">{{wxButBoxInfo.height}}</div> -->
			</div>
		</div>
		<renewvip v-if="onTab=='a'"></renewvip>
		<vip v-else></vip>
    	<tab onIndex='d'></tab>
    	<div :class="['downApp',{iPhoneX:iPhoneXFun}]" @click="clickDownBut">
    		<div>
    			下载APP
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
    	<red redEnvelopeType="1" />
    	<red v-if="rid" redEnvelopeType="1" :rid="rid"/>
	</div>
</template>

<script type="text/javascript">
import { getMemberTopic,getMemberGoodsTopic,getUser } from '@/api/index'
import tab from "../../components/tab/tab";
import vip from "./components/vip";
import renewvip from "./components/renewvip";
import red from "@/components/red/red";
import { getQueryString } from '@/utils/index'

export default {
	data(){
		return {
			imgInfo:'',
			pageIndex:1,
			list:[],
			noMore:false,
			isShowLogin:false,
			onTab:'a',
			statusBarHeight:'',
			wxButBoxInfo:'',
			bgcolor:'rgba(255,255,255,0)',
			showModel:false,
			rid:''
		}
	},
	components:{
		tab,
		vip,
		renewvip,
		red
	},
	computed:{
		iPhoneXFun(){
			return this.$store.state.iPhoneX
		}
	},
	onPageScroll(e){
		let num = parseInt(e.scrollTop/5)/100
		this.bgcolor = 'rgba(0,0,0,'+num+')'
	},
	onLoad(e){
		let that = this
		if(e.q){
	      let getStr = getQueryString(decodeURIComponent(e.q))
	      for(let k in getStr){
	        e[k]=getStr[k]
	      }
	      delete e.q
	    }
		wx.getSystemInfo({
		    success: res => {
		        //导航高度
		        that.statusBarHeight = res.statusBarHeight+46
		        wx.getStorage({
					key:'wxButBoxInfo',
					success(res){
						that.wxButBoxInfo = res.data
					},
					fail(res){
						let wxButBoxInfo = wx.getMenuButtonBoundingClientRect()
						that.wxButBoxInfo = wxButBoxInfo
						wx.setStorage({
							key:'wxButBoxInfo',
							data:wxButBoxInfo
						})
					}
				})
		    }, fail(err) {
		      console.log(err)
		    }
		})
		if(e.uiType == 2){
			this.onTab = 'b'
		} else {
			this.onTab = 'a'
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
		this.pageIndex = 1
	},
	onShow() {
	},
	methods:{
		clickDownBut(){
			console.log('打开了客服啊那妞')
			this.showModel = true
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
		display: flex;
		flex-wrap:wrap;
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
	.itemBox{
		width: 50vw;
		box-sizing: border-box;
		padding: 5px 5px;
	}
	.itemBox:nth-child(2n){
		padding-left: 2.5px;
	}
	.itemBox:nth-child(2n-1){
		padding-right: 2.5px;
	}
	.item{
		border-radius: 5px;
		background-color: #fff;
	}
	.imgBox{
		width: 100%;
		position: relative;
		padding-top: 100%;
		top: 0px;
		left: 0px;
	}
	.imgBox .img{
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
	}
	.titleBox{
		color: #323A45;
		font-size: 14px;
		overflow:hidden; 
		text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2; 
		padding: 5px;
		height: 35px;
	}
	.footBox{
		padding: 5px;
	}
	.vipTabBox{
		width: 100vw;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 20;
	}
	.vipTab{
		background-color: #000000;
		border:1px solid #F7ECC8;
		color: #F7ECC8;
		border-radius: 7px;
		text-align: center;
	}
	.vipTab>div{
		width: 80px;
		border-radius: 5px;
		font-size: 14px;
		height: 30px;
	}
	.vipTab>.on{
		background-color: #F7ECC8;
		color: #6B4915;
	}
	.downApp{
		position: fixed;
		bottom: 150PX;
		right: 0PX;
	}
	.downApp>div{
		position: relative;
		background-color: #E31515;
		color: #FFF;
		font-size: 12px;
		padding: 5px 5px 5px 10px;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
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
	.downApp.iPhoneX{
		bottom: 200px;
	}
</style>