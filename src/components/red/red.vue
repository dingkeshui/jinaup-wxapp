<template>
	<div v-if="show" class="redBox flex2 flexcenter" catchtouchmove="ture">
		<div class="redImgBox">
			<image :src="info.popupImage" model="widthFix" class="mainimg" @click="goShare"/>
			<div class="textMain">
				<span>{{info.amount}}</span>
				元
			</div>
		</div>
		<image src="/static/images/close.png" class="closeimg" @click="close"/>
	</div>
</template>

<script type="text/javascript">
import {getRed} from '@/api/index'

export default {
	props:['redEnvelopeType','id','rid'],
	data () {
		return {
			show:false,
			info:''
		}
	},
	onLoad(e){
		let that = this
		console.log('红红包',that.id)
		this.getRed()
	},
	watch:{
		id(val){
			console.log('红包id==================',val)
			this.getRed()
		}
	},
	methods:{
		async getRed(){
			let that = this
			let data = {
				redEnvelopeType:that.redEnvelopeType
			}
			if(that.redEnvelopeType==2){
				data.sid = that.id
				data.source = 3
			} else {
				data.source = 0
			}
			if(that.rid){
				data.source = 2
				data.id = that.rid
			}
			let res = await getRed(data)
			if(res.data.res_code==1){
				this.info = res.data.result
				if(res.data.result.popup){
					this.show = true
				} else {
					this.$emit('showTop',res.data.result)
					this.close()
				}
				wx.setStorage({
					key:'shareRed',
					data:res.data.result
				})
			}else{
				this.close()
			}
		},
		close(){
			this.show = false
		},
		goShare(){
			wx.navigateTo({
				url:'/pages/redShare/main'
			})
		}
	}
}
</script>

<style type="text/css" scoped>
.redBox{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	z-index: 30;
	background-color: rgba(0,0,0,0.4);
}
.closeimg{
	width: 30px;
	height: 30px;
}
.mainimg{
	width: 70vw;
	height: 82vw;
}
.redImgBox{
	width: 70vw;
	margin-bottom: 20px;
	position: relative;
}
.textMain{
	position: absolute;
	top: 25%;
	text-align: center;
	left: 0px;
	width: 100%;
	color: #FC445B;
	font-size: 18px;
	font-weight: bold;
}
.textMain span{
	font-size: 30px;
}
</style>