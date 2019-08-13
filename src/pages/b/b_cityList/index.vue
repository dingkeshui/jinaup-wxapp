<template>
  <!-- <div>城市列表</div> -->
  <div class="city_wrap">
    <div class="search">
      <div class="search_box" >
        <input type="text" placeholder="城市/区/县" v-model="inputVal"  @focus="goSearch" @input="getInputVal" @confirm="confirmSearch">
        <img class="searchImg" src="/static/seek/search.png"/>
      </div>
      <!-- <div class="search_btn" @click="confirmSearch">搜索</div> -->
      <div class="search_btn" @click.stop="isFocus = true" v-show="!isFocus">搜索</div>
      <div class="search_btn" @click.stop="cancleSearch" v-show="isFocus">取消</div>

    </div>
    <!-- 搜索结果展示-->
    <div class="search_modalCity" v-show="isFocus">
        <scroll-view scroll-y>
          <a href="" @click.stop="handleAddrChose(item)" v-for="item in searchResultList" :key="item.id">
            <span style="color:rgba(93,154,252,1);margin-right:8px;">{{item.name}}</span>
            <!-- <span>{{item.district}}</span> -->
          </a>
        </scroll-view>
    </div>
    <!-- 左侧城市列表 -->
    <div class="city_left" v-show="!isFocus">
      <scroll-view scroll-y style='width:100%;height:100%;' scroll-with-animation :scroll-into-view="cityListId"
      :scroll-top="stateHeight"
      @scroll="handleStateHeight"
      >
        <div class="city_loacte">
          <div class="curr_top">
            <div class="current_city">
              <span class='city_locate_title'>当前：</span>
              <span class='city_locate_text'>{{locateCity}}</span>
            </div>
            <div class="choose" @click.stop="handleShowXianQu" style="margin-right:5px;">
              <span>选择区县</span>
              <span class="pri-top" v-if="isShow"><img style="width:10px;height:10px;transform:rotate(90deg);" src="/static/images/jt.png"></span>
              <span class="pri-bottom" v-else><img style="width:10px;height:10px;transform:rotate(-90deg);" src="/static/images/jt.png"></span>
            </div>
          </div>
          <div class="curr_bottom" v-if="showXianQu">
            <p class="total" @click.stop="handleAllCity">全城</p>
            <p v-for="(item0,index0) in xianqu" :key="index0" @click.stop="choseXianQu(index0,$event,item0)" :data-selected="item0">{{item0.name}}</p>
            <!-- <p :class="showActive==index0 ? 'active': ''" v-for="(item0,index0) in xianqu" :key="index0" @click.stop="choseXianQu(index0,$event,item0)" :data-selected="item0">{{item0.name}}</p> -->
          </div>
        </div>
        <div class="city_loacte new_city">
          <div class="curr_top">
            <div class="current_city">
              <span class='city_locate_title new_city_title'>定位/最近访问</span>
            </div>
            <div class="choose" @click.stop="handleShowMore" style="margin-right:5px;">
              <img src="/static/seek/del.png" alt="" style="width:20px; height:20px;margin-right:10px;vertical-align:middle;" @click.stop="clearHistory">
              <span>查看更多</span>
              <span class="pri-top" v-if="!showMoreHistory"><img style="width:10px;height:10px;transform:rotate(90deg);" src="/static/images/jt.png"></span>
              <span class="pri-bottom" v-else><img style="width:10px;height:10px;transform:rotate(-90deg);" src="/static/images/jt.png"></span>
            </div>
          </div>
          <div class='new_city_box'>
              <!-- 定位 -->
              <p @click.stop="getLocate"> <img src="/static/images/adress.png" alt="" />&nbsp;{{locatedCity}}</p>
              <!-- 城市历史 -->
              <block v-if="!showMoreHistory">
                <p v-for="(item, index) in searchHistory" :key="index" v-if="index<5"
                  @click.stop="goLocateCity(item)"
                >{{item}}</p>
              </block>
              <block v-else>
                <p v-for="(item, index) in searchHistory" :key="index">{{item}}</p>
              </block>
          </div>
        </div>

        <div class="city_list_box" v-for="(item,index1) in citylist" :key="index1">
          <!-- 字母 -->
          <div class="city_title" :id="item.singleWorld">{{item.singleWorld}}</div>
          <!-- 城市 -->
          <!-- <block v-for="(val1,index2) in item.values" :key="index2"> -->
            <div class="city" v-for="val2 in item.values" :key="val2.id">
              <p @click.stop="choseCityName(val2)">{{val2.name}}</p>
            </div>
          <!-- </block> -->
        </div>
      </scroll-view>
    </div>
    <!-- 右侧字母列表 -->
    <div class="city_right" v-show="!isFocus">
      <ul>
        <li v-for="(rItem, i) in letter" :key="i" @click.stop='letterTap' :data-item='rItem'>{{rItem}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {getCityInfo} from '@/pages/b/api/index'
import {chinaAdress2,chinaAdress} from '@/api/index'
var amapFile = require('@/utils/amap-wx.js') //如：..­/..­/libs/amap-wx.js
export default {
  data() {
    return {
      letter: '', // 首字母列表
      citylist:'',// 中国区域市列表
      citylist1:'',// 中国区域市列表整合
      cityListId: '',
      xianqu: [], // 根据定位城市获取的县区
      showXianQu: false, // 是否显示全城县区
      isShow: true, // 控制显示全城县区的箭头改变
      selectedXianQu: '', // 点击选中的县区
      showActive: '', // 点击选中的县区的样式突出控制
      inputVal: '', // 输入框输入的搜索值
      locateCity: '', // 获取的当前城市
      // currentCity: '',
      flag: true, // 控制在搜索请求未返回之前重复发送请求
      isFocus: false, // 控制聚焦
      searchHistory: [], // 搜索历史记录
      showMoreHistory: false, // 是否展示搜索历史
      searchResultList: [], // 地址搜索列表
      stateHeight: 0,
      cityChose: '',
      locatedCity: ''// 获取的定位城市
    }
  },
  onLoad () {
    let that = this
    this.getCity()

    let locationSearch2 = wx.getStorageSync('cityChose')
		if (locationSearch2) {
      that.locateCity = locationSearch2.name
      let city = that.fnCity(that.citylist,that.locateCity)
      // console.log('根据定位城市找出对应的城市的id以便获取其下区县', cityid)
      that.getXianQu(city)
    }else{
      // 定位
      this.getUserLocation()
      var myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
		  myAmapFun.getRegeo({
	      success: function(data){
	        //成功回调
	        console.log('高德经纬度',data)
          that.locateCity = data[0].regeocodeData.addressComponent.province
          that.locatedCity = data[0].regeocodeData.addressComponent.province

          let city = that.fnCity(that.citylist,that.locateCity)
          // console.log('根据定位城市找出对应的城市的id以便获取其下区县', cityid)
          that.getXianQu(city)
	      },
	      fail: function(info){
	        //失败回调
	        console.log(info)
	      }
	    })
    }

  },
  onShow () {
    this.isFocus = false
    this.inputVal = ''
    this.showActive = 0
    this.searchResultList = []
    this.stateHeight = 0
    this.cityListId = ''
    this.searchHistory = wx.getStorageSync('history') || []
    // this.locateCity = this.searchHistory[0]
    // this.locateCity = this.locatedCity
    this.locatedCity =  wx.getStorageSync('locatedCity').city || '定位'
    this.xianqu = wx.getStorageSync('xianqu')
  },
  methods: {
    // 获取城市列表
    async getCity() {
      let that = this
      // 获取中国区域
      const res = await getCityInfo()
      this.letter = res.data.result.map(item => {
        return item.singleWorld
      })
      this.citylist = res.data.result
      this.searchHistory = mpvue.getStorageSync('history') || []

      let arr = []
      this.citylist.map(val => {
        arr.push(...val.values)
      })
      this.citylist1 = arr
    },

    // 根据输入框输入的值模糊匹配市
    getInputVal () {
      let that = this
      that.searchResultList = that.citylist1.filter(val => {
        return val.name.indexOf(that.inputVal) >= 0
      })
      // let that = this
      // // if (!that.flag) return //return，不发送请求
      // // that.flag = false
      // // 输入检测,如果输入为空，则不发送请求
      // if (!that.inputVal) return that.searchResultList = []
      // // 发送请求
      // var myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})

		  // myAmapFun.getInputtips({
      //   keywords: that.inputVal.toString().trim(),
      //   success: function (data) {
      //     console.log('根据输入关键词从高德模糊获取地址',data)
      //     if (data && data.tips) {
      //       that.searchResultList = data.tips
      //     }
      //   }
      // })
      // // that.flag = true // 请求完毕，改变状态可以发送下次请求了
    },
    // 在搜索结果里选中市
    handleAddrChose (params) {
      this.locateCity = params.name
      let xianqures = this.getXianQu(params)
      this.stateHeight = 0

      let that = this
      that.locateCity = params.name
      let cityChose = {
       	location:params.name,
	    	lat:params.lat,
	    	lng:params.lng,
	    	// adcode:params.adcode,
	    	adcode:'',
        citycode:params.citycode,
        name:params.name
      }
      that.cityChose = cityChose
      wx.setStorageSync('cityChose',cityChose)

      // 定位历史存入本地存储记录为历史记录
      this.searchHistory = mpvue.getStorageSync('history') || []
      // 把本地输入的添加进去并去重之后再存储进去
      this.searchHistory.unshift(this.locateCity)
      this.searchHistory = [... new Set(this.searchHistory)]
      // console.log(this.searchHistory)
      mpvue.setStorageSync('history', this.searchHistory)
      this.inputVal = ''
      this.isFocus = false
      this.searchResultList = [],
      this.showActive = 0

      // 获取到该市的县区之后跳转到首页
      if (xianqures) {
        let that = this
        wx.reLaunch({
          url: `/pages/b/b_index/main?city=${that.locateCity}&state=1`
        })
        this.showXianQu = false
      }
    },

    // 选择县区
    choseXianQu (index,e,item) {
      // wx.removeStorageSync('citySearch')
      wx.setStorageSync('cityChose',item)
      this.showActive = index
      this.selectedXianQu = item.name
      // console.log('选中的县区',e.currentTarget.dataset.selected.name)
      wx.reLaunch({
        // url: `/pages/b/b_index/main?city=${this.locateCity}&state=1`
        url: `/pages/b/b_index/main?city=${this.locateCity}${item.name}&state=1`
      })
      this.showXianQu = false
      this.showMoreHistory = false
      this.isFocus = false
      this.inputVal = ''
      this.showActive = ''
      wx.removeStorageSync('xianqu')
      wx.setStorageSync('xianqu',[item])
    },

    // 点击城市列表获取其下区县
    choseCityName (item) {
      this.locateCity = item.name
      var quxianres = this.getXianQu(item)
      // this.stateHeight = 0

      let that = this
      that.locateCity = item.name
      let cityChose = {
       	location:item.name,
	    	lat:item.lat,
	    	lng:item.lng,
	    	// adcode:item.adcode,
	    	adcode:'',
        citycode:item.citycode,
        name:item.name
      }
      that.cityChose = cityChose
      wx.setStorageSync('cityChose',cityChose)

      // 定位历史存入本地存储记录为历史记录
      this.searchHistory = mpvue.getStorageSync('history') || []
      // 把本地输入的添加进去并去重之后再存储进去
      this.searchHistory.unshift(this.locateCity)
      this.searchHistory = [... new Set(this.searchHistory)]
      // console.log(this.searchHistory)
      mpvue.setStorageSync('history', this.searchHistory)

      // 获取到该市的县区之后跳转到首页
      if (quxianres) {
        let that = this
        wx.reLaunch({
          url: `/pages/b/b_index/main?city=${that.locateCity}&state=1`
        })
        this.showXianQu = false
      }

    },

     // 根据城市获取县区
    async getXianQu (params) {
      const res = await chinaAdress2({pid: params.id})
      console.log('根据定位城市获取的其下的县区', res)
      if (res.data.res_code === 1) {
        this.xianqu = res.data.result.slice(0)
        let city = res.data.result
        params.adcode = ''
        city.unshift(params)
        wx.setStorageSync('xianqu',city)
        return true
      }
    },

    // 点击定位获取当前城市
    async getLocate(){
      let that=this
      var myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
		  myAmapFun.getRegeo({
	      success: function(data){
	        //成功回调
	        console.log('高德经纬度',data)
          that.locateCity = data[0].regeocodeData.addressComponent.province
          that.locatedCity = data[0].regeocodeData.addressComponent.province

          let city = that.fnCity(that.citylist,that.locateCity)
          // console.log('根据定位城市找出对应的城市的id以便获取其下区县', cityid)
          that.getXianQu(city)

          let cityChose = {
           	location:data[0].regeocodeData.addressComponent.province,
	        	lat:data[0].latitude,
	        	lng:data[0].longitude,
	        	// adcode:data[0].regeocodeData.addressComponent.adcode,
	        	adcode:'',
            citycode:data[0].regeocodeData.addressComponent.citycode,
            name:that.locateCity
          }
          that.cityChose = cityChose
          wx.setStorageSync('cityChose',cityChose)

          wx.reLaunch({
            url: `/pages/b/b_index/main?city=${that.locateCity}&state=1`
          })
          this.showMoreHistory = false
          this.isFocus = false
          this.inputVal = ''
          this.showActive = ''

          //把获取的定位和获取的时间放到本地存储,
          wx.setStorageSync('locatecity', { city: that.locateCity, time: new Date().getTime() })
          wx.setStorageSync('locatedCity', { city: that.locatedCity, time: new Date().getTime() })

          // 把获取的定位添加进去并去重之后再存储进去历史记录
          // that.searchHistory.unshift(that.locateCity)
          // that.searchHistory = [... new Set(that.searchHistory)]
          // // console.log(that.searchHistory)
          // mpvue.setStorageSync('history', that.searchHistory)
	      },
	      fail: function(info){
	        //失败回调
	        console.log(info)
	      }
	    })

    },
    //点击全城跳转首页根据全市搜素
    handleAllCity () {
      let that = this
      wx.setStorageSync('cityChose',that.cityChose)
      wx.reLaunch({
        url: `/pages/b/b_index/main?city=${that.locateCity}&state=1`
      })
      this.showMoreHistory = false
      this.isFocus = false
      this.showXianQu = false
      this.inputVal = ''
      this.showActive = ''
    },
    // 根据定位城市找出对应的城市的id以便获取其下区县
    fnCity(arr,locate) {
      for (var i = 0;i<arr.length;i++) {
        for (var j = 0;j<arr[i].values.length;j++) {
          if (arr[i].values[j].name == locate) {
            // return arr[i].values[j].id
            return arr[i].values[j]
          }
        }
      }
    },
    // 聚焦搜索
    goSearch () {
      this.isFocus = true
    },

    // 确认搜索
    confirmSearch () {
      this.searchHistory = mpvue.getStorageSync('history') || []
      // 把本地输入的添加进去并去重之后再存储进去
      this.searchHistory.unshift(this.inputVal)
      this.searchHistory = [... new Set(this.searchHistory)]
      console.log(this.searchHistory)
      mpvue.setStorageSync('history', this.searchHistory)
      this.inputVal = ''
      this.isFocus = false
    },
    // 取消搜索
    cancleSearch () {
      this.inputVal = ''
      this.isFocus = false
    },
    //点击城市字母
    letterTap(e) {
      const Item = e.currentTarget.dataset.item
      this.cityListId = Item
      this.stateHeight = 'auto'
    },
    // 是否展示选择县区
    handleShowXianQu () {
      this.showXianQu = !this.showXianQu
      this.isShow = !this.isShow
    },
    // 点击查看更多最近访问历史
    handleShowMore () {
      this.showMoreHistory = !this.showMoreHistory
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
    // 清除历史记录
    clearHistory () {
      wx.removeStorageSync('history')
      this.getCity()
    },
    // 点击搜索历史显示为当前
    goLocateCity (item) {
      // this.locateCity = item
      this.inputVal = item
      this.isFocus = true
      this.getInputVal()
    },
    // 控制滚动时scroll-view的高度
    handleStateHeight (res) {
      // console.log(res)
      this.stateHeight = 'auto'
    },
    	// 判断是否授权
		getUserLocation: function () {
    	var _this = this
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
                    	  _this.getLocate1()
                    	} else {
                    	  wx.showToast({
                    	    title: '授权失败',
                    	    icon: 'none',
                    	    duration: 1000
												})
                    	}
                  	}
                	})
              	}
            	}
          	})
        	} else if (res.authSetting['scope.userLocation'] == undefined) {
						 //用户首次进入页面,调用wx.getLocation的API
						 _this.pageIndex = 1
         	 	_this.getLocate1()
        	}
        	else {
          	console.log('授权成功')
						//调用wx.getLocation的API
						_this.pageIndex = 1
          	_this.getLocate1()
        	}
      	}
    	})
    },
    // 授权成功获取定位
    async getLocate1(){
      let that=this
      var myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
		  myAmapFun.getRegeo({
	      success: function(data){
	        //成功回调
	        console.log('高德经纬度',data)
          that.locateCity = data[0].regeocodeData.addressComponent.province
          that.locatedCity = data[0].regeocodeData.addressComponent.province

          let city = that.fnCity(that.citylist,that.locateCity)
          // console.log('根据定位城市找出对应的城市的id以便获取其下区县', cityid)
          that.getXianQu(city)

          let cityChose = {
           	location:data[0].regeocodeData.addressComponent.province,
	        	lat:data[0].latitude,
	        	lng:data[0].longitude,
	        	// adcode:data[0].regeocodeData.addressComponent.adcode,
	        	adcode:'',
            citycode:data[0].regeocodeData.addressComponent.citycode,
            name:that.locateCity
          }
          that.cityChose = cityChose
          wx.setStorageSync('cityChose',cityChose)

          this.showMoreHistory = false
          this.isFocus = false
          this.inputVal = ''
          this.showActive = ''

          //把获取的定位和获取的时间放到本地存储,
          wx.setStorageSync('locatecity', { city: that.locateCity, time: new Date().getTime() })
          wx.setStorageSync('locatedCity', { city: that.locatedCity, time: new Date().getTime() })

          // 把获取的定位添加进去并去重之后再存储进去历史记录
          // that.searchHistory.unshift(that.locateCity)
          // that.searchHistory = [... new Set(that.searchHistory)]
          // // console.log(that.searchHistory)
          // mpvue.setStorageSync('history', that.searchHistory)
	      },
	      fail: function(info){
	        //失败回调
	        console.log(info)
	      }
	    })

    },
  },

  // onReady(){
  //   let that = this,
  //       cityOrTime = wx.getStorageSync('locatecity')||{},
  //       time = new Date().getTime(),
  //       city=''
  //   if (!cityOrTime.time||(time - cityOrTime.time > 1800000)){//每隔30分钟请求一次定位
  //     this.getLocate()
  //   }else{//如果未满30分钟，那么直接从本地缓存里取值
  //     this.locateCity = cityOrTime.city
  //   }
  // }
}
</script>

<style scoped>
.city_wrap{
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  align-items: center;
  position: relative;
  padding-top: 60px;
  position: relative;
}
/* 搜索框 */
.city_wrap .search{
  width: 100%;
  height: 60px;
  position: fixed;
  left: 0;
  top: 0;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
}
.search .search_box{
  flex: 1;
  /* height: 35px; */
  background:rgba(237,237,237,1);
  border-radius:6px;
  position: relative;
}
.search .search_box .searchImg{
  width:13px;
  height:13px;
  position: absolute;
  left: 10px;
  top: 12px;
  vertical-align: middle;
}
.search .search_box input{
  padding-left: 31px;
  font-size:14px;
  height:35px;
}
.search .search_btn{
  width:60px;
  height:35px;
  background:rgba(252,93,123,1);
  border-radius:6px;
  font-size:14px;
  color:rgba(255,255,255,1);
  line-height:35px;
  text-align: center;
  margin-left: 5px;
}

/* 搜索结果展示 */
.search_modalCity{
  /* display: none; */
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  background-color: #fff;
}
.search_modalCity scroll-view{
  height: 100%;
}
.search_modalCity a{
  display: block;
  box-shadow:0px -1px 0px 0px rgb(246,246,246);
  padding: 14px 20px;
  font-size:14px;
}
.search_modalCity a:last-child{
  box-shadow:0px 1px 0px 0px rgb(246,246,246);
}

/* 左侧城市列表 */
.city_left{
  flex: 1;
  height: 100%;
}
.city_left scroll-view {
  height: 100%;
  color:rgba(72,72,72,1);
}
.city_left .curr_top{
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size:14px;
}
.curr_top .pri-top,.pri-bottom{
  width:10px;
  height:6px;
  border-color: transparent transparent black transparent;
  margin-left: 3px;
}
.city_left .curr_bottom{
  /* padding: 8px 0; */
  display:flex;
  flex-wrap:wrap;
  /* justify-content: space-between; */
  /* align-items: center; */
}
.city_left .curr_bottom>p{
  margin-bottom:10rpx;
  margin-right:10rpx;
  text-align:center;
  padding:20rpx 30rpx;
  border:2rpx solid rgba(231,231,231,1);
}
.city_left .curr_bottom::after{
  content: '';
  display: block;
  width:100px;
  height:40px;
  margin-bottom: 5px;
  text-align: center;
  line-height: 40px;
  border:none;
}
.city_left .curr_bottom .active{
  background:rgba(244,244,244,1);
}
.city_left .new_city_title{
  font-size:14px;
  padding: 10px 0;
}
.city_left .new_city_box{
  display: flex;
  flex-wrap: wrap;
}
.city_left .new_city_box p{
  margin-bottom: 5px;
  margin-right: 5px;
  text-align: center;
  padding: 10px 15px;
  border:1px solid rgba(231,231,231,1);
}
.city_left .new_city_box p:first-child{
  padding: 10px 20px;
}
.city_left .new_city_box p img{
  width:13px;
  height:16px;
}

.city_list_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.city_list_box .city_title{
  height:27px;
  background:#F7F7F7;
  line-height: 27px;
}
.city_list_box .city{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.city_list_box .city p{
   height:44px;
   line-height: 44px;
}

/* 右侧字母筛选 */
.city_right{
  width: 12px;
  font-size:12px;
  font-weight:600;
  text-align: center;
  margin-top: 20px;
}
.city_right li{
  /* padding: 5px 0; */
}
</style>
