<template>
	<div :class="['bTabBox','flex',{'iPhoneX':iPhoneXFun}]">
		<!-- <div class="flex2 flexcenter" @click="gopage('d')">
			<img mode="aspectFit" class="img1" src="/static/images/shouye.png">
			<span>首页</span>
		</div> -->
		<div :class="['flex2','flexcenter',{'on':onIndex=='a'}]" @click="gopage('a')">
			<img mode="aspectFit" class="img1" :src="onIndex=='a'?'/static/images/b_tab_a_on.png':'/static/images/b_tab_a.png'">
			<span>小店</span>
		</div>
		<!-- <div :class="['flex2','flexcenter',{'on':onIndex=='b'}]" @click="gopage('b')">
			<img mode="aspectFit" class="img1" :src="onIndex=='b'?'/static/images/baddtabon.png':'/static/images/baddtab.png'">
			<span>发布</span>
		</div> -->
		<div :class="['flex2','flexcenter',{'on':onIndex=='c'}]" @click="gopage('c')">
			<img mode="aspectFit" class="img1" :src="onIndex=='c'?'/static/images/b_tab_b_on.png':'/static/images/b_tab_b.png'">
			<span>我的</span>
		</div>
	</div>
</template>

<script type="text/javascript">

export default {
	data () {
		return {
			index:''
		}
	},
	props:['onIndex'],
	onLoad(){

	},
	computed:{
		iPhoneXFun(){
			return this.$store.state.iPhoneX
		}
	},
	methods:{
		gopage(item){
			if(item=='a'){
				wx.reLaunch({
					url:'/pages/b/b_index/main'
				})
			} else if(item=='b') {
				wx.navigateTo({
					url:'/pages/b/b_addGoods/main'
				})
			} else if(item=='c') {
				wx.reLaunch({
					url:'/pages/b/b_my/main'
				})
			} else if (item=='d') {
				wx.reLaunch({
					url:'/pages/index/main'
				})
			}
		}
	}
}
</script>

<style type="text/css" scoped>
	.bTabBox{
		position: fixed;
		bottom: 0px;
		left: 0px;
		height: 50px;
		width: 100vw;
		z-index: 5;
		background-color: #fff;
		font-size: 12px;
	}
	.bTabBox>div{
		flex: 1;
	}
	.img1{
		width: 25px;
		height: 25px;
	}
	.img2{
		width: 40px;
		height: 40px;
	}
	.on{
		color: #5D9AFC;
	}
	.iPhoneX{
		padding-bottom: 30px;
	}
</style>