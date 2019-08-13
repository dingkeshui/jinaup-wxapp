<template>
<div class="minBox bgf3">
	<div class="tab bgfff flex">
		<div :class="['flex1','center',{'on':type=='1'}]" @click="chooseType('1')">
			<span>出售中</span>
		</div>
		<div :class="['flex1','center',{'on':type=='2'}]" @click="chooseType('2')">
			<span>已下架</span>
		</div>
		<div :class="['flex1','center',{'on':type=='3'}]" @click="chooseType('3')">
			<span>审核中</span>
		</div>
		<div :class="['flex1','center',{'on':type=='4'}]" @click="chooseType('4')">
			<span>已拒绝</span>
		</div>
	</div>
	<div v-if="list" class="list bgfff">
		<div class="pad10 flex" v-for="item in list" @click="goodsInfo(item)">
			<div class="mgr10">
				<img style="width:60px;height:60px;" :src="item.list?item.list[0].imgUrl:''">
			</div>
			<div class="flex1 flex flexvcenter fs14">
				{{item.title}}
			</div>
		</div>
	</div>
	<div v-else class="list center">
		<img class="nogoods" src="./nogoods.png">
		<div class="center fs16 pad10 col999">您还没有发布任何商品哦~</div>
		<div class="but" @click="goAddGoods">快去发布商品吧~</div>
	</div>
</div>	
</template>

<script type="text/javascript">
import { productMicroInfoListType } from '@/pages/b/api/index'

export default {
	data () {
		return {
			type:'1',
			list:'',
			pageIndex:1
		}
	},
	onLoad(){
		this.getList()
	},
	methods:{
		async getList(){
			let res = await productMicroInfoListType({pageIndex:this.pageIndex,sid:1,status:this.type})
			console.log('res',res)
			if (res.data.res_code==1) {
				if(res.data.result&&res.data.result.length){
					this.list = res.data.result
				}else{
					this.list = ''
				}
			}else if (res.data.res_code==1004) {
					this.list = ''
			} else {
				this.list = ''
				wx.showToast({
					title:res.data.message?res.data.message:'获取失败',
					icon:'none',
					duration:2000
				})
			}
		},
		chooseType(item){
			this.type = item
			this.pageIndex = 1
			this.getList()
			console.log('type',this.type)
		},
		goodsInfo(item){
			wx.navigateTo({
			  url: '/pages/b/b_addGoods/main?id='+item.pid
			})
		},
		goAddGoods(){
			wx.navigateTo({
			  url: '/pages/b/b_addGoods/main'
			})
		}
	}
}
</script>

<style type="text/css">
.tab{
	height: 50px;
	line-height: 50px;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	font-size: 15px;
	color: #484848;
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	z-index: 1;
}
.tab .on span{
	display: inline-block;
	box-sizing: border-box;
	border-bottom: 4px solid #5D9AFC;
}
.list{
	padding-top: 55px;
}
.but{
	width: 70%;
	margin: 10px auto;
	background-color: rgba(93,154,252,1);
	color: #fff;
	text-align: center;
	font-size: 18px;
	height: 50px;
	line-height: 50px;
	border-radius: 10px;
}
.nogoods{
	width: 140px;
	height: 140px;
	margin: 20px auto;
}
</style>