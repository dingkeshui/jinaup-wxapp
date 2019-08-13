<template>
	<div>	
		<div class="topBox">
			<div :class="['bgfff','tagBox','flex','pad10','inTop']">
				<div :class="['flex1',{on:showTagArr[0]}]">
					<div class="title center" @click.stop="addTag(0)">
						<span class="mgr5">{{text1||'全部'}}</span>
						<span class="icon"></span>
					</div>
					<div v-if="showTagArr[0]" class="main padt10">
						<div @click.stop="chooseTagArrFun($event,0,0)" :class="[{on:chooseTagArr[0]==0}]" data-txt="全部">全部</div>
						<div @click.stop="chooseTagArrFun($event,0,2)" :class="[{on:chooseTagArr[0]==2}]" data-txt="普通商品">普通商品</div>
						<div @click.stop="chooseTagArrFun($event,0,1)" :class="[{on:chooseTagArr[0]==1}]" data-txt="新店开张">新店开张</div>
						<div @click.stop="chooseTagArrFun($event,0,3)" :class="[{on:chooseTagArr[0]==3}]" data-txt="9.9专区">9.9专区</div>
						<div @click.stop="chooseTagArrFun($event,0,4)" :class="[{on:chooseTagArr[0]==4}]" data-txt="爆品专区">爆品专区</div>
					</div>
				</div>
				<div :class="['flex1',{on:showTagArr[1]}]" @click.stop="addTag(1)">
					<div class="title center">
						<span class="mgr5">{{text2||'全城'}}</span>
						<span class="icon"></span>
					</div>
					<div v-if="showTagArr[1]" class="main padt10">
						<!-- <div @click.stop="chooseTagArrFun(2,0)" :class="[{on:chooseTagArr[2]==0}]">热度最高</div>
						<div @click.stop="chooseTagArrFun(2,1)" :class="[{on:chooseTagArr[2]==1}]">离我最近</div> -->
						<block v-if="xianquList.length">
						<div @click.stop="chooseTagArrFun1($event,1,index,item)" :class="[{on:chooseTagArr[1]==index}]" v-for="(item,index) in xianquList" :key="index" :data-txt="item.name">{{item.name}}</div>
						</block>
					</div>
				</div>
				<div :class="['flex1',{on:showTagArr[2]}]"  @click.stop="addTag(2)">
					<div class="title center">
						<span class="mgr5">{{text3||'智能排序'}}</span>
						<span class="icon"></span>
					</div>
					<div v-if="showTagArr[2]" class="main padt10">
						<div @click.stop="chooseTagArrFun($event,2,0)" :class="[{on:chooseTagArr[2]==0}]" data-txt="热度最高">热度最高</div>
						<div @click.stop="chooseTagArrFun($event,2,1)" :class="[{on:chooseTagArr[2]==1}]" data-txt="离我最近">离我最近</div>
					</div>
				</div>
			</div>
		</div>

			<div v-if="indexProList.length">
				<goods :List="indexProList"></goods>
				<div class="addMoreBox">
    		  <span v-if="hasMore">加载更多</span>
    		  <span v-else>没有更多啦！</span>
    		</div>
			</div>
			<!-- 若没有数据显示 -->
  	<div class="nullBox" v-else>
			<img mode="aspectFit" src="/static/images/dfh.png">
			<span>暂时没有商品哦~</span>
		</div>

		<div v-if="showTagArr[0]||showTagArr[1]||showTagArr[2]" @click="closeModel" class="modelBg"></div>

	</div>
</template>

<script type="text/javascript">
import goods from '@/components/b/goods.vue'
import {getIndexInfo, getIndexInfoByDeliver,indexCategory} from '@/pages/b/api/index'

var amapFile = require('@/utils/amap-wx.js')
export default {
	data () {
		return {
			showTagArr:[false,false,false],
			chooseTagArr:[0,0,0],
			indexProList:[],
			pageIndex: 1,
			citycode:'',
			lat:'',
			lng:'',
			adcode:'',
			productType:0,
			isHeat:0,
			hasMore: true,
			cid: '',
			queryWord: '',
			cname: '',
			xianquList: '', // 全城
			text1: '', // 筛选条件的文本展示
			text2: '',
			text3: '',
			requestType:1
		}
	},
	components:{
		goods
	},
	onReachBottom () {
		console.log('下拉加载',this.hasMore)
		if (!this.hasMore) return
		this.pageIndex++
		this.getIndexInfo()
	},
	onLoad(option){
		console.log('onload')
		let that = this
		that.hasMore = true
		that.cid = option.id || ''
		that.cname = option.name || ''
		that.queryWord = option.keyWords || ''

		console.log(JSON.parse(option.data))
		let formData = JSON.parse(option.data)
		that.lat = formData.lat
		that.lng = formData.lng
		that.adcode = formData.adcode
		that.citycode = formData.citycode
		this.showFun()
	},
	onShow() {
		console.log('onshow')
	},
	methods:{
		showFun(){
			let that = this
			that.chooseTagArr = [0,0,0]
			that.pageIndex = 1
			this.requestType = 1
			that.indexProList = []
			this.xianquList = wx.getStorageSync('xianqu') || []
			this.showTagArr.map((val,index)=>{
					this.$set(this.showTagArr,index,false)
			})

			this.getIndexInfo()

			if (that.queryWord) {
				wx.setNavigationBarTitle({
	      			title: that.queryWord
				})
			}else{
				wx.setNavigationBarTitle({
	      			title: that.cname
				})
			}
		},
		// 获取商品信息列表
		async getIndexInfo () {
			let that = this
			wx.showLoading({
        title: '加载中'
			})
			let postData = {}
			postData = {
				citycode:that.citycode,
				lat:that.lat,
				lng:that.lng,
				// adcode:110105,
				type:this.requestType==1?0:1,
				adcode:this.adcode,
				isHeat:that.isHeat,
				pageIndex:that.pageIndex,
				productType:this.chooseTagArr[0]
			}
			if (that.queryWord) {
			  postData.queryWord = that.queryWord
			}
			if (that.cid) {
			  postData.cid = that.cid
			}
			console.log('搜索参数',postData)

			let res = await getIndexInfo(postData)
			console.log('获取的首页数据',res)
			if (res.data.res_code==1) {
				let arr = [].concat(that.indexProList)
				that.indexProList = arr.concat(res.data.result)
				// that.indexProList = res.data.result
				console.log('获取的首页数据赋值',that.indexProList)
				if (res.data.result.length<3&&this.requestType==1) {
					that.indexProList.push({'showItem':true})
					this.requestType = 2
					this.pageIndex = 1
					this.getIndexInfo()
				}else{
					wx.hideLoading()
					wx.stopPullDownRefresh()
				}
			} else if (res.data.res_code==1004&&this.requestType==1) {
				this.requestType = 2
				this.pageIndex = 1
				let arr = [].concat(that.indexProList)
				that.indexProList = arr.concat([{'showItem':true}])
				this.getIndexInfo()
			} else {
				that.hasMore = false
				wx.hideLoading()
				wx.stopPullDownRefresh()
			}

			// let res = await getIndexInfo(postData)
			// console.log('获取的搜索数据',res)
			// if (res.data.res_code==1) {
			// 	if(res.data.result.length<20){
      //     console.log('没有更多了')
      //     this.hasMore = false
      //   }
			// 	this.indexProList = this.indexProList.concat(res.data.result)
			// 	wx.hideLoading()
			// } else {
			// 	wx.hideLoading()
			// }
		},

		// 点击图片预览功能
		lookImg(item,index){
			wx.previewImage({
			  current: '', // 当前显示图片的http链接
			  urls: [] // 需要预览的图片http链接列表
			})
		},

		addTag (item) {
			console.log('点击选择',item)
			if(!this.inTop){
				this.inTop = true
				wx.pageScrollTo({
					scrollTop:300
				})
			}
			for (var i = 0;i<this.showTagArr.length;i++) {
				this.showTagArr[i] = false
			}
			this.$set(this.showTagArr,item,!this.showTagArr[item])
			console.log('showTagArr',this.showTagArr)
		},

		chooseTagArrFun (e,index,index1) {
			console.log('点击',e,index,index1)
			if (index ==0) {
				this.text1 = e.mp.target.dataset.txt
			}else if (index==2) {
				console.log
				this.text3 = e.mp.target.dataset.txt
			}
			for (var i = 0;i<this.showTagArr.length;i++) {
				this.showTagArr[i] = false
			}
			this.$set(this.chooseTagArr,index,index1)
			this.indexProList = []
			this.pageIndex = 1
			this.hasMore = true
			this.requestType = 1
			this.productType = this.chooseTagArr[0]
			this.isHeat = this.chooseTagArr[2]
			this.getIndexInfo()
		},
		async chooseTagArrFun1 (e,index,index1,item) {
			console.log('点击',e,index,index1)
			if (index==1) {
				this.text2 = e.mp.target.dataset.txt
			}
			for (var i = 0;i<this.showTagArr.length;i++) {
				this.showTagArr[i] = false
			}
			this.$set(this.chooseTagArr,index,index1)
			this.indexProList = []
			this.requestType = 1
			this.pageIndex = 1
			this.hasMore = true
			this.citycode=item.citycode
			this.lat=item.lat
			this.lng=item.lng
			this.adcode=item.adcode
			// this.adcode=110105
			this.getIndexInfo()
		},

		closeModel () {
			console.log('关闭模板')
			this.showTagArr.map((val,index)=>{
				this.$set(this.showTagArr,index,false)
			})
		}
	}
}
</script>

<style type="text/css" scoped>
.addMoreBox{
  font-size: 14px;
  text-align: center;
  padding: 10px;
  color: #aaa;
}
.search {
  width: 100%;
  height: 30px;
  display: block;
  /* padding: 0 10px; */
  box-sizing: border-box;
}
/* 无商品数据时 */
 .nullBox{
	height: 60vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
  /* display: none; */
}
.nullBox img{
	width: 138px;
	height: 138px;
	margin-bottom: 10px;
}
.nullBox span{
	color: #999DA2;
	font-size: 16px;
}
/* 大盒子 */
.top{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	background: #fff;
	z-index: 10;
}
.top>div{
	line-height: 30px;
}
.swiperBox{
	display: flex;
	flex-wrap:wrap;
}
.swiperBox>div{
	width: 20%;
	text-align: center;
	padding: 0px 8px 10px 8px;
	/* justify-content: space-around; */
}
.swiperBox .imgbox{
	position: relative;
	padding-top: 100%;
}
.imgbox img{
	position: absolute;
	top: 0px;
	left: 0px;
}
.swiper{
	height: 63vw;
	/* height: 280rpx; */
}
.list {
	padding-left: 10px;
	padding-bottom: 60px;
	padding-right: 10px;
}
.searchDiv{
	/* text-align: center; */
	background-color: rgba(242,241,240,1);
	border-radius: 5px;
	color: #999DA2;
	font-size: 12px;
}
.tagBox .title{
	font-size: 14px;
	color: #484848;
}
.tagBox .icon{
	display: inline-block;
	border-top:5px solid rgba(174,172,166,1);
	border-left:5px solid #fff;
	border-right:5px solid #fff;
	border-bottom:5px solid #fff;
	margin-bottom: -3px;
}
.tagBox .on .icon{
	border-top:5px solid #fff;
	border-left:5px solid #fff;
	border-right:5px solid #fff;
	border-bottom:5px solid #5D9AFC;
	margin-bottom: 2px;
}
.inTop{
	position: fixed;
	left: 0px;
	top:0;
	width: 100vw;
	z-index: 10;
}
.main>div{
	font-size: 14px;
	text-align: center;
	color: #484848;
	line-height: 30px;
}
.main .on{
	color: #5D9AFC;
}
.on .title{
	color: #5D9AFC;
}
.adressBox{
	box-sizing: border-box;
	padding-left: 10px;
	padding-top: 20px;
}
.modelBg{
	background: rgba(0,0,0,0.5);
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	z-index: 9;
}
.backIcon{
	transform:rotate(180deg)
}
.topBox{
	padding: 10px;
	height: 20px;
}
</style>
