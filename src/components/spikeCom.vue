<template>
  <div class="spikeList">
    <div class="kh-list">
      <dl v-for="(item,index) in arr" v-bind:key="index" @click="getId(item)">
        <dt>
          <img :src="item.mainImgUrl" alt>
        </dt>
        <dd>
          <p class="over-h">{{item.title}}</p>
          <div class="present" v-if="idx==1">
            <progress activeColor="#FC5D7B" color="#f3f7f7" :percent="item.num1"/>
            <span>已售{{item.num1}}%</span>
          </div>
          <div class="zhanwei" v-if="idx!=1"></div>
          <div class="price">
            <div>
              <span class="vippic mgr5">￥{{item.vipPrice}}</span>
              <img class="vipimg mgr5" src="/static/images/vip.png" alt>
              <span v-if="loginUserinfo.userType==1" class="carouselProductPriceEarn fs12">赚￥{{item.earnMoney}}</span>
              <div>
                <span class="nprice mgr10">￥{{item.seckillPrice}}</span>
                <span class="dontpic">￥{{item.salesPrice}}</span>
              </div>
            </div>
            <template v-if="idx==1">
              <img
                v-if="item.num1<100"
                src="/static/images/msq.png"
                class="btn"
                alt
              >
              <img
                v-else
                src="/static/images/yqg.png"
                class="btn"
                alt
              >
            </template>
            <img
              v-else
              src="/static/images/ljkq.png"
              class="btn"
              alt
            >
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    arr: "",
    idx: ""
  },
  computed:{
    loginUserinfo(){
      return this.$store.state.loginUserinfo
    }
  },
  methods: {
    getId(val) {
      var name = val.title;
      var id = val.jumpUrl.split("&")[1].split("=")[1];
      var uiTyep = val.jumpUrl.split("&")[2].split("=")[1];
      console.log("val.jumpUrl...", uiTyep);
      wx.navigateTo({
        url: "/pages/go2detail/main?id=" + id
      });
    }
  }
};
</script>
<style scoped>
.kh-list dl {
  display: flex;
  width: 100%;
}
.kh-list dl dt {
  width: 30%;
}
.kh-list dl dt img {
  width: 100%;
  height: 131px;
  padding: 20px 10px;
  box-sizing: border-box;
}
.kh-list dl dd {
  width: 70%;
}
.kh-list dl dd .over-h {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 300;
  font-size: 16px;
  line-height: 2;
  margin-top: 10px;
}
.kh-list dl dd .present {
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  font-size: 16px;
  line-height: 2;
  color: #999da2;
}
.kh-list dl dd .present progress {
  margin-top: 15px;
  width: 100px;
  height: 4px;
}
.kh-list dl dd .present span {
  padding-right: 15px;
}
.kh-list dl dd .price {
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  float: bottom;
  margin-top: 10px;
}
.kh-list dl dd .price .nprice {
  font-size: 22px;
  color: #fc5d7b;
}
.kh-list dl dd .price .oprice {
  line-height: 2;
  text-decoration: line-through;
  margin-top: 7px;
  font-size: 12px;
}
.kh-list dl dd .price .btn {
  width: 80px;
  height: 33px;
  margin-top: 4px;
  margin-right: 10px;
}
.earnMoneyP{
  font-size: 12px;
  color: #fc5d7b;
  margin-left: 3px;
  margin-top: 10px;
}
</style>
