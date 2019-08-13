<template>
	<div class="hotgoodsbox">
		<div class="title"><img mode="aspectFit" src="/static/images/cnxh.png"></div>
		<div class="list">
			<dl v-for="(item,index) in list" @click="goPage(item)" :key="index">
				<dt class="imgbox">
					<img mode="aspectFit" lazy-load :src="item.mainImgUrl" alt />
				</dt>
				<dd>
					<p class="titles">{{item.title}}</p>
					<p class="tabBox">
						<span v-if="item.isFreeShipping===1">包邮</span>
			            <template v-if="item.importType==0">
			              <span>直邮</span>
			              <span v-if="item.isFreeTax===1">包税</span>
			            </template>
			            <template v-if="item.importType==1">
			              <span>保税区</span>
			              <span v-if="item.isFreeTax===1">包税</span>
			            </template>
					</p>
					<p class="prices">￥{{item.salesPrice}}</p>
					<p class="prices2" v-if="item.productType!=1||item.productType!=4">
						<span class="vipSpan">￥{{item.vipPrice}}</span>
						<span><img mode="widthFix" src="/static/images/vip.png"></span>
						<span v-if="loginUserinfo.userType&&item.earnMoney" class="earnSpan">赚￥{{item.earnMoney}}</span>
					</p>
				</dd>
			</dl>
		</div>
	</div>
</template>

<script>
import { reLikes } from '@/api/index'

export default {
	data(){
		return {
			list:'',
			loginUserinfo:''
		}
	},
	created(){
		console.log('踩你喜欢')
		const loginResult = wx.getStorageSync('loginResult')
		this.loginUserinfo = loginResult.userInfo
		this.getList()
	},
	methods:{
		async getList(){
			let result =await reLikes()
			console.log('猜你喜欢',result)
			if (result.data.res_code==1) {
				this.list = result.data.result
			} else {
				
			}
		},
		// 去详情页面
		goPage(item,index){
			wx.navigateTo({
			  url: '/pages/go2detail/main?id='+item.pid
			})
		}
	}
}
</script>

<style>
	.hotgoodsbox{
		width: 100vw;
		padding-bottom: 50px;
	}
	.hotgoodsbox .title{
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.title img{
		width: 160px;
		height: 32px;
	}
	.hotgoodsbox .list{
		display: flex;
		flex-wrap: wrap;
	}
	.hotgoodsbox .list dl{
		width: 50vw;
		padding: 5px;
		box-sizing: border-box;
	}
	.hotgoodsbox .list dd{
		background-color: #fff;
		padding: 5px;
	}
	.hotgoodsbox .imgbox{
		width: 100%;
		padding-top: 100%;
		position: relative;
		background-color: #fff;
	}
	.hotgoodsbox .imgbox img{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
	}
	.titles{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		color: #323A45;
		font-size: 14px;
		line-height: 20px;
	}
	.prices{
		color: #FF527F;
		font-size: 14px;
	}
	.vipSpan{
		color: #A87831;
		font-size: 10px;
		margin-right: 5px;
	}
	.earnSpan{
		padding: 0px 5px;
		display: inline-block;
		border-radius: 3px;
		background-color: rgba(255,232,237,1);
		color: #FC5D7B;
		font-size: 10px;
	}
	.prices2{
		height: 15px;
		line-height: 15px;
	}
	.prices2 img{
		width: 20px;
		margin-right: 5px;
	}
	.tabBox{
		min-height: 25px;
	}
	.tabBox span{
		display: inline-block;
		border:1px solid rgba(252,93,123,1);
		border-radius: 3px;
		padding: 0px 3px;
		color: #FC5D7B;
		font-size: 10px;
		margin-right: 5px;
	}
</style>