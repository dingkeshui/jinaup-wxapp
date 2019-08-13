<template>
	<div>
		<div class="box1" v-if="items.length">
			<div class="container">
				<div class="item" v-for="(item,index) in items" :key="index">
					<div :class="[{'touch-move-active':item.isTouchMove},'touch-item']" @touchstart="touchstart" @touchmove="touchmove" :data-index="index">
						<div class="content">
							<div class="flex flexcenter checkbox"><checkbox :disabled="item.isMiaoSha" :checked="item.checked" @click="chooseOne(item)" class="inpCheckBox" /></div>
							<div @click="goGoodsInfo(item)" class="mgr5">
								<image class="goodsImg" mode="aspectFit" :src="item.mainImgUrl"></image>
							</div>
							<div class="flex1">
								<div class="goodsTitle"><span class="isMiaoShaSpan" v-if="item.isMiaoSha">[秒杀中]</span> {{item.productTitle}}</div>
								<div class="goodsAttr">规格:{{item.skuName}}</div>
								<div class="flex goodsItemFoot">
									<div class="flex1 moneySpan">￥{{item.supplierProductSkuVo.salesPrice}}</div>
									<div class="numBox flex flexcenter">
										<div @click="changGoodsNum(item,'a')">-</div>
										<span>{{item.number}}</span>
										<div @click="changGoodsNum(item,'b')">+</div>
									</div>
								</div>
							</div>
						</div>
			  			<div class="del" :data-index="index" @click="delFun(item)">删除</div>
				 	</div>
			 	</div>
			 	<div class="containerFoot flex">
			 		<div class="flex1 left">
			 			<checkbox class="inpCheckBox" :checked="isChooseAll" @click="chooseAll"/>
			 			<span>全选</span>
			 		</div>
			 		<div class="right flex">
			 			<div class="allMoney">总计：<span>￥{{allMoney}}</span></div>
			 			<div @click="goPayFun" class="gopay">去结算</div>
			 		</div>
			 	</div>
			</div>
		</div>
		<div class="box2" v-else>
			<div class="nullBox">
				<img mode="aspectFit" src="/static/images/nocar.png">
				<span>您的购物车为空哦~</span>
			</div>
			<hotgoods v-if="!items||!items.length" />
		</div>
		<!-- tabber -->
    	<tab onIndex='c'></tab>
	</div>
</template>

<script>
import { getCarList,changeCarGoodsNum,getCarGoodsDel,getCarGoodsMoney,prePare,getUser } from '@/api/index'
import hotgoods from '@/components/hotgoods/hotgoods.vue'
import Login from '@/components/user/login'
import tab from "../../components/tab/tab";

export default {
	data () {
		return {
			pageIndex:1,
			startX: 0, //开始坐标
  			startY: 0,
  			items:[],
  			allMoney:0, //总计钱
  			isChooseAll:false, //是否全选
  			isMore:true  //可以滚动加载
		}
	},
	components:{
		hotgoods,
		Login,
		tab
	},
	async onShow () {
	    this.startFun()
	},
	onLoad () {
	},
	onReachBottom(){
		console.log('滚动加载',this.isMore)
		if (this.isMore) {
			this.pageIndex++
			this.getList()
		}
	},
	methods:{
		startFun(){
			this.items=[]
			this.isChooseAll = false
			this.allMoney = 0
			this.pageIndex = 1
			this.isMore = true
			this.getList()
		},
		async goPayFun(){
			console.log('去支付')
			let arr = []
			this.items.map(val=>{
				if (val.checked) {
					arr.push({buyNum:val.number,skuKey:val.skuKey,pid:val.pid})
				}
			})
			if (arr.length) {
				let res = await prePare({orderChannel:4,skuPidNums:JSON.stringify(arr)})
				console.log('预支付订单',res)
				if (res.data.res_code==1) {
					wx.setStorage({
			          key: "orderMian",
			          data: res.data.result
			        });
			        wx.navigateTo({
			          url: "/pages/submission/main"
			        });
				} else {
					wx.showToast({
					  title: res.data.message?res.data.message:'生成订单失败',
					  icon: 'none',
					  duration: 2000
					})
				}
			} else {
				wx.showToast({
				  title: '请选择商品',
				  icon: 'none',
				  duration: 2000
				})
			}
		},
		async getList(isNew){
			let res = await getCarList({pageIndex:this.pageIndex})
			console.log('购物车',res)
			if (res.data.res_code==1) {
				if(isNew=='new'){
					this.items = []
				}
				res.data.result.map(val=>{
					val.isTouchMove = false
					val.checked = false
					val.isMiaoSha = false
					if (val.supplierProductSkuVo.endTime) {
						console.log('秒杀',val.supplierProductSkuVo.startTime,val.supplierProductSkuVo.endTime)
						let str1 = new Date().getTime()
						if (str1>=val.supplierProductSkuVo.startTime&&str1<val.supplierProductSkuVo.endTime) {
							val.isMiaoSha = true
						}
					}
					this.items.push(val)
				})
				if (res.data.result.length<20) {
					this.isMore = false
				}
				console.log('items',this.items)
			} else if(res.data.res_code==1004) {
				this.isMore = false
				this.items = []
			}
		},
		// 全选
		chooseAll(e){
			let that = this
			console.log('全选',this.isChooseAll)
			this.isChooseAll = !this.isChooseAll
			this.items.map(val=>{
				if(!val.isMiaoSha){
					val.checked = this.isChooseAll
				}
			})
			that.getAllMoney()
		},
		// 选择一个
		chooseOne(e){
			let that = this
			console.log('选择一个',e)
			e.checked = !e.checked
			that.getAllMoney()
			for(let i in this.items){
				if(!this.items[i].checked){
					this.isChooseAll = false
					return
				} else if (i==this.items-1) {
					this.isChooseAll = true
				}
			}
		},
		goGoodsInfo(item){
			console.log('跳转到商品详情',item)
			wx.navigateTo({
			  url: '/pages/go2detail/main?id='+item.pid
			})
		},
		// 计算总计多少钱
		async getAllMoney(){
			let arr = []
			this.items.map(val=>{
				if (val.checked) {
					arr.push({buyNum:val.number,skuKey:val.skuKey})
				}
			})
			console.log('arr',arr)
			if(arr.length){
				let res = await getCarGoodsMoney({skuPidNums:JSON.stringify(arr)})
				console.log('计算价格',res)
				if(res.data.res_code==1){
					this.allMoney = res.data.result.totalAmount.toFixed(2)
				}else{
					wx.showToast({
					  title: res.data.message?res.data.message:'修改失败',
					  icon: 'none',
					  duration: 2000
					})
				}
			}else{
				this.allMoney = 0
			}
		},
		// 改变商品数量
		async changGoodsNum (item,type) {
			let num = item.number
			if (type=='a') {
				console.log('减',item)
				if(item.number>1){
					num--
				}
			} else {
				console.log('加',item)
				if (item.number>=item.supplierProductSkuVo.store) {
					num = item.supplierProductSkuVo.store
				} else {
					num++
				}
			}
			let res = await changeCarGoodsNum({uscid:item.uscid,number:num})
			console.log('改变数量',res)
			if (res.data.res_code==1) {
				item.number = num
				if (item.checked) {
					this.getAllMoney()
				}
			} else {
				wx.showToast({
				  title: res.data.message?res.data.message:'修改失败',
				  icon: 'none',
				  duration: 2000
				})

			}
		},
		angle: function (start, end) {
		 	var _X = end.X - start.X,
		   	_Y = end.Y - start.Y
		  	//返回角度 /Math.atan()返回数字的反正切值
		  	return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
		 },
		//删除事件
		async delFun(e) {
		 	console.log('删除',e)
		 	let res = await getCarGoodsDel({ids:JSON.stringify([e.uscid])})
		 	console.log('删除结果',res)
		 	if (res.data.res_code==1) {
		 		wx.showToast({
				  title: '删除成功',
				  icon: 'success',
				  duration: 2000
				})
				this.pageIndex = 1
				this.isChooseAll = false
				this.getList('new')
		 	} else {
		 		wx.showToast({
				  title: res.data.message?res.data.message:'删除失败',
				  icon: 'none',
				  duration: 2000
				})
		 	}
		},
		//手指触摸动作开始 记录起点X坐标
		touchstart: function (e) {
			//开始触摸时 重置所有删除
			let that= this
			console.log('111')
			that.items.forEach(function (v, i) {
			if (v.isTouchMove)//只操作为true的
		    	v.isTouchMove = false;
		  	})
			console.log('222',e)
		  	that.startX = e.clientX
		  	that.startY = e.clientY
		},
		//滑动事件处理
		touchmove: function (e) {
			console.log(333,e)
			var that = this,
			index = e.currentTarget.dataset.index,//当前索引
			startX = that.startX,//开始X坐标
			startY = that.startY,//开始Y坐标
			touchMoveX = e.clientX,//滑动变化坐标
			touchMoveY = e.clientY,//滑动变化坐标
			//获取滑动角度
			angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
			console.log(444)
			that.items.forEach(function (v, i) {
				v.isTouchMove = false
				//滑动超过30度角 return
				if (Math.abs(angle) > 30) return;
				if (i == index) {
				if (touchMoveX > startX) //右滑
			 		v.isTouchMove = false
				else //左滑
			 		v.isTouchMove = true
				}
			})
		}
	}
}
</script>

<style type="text/css">
.touch-item {
 font-size: 14px;
 display: flex;
 justify-content: space-between;
 overflow: hidden;
 width: 100%;
 border-radius: 5px;
 box-sizing: border-box;
}
.content {
 width: 100%;
 padding: 10px 10px 10px 0px;
 margin-right:0;
 -webkit-transition: all 0.4s;
 transition: all 0.4s;
 -webkit-transform: translateX(90px);
 transform: translateX(90px);
 margin-left: -90px;
 background-color: #fff;
 display: flex;
}
.del {
 background-color: orangered;
 width: 90px;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 color: #fff;
 -webkit-transform: translateX(90px);
 transform: translateX(90px);
 -webkit-transition: all 0.4s;
 transition: all 0.4s;
}
.touch-move-active .content,
.touch-move-active .del {
 -webkit-transform: translateX(0);
 transform: translateX(0);
}
.box1{
	min-height:100vh;
	background:rgba(243,247,247,1); 
}
.item{
	padding:10px 10px 0px;
}
.flex{
	display: flex;
}
.flex1{
	flex: 1;
}
.flexcenter{
	align-items: center;
	justify-content: center;
}
.inpCheckBox{
	width: 10px;
	height: 10px;
	margin-right: 10px;
}
.goodsImg{
	width: 80px;
	height: 80px;
}
.checkbox{
	width: 60rpx;
}
checkbox {
	width: 28rpx;
	height: 28rpx;
}
checkbox .wx-checkbox-input {
	width: 28rpx;
	height: 28rpx;
}
checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	background: #3296fa;
}
checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
	width: 28rpx;
	height: 28rpx;
	line-height: 28rpx;
	text-align: center;
	font-size: 22rpx;
	color: #fff;
	background: transparent;
	transform: translate(-50%, -50%) scale(1);
	-webkit-transform: translate(-50%, -50%) scale(1);
}
.mgr5{
	margin-right: 5px;
}
.goodsTitle{
	overflow:hidden; 
	text-overflow:ellipsis;
	display:-webkit-box; 
	-webkit-box-orient:vertical;
	-webkit-line-clamp:2;
	line-height: 20px;
	min-height: 40px;
	font-size: 16px;
	color: #484848;
}
.goodsAttr{
	color: #999DA2;
	font-size: 12px;
	line-height: 20px;
}
.moneySpan{
	color: #FC5D7B;
}
.numBox{
}
.numBox div{
	width: 20px;
	height: 20px;
	text-align: center;
	border:1px solid rgba(203,203,203,1);
	color: #CFCFCF;
}
.numBox span{
	width: 40px;
	display: inline-block;
	height: 20px;
	color: #70767E;
	border-bottom: 1px solid rgba(203,203,203,1);
	border-top: 1px solid rgba(203,203,203,1);
	text-align: center;
}
.goodsItemFoot{
	line-height: 20px;
}
.container{
	padding-bottom: 60px;
}
.containerFoot{
	position: fixed;
	bottom: 50px;
	left: 0px;
	width: 100%;
	height: 50px;
	line-height: 50px;
	background-color: #fff;
	display: flex;
}
.containerFoot .left{
	font-size: 14px;
	color: #323A45;
}
.containerFoot .inpCheckBox{
	width: 30px;
	padding-left: 10px;
}
.allMoney{
	padding: 0px 10px;
	color: #323A45;
	font-size: 14px;
}
.allMoney span{
	color: #FC5D7B;
	font-size: 16px;
}
.gopay{
	padding:0px 20px;
	background: linear-gradient(217deg,rgba(248,99,103,1) 0%,rgba(251,37,121,1) 100%);
	color: #fff;
	font-size: 18px;
}
.nullBox{
	height: 60vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.nullBox img{
	width: 150px;
	height: 150px;
	margin-bottom: 10px;
}
.nullBox span{
	color: #999DA2;
	font-size: 16px;
}
.isMiaoShaSpan{
	color:#FC5D7B;
}
.box2{
	min-height: 100vh;
	background-color: rgba(243,247,247,1);
}
</style>