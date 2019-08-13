<template>
  <div class="box">
    <scroll-view class="listWrap" :scroll-into-view="toView" scroll-y="true" scroll-with-animation @scroll="scrollFun">
      <div class="header">
        <div class="banner">
          <img
            :id="scal === true ? 'actives':'banners'"
            @load="bannerLoad"
            :src="banner"
            alt
            mode="widthFix"
            @click="scals"
          >
        </div>
        <scroll-view @load="scrollLoad" scroll-x="true" :class="bannerCls?'fixed nav':'nav'">
          <span
            v-for="(item,index) in list"
            :key="index"
            :class="index==ind ? 'active' : ''"
            @click="changeind(index,item)"
          >{{item.anchorDesc}}</span>
        </scroll-view>
      </div>
        <div v-for="(item2,index2) in list" class="padb10" :key="index2">
          <div class="cake" :id="'a'+index2">
            <div class="cake_left">
              <i class="left_line"></i>
              <i class="left_dot"></i>
            </div>
            <p>
              <span>{{item2.anchorDesc}}</span>
            </p>
            <div class="cake_right">
              <i class="right_dot"></i>
              <i class="right_line"></i>
            </div>
          </div>
          <template v-if="item2.uiType==1">
            <div class="hot1">
              <dl v-for="(item1,index1) in item2.products" :class="['item'+index2+'-'+index1]" :key="index1" @click="detail(item1.pid)">
                <dt>
                  <img lazy-load :src="item1.mainImgUrl">
                </dt>
                <dd>
                  <div class="titleBox">{{item1.title}}</div>
                  <div class="moneySpanBox">
                    <span class="moneySpan1">￥<span>{{item1.salesPrice}}</span></span>
                  </div>
                  <div>
                    <span class="vippic mgr5">￥{{item1.vipPrice}}</span>
                    <img class="vipimg mgr5" src="/static/images/vip.png" alt>
                    <span v-if="loginUserinfo.userType" class="moneySpan3">赚￥<span>{{item1.earnMoney}}</span></span>
                  </div>
                </dd>
              </dl>
            </div>
          </template>
          <template v-else>
            <div class="detail">
              <ul class="d_list">
                <li @click="detail(item1.pid)" v-for="(item1,index1) in item2.products" :class="['item'+index2+'-'+index1]" :key="index" v-if="item1">
                  <img lazy-load :src="item1.mainImgUrl">
                  <p class="contents">{{item1.title}}</p>
                  <div>
                    <span class="onpic">￥{{item1.salesPrice}}</span>
                    <span v-if="loginUserinfo.userType" class="moneySpan3">赚￥{{item1.earnMoney}}</span>
                  </div>
                  <div>
                    <span class="vippic mgr5">￥{{item1.vipPrice}}</span>
                    <img style="width:21px;height:10px;" class="vipimg mgr5" src="/static/images/vip.png" alt>
                  </div>
                </li>
              </ul>
            </div>
          </template>
        </div>
      <!-- </div> -->
    </scroll-view>
    <div @click="goshare" class="shareDiv">
      <div>
         <img style="width:100%;height:100%;" src="/static/images/share.png">
         <Login v-if="!isLogin" @loginFun="loginFun" />
      </div>
    </div>
    <red redEnvelopeType="1" />
    <red v-if="rid" redEnvelopeType="1" :rid="rid" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { getUser } from '@/api/index'
import red from "@/components/red/red";
import Login from "@/components/user/login"; //组件
import { getQueryString } from '@/utils/index'

export default {
  data() {
    return {
      ind: 0,
      toView: null,
      scal: false,
      bannerCls: false,
      siid:'',
      uiType:'',
      domList:'',
      isShowLogin:false,
      isLogin:false,
      options:'',
      rid:''
    };
  },
  components:{
    red,
    Login
  },
  computed: {
    ...mapState({
      list: state => state.special.list,
      banner: state => state.special.banner,
      title: state => state.special.title,
      info: state => state.special.info,
      loginUserinfo(){
      return this.$store.state.loginUserinfo
    }
    })
  },
  onReady(){

  },
  onShow() {
    this.onshowFun()
  },
  onLoad(options) {
    if(options){
      let getStr = getQueryString(decodeURIComponent(options.q))
      for(let k in getStr){
        options[k]=getStr[k]
      }
    }
    this.options = options
    this.onloadFun(options)
  },
  methods: {
    loginFun(){
      this.onshowFun()
      this.onloadFun(this.options)
    },
    onloadFun(options){
      if (options.q) {
        let getStr = this.getQueryString(decodeURIComponent(options.q))
        console.log('q',getStr)
        this.siid = getStr.sild
        if(getStr.fromInviteCode){
          this.$store.state.fromInviteCode = getStr.fromInviteCode
        }
      }
      if (options.sild) {
      console.log(2)
        this.siid = options.sild
      }
      if (options.fromInviteCode) {
      console.log(3)
        this.$store.state.fromInviteCode = options.fromInviteCode
      }
      this.ind = 0
      if(this.siid){
        this.getList(111)
      }else{
        wx.showToast({
          title: '参数错误',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.reLaunch({
            url:'/pages/index/main'
          })
        },2000)
      }
    },
    onshowFun(){
      let loginResult = wx.getStorageSync('loginResult')
      if(loginResult){
        this.isLogin = true
      }else{
        this.isLogin = false
      }
    },
    async getList(num){
      console.log('参数',num)
      wx.showLoading({
        title: '加载中',
      })
      await this.specialList({
        siid: this.siid
      })
      wx.hideLoading()
      console.log('info',this.info)
      wx.setNavigationBarTitle({ title: this.title });
    },
    // 去分享
    goshare () {
      if(!this.isLogin){
        return
      }
      wx.navigateTo({
        url: "/pages/specialShare/main?id="+this.siid+"&type=1"
      });
    },
    //url解析
    getQueryString(url) { 
      if(url) { 
          url=url.substr(url.indexOf("?")+1); //字符串截取，比我之前的split()方法效率高 
      } 
      var result = {}, //创建一个对象，用于存name，和value 
      queryString =url || location.search.substring(1), //location.search设置或返回从问号 (?) 开始的 URL（查询部分）。 
      re = /([^&=]+)=([^&]*)/g, //正则，具体不会用 
      m; 
      while (m = re.exec(queryString)) { //exec()正则表达式的匹配，具体不会用 
          result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]); //使用 decodeURIComponent() 对编码后的 URI 进行解码 
      } 
      return result; 
    },
    scrollFun(e){
      console.log('滚动条滚动事件',e,this.domList)
      if (this.bannerHeight && e.target.scrollTop > this.bannerHeight) {
        this.bannerCls = true;
      } else {
        this.bannerCls = false;
      }
      for(let i in this.domList){
        if (e.target.scrollTop<this.domList[i].top-20) {
          if (i>0) {
            this.ind = i-1
            return
          }
        } else if (e.target.scrollTop>this.domList[i].top-20&&e.target.scrollTop<this.domList[i].top) {
          this.ind = i
          return
        }
      }
    },
    scals() {
      console.log(1);
      this.scal = !this.scal;
    },
    changeind(index, item) {
      console.log(this.banner);
      this.ind = index;
      this.toView = "a" + index;
    },
    detail(id) {
      wx.navigateTo({
        url: "/pages/go2detail/main?id=" + id
      });
    },
    ...mapMutations({
      updata: "special/upstate"
    }),
    ...mapActions({
      specialList: "special/getList"
    }),
    bannerLoad(e) {
      let that = this
      this.bannerHeight = 375 / e.target.width * e.target.height;
      console.log("e....", this.bannerHeight);
      if(wx.createSelectorQuery){
        setTimeout(()=>{
          const query = wx.createSelectorQuery()
          query.selectAll('.cake').boundingClientRect()
          query.selectViewport()
          query.exec(function (res) {
            console.log('dom',res,res[0])
            if(res[0].length){
              let num  = res[0][0].top
              res[0].map(val=>{
                val.top = val.top-num
              })
              that.domList = res[0]
            }
          })
        },1000)
      } else {

      }
    }
  }
};
</script>

<style scoped>
.nav.fixed {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: #fff;
}
.listWrap {
  /* height: 100%; */
  height: 100vh;
  box-sizing: border-box;
  /* padding-top: 92rpx; */
  /* margin-top: -92rpx; */
}
.box {
  width: 100%;
  background: rgba(243, 247, 247, 1);
}

.content {
  width: 100%;
  height: auto;
  background: #f3f7f7;
}

.none {
  display: none;
}

.list {
  width: 100%;
  box-sizing: border-box;
}

.list h3 {
  width: 100%;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list h3 span:nth-child(1) {
  width: 34px;
  height: 1px;
  background: rgba(72, 72, 72, 1);
}

.list h3 span:nth-child(2) {
  margin-right: 12px;
  margin-left: 10rpx;
}

.list h3 span:nth-child(3) {
  width: 150px;
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: bold;
  color: rgba(72, 72, 72, 1);
  line-height: 25px;
}

.list h3 span:nth-child(4) {
  margin-left: 12px;
  margin-right: 10rpx;
}

.list h3 span:nth-child(5) {
  width: 34px;
  height: 1px;
  background: rgba(72, 72, 72, 1);
}

.hot {
  display: flex;
  flex-wrap: wrap;
}

.list dl {
  width: 49%;
  height: 568rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 10rpx;
  margin-top: 8rpx;
  margin-left: 3px;
}

.list dt img {
  width: 360rpx;
  height: 360rpx;
}

.list dl dd h4 {
  width: 360rpx;
  height: 68rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(50, 58, 69, 1);
  line-height: 34rpx;
  margin-left: 10rpx;
  overflow: hidden;
}

.list dl dd h3 {
  width: 100%;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.list dl dd h3 span:nth-child(1) {
  width: 18rpx;
  height: 32rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(252, 93, 123, 1);
  line-height: 32rpx;
  margin-left: 10rpx;
  background: #fff;
}

.list dl dd h3 span:nth-child(2) {
  width: 38rpx;
  height: 64rpx;
  font-size: 36rpx;
  font-family: DINAlternate-Bold;
  font-weight: bold;
  color: rgba(252, 93, 123, 1);
  line-height: 62rpx;
  margin-right: 0px;
}

.list dl dd h3 span:nth-child(3) {
  width: 30rpx;
  height: 64rpx;
  font-size: 14px;
  font-family: DINAlternate-Bold;
  font-weight: bold;
  color: rgba(252, 93, 123, 1);
  line-height: 62rpx;
  margin-left: 10rpx;
}

.list dl dd h3 span:nth-child(4) {
  width: 50rpx;
  height: 24rpx;
  font-size: 11px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(153, 157, 162, 1);
  line-height: 24rpx;
  margin-left: 20rpx;
  text-decoration: line-through;
}

.infant {
  width: 100%;
}

.infant h3 {
  width: 100%;
  height: 130rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25rpx;
}

.infant h3 span:nth-child(1) {
  width: 34px;
  height: 1px;
  background: rgba(72, 72, 72, 1);
}

.infant h3 span:nth-child(2) {
  margin-right: 12px;
  margin-left: 10rpx;
}

.infant h3 span:nth-child(3) {
  width: 150px;
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: bold;
  color: rgba(72, 72, 72, 1);
  line-height: 25px;
}

.infant h3 span:nth-child(4) {
  margin-left: 12px;
  margin-right: 10rpx;
}

.infant h3 span:nth-child(5) {
  width: 34px;
  height: 1px;
  background: rgba(72, 72, 72, 1);
}

.hot1 {
  width: 100%;
  padding-bottom: 20px;
}

.hot1 dl {
  display: flex;
  /*width: 406px;*/
  height: 141px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  margin-top: 20rpx;
}

.hot1 dt {
  padding: 10px;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.hot1 dt img {
  max-width: 100%;
  max-height: 100%;
}

.hot1 dl dd {
  flex: 1;
  box-sizing: border-box;
  padding: 10px;
}

.hot1 dl dd h4 {
  width: 250px;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(50, 58, 69, 1);
  line-height: 20px;
  margin-right: 6px;
  margin-top: 20rpx;
}

.hot1 dl dd h3 {
  display: flex;
  justify-content: flex-start;
  margin-top: 59px;
}

.hot1 dl dd h3 span:nth-child(1) {
  width: 9px;
  height: 16px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(252, 93, 123, 1);
  line-height: 16px;
  background: #fff;
}

.hot1 dl dd h3 span:nth-child(2) {
  width: 34px;
  height: 32px;
  font-size: 22px;
  font-family: DINAlternate-Bold;
  font-weight: bold;
  color: rgba(252, 93, 123, 1);
  line-height: 31px;
}

.hot1 dl dd h3 span:nth-child(3) {
  width: 27px;
  height: 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(153, 157, 162, 1);
  line-height: 12px;
  margin-left: 19px;
  text-decoration: line-through;
}

.header {
  width: 100%;
}
.banner {
  width: 100%;
}
#actives {
  width: 100%;
  height: 648px;
}
#banners {
  width: 100%;
  height: 150px;
}

.nav {
  width: 100%;
  height: 46px;
  line-height: 46px;
  display: flex;
  white-space: nowrap;
  border-bottom: 1px solid rgb(236, 236, 236);
  justify-content: space-between;
  background: #fff;
}

.nav span {
  height: 46px;
  margin: 0 10px;
  flex: 1;
  display: inline-block;
}

.active {
  color: #f00;
  border-bottom: 2px solid #f00;
}

.cake {
  width: 100%;
  display: flex;
  height: 75px;
  box-sizing: border-box;
  padding: 0 75px;
  justify-content: space-between;
}

.cake_left {
  display: flex;
}

.cake_left .left_line,
.cake_right .right_line {
  width: 34px;
  height: 1px;
  background: rgba(72, 72, 72, 1);
  margin: 36px 0 0 0;
}

.cake .cake_left > .left_dot {
  margin-left: 4px;
}

.cake .cake_right > .right_dot {
  margin-right: 4px;
}

.cake_left .left_dot,
.cake_right .right_dot {
  width: 7px;
  height: 7px;
  background: rgba(72, 72, 72, 1);
  margin: 33px 0 0 0;
  transform: rotate(45deg);
}

.cake p {
  width: 150px;
  height: 25px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(72, 72, 72, 1);
  line-height: 25px;
  text-align: center;
  margin-top: 25px;
  box-sizing: border-box;
}

.cake p span:nth-child(1) {
  margin-right: 4px;
}

.cake_right {
  display: flex;
}

.detail {
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
}

.d_list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 50px;
  box-sizing: content-box;
}

.d_list li {
  width: 118px;
  height: 242px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  overflow: hidden;
  margin: 5px 0 0 4px;
  box-sizing: border-box;
}

.d_list li img {
  width: 100%;
  height: 132px;
}

.d_list li .contents {
  box-sizing: border-box;
  padding: 5px;
  width: 127px;
  height: 40px;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(50, 58, 69, 1);
  line-height: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.money {
  width: 100%;
  display: flex;
  margin-top: 5px;
}

.money span:nth-child(1) {
  width: 9px;
  height: 16px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(252, 93, 123, 1);
  line-height: 16px;
  margin-top: 10px;
}

.money b {
  width: 19px;
  height: 32px;
  font-size: 18px;
  font-family: DINAlternate-Bold;
  font-weight: bold;
  color: rgba(252, 93, 123, 1);
  line-height: 31px;
  margin-top: 1px;
  margin-left: 4px;
}

.money span:nth-child(3) {
  width: 4px;
  height: 32px;
  font-size: 18px;
  font-family: DINAlternate-Bold;
  font-weight: bold;
  color: rgba(252, 93, 123, 1);
  line-height: 31px;
  margin-top: 1px;
  margin-left: 2px;
}

.money sub {
  width: 15px;
  height: 32px;
  font-size: 14px;
  font-family: DINAlternate-Bold;
  font-weight: bold;
  color: rgba(252, 93, 123, 1);
  line-height: 31px;
  margin-top: 2px;
}

.d_list li p:nth-child(4) {
  height: 12px;
  font-size: 11px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(153, 157, 162, 1);
  line-height: 12px;
  /* margin-top: 5px; */
}
.zhuan {
  color: rgba(252, 93, 123, 1);
}
.zhuan1 {
  text-decoration: line-through;
  margin-right: 5px;
}
.titleBox{
  height: 40px;
}
.moneySpanBox{
  height: 60px;
  box-sizing: border-box;
  padding-top:40px;
}
.titleBox{
  color: #323A45;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 20px;
}
.moneySpan1{
  color: #FC5D7B;
  margin-right: 10px;
}
.moneySpan3{
  padding: 0px 3px;
  border-radius: 3px;
  font-size: 12px;
  background-color: rgba(255,232,237,1);
  color: #FC5D7B;
}
.box2{
  display: flex;
  flex-wrap:wrap;
}
.box2 .box2Item{
  width: 50%;
  margin:3px 5px;
  background-color: #fff;
  border-radius: 3px;
}
.padb10{
  padding-bottom: 10px;
}
.shareDiv>div{
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
