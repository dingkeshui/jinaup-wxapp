<template>
  <div>
    <div class="wop-swiper">
      <img class="bigImg" v-if="!swiperArr.length" :src="goodInfo.mainImgUrl" mode="widthFix" alt>
      <swiper class="thisSwiper" autoplay="true" circular="true" current="0" @change="onSlideChangeEnd" v-else>
        <block v-for="(item,index) in swiperArr" :key="index">
          <swiper-item class="swiperItem">
            <image :src="item.imgUrl" class="slide-image" mode="aspectFit" alt></image>
          </swiper-item>
        </block>
      </swiper>
      <span class="page">{{idx}}/{{lenth}}</span>
    </div>
    <!-- <hotgoods></hotgoods> -->
    <template v-if="isMiaoSha||isToMiaoSha">
      <div v-if="isMiaoSha" class="miaoshadiv">
        <div class="miaoshadivleft">
          <span style="font-size:12px;" v-if="goodInfo.seckillPrice">
            ￥
            <span style="font-size:18px;margin-right:10px;">{{goodInfo.seckillPrice}}</span>
          </span>
          <template v-if="goodInfo.salesPrice>goodInfo.seckillPrice">
            <span style="font-size:12px;text-decoration:line-through;">￥{{goodInfo.salesPrice}}</span>
          </template>
        </div>
        <div style="font-size:14px;" class="times">距结束 {{times}}</div>
      </div>
      <template v-if="isToMiaoSha">
        <div  class="miaoshadiv isToMiaoShaBox">
          <div class="miaoshadivleft">
            <span style="font-size:12px;">限时秒杀价</span>
            <span style="font-size:12px;">
              ￥
              <span style="font-size:18px;margin-right:10px;">{{goodInfo.seckillPrice}}</span>
            </span>
            <span class="miaoShaEarnSpan" style="color:#FC5D7B;font-size:12px;">分享赚￥{{goodInfo.seckillEarnMoney}}</span>
          </div>
          <div style="font-size:14px;" class="times">距开始 {{times}}</div>
        </div>
      </template>
    </template>
    <div class="tit">
      <div class="ones" style="padding-left:10px;box-sizing:border-box;">
        <template v-if="!isMiaoSha">
          <p>￥</p>
          <p class="price">{{goodInfo.salesPrice}}</p>
        </template>
        <s class="num" v-if="goodInfo.showEarnMoney">￥{{goodInfo.vipPrice}}</s>
        <img v-if="goodInfo.showEarnMoney" src="/static/images/vip.png" alt>
      </div>
    </div>
    <div class="title">
      <div class="names">{{goodInfo.title}}</div>
    </div>
    <div class="tit2">
        <span class="spanLeft">
          <span v-if="goodInfo.isFreeShipping=='1'">快递包邮</span>
        </span>
        <span class="earn" @click="shares">
          分享
          <span v-if="goodInfo.showEarnMoney&&loginUserinfo.userType">赚￥{{goodInfo.earnMoney}}</span>
          <Login v-if="!isLogin" @loginFun="loginFun" />
        </span>
    </div>
    <template v-if="loginUserinfo">
      <div v-if="loginUserinfo.userLevel==0&&goodInfo.showEarnMoney" @click="goVip" class="flex fs12 vipDiv pad10">
        <div class="left fs0"><img style="height:20px;width:30px;" :model="aspectFit" src="/static/images/addVip.png"></div>
        <div class="ovh flex1 padl10 flex flexvcenter">
          开通会员购买本商品预计可省<span class="vipcol">￥{{goodInfo.memberDiscountPrice}}</span>
        </div>
        <div class="foot flex flexcenter">
          <span class="vipcol">立即开通</span>
          <img style="width:10px;height:10px;" src="/static/images/jt.png" alt>
        </div>
      </div>
    </template>
    <ul class="list">
      <div class="descriptionBox" @tap="toShow">
        <div class="left">选择</div>
        <div class="ovh" style="flex:1;">
          <span
            style="margin-right:5px;"
            v-for="(item,index) in skuData"
            :key="index"
          >{{item.aname}}</span>
        </div>
        <div class="foot">
          <span v-if="onSkuInfo">{{onSkuInfo.skuName}}</span>
          <img style="width:10px;height:10px;" src="/static/images/jt.png" alt>
        </div>
      </div>
      <template v-if="!isMiaoSha">
        <div v-if="couponList" class="descriptionBox" @tap="showCouponFun">
          <div class="left">领券</div>
          <div class="ovh red" style="flex:1;">
            <span style="margin-right:5px;" v-for="(item,index) in couponList">{{item.title}}</span>
          </div>
          <div class="foot">
            <img style="width:10px;height:10px;" src="/static/images/jt.png" alt>
          </div>
        </div>
      </template>
      <div v-if="goodInfo.description" class="descriptionBox">
        <div class="left">说明</div>
        <div class="right">{{goodInfo.description}}</div>
      </div>
      <div v-if="sstidInfo" class="descriptionBox">
        <div class="left">提示</div>
        <div class="right">{{sstidInfo}}</div>
      </div>
    </ul>
    <div class="pic">
      <img v-for="(item,index) in imgArr" lazy-load :key="index" :src="item.imgUrl" mode="widthFix" alt>
    </div>
    <hotgoods v-if="showHotGoods" />
    <ModalFrame
      v-if="show"
      :goodInfo="goodInfo"
      :skuData="skuData"
      :onSkuInfo="onSkuInfo"
      @closeFun="closeFun"
      @getsku="getSkuFun"
      :xg="goodInfo.totalStock"
      @toParent="newThing"
      :onSkuIndexArr="onSkuIndexArr"
    />
    <!-- 优惠券 -->
    <couponItem v-if="showCoupon" type="goods" :list="couponList" @choose="chooseCoupon" @close="closeCoupon"></couponItem>
    <div v-if="goodInfo" class="footer">
      <div v-if="fromType=='q'" class="goHome" @click="goHomeFun">
        <img src="../../../static/images/shouye.png">
      </div>
      <template v-if="goodInfo.state=='1'">
        <div class="butDiv" v-if="goodInfo.showEarnMoney&&!isMiaoSha" @click="addShopBut">加入购物车<Login v-if="!isLogin" @loginFun="loginFun" /></div>
        <template v-else>
          <div class="butDiv" v-if="loginUserinfo.userType==1||loginUserinfo.userType==2" @click="shares">
            分享<span v-if="goodInfo.showEarnMoney">赚￥{{goodInfo.earnMoney}}<Login v-if="!isLogin" @loginFun="loginFun" /></span>
          </div>
        </template>
        <div class="butDiv" @click="goPay">立即购买<Login v-if="!isLogin" @loginFun="loginFun" /></div>
      </template>
      <template v-if="goodInfo.state=='0'">
        <div class="noState">已下架</div>
      </template>
    </div>
    <!-- 19.9分享 -->
    <div v-if="showModelData" class="shareModel flex flexcenter" catchtouchmove="ture">
      <div class="shareModelMain">
        <div class="center mgb10">
          <img src="./img/icon.png">
        </div>
        <div class="text center">
          成为金牌会员
        </div>
        <div class="text center mgb10">
          可获得更多权益
        </div>
        <div class="flex flexcenter mgb10 butBox">
          <div class="pad10" @click="gopage('a')">成为会员</div>
          <div class="pad10" @click="gopage('b')">继续分享</div>
        </div>
        <img class="closeImg" @click="showModelData=false" src="/static/images/close.png">
      </div>
    </div>
    <red redEnvelopeType="1" />
    <red v-if="rid" redEnvelopeType="1" :rid="rid" />
  </div>
</template>
<script>
import red from "../../components/red/red";
import couponItem from "../../components/coupon"; //组件
import ModalFrame from "../../components/modalFrame"; //组件
import Login from "../../components/user/login"; //组件
import { prePare } from "@/api/index"; // 预支付接口
import { collection } from "@/api/index"; // 用户收藏商品
import { failCollection,getUser } from "@/api/index"; // 预支付接口
import { sstids } from "@/api/index"; // 运费模板信息
import { couponList } from "@/api/index"; //获取优惠券
import { getGoodsInfo,getGoodsSkuInfo,getGoodsImgInfo,addShop,appInt } from "@/api/index"; //
import hotgoods from '@/components/hotgoods/hotgoods.vue'

export default {
  data(){
    return {
      showCoupon: false, //是否显示优惠券
      couponList: "",
      onCouPonItem: "",
      onSkuInfo: "", //获取的子组件sku信息
      onSkuIndexArr: "", //获取的子组件sku排序信息
      idx: 1,//轮播图下标
      lenth: 1,//轮播图总长度
      swiperArr: [],
      boo: false,
      pid: "",
      skuData: [], //商品的sku
      // 显示商品的sku组件
      show: false,
      // 打开商品sku组件的原因,a-普通点击,b-立即购买,c-加入购物车
      showType:'a',
      basePid: "",
      userIdentity: "",
      imgArr: {},
      skuPidNums: [], //生成支付需要的参数
      allSku: [], //所有的sku,
      goodInfo: "", //商品详情
      times: "",
      isMiaoSha: false, //是否是秒杀
      isToMiaoSha:false,//即将秒杀
      sstidInfo: "",
      setTimeFun:'',//倒计时函数
      fromType:'',
      numindex:1,
      loginUserinfo:'', //登陆后的用户信息
      showHotGoods:false,
      showModelData:false,
      isLogin:false,
      options:'',
      rid:'',
    }
  },
  components: {
    ModalFrame,
    Login,
    couponItem,
    hotgoods,
    red
  },
  onLoad(options) {
    this.options = options
    this.onloadFun(options)
  },
  onShow () {
    this.onshowFun()
  },
  methods: {
    onshowFun(){
      // 获取用户信息
      const loginResult = wx.getStorageSync('loginResult')
      if(loginResult){
        this.isLogin = true
        this.loginUserinfo = loginResult.userInfo
      } else {
        this.isLogin = false
        this.loginUserinfo = {
          userType:0
        }
      }
    },
    async onloadFun(options){
      let that = this;
      this.idx = 1
      this.lenth = 1
      this.show = false
      this.goodInfo = ''
      this.swiperArr =[]
      console.log('详情页',options)
      if(options.id||options.pid){
        if(options.id){
          that.pid = options.id
        }
        if(options.pid){
          that.pid = options.id
        }
        that.fromType = "id"
      } else if (options.q) {
        let getStr = that.getQueryString(decodeURIComponent(options.q))
        for(let k in getStr){
          options[k]=getStr[k]
        }
        that.pid = getStr.pid
        if(getStr.fromInviteCode){
          this.$store.state.fromInviteCode = getStr.fromInviteCode
          console.log('options.fromInviteCode1',this.$store.state.fromInviteCode)
        }
        that.fromType = "q"
      } else {
        wx.showToast({
          title:'参数错误',
          icon: 'none',
          duration: 2000
        })
      }
      wx.getStorage({
        key:'rid',
        success(e){
          that.rid = e.data
          wx.removeStorage({
            key: 'rid',
            success (res) {
            }
          })
        }
      })
      if (options.fromInviteCode) {
        console.log('别人分享的小程序打开')
        // this.$store.state.fromInviteCode = options.fromInviteCode
        this.fromType = "q"
        console.log('options.fromInviteCode2',this.$store.state.fromInviteCode)
      }
      //获取商品的基本信息
      this.numindex++
      let res = await appInt()
      if(res.data.res_code==1){
        if(res.data.result.appletsReviewVersion==that.$store.state.appIndex){
          console.log('版本相等')
          that.$store.state.requsetUrl = res.data.result.appletsReviewDomain+'/'
        }
      }
      let pageArr = getCurrentPages()
      console.log('小程序的页面栈',pageArr)
      if(pageArr.length==1){
        this.fromType = "q"
      }
      //获取商品的基本信息
      this.numindex++
      
      let res1 = await getGoodsInfo({pid: that.pid})
      console.log('res1',res1)
      if (res1.data.res_code!=1) {
        wx.reLaunch({
          url: '/pages/index/main'
        })
      } else {
        wx.hideLoading()
        that.numindex = JSON.stringify(res1)
        console.log("详情", res1);
        that.onSkuInfo = "";
        that.onSkuIndexArr = "";
        if(res1.data.result.productType==1||res1.data.result.productType==4){
          res1.data.result.showEarnMoney = false
        }else{
          res1.data.result.showEarnMoney = true
        }
        that.goodInfo = res1.data.result;
        // warehouseVo   这个判断是不是海外的
        console.log("that.arr////", res1);
        that.lenth = res1.data.result.supplierProductPictureVoList.length
          ? res1.data.result.supplierProductPictureVoList.length
          : 1;
        that.swiperArr = res1.data.result.supplierProductPictureVoList;
        console.log("that.swiperArr", that.swiperArr.length);
        that.pid = res1.data.result.pid;
        that.basePid = res1.data.result.basePid;
        that.userIdentity = res1.data.result.userIdentity;
        if (res1.data.result.sstid) {
          that.getSstid(res1.data.result.sstid);
        } else {
          that.sstidInfo = "";
        }
        if (res1.data.result.seckillEndTime) {
          let nowtime = new Date().getTime();
          if (
            nowtime < res1.data.result.seckillEndTime &&
            nowtime > res1.data.result.seckillStartTime
          ) {
            console.log("秒杀中");
            that.isMiaoSha = true;
            that.isToMiaoSha = false;
            that.getTimeFun(res1.data.result.seckillEndTime);
          } else if(nowtime < res1.data.result.seckillStartTime) {
            console.log('即将秒杀')
            that.isMiaoSha = false;
            that.isToMiaoSha = true;
            that.getTimeFun(res1.data.result.seckillStartTime);
          } else {
            console.log("非秒杀");
            that.isToMiaoSha = false;
            that.isMiaoSha = false;
          }
        } else {
          that.isToMiaoSha = false;
          that.isMiaoSha = false;
        }
        that.getCouPon();
      }
      let res2 = await getGoodsSkuInfo({pid: that.pid})
      if (res2.data.res_code==1) {
        that.skuData = res2.data.result;
      }
      let res3 = await getGoodsImgInfo({
        pid: that.pid,
        basePid: that.basePid,
        userIdentity: that.userIdentity
      })
      if (res3.data.res_code==1) {
        that.imgArr = res3.data.result;
      }
    },
    // 登陆成功
    loginFun(){
      this.isLogin = true
      this.isShowLogin = false
      this.showHotGoods = true
      this.onloadFun(this.options)
      this.onshowFun()
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
    gopage(item){
      if(item=='a'){
         wx.reLaunch({
          url: "/pages/memberSpecial/main?uiType=2"
        });
      }else{
        wx.navigateTo({
          url: "/pages/share/main?id=" + this.pid
        })
      }
    },
    // 去首页
    goHomeFun () {
      wx.reLaunch({
        url: '/pages/index/main'
      })
    },
    onSlideChangeEnd(e) {
      console.log('+1',e)
      this.idx = e.target.current + 1;
      // console.log("eeeeee", e);
    },
    shares() {
      console.log("去分享页面",this.loginUserinfo);
      if(!this.isLogin){
        return
      }
      if(this.loginUserinfo.userType==2){
        let time = new Date().getTime()
        if(time<=this.loginUserinfo.expireDate){
          this.showModelData = true
          return
        }
      }
      wx.navigateTo({
        url: "/pages/share/main?id=" + this.pid
      });
    },
    async getSstid(data) {
      let that = this;
      let result = await sstids({
        sstid: data
      });
      if (result.data.res_code == 1) {
        that.sstidInfo = result.data.result;
      }
    },
    getTimeFun(str,isTo) {
      var that = this;
      clearInterval(that.setTimeFun)
      that.setTimeFun = setInterval(() => {
        var date = new Date();
        var nowDate = date.getTime(); // 当前时间
        // console.log('nowDate', nowDate)
        if (isTo) {
          console.log('即将秒杀函数')
          if (str <= nowDate && !isTo) {
            console.log("秒杀开始");
            that.isMiaoSha = true;
            that.isToMiaoSha = false;
          }
        }else{
          console.log('秒杀中函数')
          if (str <= nowDate) {
            console.log("秒杀结束");
            that.isMiaoSha = false;
            clearInterval(that.setTimeFun)
          }
        }
        var nextDate = new Date(str);
        var leftTime;
        if (isTo) {
          leftTime = nowDate - nextDate;
        } else {
          leftTime = nextDate - nowDate;
        }
        // console.log('leftTime', leftTime)
        var d, h, m, s;
        if (leftTime >= 0) {
          d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          h = Math.floor((leftTime / 1000 / 60 / 60));
          m = Math.floor((leftTime / 1000 / 60) % 60);
          s = Math.floor((leftTime / 1000) % 60);
        }
        // console.log('开始', h, m, s,s<10)
        if (h < 10) {
          h = "0" + h;
        }
        if (m < 10) {
          // console.log('m<10')
          m = "0" + m;
        }
        if (s < 10) {
          s = "0" + s;
          // console.log('s<10')
        }
        that.times = h + ":" + m + ":" + s;
        // console.log(that.times)
      }, 1000);
    },
    // 获取子组件sku信息
    getSkuFun(item, item2) {
      console.log("获取子组件sku信息", item, item2);
      this.onSkuInfo = item;
      this.onSkuIndexArr = item2;
    },
    getVal(e) {
      this.idx = e.target.current + 1;
    },
    async changes() {
      console.log(this.pid);
      this.boo = !this.boo;
      console.log("this.boo", this.boo);
      if (this.boo) {
        let result = await collection({
          pid: this.pid
        });
        console.log("收藏商品", result);
      } else {
        let result = await failCollection({
          pid: this.pid
        });
        console.log("取消收藏商品", result);
      }
    },
    // 去vip页面
    goVip(){
      wx.reLaunch({
        url: "/pages/memberSpecial/main"
      });
    },
    showCouponFun() {
      this.showCoupon = true;
      console.log("点击优惠券组件", this.showCoupon);
    },
    closeCoupon() {
      this.showCoupon = false;
    },
    chooseCoupon(item) {
      this.showCoupon = false;
      this.onCouPonItem = item;
    },
    // 控制模态框的限时隐藏
    toShow() {
      this.show = true;
      this.showType = 'a'
      // console.log(this.show);
    },
    // 获取商品优惠券
    async getCouPon() {
      let result = await couponList({
        pid: this.goodInfo.pid ? this.goodInfo.pid : 0,
        bid: this.goodInfo.bid ? this.goodInfo.bid : 0,
        uid: this.goodInfo.uid ? this.goodInfo.uid : 0,
        usiid: this.goodInfo.usiid ? this.goodInfo.usiid : 0
      });
      if (result.data.res_code == 1) {
        this.couponList = result.data.result;
      } else {
        this.couponList = "";
      }
      console.log("优惠券", result);
    },
    addShopBut(){
      if(!this.isLogin){
        return
      }
      this.show = true
      this.showType = 'c'
    },
    // 加入购物车
    async addShopFun(){
      console.log('加入购物车',this.onSkuInfo,this.goodInfo)
      if (!this.onSkuInfo) {
        this.show = true;
        this.showType = 'c'
        return;
      }
      if (this.onSkuInfo.onNum > this.onSkuInfo.store) {
        wx.showToast({
          title: "库存不足",
          icon: "none",
          duration: 2000
        });
        return;
      }
      let postData = {
        pid:this.pid,
        skuKey:this.onSkuInfo.skuKey,
        skuName:this.onSkuInfo.skuName,
        number:this.onSkuInfo.onNum,
        mainImgUrl:this.goodInfo.mainImgUrl,
        productTitle:this.goodInfo.title
      }
      console.log('addshopdata',postData)
      let res = await addShop(postData)
      if (res.data.res_code==1) {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.data.message?res.data.message:"加入购物车失败",
          icon: 'none',
          duration: 2000
        })
      }
      console.log('res',res)
    },
    // 生成与支付订单
    async goPay() {
      let that = this;
      if(!this.isLogin){
        return
      }
      if (!this.onSkuInfo) {
        that.show = true;
        that.showType = 'b'
        return;
      }
      if (!this.onSkuInfo.salesPrice) {
        wx.showToast({
          title: "价格不正确",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.onSkuInfo.onNum > this.onSkuInfo.store) {
        wx.showToast({
          title: "库存不足",
          icon: "none",
          duration: 2000
        });
        return;
      }
      this.skuPidNums = [];
      var pid = this.skuData[0].attributeValueRelationVoList[0].pid;
      this.skuPidNums.push({
        pid: pid,
        buyNum: this.onSkuInfo.onNum,
        skuKey: this.onSkuInfo.skuKey
      });
      wx.showLoading({
        title: '加载中',
      })
      let result = await prePare({
        orderChannel: "4",
        skuPidNums: JSON.stringify(this.skuPidNums)
      });
      wx.hideLoading()
      console.log("result...", result);
      if (result.data.res_code === 1) {
        console.log("111跳转");
        wx.setStorage({
          key: "orderMian",
          data: result.data.result
        });
        wx.navigateTo({
          url: "/pages/submission/main"
        });
      } else {
        wx.showToast({
          title: result.data.message,
          icon: "none",
          duration: 2000
        });
      }
    },
    newThing: function(val) {
      this.show = false;
      if(this.showType=='b'){
        console.log('立即购买')
        this.goPay()
      }else if(this.showType=='c'){
        console.log('加入购物车')
        this.addShopFun('item')
      }
    },
    closeFun () {
      this.show = false
    }
  }
};
</script>
<style scoped>
page {
  width: 100%;
  height: 100%;
}
.wop-swiper {
  width: 100%;
  height: 100vw;
  position: relative;
}
.wop-swiper .bigImg {
  width: 100%;
  max-height: 100vw;
}
.thisSwiper {
  width: 100vw;
  height: 100vw;
}
.swiperItem{
  width: 100vw;
  height: 100vw;
  overflow: hidden;
}
.swiperItem .slide-image {
  width: 100vw;
  height: 100vw;
}
.wop-swiper .page {
  position: absolute;
  right: 10px;
  bottom: 10%;
  color: #fff;
  font-size: 12px;
  background: rgba(0, 0, 0, 1);
  border-radius: 8px;
  opacity: 0.5;
  padding: 2px 4px;
  box-sizing: border-box;
}
.tit {
  display: flex;
  justify-content: space-between;
  height: 32px;
  color: #fc5d7b;
}
.tit2{
  display: flex;
  line-height: 25px;
  padding-left: 2%;
}
.tit2 .spanLeft{
  font-size: 12px;
  color: #A1A5AA;
  flex:1;
}
.tit2 .earn {
  font-size: 12px;
  border: 1px solid #fc5d7b;
  padding: 3px 10px;
  height: 17px;
  line-height: 17px;
  color: #FC5D7B !important;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  position: relative;
}
.tit .ones {
  display: flex;
  justify-content: space-between;
}
.tit .ones p {
  font-size: 16px;
}
.tit .ones p:nth-child(1) {
  font-size: 15px;
  height: 32px;
  line-height: 32px;
}
.tit .ones .price {
  font-size: 22px;
  margin-right: 10px;
}
.tit .ones .num {
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #a97a33;
}
.tit .ones img {
  width: 20px;
  height: 10px;
  margin-top: 13px;
  margin-left: 5px;
}
.tit .times {
  float: right;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
}
.title {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.title .names {
  font-size: 18px;
  color: #323a45;
}
.title p {
  display: flex;
  justify-content: space-between;
  line-height: 3;
  font-size: 12px;
  color: #999da2;
}
.list {
  width: 100%;
  padding: 0 2%;
  box-sizing: border-box;
}
.list .lis {
  display: flex;
  font-size: 13px;
  height: 40px;
  line-height: 40px;
}
.list .lis span {
  color: #676767;
}
.list .lis .rights {
  flex: 1;
  color: #323a45;
  display: flex;
  padding: 0 5px;
  box-sizing: border-box;
  justify-content: space-between;
}
.list .lis .rights img {
  width: 10px;
  height: 10px;
  margin-top: 10px;
}
.list .lis .to2color {
  color: #fc5d7b;
}

/* .footer .lefts {
  width: 30%;
}
.footer .lefts img {
  width: 14px;
  height: 12px;
}
.footer .lefts p {
  font-size: 12px;
}
.colos {
  color: #fc5d7b;
}*/
.pic {
  width: 100%;
  margin-bottom: 60px;
}
.pic img {
  width: 100%;
  display: block;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #ccc;
  text-align: center;
  display: flex;
  background: #fff;
}

.footer .butDiv {
  border-radius: 0px;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    217deg,
    rgba(248, 99, 103, 1) 0%,
    rgba(251, 37, 121, 1) 100%
  );
  font-size: 18px;
  color: #fff;
}
.miaoshadiv {
  background: linear-gradient(
    217deg,
    rgba(248, 99, 103, 1) 0%,
    rgba(251, 37, 121, 1) 100%
  );
  color: #fff;
  height: 40px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.miaoshadiv .miaoshadivleft {
  flex: 1;
}
.notext {
  font-size: 12px;
  text-decoration: line-through;
}
.isToMiaoShaBox{
  background:linear-gradient(225deg,rgba(49,211,243,1) 0%,rgba(82,226,191,1) 100%);
  color: #fff;
}
.miaoShaEarnSpan{
  padding: 0px 3px;
  border-radius: 3px;
  display: inline-block;
  background-color: #fff;
  position: relative;
}
.miaoShaEarnSpan:after{
  display: block;
  content: '';
  position: absolute;
  left: -10px;
  bottom: 2px;
  border:6px solid;
  border-color:transparent #fff transparent transparent;
}
.goHome{
  padding: 0px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}
.goHome img{
  height:30px;
  width:30px;
}
.noState{
  background-color:rgba(203,203,203,1) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 100%;
}
.descriptionBox{
  font-size: 13px;
  padding: 10px 0px;
  display: flex;
}
.descriptionBox .left{
  color: #676767;
  margin-right: 5px;
  min-width: 26px;
}
.descriptionBox .right{
  color: #323A45;
  display: flex;
  flex: 1;
  align-items: center;
}
.descriptionBox .foot{
  display: flex;
  align-items: center;
  justify-content: center;
}
.ovh{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.vipDiv{
  background-color: rgba(252,250,246,1);
}
.shareModelMain{
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  width: 60vw;
  margin-left: 0px auto;
  position: relative;
}
.shareModelMain .closeImg{
  position: absolute;
  width: 30px !important;
  height: 30px !important;
  top: -40px;
  right: 0px;
}
.shareModelMain .text{
  color: #323A45;
  font-size: 18px;
  font-weight: bold;
}
.shareModel{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.3);
}
.shareModelMain img{
  width: 60px;
  height: 60px;
}
.shareModelMain .butBox div{
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
}
.shareModelMain .butBox>div:nth-child(1){
  background-color: #E2BE98;
  margin-right: 20px;
}
.shareModelMain .butBox>div:nth-child(2){
  background-color:#33D6C5;
}
</style>

