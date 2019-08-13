<template>
  <div class="wrap">
    <img src="../../../static/images/search.png" class="search" @click="gotoSeek" alt>
    <template v-if="indexInfo||carouselProductData">
    <scrollTop :classlist="typeList" type="index" @changClass="actives"></scrollTop>
    <div>
      <Daily :indexInfo="indexInfo" :carouselProductData="carouselProductData"/>
    </div>
    <div class="addMoreBox">
      <span v-if="!notMore">加载更多</span>
      <span v-else>没有更多啦！</span>
    </div>
    <!-- 广告 -->
    <div v-if="showModel&&!showRed" class="modelBox flex2 flexcenter">
      <img @click="clickModelImg" style="width:92.27vw;height:92.27vw;" class="mgb20" :src="showModelInfo.imgUrl">
      <img @click="clsoeModel" style="width:30px;height:30px;" src="/static/images/close.png">
    </div>
    </template>
    <!-- 红包 -->
    <red :redEnvelopeType="1" />
    <red v-if="rid" :redEnvelopeType="1" :rid="rid" />
    <!-- tabber -->
    <tab onIndex='a'></tab>
  </div>
</template>
<script>
import Daily from "../../components/daily";
import scrollTop from "../../components/scrollTop/scrollTop";
import tab from "../../components/tab/tab";
import red from "@/components/red/red";
import { getQueryString } from '@/utils/index'
import { getIndexInfo,getIndexProductsInfo,getIndexClassInfo,getShowModelList,getUser,appInt,getIndexInfoNew } from "@/api/index";

export default {
  data(){
    return {
      typeList: [], //顶头横滚数据
      carouselProductData: [], //最下面的数据
      indexInfo: "",//首页信息
      pageIndex:1,//为你精选页数
      notMore:false, //加载更多
      isShowLogin:false,
      showModel:false, // 是否显示弹框
      showModelInfo:'',
      modelImgId:'', // 缓存的弹框列表
      rid:'',
      isLogin:false
    }
  },
  components: {
    Daily,
    scrollTop,
    tab,
    red
  },
  async onLoad(options){
    let that = this
    if(options.q){
      let getStr = that.getQueryString(decodeURIComponent(options.q))
      for(let k in getStr){
        options[k]=getStr[k]
      }
      delete options.q
    }
    let res = await appInt()
    if(res.data.res_code==1){
      console.log('小程序request',res,that.$store.state.appIndex,res.data.result.appletsReviewVersion==that.$store.state.appIndex)
      if(res.data.result.appletsReviewVersion==that.$store.state.appIndex){
        console.log('版本相等')
        that.$store.state.requsetUrl = res.data.result.appletsReviewDomain+'/'
      }
    }else{

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
    console.log('首页开始创建')
    this.creatFun()
    this.getModelList()
  },
  onShow() {
    const loginResult = wx.getStorageSync('loginResult')
    if(loginResult){
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },
  onReachBottom(){
    if(!this.notMore){
      this.getChooseForYou()
    }
  },
  methods: {
    // 点击图片
    clickModelImg(){
      this.clsoeModel()
      this.gopage(this.showModelInfo)
    },
    gopage(item) {
      let str1 = item.jumpUrl.substring(
        item.jumpUrl.indexOf("contentValue") + 13
      );
      let contentValue = str1.substring(0, str1.indexOf("&"));
      let str2 = item.jumpUrl.substring(
        item.jumpUrl.indexOf("businessId") + 11
      );
      let businessId = str2.substring(0, str2.indexOf("&"));
      let str3 = item.jumpUrl.substring(item.jumpUrl.indexOf("uiType") + 7);
      let uiType = str3;
      console.log(123, contentValue, businessId, uiType, 456);
      switch (contentValue) {
        case 'product':
          wx.navigateTo({
            url: "/pages/go2detail/main?id=" + businessId
          });
          break;
        case 'spike':
          wx.navigateTo({
            url: "/pages/go2detail/main?id=" + businessId
          });
          break;
        case 'category':
          wx.navigateTo({
            url: "/pages/classify/main?cid=" + businessId
          });
          break;
        case 'topic':
          if (uiType==2||uiType==3) {
            wx.reLaunch({
              url: "/pages/memberSpecial/main?sild=" + businessId + "&uiType=" + uiType
            });
          } else {
            wx.navigateTo({
              url: "/pages/special/main?sild=" + businessId + "&uiType=" + uiType
            });
          }
          break;
      }
    },
    // 关闭弹框
    clsoeModel () {
      this.showModel = false
      if(!this.modelImgId){
        this.modelImgId = []
      }
      this.modelImgId.push(this.showModelInfo.popid)
      if(this.modelImgId.length>20){
        this.modelImgId.shift()
      }
      wx.setStorage({
        key: 'modelImgId',
        data: this.modelImgId
      })
    },
    // 获取弹出昂
    async getModelList(){
      let res = await getShowModelList()
      let that  = this
      if (res.data.res_code==1) {
        wx.getStorage({
          key: 'modelImgId',
          success(res2) {
            if(res2.data&&res2.data.length){
              that.modelImgId = res2.data
              for(let i in res.data.result){
                console.log('id===========',res2.data.indexOf(res.data.result[i].popid))
                if(res2.data.indexOf(res.data.result[i].popid)<0){
                  that.showModelInfo = res.data.result[i]
                  that.showModel = true
                  return
                }
              }
            }
          },
          fail(res2){
            that.showModelInfo = res.data.result[0]
            that.showModel = true
          }
        })
      }
    },
    // 未授权
    noScope(){
      this.isShowLogin = true
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
    activeClass(index) {
      this.ind = index;
    },
    actives(index, item) {
      console.log(123, item,index);
      wx.navigateTo({
        url: "/pages/classify/main?cid=" + item.cid+"&index="+index
      });
    },
    gotoSeek() {
      wx.navigateTo({
        url: "/pages/search/main?type=a"
      });
    },
    // 获取为你精选
    async getChooseForYou(){
      // 最下面的数据
      let that = this
      this.pageIndex++
      let res2 = await getIndexProductsInfo({pageIndex:this.pageIndex})
      console.log('res2',res2)
      if (res2.data.res_code==1) {
        if(res2.data.result.length<20){
          that.notMore = true
        }
        res2.data.result.map((item, index) => {
          that.carouselProductData.push(item.productVo);
        })
      } else {

      }
    },
    async creatFun(){
      var that = this;
      this.getModelList()
      //分类列表的数据   顶部滚动条数据  (yyy)
      let res1 = await getIndexClassInfo({parentId:0})
      console.log('res1',res1)
      if (res1.data.res_code==1) {
        that.typeList = res1.data.result;
      } else {

      }
      // 最下面的数据
      let res2 = await getIndexProductsInfo({pageIndex:1})
      console.log('res2',res2)
      if (res2.data.res_code==1) {
        res2.data.result.map((item, index) => {
          that.carouselProductData.push(item.productVo);
        });
      } else {

      }
      // 首页数据
      // let res3 = await getIndexInfo()
      let res3 = await getIndexInfoNew()
      if (res3.data.res_code==1) {
        that.indexInfo = res3.data.result;
      } else {
        wx.showToast({
          title: '数据获取失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  updated() {
    wx.removeStorageSync("orderMian");
  },
  created() {
    //数据不存在,显示Loading动画
    // wx.showLoading({
    //   title: "加载中"
    // });
  },
  mounted() {
    wx.hideLoading();
  }
};
</script>
<style lang='scss' scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.search {
  width: 100%;
  height: 30px;
  display: block;
  padding: 0 10px;
  box-sizing: border-box;
}
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
}
.headers {
  display: flex;
  height: 44px;
  line-height: 44px;
  .recommend {
    position: absolute;
    left: 0;
    text-align: center;
    width: 20%;
    font-size: 16px;
    display: block;
    background: #fff;
    z-index: 999;
    border-bottom: solid #56d2bf 6rpx;
    line-height: 94rpx;
    font-weight: 500;
    color: #56d2bf;
  }
  .ulList {
    position: relative;
    width: 80%;
    display: flex;
    margin-left: 20%;
    white-space: nowrap;
    li {
      margin: 0 5px;
      font-size: 16px;
    }
  }
}
.addMoreBox{
  font-size: 14px;
  text-align: center;
  padding: 10px;
  color: #aaa;
}
.modelBox{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(0,0,0,0.3)
}
</style>
