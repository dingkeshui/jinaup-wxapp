<template>
  <div class="wrap">
    <scrollTop :classlist="list" :ind="active" @changClass="clickType"></scrollTop>
    <!-- <scroll-view scroll-x="true" class="chun">
      <li @click="goIndex">今日推荐</li>
      <li
        @click="clickType(index, item.cid)"
        v-for="(item, index) in list"
        :key="index"
        :class="active==index?'active':''"
      >{{item.cname}}</li>
    </scroll-view> -->
    <div class="main">
      <div
        v-for="(items, indexs) in lists"
        :key="indexs"
        class="center"
        @click="clickSubType(items.cid)"
      >
        <img :src="items.imgUrl" class="tu">
        <span class="txt">{{items.cname}}</span>
      </div>
      <!-- <div>
        没有该数据
      </div>-->
    </div>
    <ul class="tbar">
      <li :class="['col666',{'onIndex':onIndex==1}]" @click="clickSortType(1)">综合</li>
      <li :class="['col666',{'onIndex':onIndex==2}]" @click="clickSortType(2)">最新</li>
      <li :class="['prices','col666',{'onIndex':onIndex==3}]">
        <b @click="clickSortType(3)">价格</b>
        <span :class="isShow?'addActive1':'pri-top'">△</span>
        <span :class="!isShow?'addActive2':'pri-bottom'">▽</span>
      </li>
    </ul>

    <div class="dls">
      <dl v-for="(item,index) in props" :key="index" class="dl-re" @click="clickItem(item.pid)">
        <dt>
          <span>
            <img :src="item.mainImgUrl" lazy-load mode="aspectFit" alt>
          </span>
        </dt>
        <dd>
          <h3>{{item.title}}</h3>
          <div class="coupon">
            <span v-if="item.isFreeShipping===1">包邮</span>
            <template v-if="item.importType==0">
              <span>直邮</span>
              <span v-if="item.isFreeTax===1">包税</span>
            </template>
            <template v-if="item.importType==1">
              <span>保税区</span>
              <span v-if="item.isFreeTax===1">包税</span>
            </template>
          </div>
          <div class="price">
            <div>
              <b>￥</b>
              <b>{{item.salesPrice}}</b>
            </div>
            <span class="left" v-if="item.productType!=1">￥{{item.vipPrice}}</span>
            <span class="rights" v-if="item.productType!=1">赚￥{{item.earnMoney}}</span>
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import scrollTop from "../../components/scrollTop/scrollTop";

export default {
  data() {
    return {
      page: 1,
      cid: "",
      sortType: 1,

      active: 0,
      listProps: [],
      datas: [],
      isShow: true,
      onIndex:0
    }
  },
  components: {
    scrollTop
  },
  computed: {
    ...mapState({
      list: state => state.classify.list,
      props: state => state.classify.props
    }),
    // 子分类
    lists() {
      if (this.list && this.list.length) {
        return this.list[this.active].childs;
      }
      return [];
    },
    // 判断是否还有更多
    hasMore() {
      return this.page * 20 === this.props.length;
    }
  },
  methods: {
    ...mapMutations({
      appuserState: "classify/appuserState"
    }),
    ...mapActions({
      getList: "classify/getList",
      getProps: "classify/getProps"
    }),
    // 获取数据接口
    async fetchData() {
      wx.showLoading({
        title: "数据加载中...", //提示的内容,
        mask: true //显示透明蒙层，防止触摸穿透,
      });
      let result = await this.getProps({
        pageIndex: this.page,
        cid: this.cid,
        sortType: this.sortType
      });
      wx.hideLoading();
    },
    // 跳转首页
    goIndex() {
      wx.reLaunch({ url: "/pages/index/main" });
    },
    // 点击跳转详情
    clickItem(id) {
      wx.navigateTo({
        url: "/pages/go2detail/main?id=" + id
      });
    },
    // 一级分类点击
    clickType(ind, item) {
      this.active = ind;
      this.cid = item.cid;
      this.page = 1;
      // 重新请求数据
      this.fetchData();
    },
    // 二级分类点击
    clickSubType(cid) {
      this.cid = cid;
      this.page = 1;
      // 重新请求数据
      this.fetchData();
    },
    // 分类条件点击
    clickSortType(sort) {
      this.page = 1;
      this.onIndex = sort
      if (sort === 3) {
        this.isShow = !this.isShow;
        this.sortType = this.isShow ? 3 : 4;
      } else {
        this.sortType = sort;
      }

      // 重新请求数据
      this.fetchData();
    },
    async showFun(){
      let data = await this.getList();
      this.cid = this.list[this.active].cid;
      this.fetchData();
    }
  },
  onReachBottom() {
    if (this.hasMore) {
      this.page++;
      this.fetchData();
    }
  },
  onLoad(options) {
    this.active = options.index || 0;
    console.log("options", options.index, this.active);
    this.showFun()
  },
  onShow(e) {
    console.log('onshowe',this.$root.$mp.query)
    let data = this.$root.$mp.query
    this.active = data.index || 0;
    if(data.cid){
      this.active = data.index || 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  background: #f6f6f6;
  .chun {
    width: 100%;
    display: flex;
    white-space: nowrap;
    height: 100rpx;
    background: #fff;
    li {
      font-size: 32rpx;
      display: inline-block;
      height: 100rpx;
      text-align: center;
      color: #484848;
      box-sizing: border-box;
      margin: 0 20rpx;
    }
    li.active {
      border-bottom: solid #56d2bf 6rpx;
      line-height: 94rpx;
      font-weight: 500;
      color: #56d2bf;
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    .center {
      width: 25%;
      display: inline-block;
      padding: 20rpx;
      box-sizing: border-box;
      text-align: center;
      .tu {
        width: 100rpx;
        height: 100rpx;
      }
      .txt {
        font-size: 24rpx;
        display: block;
        padding: 12rpx 0;
        box-sizing: border-box;
      }
    }
  }
  .tbar {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #ffffff;
    margin-top: 10rpx;
    li {
      font-size: 13px;
      font-weight: 400;
    }
  }
  .dls {
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
      width: 48%;
      background: #fff;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      margin: 4px 1%;
      padding: 5px 10px;
      box-sizing: border-box;
      dt {
        margin-bottom:5px;
        span {
          display: block;
          position:relative;
          width:100%;
          padding-top:100%;
          img {
            position:absolute;
            top:0px;
            left:0px;
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
          padding-top: 10px;
          box-sizing: border-box;
          > span {
            display: block;
            padding: 0 5px;
            box-sizing: border-box;
            color: #fc5d7b;
            border: 1px solid #fc5d7b;
            border-radius: 3px;
            font-size: 10px;
            margin-right:5px;
          }
        }
        .price {
          width: 100%;
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
            display: inline-block;
            color: #a87831;
            padding: 5rpx 5rpx;
            box-sizing: border-box;
          }
          .rights {
            background: rgba(255, 232, 237, 1);
            color: #fc5d7b;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .prices {
    position: relative;
  }
  .col666{
    color:#666666 !important;
  }
  .col666.onIndex{
    color:#FC5D7B !important;
  }
  .pri-top {
    position: absolute;
    top: 19rpx;
    right: -25rpx;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-width: 5px;
    border-style: solid dashed dashed dashed;
    border-color: transparent transparent #d8d8d8 transparent;
  }
  .pri-bottom {
    position: absolute;
    top: 49rpx;
    right: -25rpx;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-width: 5px;
    border-style: solid dashed dashed dashed;
    border-color: #d8d8d8 transparent transparent transparent;
  }
  .addActive1 {
    position: absolute;
    top: 19rpx;
    right: -25rpx;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-width: 5px;
    border-style: solid dashed dashed dashed;
    border-color: transparent transparent #d8d8d8 transparent;
  }
  .addActive2 {
    position: absolute;
    top: 49rpx;
    right: -25rpx;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-width: 5px;
    border-style: solid dashed dashed dashed;
    border-color: #d8d8d8 transparent transparent transparent;
  }
  .onIndex .addActive1{
    border-color: transparent transparent #fc5d7b transparent;
  }
  .onIndex .addActive2{
    border-color: #fc5d7b transparent transparent transparent;
  }
}
</style>
