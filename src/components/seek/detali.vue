<template>
  <div style="flex:1;">
    <div class="wrap">
      <!-- <div :class="reachbottom?'nav fix':'nav'"> -->
      <div :class="reachbottom?'nav fix':'nav'">
        <!-- <ul>
          <li
            v-for="(item,index) in navList"
            :key="index"
            @click="goIsPrice(index)"
            :class="ind===index?'active':''"
          >{{item}}</li>
        </ul> -->
        <ul class="tbar">
          <li @click="goIsPrice(0)" :class="ind===0?'active':''">综合</li>
          <li @click="goIsPrice(1)" :class="ind===1?'active':''">最新</li>
          <li class="prices" :class="ind===2?'active':''">
            <b @click="goIsPrice(2)">价格</b>
            <span :class="isShow?'addActive1':'pri-top'">△</span>
            <span :class="!isShow?'addActive2':'pri-bottom'">▽</span>
          </li>
        </ul>
        <!-- <span class="tl-top"></span>
        <span class="tl-bottom"></span>-->
      </div>
      <div class="price-sort" v-if="isPrice">
        <span v-for="(item,index) in priceSort" :key="index" @click="goPrice(index)">{{item}}</span>
      </div>
      <div class="content">
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
            <span class="tl-content">NEW</span>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    list: {
      type: Array,
      default: [],
      ind: 0
    }
  },
  data() {
    return {
      isPrice: false,
      navList: ["综合", "最新", "价格"],
      ind: 0,
      reachbottom: false,
      index: 1
    };
  },
  onReachBottom() {
    console.log("开启上拉加载");
    wx.showLoading({
      title: "加载中"
    });
    this.index++;
    let num1 = this.list.length
    this.getSeekList({
      queryWord: this.productName,
      pageIndex: this.index,
      queryType: this.ind
    });
    let num2 = this.list.length
    console.log('num1,num2',num1,num2)
    wx.hideLoading();
  },
  onPageScroll: function(res) {
    if (res.scrollTop > 50) {
      this.reachbottom = true;
    } else {
      this.reachbottom = false;
    }
  },
  onShow() {
    console.log(this.queryWord);
  },
  computed: {
    ...mapState({
      priceSort: state => state.seek.priceSort,
      productName: state => state.seek.productName
    }),
    loginUserinfo () {
      return this.$store.state.loginUserinfo
    }
  },
  methods: {
    ...mapActions({
      getSeekSort: "seek/getSeekSort",
      getSeekList: "seek/getSeekList"
    }),
    goIsPrice(index) {
      if (index === 2) {
        this.isPrice = !this.isPrice;
      }
      this.goSort(this.productName, index, "asc");
      this.ind = index;
    },
    goPrice(index) {
      if (index === 0) {
        this.goSort(this.productName, 2, "desc");
      } else {
        this.goSort(this.productName, 2, "asc");
      }
      this.isPrice = !this.isPrice;
    },
    goSort(queryName, ind, order) {
      this.getSeekSort({
        queryWord: queryName,
        queryType: ind,
        querySort: order,
        pageIndex: 1
      });
    },
    goDetali(id) {
      wx.navigateTo({
        url: "/pages/go2detail/main?id=" + id
      });
    }
  }
};
</script>

<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.fix {
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.nav {
  z-index: 666;
  width: 100%;
  height: 40px;
  background: #fff;
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    li {
      flex: 1;
      height: 100%;
      text-align: center;
      line-height: 40px;
      font-size: 13px;
      color: #666666;
    }
  }
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
.li-re {
  position: relative;
}
.tl-top {
  display: block;
  position: absolute;
  top: 12px;
  right: 36px;
  border: 4px solid;
  border-color: transparent transparent #fc5d7b transparent;
}
.tl-bottom {
  display: block;
  position: absolute;
  bottom: 12px;
  right: 36px;
  border: 4px solid;
  border-color: #d8d8d8 transparent transparent transparent;
}
.dl-re {
  position: relative;
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
.active {
  color: skyblue !important;
}
.earnBox{
  background:rgba(255,232,237,1);
  border-radius:2px;
  color:#FC5D7B !important;
  font-size:10px;
  padding:0px 3px;
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
.addActive1 {
    position: absolute;
    top: 19rpx;
    right: -25rpx;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-width: 5px;
    border-style: solid dashed dashed dashed;
    border-color: transparent transparent #fc5d7b transparent;
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
    border-color: #fc5d7b transparent transparent transparent;
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
</style>
