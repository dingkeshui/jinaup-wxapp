<template>
<div class="minBox bgf3">
	<div class="pad10 bgfff">
		<input class="fs16" maxlength="20" v-model="name">
	</div>
	<div class="but fs16" @click="changeName">
		保存
	</div>
</div>
</template>

<script type="text/javascript">
import { changeShopName } from '@/pages/b/api/index'

export default {
	data () {
		return {
			name:'',
			id:''
		}
	},
	onLoad(e){
		this.name = e.name
		this.id=e.id
	},
	methods:{
		changeName () {
			wx.navigateTo({
				url: `/pages/b/b_shopInfo/b_shopInfo/main?name1=${this.name}`
			})
		}
		// async changeName(){
		// 	let res = await changeShopName({storeName:this.name,id:this.id})
		// 	console.log('res',res)
		// 	if(res.data.res_code==1){
		// 		wx.showToast({
		// 			title:'修改成功',
		// 			icon:'none',
		// 			duration:2000
		// 		})
		// 		wx.navigateBack({
		// 			delta:1
		// 		})
		// 	} else {
		// 		wx.showToast({
		// 			title:res.data.message?res.data.message:'修改失败',
		// 			icon:'none',
		// 			duration:2000
		// 		})
		// 	}
		// }
	}
}
</script>

<style type="text/css">
.but{
	width: 80%;
	margin:40px auto;
	height: 50px;
	line-height: 50px;
	text-align: center;
	color: #fff;
	border-radius: 10px;
	background-color: #5D9AFC;
}
</style>
