<template>
	<div class="topBox bgfff">
		<div v-if="showScroll" class="scrollTop">
			<!-- <div class="scrollTopBox"> -->
				<scroll-view class="scroll" :scroll-into-view="'item'+ind" scroll-x="true">
					<div @click="goIndex" id="item-1" :class="['scrollItem',{'on':onIndex==-1}]">今日推荐</div>
					<div v-for="(item,index) in classlist" :id="'item'+index" @click="chooseClass(item,index)" :class="['scrollItem',{'on':onIndex
					==index}]">{{item.cname}}</div>
				</scroll-view>
			<!-- </div> -->
			<span @click="changType" class="showBut">
				<img class="jtimg jtimg1" src="/static/images/jt.png">
			</span>
		</div>
		<div v-else class="listTop" :style="{top:type=='index'?'30px':'0px'}" catchtouchmove="ture">
			<div class="listTopBox bgfff">
				<div>全部分类</div>
				<span @click="changType" class="showBut">
					<img class="jtimg jtimg2" src="/static/images/jt.png">
				</span>
			</div>
			<div class="listBox bgfff">
				<div  @click="goIndex" :class="[{'on':onIndex==-1}]">今日推荐</div>
				<div v-for="(item,index) in classlist" @click="chooseClass(item,index)" :class="[{'on':onIndex==index}]">{{item.cname}}</div>
			</div>
			<div class="model" @click="changType"></div>
		</div>
	</div>
</template>

<script type="text/javascript">
export default {
	props:['classlist','ind','type'],
	data () {
		return {
			showScroll:true,
			onIndex:-1
		}
	},
	watch:{
		ind(val){
			console.log('watch',val)
			this.onIndex = val
		}
	},
	onLoad(){
		console.log('ind',this.ind)
		if(this.ind||this.ind === 0){
			this.onIndex = this.ind
		}
	},
	onShow(){
		console.log('子组件onshow',this.ind)
		if(this.type == 'index'){
			this.ind = -1
		}
	},
	methods:{
		changType(){
			this.showScroll = !this.showScroll
		},
		chooseClass(item,index){
			console.log('选择的分类',item,index)
			if(this.type!='index'){
				this.onIndex = index
			}
			this.showScroll = true
			this.$emit('changClass',index,item)
		},
		goIndex(){
			console.log('跳页')
			wx.reLaunch({ url: "/pages/index/main" });
		}
	}
}
</script>

<style type="text/css" scoped>
.scrollTop{
	box-sizing: border-box;
	padding: 10px;
	width: 100vw;
	display: flex;
	position: relative;
}
.showBut{
	position: absolute;
	top: 0px;
	right: 0px;
	background-color: #fff;
	padding: 10px;
	display: inline-block;
	line-height: 20px;
	height: 20px;
	width: 20px;
	text-align: center;
	box-shadow:0px 0px 0px 0px rgba(239,239,239,1),-3px 0px 4px 0px rgba(213,213,213,0.5);
}
.scroll{
	width: 100%;
	white-space: nowrap;
	line-height: 20px;
	height: 20px;
	color: #666;
}
.scroll .scrollItem:last-child{
	padding-right: 50px;
}
.scrollTopBox{
	flex: 1;
	position: relative;
}
.scrollItem{
	padding: 0px 15px;
	display: inline-block;
	position: relative;
}
.scrollItem.on{
	color: #000;
	font-weight: bold;
}
.scrollItem.on:after{
	content:'';
	display: inline-block;
	height: 2px;
	width: 30px;
	background-color: #56D2BF;
	position: absolute;
	bottom: 0px;
	left: 50%;
	margin-left: -15px;
}
.listTopBox{
	height: 20px;
	line-height: 20px;
	position: relative;
	padding: 10px;
}
.listTop{
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: fixed;
	z-index: 1;
}
.listBox{
	display: flex;
	flex-wrap: wrap;
	padding: 10px;
	box-sizing: border-box;
}
.listBox>div{
	width: 22%;
	background-color: rgba(245,245,244,1);
	border-radius: 2px;
	text-align: center;
	height: 28px;
	line-height: 28px;
	margin-right: 4%;
	overflow: hidden;
	font-size: 14px;
	margin-bottom: 10px;
}
.listBox .on{
	color: #FC5D7B;
}
.listBox>div:nth-child(4n){
	margin-right: 0px;
}
.model{
	flex: 1;
	background-color: rgba(0,0,0,0.4);
}
.jtimg{
	width: 15px;
	height: 15px;
}
.jtimg1{
	transform: rotate(90deg);
}
.jtimg2{
	transform: rotate(270deg);
}
</style>