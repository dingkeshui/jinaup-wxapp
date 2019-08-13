<template>
<!-- 商家订单列表 -->
<div class="b-orderWarp">
    <div class="head">
      <span
			:class="tabinfo == 0? 'active' : ''"
			@click="changeactive(0)">全部</span>
			<span
			:class="tabinfo == 2? 'active' : ''"
			@click="changeactive(2)"
			>待发货</span>
			<span
			:class="tabinfo == 3? 'active' : ''"
			@click="changeactive(3)"
			>已收货</span>
			<span
			:class="tabinfo == 6? 'active' : ''"
			@click="changeactive(6)"
			>售后</span>
    </div>
    <block v-if="orderList.length">

		<scroll-view class="main" scroll-y v-if="tabinfo == 0" @scrolltolower="getMore">
			<div class="shop"  @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">待收货</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
        </dl>
      </div>
			<div class="shop" @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">申请退款</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
        </dl>
      </div>
			<div class="shop" @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">待发货</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
        </dl>
      </div>
			<div class="shop" @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">交易成功</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
        </dl>
      </div>
      <div class="shop" @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">退款完成</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
        </dl>
      </div>
		</scroll-view>

		<scroll-view class="main" scroll-y v-else-if="tabinfo == 2" @scrolltolower="getMore">
			<div class="shop"  @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">待发货</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
          <!-- <div class="box-btn">
            <button style="margin-right:15rpx;background:#fff;">取消订单</button>
            <button class="go-payment">去付款19:02</button>
          </div> -->
          <!-- <div class="box-btn" v-if="item.processStatus==='待收货'">
            <button style="margin-right:15rpx;background:#fff;" @click.stop="goLogistics(item)">查看物流</button>
            <button @click.stop="ensure(item)">确认收货</button>
          </div> -->
        </dl>
      </div>
		</scroll-view>

		<scroll-view class="main" scroll-y v-else-if="tabinfo == 3" @scrolltolower="getMore">
			<div class="shop" @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">待收货</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
        </dl>
      </div>
		</scroll-view>

		<scroll-view class="main" scroll-y v-else @scrolltolower="getMore">
			<div class="shop" @click="goOrdermain">
        <div class="state">
          <span style="font-size:28rpx;color:#323A45">小和尚的店铺</span>
          <span style="font-size:32rpx;color:#323A45;font-weight:500;">售后</span>
        </div>
        <dl class="shop-box">
          <dd>
            <img src="/static/images/6.png" alt="">
          </dd>
          <dt>
            <h3>帮宝适绿帮纸尿裤大号L164片超薄透气男女通用婴儿尿片尿不湿</h3>
            <span class="size" style="color:#999DA2;font-size:24rpx;">规格：XL</span>
            <li class="shop-bot">
              <span class="price" style="color:#323A45;font-size:24rpx;">￥52.50</span>
              <span class="num" style="color:#323A45;font-size:24rpx;">×1</span>
            </li>
          </dt>
        </dl>
				<!-- 结算 -->
				<dl class="balance">
          <p>共2件商品 合计：￥
            <em>52.5</em>
          </p>
          <!-- <div class="box-btn">
            <button style="margin-right:15rpx;background:#fff;">物流详情</button>
          </div> -->
        </dl>
      </div>
		</scroll-view>

    </block>
    <!-- 若无网络显示 -->

    <!-- 若没有数据显示 -->
    <div class="nullBox" v-else>
			<img mode="aspectFit" src="/static/images/wudingdan.png">
			<span>暂时没有订单哦~</span>
		</div>
    <!-- 有订单数据 -->


        <!-- 结算 -->



    <!-- 支付弹窗 -->

  </div>
</template>

<script type="text/javascript">
import {getBMicroOrderList} from '@/pages/b/api/index'
export default {
	data () {
		return {
      orderList: [],
      tabinfo: 0,
      pageIndex: 1,
      pageSize: 5,
      // state: 0,
      hasMore: true // 记录是否是否还有数据可加载，加载完时不再发送请求
		}
  },
  onLoad () {
    this.getOrderList()
  },
	methods: {
    // 获取订单列表
    async getOrderList () {
      const query = {
        state: this.tabinfo,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
       wx.showLoading({
        title: '加载中'
      })
      const res = await getBMicroOrderList(query)
      if (res.data.result.length== 0) {
        return that.hasMore = false
      }
      if (res.data.res_code === 1){
         this.orderList = res.data.result
         console.log('全部订单列表', res)
          wx.hideLoading()
      }
    },
    // 加载更多
    async getMore () {
      console.log('到底...')
      if (!this.hasMore) return // 没有更多数据时，return
      this.pageIndex += 1
      const query = {
        state: this.tabinfo,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      const res = await getBMicroOrderList(query)
      if (res.data.result.length== 0) {
        return this.hasMore = false
      }
      if (res.data.res_code === 1){
        this.orderList.push(...res.data.result)
        console.log('拼接订单列表后的列表数据', this.orderList)
      }
    },

		changeactive (tab) {
      this.tabinfo = tab
      this.getOrderList()
		},

		// 跳转到商家订单详情页
		goOrdermain () {
			wx.navigateTo({
					url: `/pages/b/b_order/b_ShopOrderMain/main`
      })
    }
  }

}
</script>

<style scoped>
	.b-orderWarp{
		width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f3f7f7;
		/* position: relative; */
	}
	.b-orderWarp .head {
    width: 100%;
    height: 80rpx;
    background: #fff;
    line-height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40rpx;
    box-sizing: border-box;
    font-size: 30rpx;
    position: fixed;
    top: 0;
    left: 0;
		box-shadow:0px 1px 0px 0px rgba(246,246,246,1);
  }
	.head span {
    width: 16%;
    height: 90%;
    color: #484848;
    text-align: center;
    border-bottom: 6rpx solid #fff;
  }

  .active {
    border-bottom: 6rpx solid #5D9AFC !important;
  }
  /* 无订单 */
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
/* 有订单数据 */
	.main {
    width: 100%;
    /* height: 100%; */
		flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 18rpx;
    box-sizing: border-box;
    margin-top: 80rpx;
		position: absolute;
		top: 0;
		bottom: 0;
		background: #f3f7f7;
    /* display: none; */
  }

  .shop {
    width: 100%;
    background: #fff;
    margin-top: 24rpx;
    border-radius: 12rpx;
  }

  .state {
    width: 100%;
    height: 74rpx;
    line-height: 74rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 24rpx;
  }

  .shop-box {
    width: 100%;
    height: 208rpx;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 12rpx 24rpx;
    /* border-bottom: 1px solid #eee; */
		box-shadow:0px 1px 0px 0px rgba(246,246,246,1);
  }

  .shop-box dd {
    width: 25%;
    height: 100%;
    background: #eee;
  }

  .shop-box dd img {
    width: 100%;
    height: 100%;
  }

  .shop-box dt {
    width: 70%;
    height: 100%;
    font-size: 28rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .shop-bot {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .balance {
    width: 100%;
		padding: 18rpx 20rpx 0 0;
		box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
  }

  .balance p {
    display: flex;
    font-size: 26rpx;
    color: #484848;
		margin-bottom: 40rpx;
  }

  .balance .box-btn {
    height: 60rpx;
    display: flex;
  }

  .box-btn button {
    font-size: 28rpx;
    line-height: 60rpx;
    padding: 0 5px;
  }

  .go-payment {
    background: #FC5D7B;
    color: #fff;
  }
</style>
