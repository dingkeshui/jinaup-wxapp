<template>
	<div :class="['tabbarBox','flex',{'iPhoneX':iPhoneXFun}]">
		<div :class="['flex2','flexcenter',{'on':onIndex=='a'}]" @click="gopage('a')">
			<img :src="onIndex=='a'?'/static/images/shouye_active.png':'/static/images/shouye.png'">
			<span>首页</span>
		</div>
		<div v-if="showBFun" :class="['flex2','flexcenter','biconbox',{'on':onIndex=='b'}]" @click="gopage('b')">
			<img :src="'/static/images/bicon.png'">
			<div></div>
			<span>纳小店</span>
		</div>
		<div :class="['flex2','flexcenter',{'on':onIndex=='c'}]" @click="gopage('c')">
			<img :src="onIndex=='c'?'/static/images/oncar.png':'/static/images/shop.png'">
			<span>购物车</span>
		</div>
		<div :class="['flex2','flexcenter',{'on':onIndex=='d'}]" @click="gopage('d')">
			<img :src="onIndex=='d'?'/static/images/hytabon.png':'/static/images/hytab.png'">
			<span>会员</span>
		</div>
		<div :class="['flex2','flexcenter',{'on':onIndex=='e'}]" @click="gopage('e')">
			<img :src="onIndex=='e'?'/static/images/my_active.png':'/static/images/my.png'">
			<span>我的</span>
		</div>
	</div>
</template>

<script type="text/javascript">
export default{
	data(){
		return{
		}
	},
	props:['onIndex'],
	computed:{
		showBFun(){
			return this.$store.state.showB
		},
		iPhoneXFun(){
			return this.$store.state.iPhoneX
		}
	},
	methods:{
		gopage(item){
			let that = this
			if(item=='a'){
				wx.reLaunch({
					url:'/pages/index/main'
				})
			} else if(item=='b') {
				wx.reLaunch({
					url:'/pages/b_login/main'
				})
			} else if(item=='c') {
				wx.reLaunch({
					url:'/pages/goodsCar/main'
				})
			} else if (item=='d') {
				wx.reLaunch({
					url:'/pages/memberSpecial/main'
				})
			} else if (item=='e') {
				wx.reLaunch({
					url:'/pages/logs/main'
				})
			}
		}
	}
}
</script>

<style type="text/css" scoped>
.tabbarBox{
	height: 50px;
	background-color: #fff;
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	display: flex;
	font-size: 12px;
	color: #323A45;
}
.tabbarBox>div{
	flex: 1;
}
.tabbarBox img{
	width: 25px;
	height: 25px;
}
.on{
	color: #56D2BF;
}
.iPhoneX{
	padding-bottom: 68rpx;
}
.biconbox{
	position: relative;
}
.biconbox div{
	position: relative;
	width: 25px;
	height: 25px;
}
.biconbox img{
	width: 40px;
	height: 40px;
	position: absolute;
	top: -10px;
}
</style>