<template>
<div class="minBox">
	<div class="top">
		<div class="pad10 flex fs16">
			<input v-model="name" class="flex1 mgr10 inp" placeholder="搜索商品名">
			<div class="searchBut" @click="searchFun">搜索</div>
		</div>
		<div class="searchTab flex">
			<div @click="changeTabFun('a')"><span :class="[{'on':onTab=='a'}]">商城</span></div>
			<div v-if="showBFun" @click="changeTabFun('b')"><span :class="[{'on':onTab=='b'}]">纳小店</span></div>
		</div>
		<div v-if="showType=='a'" class="flex hisTop pad10 flexvcenter">
			<div class="flex1">历史搜索</div>
			<img style="width:15px;height:15px;" src="/static/seek/del.png" @click="clearHis">
		</div>
		<template v-if="showType=='b'">
			<div v-if="onTab=='a'" class="flex fs14 tabBox">
				<div :class="['flex1','flexcenter',{'on':queryType==0}]" @click="changeTab(0)">综合</div>
				<div :class="['flex1','flexcenter',{'on':queryType==1}]" @click="changeTab(1)">最新</div>
				<div :class="['flex1','flexcenter',{'on':queryType==2}]" @click="changeTab(2)">
					<label :class="querySort">价格</label>
				</div>
			</div>
			<div v-if="onTab=='b'" class="topBox">
				<div :class="['bgfff','tagBox','flex','inTop']">
					<div :class="['flex1',{on:showTagArr[0]}]" @click.stop="addTag(0)">
						<div class="title center" @click.stop="clickTitle(0)">
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
						<div class="title center" @click.stop="clickTitle(1)">
							<span class="mgr5">{{text2||'全城'}}</span>
							<span class="icon"></span>
						</div>
						<div v-if="showTagArr[1]" class="main padt10">
							<block v-if="xianquList.length">
							<div @click.stop="chooseTagArrFun1($event,1,index,item)" :class="[{on:chooseTagArr[1]==index}]" v-for="(item,index) in xianquList" :key="index" :data-txt="item.name">{{item.name}}</div>
							</block>
						</div>
					</div>
					<div :class="['flex1',{on:showTagArr[2]}]"  @click.stop="addTag(2)">
						<div class="title center" @click.stop="clickTitle(2)">
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
		</template>
	</div>
	<div :class="['list',{'bgf':showType=='b'}]">
		<div v-if="showType=='a'" class="his pad10">
			<div class="hisMain flex">
				<div v-for="item in hisList" class="hisItem fs14 mgr10 mgb10" @click="clickHisItme(item)">{{item}}</div>
			</div>
		</div>
		<template v-if="showType=='b'">
			<div class="box" v-if="onTab=='a'">
				<div v-if="list&&list.length" class="content">
			        <dl v-for="(item,index) in list" :key="index" class="dl-re" @click="goDetali(item.pid)">
			          <dt>
			            <span>
			              <img :src="item.mainImgUrl" alt>
			            </span>
			          </dt>
			          <dd>
			            <h3>{{item.title}}</h3>
			            <div class="coupon">
			              <span v-if="item.isFreeShipping==1">包邮</span>
			            </div>
			            <div class="price">
			              <div>
			                <b>￥</b>
			                <b>{{item.salesPrice}}</b>
			              </div>
			              <span v-if="item.productType!=1">￥{{item.vipPrice}}</span>
			              <span class="earnBox" v-if="item.productType!=1&&item.earnMoney&&loginUserinfo.userType==1">赚￥{{item.earnMoney}}</span>
			            </div>
			            <span class="tl-content" v-if="item.productType==2">秒杀</span>
			            <span class="tl-content" v-else>NEW</span>
			          </dd>
			        </dl>
			    </div>
			    <div v-else class="flex2 flexvcenter noBox">
			    	<img class="noimg mgb10" src="/static/images/sou.jpg" alt="">
	    			<h1>抱歉未找到该商品~</h1>
			    </div>
			</div>
			<template v-else>
				<div v-if="indexProList.length">
					<goods :List="indexProList"></goods>
					<div class="addMoreBox">
	    		  		<span v-if="hasMore">加载更多</span>
	    		  		<span v-else>没有更多啦！</span>
	    			</div>
				</div>
			</template>
		</template>
	</div>
	<!-- 模态框 -->
	<div v-if="showTagArr[0]||showTagArr[1]||showTagArr[2]" @click="closeModel" class="modelBg"></div>
</div>
</template>

<script type="text/javascript">
import goods from '@/components/b/goods.vue'
import {getIndexInfo, getIndexInfoByDeliver,indexCategory,getCityInfo} from '@/pages/b/api/index'
import { getSearch,chinaAdress2 } from '@/api/index'

var amapFile = require('@/utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
	export default {
		data () {
			return {
				name:'',
				hisList:'',
				pageIndexa:1,
				queryType:0,
				querySort:'asc',
				list:'',
				showType:'a',
				loginUserinfo:'',
				notMore:false,
				onTab:'a',
				// b
				showTagArr:[false,false,false],
				chooseTagArr:[0,0,0],
				indexProList:[],
				pageIndexb: 1,
				citycode:'010',
				lat:'39.921466',
				lng:'116.443153',
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
				location:'北京市',
				requestType:1
			}
		},
		components:{
			goods
		},
		computed:{
			showBFun(){
				return this.$store.state.showB
			}
		},
		onReachBottom(){
		    console.log('滚动加载')
		    if(this.onTab=='a'){
		    	if(!this.notMore){
		      		this.pageIndexa++
		      		this.getList()
		    	}
		    }else{
		    	if (!this.hasMore) return
				this.pageIndexb++
				this.getIndexInfo()
			}
		},
		onLoad (e) {
			console.log('eeeeee',e)
			this.onTab = e.type
			this.bSearchSet()
			let that = this
			wx.getStorage({
			  key: 'hisList',
			  success (res) {
			    console.log('获取搜索缓存',res.data)
			    that.hisList = res.data
			  }
			})
			this.name = ''
			this.pageIndexa = 1
			this.pageIndexb = 1
			this.indexProList = []
			this.queryType = 0
			this.showType = 'a'
			this.querySort = 'asc'
			let loginResult = wx.getStorageSync('loginResult')
			this.loginUserinfo = loginResult.userInfo
		},
		onShow () {
			
		},
		methods:{
			//
			clickTitle(item){
				if(this.showTagArr[item]){
					this.closeModel()
				} else {
					this.addTag(item)
				}
			},
			// 小B商品搜索准备
			bSearchSet(){
				let that = this
				that.hasMore = true
				let myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
				myAmapFun.getRegeo({
      				success: function(data){
      					console.log('高的定位成',data)
      					wx.setStorage({
							key:'mapInfo',
							data:data,
							success(){
								console.log('定位位置缓存成功')
							}
						})
						that.location = data[0].regeocodeData.addressComponent.province
						that.lat = data[0].latitude
						that.lng = data[0].longitude
						that.adcode = ''
						that.citycode = data[0].regeocodeData.addressComponent.citycode
						that.pageIndexb = 1
						that.chooseTagArr[0] = 0
						that.indexProList = []
						that.getCity() // 获取城市列表--展示全城
      				},
      				fail:function(){
      					that.adcode = ''
      					that.pageIndexb = 1
						that.chooseTagArr[0] = 0
						that.indexProList = []
      					that.getCity()
      				}
      			})
				// let locationSearch2 = wx.getStorageSync('cityChose')
				// if (locationSearch2) {
				// 	console.log('locationSearch2',locationSearch2)
				// 	that.pageIndexb = 1
				// 	that.indexProList = []
				// 	that.chooseTagArr = [0,0,0]
				// 	that.location = locationSearch2.name
				// 	this.lat = locationSearch2.lat
			 //    	this.lng = locationSearch2.lng
			 //    	this.adcode = locationSearch2.adcode
				// 	this.citycode = locationSearch2.citycode
				// 	that.getCity()
				// } else {
				// 	let myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
				// 	myAmapFun.getRegeo({
	   //    				success: function(data){
	   //    					console.log('高的定位成',data)
	   //    					wx.setStorage({
				// 				key:'mapInfo',
				// 				data:data,
				// 				success(){
				// 					console.log('定位位置缓存成功')
				// 				}
				// 			})
				// 			that.location = data[0].regeocodeData.addressComponent.province
				// 			that.lat = data[0].latitude
				// 			that.lng = data[0].longitude
				// 			that.adcode = ''
				// 			that.citycode = data[0].regeocodeData.addressComponent.citycode
				// 			that.pageIndexb = 1
				// 			that.chooseTagArr[0] = 0
				// 			that.indexProList = []
				// 			that.getCity() // 获取城市列表--展示全城
	   //    				}
	   //    			})
				// }
			},
			async getCity() {
				let that = this
			    // 获取中国区域
			    console.log(111)
				const res = await getCityInfo()
				console.log(222)
				let arr = []
				res.data.result.map(val => {
				  arr.push(...val.values)
				})
				let city = that.fnCity(arr,that.location) //定位城市对应城市列表的id
				// console.log('object获取城市列表对应id',city)
				this.getXianQu(city) // 根据城市id获取其下区县
			},
			fnCity(arr,locate) {
		        for (var i = 0;i<arr.length;i++) {
		        	if (arr[i].name == locate) {
		          		return arr[i]
		        	}
		      	}
			},
			async getXianQu (params) {
				let res = await chinaAdress2({pid: params.id})
				console.log('根据定位城市获取的其下的县区', res)
				if (res.data.res_code === 1) {
					let city = res.data.result
					params.adcode = ''
					city.unshift(params)
					this.xianquList = city
					wx.setStorageSync('xianqu',city)
				}
			},
			changeTabFun(item){
				this.onTab = item
			},
			clearHis(){
				this.hisList = ''
				wx.removeStorage({
				  key: 'hisList',
				  success (res) {
				    console.log(res)
				  }
				})
			},
			changeTab(item){
				this.queryType = item
				if(item==2){
					if(this.querySort=="asc"){
						this.querySort="desc"
					}else{
						this.querySort="asc"
					}
				}
				this.pageIndexa = 1
				this.getList()
			},
			searchFun(){
				let that = this
				if(this.name){
					if(!this.hisList){
						this.hisList = []
					}
					this.hisList.push(this.name)
					wx.setStorage({
						key:"hisList",
						data:that.hisList
					})
					this.pageIndexa= 1
					this.pageIndexb= 1
					this.indexProList = []
					this.requestType = 1
					this.getList()
					this.getIndexInfo()
				}
			},
			clickHisItme(item){
				this.name = item
				this.pageIndexa = 1
				this.pageIndexb = 1
				this.requestType = 1
				this.indexProList = []
				this.hasMore = true
				this.notMore = true
				this.getList()
				this.getIndexInfo()
			},
			goDetali(id) {
		      wx.navigateTo({
		        url: "/pages/go2detail/main?id=" + id
		      });
		    },
			async getList(){
				if(this.name){
					let postData={}
					postData.pageIndex = this.pageIndexa
					postData.queryWord = this.name
					postData.queryType = this.queryType
					postData.querySort  = this.querySort
					wx.showLoading({
					  title: '加载中',
					})
					let res = await getSearch(postData)
					wx.hideLoading()
					console.log('搜索结果',res)
					if(res.data.res_code==1){
						this.showType = 'b'
						if(this.pageIndexa==1){
							this.list = res.data.result
						}else{
							this.list = this.list.concat(res.data.result)
						}
						if(res.data.result.length<20){
							this.notMore = true
						}else{
							this.notMore = false
						}
					} else if (res.data.res_code==1004) {
						this.showType = 'b'
						this.list = ''
						this.notMore = true
					} else {
						wx.showToast({
						  title: res.data.message?res.data.message:'搜索失败',
						  icon: 'none',
						  duration: 2000
						})
						this.notMore = true
					}
				}
			},
			// b
			showFun(){
				let that = this
				that.chooseTagArr = [0,0,0]
				that.pageIndexb = 1
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
					pageIndex:that.pageIndexb,
					productType:this.chooseTagArr[0]
				}
				if (that.name) {
				  postData.queryWord = that.name
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
						this.pageIndexb = 1
						this.getIndexInfo()
					}else{
						wx.hideLoading()
						wx.stopPullDownRefresh()
					}
				} else if (res.data.res_code==1004&&this.requestType==1) {
					this.requestType = 2
					this.pageIndexb = 1
					let arr = [].concat(that.indexProList)
					that.indexProList = arr.concat([{'showItem':true}])
					this.getIndexInfo()
				} else {
					that.hasMore = false
					wx.hideLoading()
					wx.stopPullDownRefresh()
				}
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
				this.pageIndexb = 1
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
				this.pageIndexb = 1
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

<style type="text/css" scoped lang="scss">
	.top{
		position: fixed;
		top: 0px;
		left: 1px;
		width: 100vw;
		box-sizing: border-box;
		background-color: #fff;
		z-index:10;
	}
	.top .inp{
		background-color: rgba(237,237,237,1);
		border-radius: 5px;
		height: 30px;
		line-height: 30px;
		box-sizing: border-box;
		padding: 0px 10px;
	}
	.searchBut{
		height: 30px;
		line-height: 30px;
		border-radius: 5px;
		background-color: #FC5D7B;
		color: #fff;
		text-align: center;
		width: 64px;
	}
	.list{
		padding-top: 130px;
		min-height:100vh;
		box-sizing:border-box;
	}
	.hisTop{
		color: #999999;
		font-size: 16px;
		height: 50px;
		box-sizing: border-box;
	}
	.hisMain{
		flex-wrap: wrap;
	}
	.hisItem{
		padding: 5px 10px;
		border-radius: 5px;
		background-color: #F5F5F4;
		color: #333333;
	}
	.tabBox{
		height: 50px;
	}
	.tabBox>div{
		height: 50px;
		display: flex;
	}
	.tabBox .on{
		color: #FC5D7B;
	}
	.asc,.desc{
		position: relative;
	}
	.asc:after{
		content:'';
		display: inline-block;
		position: absolute;
		bottom: 0px;
		right: -15px;
		border-top: 5px solid #FC5D7B;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
	}
	.asc:before{
		content:'';
		display: inline-block;
		position: absolute;
		top: 0px;
		right: -15px;
		border-bottom: 5px solid #D8D8D8;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
	}
	.desc:after{
		content:'';
		display: inline-block;
		position: absolute;
		bottom: 0px;
		right: -15px;
		border-top: 5px solid #D8D8D8;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
	}
	.desc:before{
		content:'';
		display: inline-block;
		position: absolute;
		top: 0px;
		right: -15px;
		border-bottom: 5px solid #FC5D7B;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
	}
	.content {
  /* margin-top: 40px; */
  flex: 1;
  width: 100%;
  height: 100%;
  background: #f3f7f7;
  padding: 9px 5px 0 5px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  dl {
    width: 363rpx;
    height: 536rpx;
    background: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin-top: 4px;
    dt {
      // width:100%;
      height: 200px;
      padding: 30px 23px 15px 14px;
      span {
        display: block;
        width: 295rpx;
        height: 277rpx;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    dd {
      width: 100%;
      flex: 1;
      h3 {
        font-size: 12px;
        padding-left: 5px;
        color: #323a45;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .coupon {
        width: 100%;
        display: flex;
        padding-left: 6px;
        box-sizing: border-box;
        margin-top: 16px;
        span {
          display: block;
          padding: 0 5px;
          color: #fc5d7b;
          border: 1px solid #fc5d7b;
          border-radius: 2px;
          font-size: 10px;
          margin-right: 5px;
        }
      }
      .price {
        width: 100%;
        display: flex;
        align-items: flex-end;
        div {
          display: flex;
          align-items: flex-end;
          padding-left: 3px;
          b {
            color: #fc5d7b;
            &:nth-child(1) {
              font-size: 14px;
            }
            &:nth-child(2) {
              font-size: 18px;
            }
            &:nth-child(3) {
              font-size: 14px;
            }
          }
        }
        span {
          font-size: 11px;
          color: #a87831;
        }
      }
    }
  }
}
.tl-content {
  display: block;
  width: 25px;
  height: 13px;
  border-radius: 2px;
  background: linear-gradient(to left, #ffb848, #ff7737);
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 9px;
  text-align: center;
  line-height: 13px;
}
.dl-re {
  position: relative;
}
.price-sort {
  width: 30%;
  height: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top: 155rpx;
  right: 10rpx;
  z-index: 999;
  background: #fff;
  span {
    font-size: 15px;
  }
}
.earnBox{
  background:rgba(255,232,237,1);
  border-radius:2px;
  color:#FC5D7B !important;
  font-size:10px;
  padding:0px 3px;
}
.noimg{
	margin-top:20px;
	width:60vw;
	height:60vw;
}
.noBox{
	background-color:#F3F7F7;
	color:#999DA2;
}
.bgf{
	background-color:#F3F7F7;
}
.searchTab div{
	width:50vw;
	height:30px;
	text-align:center;
}
.searchTab span{
	display:inline-block;
	height:30px;
	box-sizing:border-box;
	width:80px;
	border-bottom:3px solid #fff;
}
.searchTab .on{
	border-bottom:3px solid #FC5D7B;
}

.tagBox .title{
	font-size: 14px;
	color: #484848;
	height:30px;
	line-height:30px;
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
	padding:10px 0px;
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
.addMoreBox{
  font-size: 14px;
  text-align: center;
  padding: 10px;
  color: #aaa;
}
</style>