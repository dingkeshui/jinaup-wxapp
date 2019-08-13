<template>
	<div>
		<div class="top">
			<div class="adressBox flex flexvcenter" :style="{height:statusBarHeight+'px'}">
				<img class="backIcon mgr5" @click.stop="backPage" style="width:15px;height:15px;" src="/static/images/jt.png">
				<!-- <div @click.stop="goCityList">
					<img class="mgr5" style="width:13px;height:17px;" src="/static/images/adress.png">
					<span style="width:70px;" class="line1 fs12">{{location}}</span>
				</div> -->
				<img class="mgr5" style="width:13px;height:17px;" src="/static/images/adress.png">
				<span @click.stop="goCityList" style="width:70px;" class="line1 fs12">{{location}}</span>
				<!-- <span class="mgr5 fs14">></span> -->
			</div>
			<div class="pad10 flex flexvcenter">
				<div class="searchDiv flex1">
					<!-- <div>搜索</div> -->
					<!-- <input type="text" placeholder="搜索" v-model="inputVal" @confirm="searchGoods"> -->
					<img src="/static/images/search.png" class="search" @click="gotoSeek" alt>
				</div>
			</div>
		</div>
		<div class="list" :style="{paddingTop:statusBarHeight+55+'px'}">
			<div>
				<swiper
				indicator-dots
				indicator-color="#CCCCCC"
				indicator-active-color="#FC5D7B"
				interval="3000"
				circular
				class="swiper"
				>
				<swiper-item v-for="(item,index) in indexCategoryList" :key="index">
			      <div class="box boxsizing swiperBox">
			      	<div class="boxsizing" v-for="(item2,index2) in item" :key="index2" @click="goGoodsSearch(item2)">
			      		<div class="imgbox">
			      			<img class="box" :src="item2.imgUrl?item2.imgUrl:cateImg" mode="aspectFit">
			      		</div>
			      		<div class="fs12">{{item2.cname}}</div>
			      	</div>
			      </div>
			    </swiper-item>
				</swiper>
			</div>

			<div :class="['bgfff','tagBox','flex','pad10',{inTop:inTop}]" :style="{top:inTop?statusBarHeight+46+'px':'0px'}">
				<div :class="['flex1',{on:showTagArr[0]}]">
					<div class="title center" @click.stop="addTag(0)">
						<span class="mgr5">{{text1||'全部'}}</span>
						<span class="icon"></span>
					</div>
					<div v-if="showTagArr[0]" class="main padt10">
						<div @click="chooseTagArrFun('全部',0,0)" :class="[{on:chooseTagArr[0]==0}]">全部</div>
						<div @click="chooseTagArrFun('普通商品',0,2)" :class="[{on:chooseTagArr[0]==2}]">普通商品</div>
						<div @click="chooseTagArrFun('新店开张',0,1)" :class="[{on:chooseTagArr[0]==1}]">新店开张</div>
						<div @click="chooseTagArrFun('9.9专区',0,3)" :class="[{on:chooseTagArr[0]==3}]">9.9专区</div>
						<div @click="chooseTagArrFun('爆品专区',0,4)" :class="[{on:chooseTagArr[0]==4}]">爆品专区</div>
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
						<div @click.stop="chooseTagArrFun1(item.name,1,index,item)" :class="[{on:chooseTagArr[1]==index}]" v-for="(item,index) in xianquList" :key="index">{{item.name}}</div>
						</block>
					</div>
				</div>
				<div :class="['flex1',{on:showTagArr[2]}]"  @click.stop="addTag(2)">
					<div class="title center">
						<span class="mgr5">{{text3||'智能排序'}}</span>
						<span class="icon"></span>
					</div>
					<div v-if="showTagArr[2]" class="main padt10">
						<div @click.stop="chooseTagArrFun('离我最近',2,0)" :class="[{on:chooseTagArr[2]==0}]">离我最近</div>
						<div @click.stop="chooseTagArrFun('热度最高',2,1)" :class="[{on:chooseTagArr[2]==1}]">热度最高</div>
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

		</div>
		<div v-if="showTagArr[0]||showTagArr[1]||showTagArr[2]" @click="closeModel" class="modelBg"></div>
		<btab onIndex="a"></btab>
	</div>
</template>

<script type="text/javascript">
import btab from '@/components/b/tab.vue'
import goods from '@/components/b/goods.vue'
import {getIndexInfo, getIndexInfoByDeliver,indexCategory, productMicroCategoryQuery,getCityInfo} from '@/pages/b/api/index'
import {chinaAdress2} from '@/api/index'

var amapFile = require('@/utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
export default {
	data () {
		return {
			isShowTop: true,
			indexCategoryList: [],
			inTop:false,
			showTagArr:[false,false,false],
			chooseTagArr:[0,0,0],
			statusBarHeight:50, // 头部高度
			indexProList:[],
			pageIndex: 1,
			location:'',
			citycode:'',
			lat:'',
			lng:'',
			adcode:'',
			productType:0,
			isHeat:0,
			hasMore: true,
			inputVal: '',
			// flag: true,
			cateImg: '/static/images/creame.png',// 没有分类图片的备用
			xianquList: [],
			naviState: '',
			text1: '', // 筛选条件的文本展示
			text2: '',
			text3: '',
			requestType:1,
			byCityList:false
		}
	},
	components:{
		btab,
		goods
	},
	onPageScroll (res) {
	    // console.log('页面滚动',res)
	    if (res.scrollTop>=200) {
	    	if (!this.inTop) {
	    		this.inTop = true
	    	}
	    } else {
	    	if (this.inTop && this.showTagArr.indexOf(true)<0) {
	    		this.inTop = false
	    	}
			}
	},
	// 下拉刷新
	async onPullDownRefresh(){
		this.isShowTop = true
		this.pageIndex = 1
		this.indexProList = []
		this.hasMore = true
		let locationSearch2 = wx.getStorageSync('cityChose')
		if (locationSearch2) {
			this.location = locationSearch2.name
			this.lat = locationSearch2.lat
	    this.lng = locationSearch2.lng
	    this.adcode = locationSearch2.adcode
			this.citycode = locationSearch2.citycode
		}
		this.getIndexInfo()
		// this.getUserLocation()
	},
	async onLoad(option){
		// debugger
		let that = this
		// console.log('接收的城市县区',option)
		// that.location = option.city
		if (option.city) {
			that.byCityList = true
		} else {
			that.byCityList = false
		}
		this.text1 = ''
		this.text2 = ''
		this.text3 = ''
		// that.pageIndex = 1
		// that.chooseTagArr[0] = 0
		// that.indexProList = []
		// that.naviState = option.state
		let locationSearch2 = wx.getStorageSync('cityChose')
		if (locationSearch2) {
			that.pageIndex = 1
			that.indexProList = []
			that.chooseTagArr = [0,0,0]
			that.location = locationSearch2.name
			this.lat = locationSearch2.lat
	    	this.lng = locationSearch2.lng
	    	this.adcode = locationSearch2.adcode
			this.citycode = locationSearch2.citycode
			// this.getIndexInfo()
		}
		this.getUserLocation()
		wx.getSystemInfo({
		    success: res => {
		      //导航高度
		      console.log('导航高度',res.statusBarHeight+46)
		      that.statusBarHeight = res.statusBarHeight+46
		    }, fail(err) {
		      console.log(err)
		    }
		})
		this.getIndexCategory()
	},
	onShow() {
		console.log('首页onshow')
		let that = this
		// this.indexProList = []
		// this.pageIndex = 1
		this.isShowTop = true

		this.xianquList = wx.getStorageSync('xianqu') || []
		// 关闭模板
		this.showTagArr.map((val,index)=>{
				this.$set(this.showTagArr,index,false)
		})
	},
	mounted() {
		this.xianquList = wx.getStorageSync('xianqu') || []
	},
	onReachBottom () {
		// console.log('滚动到底')
		if (!this.hasMore) return
			this.pageIndex++
			this.getIndexInfo()
	},
	methods:{
		// 获取首页商品信息列表
		async getIndexInfo () {
			let that = this
			wx.showLoading({
        		title: '加载中'
			})
			let postData = {
				citycode:this.citycode,
				lat:this.lat,
				lng:this.lng,
				adcode:this.adcode,
				// adcode:110105,
				type:this.requestType == 1?0:1,
				isHeat:this.isHeat,
				pageIndex:this.pageIndex,
				productType:this.chooseTagArr[0]
			}
			console.log('首页参数',postData)
			let res = await getIndexInfo(postData)
			// if(this.requestType == 1){
			// 	res = await getIndexInfo(postData)
			// }else {
			// 	res = await getIndexInfoByDeliver(postData)
			// }
			console.log('获取的首页数据',res)
			if (res.data.res_code==1) {
				let arr = [].concat(that.indexProList)
				that.indexProList = arr.concat(res.data.result)
				if(res.data.result.length<3&&this.requestType==1){
					that.indexProList.push({'showItem':true})
					this.requestType = 2
					this.pageIndex = 1
					this.getIndexInfo()
				}else{
					wx.hideLoading()
					wx.stopPullDownRefresh()
				}
				// that.indexProList = res.data.result
				console.log('获取的首页数据赋值',that.indexProList)
			} else if (this.requestType==1) {
				this.requestType = 2
				this.pageIndex = 1
				let arr = [].concat(that.indexProList)
				that.indexProList = arr.concat([{'showItem':true}])
				console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
				this.getIndexInfo()
			} else {
				that.hasMore = false
				wx.hideLoading()
				wx.stopPullDownRefresh()
			}
			// else if (res.data.res_code==1004&&postData.pageIndex==1&&this.requestType==1) {
			// 	this.requestType = 2
			// 	this.getIndexInfo()
			// } else {
			// 	that.hasMore = false
			// 	wx.hideLoading()
			// 	wx.stopPullDownRefresh()
			// }
		},
		// 返回积纳
		backPage(){
			wx.reLaunch({
				url:'/pages/index/main'
			})
		},
		// 获取首页分类
		async getIndexCategory () {
			let that = this
			const res = await productMicroCategoryQuery()
			console.log('小B首页分类数据', res)
			if (res.data.res_code === 1) {
				var arr = []
				for(var i=0;i< res.data.result.length;i+=10){
				    arr.push( res.data.result.slice(i,i+10))
				}
				that.indexCategoryList = arr
			}
		},
		// 跳转到搜索分类页
		goGoodsSearch (item) {
			let historyList = wx.getStorageSync('hisSearch') || []
			historyList.unshift(item.cname)
			historyList = [... new Set(historyList)]
			wx.setStorageSync('hisSearch',historyList)

			let formData = {
				lat: this.lat,
				lng: this.lng,
				adcode: this.adcode,
				citycode: this.citycode
			}

			wx.navigateTo({
				url: `/pages/b/b_goodsSearch/main?id=${item.cid}&name=${item.cname}&data=${JSON.stringify(formData)}`
			})
		},
		// 搜索商品
		gotoSeek() {
			console.log("去搜索页面")
			// let formData = {
			// 	lat: this.lat,
			// 	lng: this.lng,
			// 	adcode: this.adcode,
			// 	citycode: this.citycode
			// }
	  //       wx.navigateTo({
	  //       	url: `/pages/b/b_search/main?data=${JSON.stringify(formData)}`
	  //     	});
			wx.navigateTo({
				url: "/pages/search/main?type=b"
			});
    },

		// 跳转到城市列表
		goCityList () {
			wx.navigateTo({
				url: '/pages/b/b_cityList/main'
			})
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
			console.log('点击',index,index1,e)
			if (index ==0) {
				// this.text1 = e.mp._relatedInfo.anchorTargetText
				this.text1 = e
			}else if (index==2) {
				// this.text3 = e.mp._relatedInfo.anchorTargetText
				this.text3 = e
			}
			for (var i = 0;i<this.showTagArr.length;i++) {
				this.showTagArr[i] = false
			}
			this.$set(this.chooseTagArr,index,index1)
			this.indexProList = []
			this.pageIndex = 1
			this.requestType = 1
			this.hasMore = true
			this.productType = this.chooseTagArr[0]
			this.isHeat = this.chooseTagArr[2]
			this.getIndexInfo()
		},
		async chooseTagArrFun1 (e,index,index1,item) {
			console.log('点击',e,index,index1)
			if (index==1) {
				// this.text2 = e.mp._relatedInfo.anchorTargetText
				this.text2 = e
			}
			for (var i = 0;i<this.showTagArr.length;i++) {
				this.showTagArr[i] = false
			}
			this.$set(this.chooseTagArr,index,index1)
			this.indexProList = []
			this.pageIndex = 1
			this.requestType = 1
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
		},
		// 加载更多
		getMore () {
			// let that = this
			// if (!that.hasMore) return
			// that.pageIndex++
			// that.getIndexInfo()
		},
		// 获取定位
		getLocate () {
			let that = this
			var myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
			myAmapFun.getRegeo({
	      success: function(data){
		    	//成功回调
					console.log('高德经纬度---',data)
					wx.setStorage({
						key:'mapInfo',
						data:data,
						success(){
							console.log('定位位置缓存成功')
						}
					})
					let locationSearch2 = wx.getStorageSync('cityChose')
					if (locationSearch2) {
						if(that.byCityList){
 							that.lat = data[0].latitude
					    	that.lng = data[0].longitude
	            			that.location = locationSearch2.name
	            			that.getIndexInfo()
						} else {
							wx.showModal({
				            	title: '位置发生改变',
				            	content: '定位与当前城市不同,是否切换到定位城市?',
				            	success: function (res) {
				            		if (res.confirm) {
				            			wx.removeStorage({
											key: 'cityChose',
											success (res) {
											console.log(res)
											}
										})
				            			that.location = data[0].regeocodeData.addressComponent.province
										that.lat = data[0].latitude
								    	that.lng = data[0].longitude
								    	// that.adcode = data[0].regeocodeData.addressComponent.adcode
								    	that.adcode = ''
										that.citycode = data[0].regeocodeData.addressComponent.citycode
										that.pageIndex = 1
										that.chooseTagArr[0] = 0
										that.indexProList = []
										that.getIndexInfo() // 获取首页商品数据
										that.getCity() // 获取城市列表--展示全城
				            		} else {
				            			that.lat = data[0].latitude
								    	that.lng = data[0].longitude
				            			that.location = locationSearch2.name
				            			that.getIndexInfo()
				            		}
				            	}
				            })
			            }
					}else{
						that.location = data[0].regeocodeData.addressComponent.province
						that.lat = data[0].latitude
				    	that.lng = data[0].longitude
				    	// that.adcode = data[0].regeocodeData.addressComponent.adcode
				    	that.adcode = ''
						that.citycode = data[0].regeocodeData.addressComponent.citycode
						that.pageIndex = 1
						that.chooseTagArr[0] = 0
						that.indexProList = []
						that.getIndexInfo() // 获取首页商品数据
						that.getCity() // 获取城市列表--展示全城
					}
		    },
				fail: function(info){
					//失败回调
					console.log(info)
					wx.showToast({
						title: '拒绝授权',
			            icon: 'none',
			            duration: 1000
					})
					let locationSearch2 = wx.getStorageSync('cityChose')
					if(!locationSearch2){
						that.location = '未定位'
				    	that.lat =''
				    	that.lng = ''
				    	// that.adcode = data[0].regeocodeData.addressComponent.adcode
				    	that.adcode = ''
						that.citycode = ''
						that.pageIndex = 1
						that.requestType = 1
						that.chooseTagArr[0] = 0
						that.indexProList = []
						that.getIndexInfo() // 获取首页商品数据
						// that.getCity() // 获取城市列表--展示全城
					}
				}
			})
		},
		// 获取城市列表
    async getCity() {
			console.log('object获取城市列表')
			let that = this
		    // 获取中国区域
		  const res = await getCityInfo()
		  let arr = []
		  res.data.result.map(val => {
		      arr.push(...val.values)
		  })
			let city = that.fnCity(arr,that.location) //定位城市对应城市列表的id
			// console.log('object获取城市列表对应id',city)
			this.getXianQu(city) // 根据城市id获取其下区县
		},
		// 根据定位城市找出对应的城市列表中的id以便获取其下区县
    fnCity(arr,locate) {
		console.log('object获取城市列表对应id')
        for (var i = 0;i<arr.length;i++) {
        	if (arr[i].name == locate) {
          		// return arr[i].values[j].id
          		return arr[i]
        	}
      	}
	},
		// 根据城市获取县区
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
		// 检测用户是否授权,封装
    getSetting() {
      return new Promise((resolve,reject) => {
        mpvue.getSetting({
          success: function(res) {
            resolve(res)
          }
        })
      })
		},
		// 判断是否授权
		getUserLocation: function () {
    	var _this = this
    	let locationSearch2 = wx.getStorageSync('cityChose')
    	wx.getSetting({
      	success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            	title: '请求授权当前位置',
            	content: '需要获取您的地理位置，请确认授权',
            	success: function (res) {
              	if (res.cancel) {
                	//取消授权
                	wx.showToast({
                	  title: '拒绝授权',
                	  icon: 'none',
                	  duration: 1000
									})
                	if(!locationSearch2){
                		_this.location = '未定位'
		    					_this.lat = ''
		    					_this.lng = ''
		    					_this.adcode = ''
									_this.citycode = ''
									_this.pageIndex = 1
									_this.requestType = 1
									_this.chooseTagArr[0] = 0
									_this.indexProList = []
									_this.getIndexInfo() // 获取首页商品数据
									// _this.getCity() // 获取城市列表--展示全城
                	}
              	} else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                	wx.openSetting({
                  	success: function (res) {
                    	if (res.authSetting["scope.userLocation"] == true) {
                    	  wx.showToast({
                    	    title: '授权成功',
                    	    icon: 'success',
                    	    duration: 1000
                    	  })
												//再次授权，调用wx.getLocation的API
												_this.pageIndex = 1
												_this.requestType = 1
                    	  _this.getLocate()
                    	} else {
                    	  wx.showToast({
                    	    title: '授权失败',
                    	    icon: 'none',
                    	    duration: 1000
												})
                    	  if(!locationSearch2){
                    	  	_this.location = '未定位'
		    								_this.lat = ''
		    								_this.lng = ''
		    								_this.adcode = ''
												_this.citycode = ''
												_this.pageIndex = 1
												_this.requestType = 1
												_this.chooseTagArr[0] = 0
												_this.indexProList = []
												_this.getIndexInfo() // 获取首页商品数据
												// _this.getCity() // 获取城市列表--展示全城
                    	  }
                    	}
                  	}
                	})
              	}
            	}
          	})
        	} else if (res.authSetting['scope.userLocation'] == undefined) {
						 //用户首次进入页面,调用wx.getLocation的API
						 _this.pageIndex = 1
						 _this.requestType = 1
         	 	_this.getLocate()
        	}
        	else {
          	console.log('授权成功')
						//调用wx.getLocation的API
						_this.pageIndex = 1
						_this.requestType = 1
          	_this.getLocate()
        	}
      	}
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
	justify-content: center;
	/* align-items: center; */
}
.swiperBox>div{
	width: 20%;
	text-align: center;
	padding: 0px 8px 0px 8px;
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
	width: 45px;
	height: 45px;
}
.swiper{
	height: 50vw;
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
</style>
