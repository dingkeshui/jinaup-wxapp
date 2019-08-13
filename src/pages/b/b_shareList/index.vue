<template>
	<div>
		<!-- 我的分享 -->
		<goods v-if='shareList1.length' :List="shareList1"></goods>
		<div class="addMoreBox" v-if='shareList1.length'>
      <span v-if="hasMore">加载更多</span>
      <span v-else>没有更多啦！</span>
  	</div>
		<!-- 若没有数据显示 -->
    <div class="nullBox" v-else>
			<img mode="aspectFit" src="/static/images/dfh.png">
			<span>暂时没有分享商品哦~</span>
		</div>

	</div>
</template>

<script type="text/javascript">
import goods from '@/components/b/goods.vue'
import {bProducts} from '@/pages/b/api/index'
export default {
	data () {
		return {
			shareList: [],
			pageIndex: 1,
			hasMore: true,
			longitude: '',
			latitude: ''
		}
	},
	async onLoad () {
		// this.getShareList()
		// this.getLocate()
	},
	async onShow() {
		this.pageIndex = 1
		this.shareList = []
		await this.getShareList()
		await this.getLocate()
	},
	onReachBottom () {
		if(!this.hasMore) return
		this.pageIndex++
		this.getShareList()
	},
	computed: {
		shareList1 () {
			let that = this
			if (that.shareList) {
				that.shareList.forEach(val => {
					val.storeVo.distance = that.space(val.storeVo.latitude,val.storeVo.longitude, that.latitude, that.longitude)
				})
				return that.shareList
			}
		}
	},
	methods: {
		// 获取我的分享商品列表
		async getShareList () {
			const that = this
			const res = await bProducts({
				pageIndex: that.pageIndex
			})
			console.log('分享列表结果',res)
			if (res.data.res_code === 1) {
				that.shareList = that.shareList.concat(res.data.result)
			}else if (res.data.res_code === 1004) {
				that.hasMore = false
			}
		},

		// 定位获取位置
    async getLocate(){
      let that=this
      // 判断是否授权
      const {authSetting} = await that.getSetting()
      if (!authSetting['scope.userInfo']) {
          wx.showToast({
						title:'自动定位需要授权',
						icon:'none',
						duration:2000
					})
          return wx.reLaunch({
            url: '/pages/b_login/main',
          })
      } else {
				wx.getLocation({
				 	type: 'wgs84',
				 	success (res) {
						// console.log('获取的当前位置经纬度',res)
						that.latitude = res.latitude
						that.longitude = res.longitude
				 	}
				})
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
		// 基于经纬度计算两地之间的距离
    space(lat1, lng1, lat2, lng2) {
      console.log(lat1, lng1, lat2, lng2)
      var radLat1 = lat1 * Math.PI / 180.0
      var radLat2 = lat2 * Math.PI / 180.0
      var a = radLat1 - radLat2
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
      s = s * 6378.137
			s = Math.round(s * 10000) / 10000
			// s = s < 1? '<1' : s.toFixed(2)
      return s  // 单位千米
    }
	},
	components:{
		goods
	}
}
</script>

<style type="text/css" scoped>
/* 无更多数据 */
.addMoreBox{
  font-size: 14px;
  text-align: center;
  padding: 10px;
  color: #aaa;
}

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
</style>
