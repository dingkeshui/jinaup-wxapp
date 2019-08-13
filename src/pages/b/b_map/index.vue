<template>
<div class="minBox">
	<div class="top flex bgfff">
		<div class="flex">
			<span style="width:70px;" class="line1 fs12">朝阳区阿瑟东</span>
			<span>></span>
		</div>
		<div class="flex1 mgr10">
			<input class="searchInp" v-model="text" placeholder="请输入您的地址" type="" name="">
		</div>
		<div class="searchBut" @click="searchBut">搜索</div>
	</div>
	<div class="map_container">
		<map id="map"
		:longitude="location.longitude"
  		:latitude="location.latitude"
  		show-location
  		scale="12"
		></map>
		<cover-view class="coverview" @click="chooserAdressMap">
			移动位置
		</cover-view>
	</div>
	<div class="list pad10">
		<div :class="['mgb10',{'on':onLongitude==item.location}]" v-for="(item,index) in list">
			<div class="line1 titleSpan1">{{item.name}}</div>
			<div class="line1 titleSpan2">{{item.address}}</div>
		</div>
	</div>
</div>
</template>

<script type="text/javascript">
var amapFile = require('@/utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js

export default {
	data () {
		return {
			myAmapFun:'',
			text:'',
			list:'',
			onLongitude:'',
			location:""
		}
	},
	onLoad(){
		let that = this
		let mapKey = this.$store.state.mapKey
		let myAmapFun = new amapFile.AMapWX({key:mapKey});
		this.myAmapFun = myAmapFun
		myAmapFun.getRegeo({
	      success: function(data){
	        console.log('mapdata',data)
	        that.location = data[0]
	        that.onLongitude = data[0].longitude+','+data[0].latitude
	        that.list = data[0].regeocodeData.pois
	        console.log('location',that.$store.state.location)
	        console.log('location2',that.location)
	      },
	      fail: function(info){
	        wx.showModal({title:info.errMsg})
	      }
	    })
	},
	methods:{
		searchBut(){
			if(this.text){
				this.myAmapFun.getInputtips({
			      keywords: this.text,
			      location: this.location.longitude+','+this.location.latitude,
			      success: function(data){
			      	console.log('搜索',data)
			        if(data && data.tips){
			          this.list = data.tips
			        }
			      }
			    })
			}
		},
		chooserAdressMap(){
			console.log('选择位置')
			wx.chooseLocation({
				success:(res)=>{
					console.log('成',res)
					this.location = res
				}
			})
		}
	}
}
</script>

<style type="text/css" scoped>
.top{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	padding: 10px;
	line-height: 30px;
	height: 50px;
	box-sizing: border-box;
	z-index: 2;
}
.searchBut{
	background: #FC5D7B;
	color: #fff;
	padding: 0px 20px;
	border-radius: 10px;
	font-size: 14px;
}
.searchInp{
	background: #F2F1F0;
	color: #999DA2;
	font-size: 14px;
	border-radius: 5px;
	height: 30px;
	box-sizing: border-box;
	padding: 0px 10px;
}
.map_container{
	position: fixed;
	top: 50px;
	left: 0px;
	width: 100vw;
	height: 300px;
	z-index: 2;
}
#map{
	width: 100%;
	height: 100%;
}
.list{
	padding-top: 370px;
}
.titleSpan1{
	color: #484848;
	font-size: 16px;
}
.titleSpan2{
	color: #999DA2;
	font-size: 12px;
}
.list>div{
	padding-left: 30px;
	position: relative;
}
.list>div:after{
	position: absolute;
	left: 0px;
	top: 50%;
	margin-top: -5px;
	display: inline-block;
	content: "";
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #DEDEDE;
}
.list .on .titleSpan1{
	color: #5D9AFC;
}
.list .on:after{
	position: absolute;
	left: 0px;
	top: 50%;
	margin-top: -5px;
	display: inline-block;
	content: "";
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #5D9AFC;
}
.coverview{
	background-color: #fff;
	border-radius: 5px;
	padding: 5px 10px;
	font-size: 16px;
	position: absolute;
	bottom: 10px;
	left: 10px;
}
</style>