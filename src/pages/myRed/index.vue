<template>
	<div class="box2">
		<div v-if="list1">
			<div class="title">通用红包</div>
			<div class="itemList">
				<div v-for="(item,index) in list1Time" :key="index" class="item item2" @click="goIndex">
					<div class="itemTop flex">
						<div class="imgBox">
							<img :src="item.icon?item.icon:'/static/images/jina.png'">
						</div>
						<div class="flex1 main">
							<div class="fs1 ovh">{{item.title}}</div>
							<div class="fs2 ovh">有效期至{{item.time}}</div>
						</div>
						<div>
							<div class="fs3">￥<span>{{item.amount}}</span></div>
							<div class="fs4">{{item.condition}}</div>
						</div>
					</div>
					<div class="itemFoot flex itemFoot2">
						<div class="flex1 left ovh">
							{{item.desc}}
						</div>
						<div class="right" @click.stop="goShare(item)">
							分享
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="list2">
			<div class="title">可使用店铺红包</div>
			<div class="itemList">
				<div v-for="(item,index2) in list2Time" :key="index2" class="item item2" @click="goShop(item)">
					<div class="itemTop flex">
						<div class="imgBox">
							<img :src="item.icon?item.icon:'/static/images/jina.png'">
						</div>
						<div class="flex1 main">
							<div class="fs1 ovh">{{item.title}}</div>
							<div class="fs2 ovh">有效期至{{item.time}}</div>
						</div>
						<div>
							<div class="fs3">￥<span>{{item.amount}}</span></div>
							<div class="fs4">{{item.condition}}</div>
						</div>
					</div>
					<div class="itemFoot flex itemFoot2">
						<div class="flex1 left ovh">
							{{item.desc}}
						</div>
						<div class="right" @click.stop="goShare(item)">
							分享
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!list1&&!list2" class="nullBox flex2 flexcenter">
			<img src="./img/null.png">
			<span>您还没有红包哦~</span>
		</div>
	</div>
</template>

<script type="text/javascript">
import {getMyRed} from '@/api/index'
import { formatTime } from '@/utils/index'

export default {
	data () {
		return {
			list1:'',
			list2:''
		}
	},
	onLoad () {
	},
	onShow(){
		this.getList()
	},
	computed:{
		list1Time(){
			if(this.list1){
				this.list1.map(val=>{
					val.time = formatTime(val.expiryEndDate,'day')
				})
			}
			return this.list1
		},
		list2Time(){
			if(this.list2){
				this.list2.map(val=>{
					val.time = formatTime(val.expiryEndDate,'day')
				})
			}
			return this.list2
		}
	},
	methods:{
		async getList () {
			let res = await getMyRed()
			console.log('res',res)
			if(res.data.res_code==1){
				if(res.data.result.currencyRedEnvelope&&res.data.result.currencyRedEnvelope.length){
					this.list1 = res.data.result.currencyRedEnvelope
				}else{
					this.list1 = ''
				}
				if(res.data.result.storeRedEnvelope&&res.data.result.storeRedEnvelope.length){
					this.list2 = res.data.result.storeRedEnvelope
				}else{
					this.list2 = ''
				}
			}else{
			}
		},
		goIndex(){
			wx.reLaunch({
				url:'/pages/b/b_index/main'
			})
		},
		goShop(item){
			wx.navigateTo({
				url:"/pages/b/b_shopInfo/b_shopGoods/main?id="+item.sid
			})
		},
		goShare(item){
			wx.setStorage({
				key:'shareRed',
				data:item,
				success(){
					wx.navigateTo({
						url:'/pages/redShare/main'
					})
				}
			})
		}
	}
}
</script>

<style type="text/css" scoped>
.box2{
	width: 100vw;
	min-height: 100vh;
	background-color: rgba(243,247,247,1);
}
.title{
	padding: 10px 15px;
	font-weight: bold;
	font-size: 16px;
	color: #484848;
}
.itemList{
	margin: 0px 10px;
}
.item{
	padding: 10px;
	box-sizing: border-box;
	background-color: #fff;
	margin-bottom: 10px;
}
.itemTop{
	margin-bottom: 10px;
}
.itemTop img{
	width: 50px;
	height: 50px;
}
.itemTop .main{
	margin: 0px 10px;
	overflow: hidden;
}
.main .fs1{
	line-height: 30px;
	color: #323A45;
	font-size: 16px;
}
.main .fs2{
	color: #676767;
	font-size: 12px;
}
.fs3{
	color: #FC5D7B;
	font-size: 16px;
	line-height: 30px;
}
.fs3 span{
	font-size: 24px;
}
.fs4{
	font-size: 12px;
	color: #676767;
	text-align: right;
}
.itemFoot{
	border-top: 1px dashed #CBCBCB;
	padding-top: 10px;
	height: 20px;
	line-height: 20px;
	overflow: hidden;
}
.itemFoot .left{
	font-size: 12px;
	color: #999DA2;
}
.ovh{
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	position: relative;
}
.right{
	background-color: #FC5D7B;
	color: #fff;
	padding: 0px 15px;
	font-size: 14px;
	border-top-left-radius:2em;
	border-bottom-left-radius:2em;
}
.item2{
	position: relative;
}
.item2:after{
	content: '';
	display: inline-block;
	position: absolute;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background-color: rgba(243,247,247,1);
	bottom: 31px;
	left: -10px;
}
.item2:before{
	content: '';
	display: inline-block;
	position: absolute;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background-color: rgba(243,247,247,1);
	bottom: 31px;
	right: -10px;
}
.nullBox img{
	width: 130px;
	height: 130px;
	margin-bottom: 20px;
}
.nullBox{
	color: #999DA2;
	font-size: 16px;
	width: 100vw;
	height: 100vh;
}
</style>