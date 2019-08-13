<template>
  <div class="minBox">
	<div class="top">
		<div class="pad10 flex fs16">
			<input v-model="inputVal" class="flex1 mgr10 inp" placeholder="搜索商品" focus="true">
			<div class="searchBut" @click="searchGoods">搜索</div>
      <!-- <img src="/static/images/close.png" alt="" > -->
		</div>
		<div class="flex hisTop pad10 flexvcenter">
			<div class="flex1">历史搜索</div>
			<img style="width:15px;height:15px;" src="/static/seek/del.png" @click="clearHis">
		</div>
    <div class="his pad10">
			<div class="hisMain flex">
        <block v-if="historyList.length">
				<div v-for="(item,index) in historyList" class="hisItem fs14 mgr10 mgb10" @click="clickHisItme(item)" :key="index">{{item}}</div>
        </block>
			</div>
		</div>
	</div>

</div>
</template>

<script>
export default {
  data() {
    return {
        inputVal: '',
				historyList: [],
				formData: ''
    }
	},
	onLoad(params) {
		this.formData = JSON.parse(params.data)
	},
  onShow() {
    this.historyList = wx.getStorageSync('hisSearch')
    this.inputVal = ''
  },
  methods: {
    searchGoods () {
      let that = this
      if (that.inputVal) {
        let historyList0 = wx.getStorageSync('hisSearch') || []
        historyList0.unshift(that.inputVal)
        historyList0 = [... new Set(historyList0)]
        that.historyList = historyList0
        wx.setStorageSync('hisSearch', historyList0)

			  wx.navigateTo({
			  	url: `/pages/b/b_goodsSearch/main?keyWords=${that.inputVal}&data=${JSON.stringify(that.formData)}`
			  })
			  that.inputVal = ''
      }

    },
    clickHisItme(item) {
			let that = this
      wx.navigateTo({
				url: `/pages/b/b_goodsSearch/main?keyWords=${item}&data=${JSON.stringify(that.formData)}`
			})
			that.inputVal = ''
    },
    clearHis () {
      	this.historyList = ''
				wx.removeStorageSync('hisSearch')
    }
  },
}
</script>

<style scoped>
  	.top{
		position: fixed;
		top: 0px;
		left: 1px;
		width: 100vw;
		box-sizing: border-box;
		background-color: #fff;
		z-index:5;
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
		padding-top: 100px;
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
		/* display: flex; */
		flex-wrap: wrap;
	}
	.hisItem{
		padding: 5px 10px;
		background-color: #F5F5F4;
		border-radius: 5px;
		color: #333333;
	}
</style>
