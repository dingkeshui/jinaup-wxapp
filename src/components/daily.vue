<template>
  <div class="swrap">
    <!-- 首页数据 -->
    <template v-for="(item,index) in list">
      <!-- 轮播图 1 -->
      <template v-if="item.type=='carouselImg'">
        <div :class="['swiper']">
          <swiper
            class="swiperItem"
            indicator-dots="true"
            autoplay="true"
            interval="2000"
            duration="1000"
            circular="true"
          >
            <block v-for="(item1,index1) in item.items" v-bind:key="index1">
              <swiper-item>
                <img :src="item1.imgUrl" lazy-load class="slide-image" @click="gopage(item1)" alt>
              </swiper-item>
            </block>
          </swiper>
        </div>
      </template>
      <!-- 五个小icon 2 -->
      <template v-if="item.type=='specialColumn'">
        <div :class="['chart']">
          <dl v-for="(item2,index2) in item.items" @click="gopage(item2)" v-bind:key="index2">
            <dt>
              <img :src="item2.imgUrl" lazy-load alt />
            </dt>
            <dd>
              <span>{{item2.title}}</span>
            </dd>
          </dl>
        </div>
      </template>
      <!-- 轮播产品 3 -->
      <template v-if="item.type=='carouselProduct'">
        <div @click="gopage(item)" :class="['carouselProduct','item-'+index]">
          <div class="carouselProductImgBox">
            <img lazy-load :src="item.pictUrl" />
          </div>
          <div class="swiperBox">
            <swiper
              class="thisSwiper"
              interval="4000"
              indicator-dots
              indicator-color="#D8D8D8"
              indicator-active-color="#FC5D7B"
              autoplay
            >
              <block v-for="(item3,index3) in item.putArr" :key="index3">
                <swiper-item class="thisSwiperItem">
                  <div
                    class="thisSwiperItemDiv"
                    v-for="(item31,index31) in item3"
                    :key="index31"
                    @click.stop="gopage(item31)"
                  >
                    <div class="itemImgBox">
                      <div>
                        <image
                          style="width: 100%; height: 100%;"
                          mode="aspectFit"
                          lazy-load
                          :src="item31.imgUrl"
                        ></image>
                      </div>
                    </div>
                    <div class="carouselProductText">{{item31.title}}</div>
                    <div class="carouselProductPrice">
                      <span class="carouselProductPriceSales">￥{{item31.salesPrice}}</span>
                      <span v-if="!item.isVip&&loginUserinfo.userType" class="carouselProductPriceEarn">赚￥{{item31.earnMoney}}</span>
                    </div>
                    <div v-if="!item.isVip">
                      <span class="vippic mgr5">￥{{item31.vipPrice}}</span>
                      <img class="vipimg mgr5" src="/static/images/vip.png" alt>
                    </div>
                  </div>
                </swiper-item>
              </block>
            </swiper>
          </div>
        </div>
      </template>
      <!-- 单图 4 -->
      <template v-if="item.type=='adOne'">
        <div :class="['swipers']">
          <div><img @click="gopage(item)" lazy-load :src="item.pictUrl" alt></div>
        </div>
      </template>
      <!-- 3图 5 -->
      <template v-if="item.type=='adThree'">
        <div class="milk">
          <div class="bot">
            <div class="bot-left">
              <img lazy-load :src="item.items[0].imgUrl" alt @click="gopage(item.items[0])">
            </div>
            <div class="bot-right">
              <img lazy-load :src="item.items[1].imgUrl" @click="gopage(item.items[1])">
              <img lazy-load :src="item.items[2].imgUrl" @click="gopage(item.items[2])">
            </div>
          </div>
        </div>
        <!-- <div class="div3imgBox flex">
          <div class="div3imgBoxLeft">
            <img lazy-load :src="item.items[0].imgUrl" @click="gopage(item.items[0])">
          </div>
          <div class="div3imgBoxRight flex1">
            <img lazy-load :src="item.items[1].imgUrl" @click="gopage(item.items[1])">
            <img lazy-load :src="item.items[2].imgUrl" @click="gopage(item.items[2])">
          </div>
        </div> -->
      </template>
      <!-- 4图 6 -->
      <template v-if="item.type=='adFour'">
        <div :class="['fourBox','item-'+index]">
          <img
            class
            v-for="(item6,index6) in item.items"
            @click="gopage(item6)"
            :key="index6"
            lazy-load
            :src="item6.imgUrl"
            alt
          >
        </div>
      </template>
      <!-- 精品好物 7 -->
      <template v-if="item.type=='sixProduct'">
        <!-- <div :class="['today']">
          <p>
            <span class="today1">精品好物</span>
            <span class="today2">等你来抢</span>
          </p>
        </div> -->
        <div class="box6">
          <div v-for="(item7,index7) in item.items" :key="index7" @click="gopage(item7)" class="box6item">
            <div class="imgbox">
              <img lazy-load :src="item7.imgUrl">
            </div>
            <div class="titlebox">{{item7.title}}</div>
            <div class="carouselProductPrice">
              <span class="carouselProductPriceSales">￥{{item7.salesPrice}}</span>
              <span v-if="!item.isVip&&loginUserinfo.userType" class="carouselProductPriceEarn line1">赚￥{{item7.earnMoney}}</span>
            </div>
            <div v-if="!item.isVip">
              <span class="vippic mgr5">￥{{item7.vipPrice}}</span>
              <img class="vipimg mgr5" src="/static/images/vip.png" alt>
            </div>
          </div>
        </div>
      </template>
      <!-- 新秒杀 -->
      <template v-if="item.type=='spikeProduct'">
        <div id="newSpikeBox" :class="['newSpikeBox']">
          <div class="flex newSpikeTop">
            <div class="flex1">
              <span class="fs20">限时秒杀</span>
              <span class="fs14 span2">先下单先得</span>
            </div>
            <div class="more" @click="spikeList">
              <img src="/static/images/gd.png" class="more" alt>
            </div>
          </div>
          <div class="scrollBox">
          <scroll-view scroll-x="true" :scroll-into-view="intoView" :class="['newSpikeTag',{'isBindTop':isBindTop}]">
              <div v-for="(item8,index8) in item.seckill" :id="'item'+index8" :key="index8" :class="['newSpikeTagItem',{'on':onSkillIndex==index8}]" @click="spikeChooseTime(index8)">
                <div>{{item8.periodValue}}</div>
                <div>{{item8.description}}</div>
              </div>
          </scroll-view>
          </div>
          <div :class="['shareListImg',{'none':!isBindTop}]" @click="goShareList">
            <div>
              <img src="/static/images/shareList.png">
              <Login v-if="!isLogin" @loginFun="loginFun"/>
            </div>
          </div>
          <div v-for="(item81,index81) in item.seckill" :key="index81" :class="['kh-list',{'none':index81!=onSkillIndex}]">
            <dl v-for="(item811,index811) in item81.seckillProduct" v-bind:key="index811" @click="gopage(item811)">
              <dt>
                <img lazy-load :src="item811.mainImgUrl" alt>
              </dt>
              <dd>
                <p class="over-h">{{item811.title}}</p>
                <div v-if="item81.inStart" class="present">
                  <progress
                    activeColor="#FC5D7B"
                    font-size="12px"
                    color="#f3f7f7"
                    :percent="item811.progress"
                    show-info
                  />
                  <span v-if="item811.salesStore>=item811.totalStore">已抢光</span>
                </div>
                <div class="price">
                  <div>
                    <div>
                      <span class="vippic mgr5" v-if="item811.vipPrice">￥{{item811.vipPrice}}</span>
                      <img class="vipimg mgr5" v-if="item811.vipPrice" src="/static/images/vip.png" alt>
                      <span v-if="loginUserinfo.userType&&item811.earnMoney" class="carouselProductPriceEarn fs12">赚￥{{item811.earnMoney}}</span>
                    </div>
                    <div>
                      <span class="nprice mgr10">￥{{item811.seckillPrice}}</span>
                      <span v-if="item811.salesPrice" class="dontpic">￥{{item811.salesPrice}}</span>
                    </div>
                  </div>
                  <img v-if="item81.inStart" :src="item811.progress>=100?'/static/images/yqg.png':'/static/images/msq.png'" class="btn" alt>
                  <img v-else :src="'/static/images/ljkq.png'" class="btn" alt>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </template>
    </template>  
    <!-- 为你精选 -->
    <div class="choose">
      <div class="today">
        <p>
          <span class="today1">为你精选</span>
          <span class="today2">等你来抢</span>
        </p>
      </div>
      <div class="list">
        <dl v-for="(item0,index0) in carouselProductData" v-bind:key="index0" @click="gopage(item0)">
          <dt class="imgbox">
            <img mode="aspectFit" lazy-load :src="item0.mainImgUrl" alt />
          </dt>
          <dd>
            <p class="titles">{{item0.title}}</p>
            <p class="tabBox">
              <span v-if="item0.isFreeShipping===1">包邮</span>
                    <template v-if="item0.importType==0">
                      <span>直邮</span>
                      <span v-if="item0.isFreeTax===1">包税</span>
                    </template>
                    <template v-if="item0.importType==1">
                      <span>保税区</span>
                      <span v-if="item0.isFreeTax===1">包税</span>
                    </template>
            </p>
            <p class="prices">￥{{item0.salesPrice}}</p>
            <p class="prices2" v-if="item0.productType!=1||item0.productType!=4">
              <span class="vipSpan">￥{{item0.vipPrice}}</span>
              <span><img mode="widthFix" src="/static/images/vip.png"></span>
              <span v-if="loginUserinfo.userType&&item0.earnMoney" class="earnSpan">赚￥{{item0.earnMoney}}</span>
            </p>
          </dd>
        </dl>
      </div>
      <!-- <div class="milks">
        <div>
          <dl v-for="(item0,index0) in carouselProductData" v-bind:key="index0" @click="gopage(item0)">
            <dt>
              <img lazy-load :src="item0.mainImgUrl" alt>
            </dt>
            <dd>
              <p>{{item0.title}}</p>
              <div class="discount">
                <span v-if="item0.isFreeShipping==1">包邮</span>
                <span v-if="item0.isFreeTax==1">包税</span>
                <span v-if="item0.isPresell==1">直邮</span>
              </div>
              <div class="milkProce">
                <span class="ft14">￥</span>
                <span class="ft22">{{item0.salesPrice}}</span>
                <span class="fcg">￥{{item0.vipPrice}}</span>
                <img src="/static/images/vip.png" alt>
                <span v-if="loginUserinfo.userType==1||loginUserinfo.userType==2" style="padding:0px 3px;" class="ft10">赚￥{{item0.earnMoney}}</span>
              </div>
            </dd>
          </dl>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import Login from "@/components/user/login"; //组件
import { getQueryString } from '@/utils/index'

export default {
  props: {
    indexInfo: "",
    carouselProductData: "" //最下面的优选数据
  },
  data() {
    return {
      list: [],
      loginUserinfo:'',
      spikeTop:'',
      spikeBottom:'',
      isBindTop:false,
      onSkillIndex:0,
      spikeListData:'',
      winScrollTop:0,
      intoView:0,
      settimefun:'',
      isLogin:false
    };
  },
  components:{
    Login
  },
  onShow() {
    this.onShowFun()
  },
  onPageScroll(e){
    let that = this
    if(that.settimefun){
      clearTimeout(that.settimefun)
    }
    that.settimefun = setTimeout(()=>{
      that.winScrollTop = e.scrollTop
      console.log('页面滚动',e.scrollTop,that.isBindTop,this.spikeTop,this.spikeBottom)
      if(this.spikeTop&&this.spikeBottom){
        if (e.scrollTop<that.spikeTop&&that.isBindTop) {
          that.isBindTop = false
        } else if (e.scrollTop>=that.spikeTop&&e.scrollTop<(that.spikeBottom-70)&&!that.isBindTop) {
          that.isBindTop = true
        } else if (e.scrollTop>(that.spikeBottom-70)&&that.isBindTop) {
          that.isBindTop = false
        }
      }
    },100)
  },
  created() {
    this.onShowFun()
    if (this.indexInfo) {
      this.fun()
    }
  },
  watch: {
    indexInfo(data) {
      let that = this
      console.log("this.indexInfo改变", data);
      if (data) {
        this.fun()
      }
    }
  },
  methods: {
    loginFun(){
      this.onShowFun()
    },
    onShowFun(){
      const loginResult = wx.getStorageSync('loginResult')
      console.log('loginResult======',loginResult)
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
    goShareList(){
      if(!this.isLogin){
        return
      }
      let data = this.spikeListData[this.onSkillIndex]
      let arr = data.seckillShareUrl.split('?')
      console.log('arr',arr,data)
      if(!data.seckillImageUrl){
        wx.showToast({
          title: '暂无分享图片',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if(!arr[0]){
        wx.showToast({
          title: '暂无分享链接',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let url = '/pages/shareSpikeList/main?time='+data.seckillShareTitle+'&startTime='+data.startTime+'&bg='+data.seckillImageUrl+'&shareUrl='+arr[0]
      console.log('data',data,url)
      wx.navigateTo({
        url:url
      })
    },
    getDome(){
      let that = this
      setTimeout(()=>{
        this.$nextTick(() =>{
          let query = wx.createSelectorQuery()//创建节点查询器 query
          query.select('#newSpikeBox').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
          query.exec(function (res) {
              console.log('res',res)
              // console.log(res[0].top); // #affix节点的上边界坐
              if(res&&res[0]){
                that.spikeTop = res[0].top+that.winScrollTop
                that.spikeBottom = res[0].bottom+that.winScrollTop
              } 
          })
        })
      },500)
    },
    // 去秒杀列表
    spikeList(){
      wx.navigateTo({
        url:'/pages/spikeList/main'
      })
    },
    // 选择时间
    spikeChooseTime (item) {
      this.onSkillIndex = item
      this.getDome()
    },
    imgbindload(index,index2){
    },
    fun(){
      let that = this
      let list = []
      this.indexInfo.map((val, index) => {
        val.show = false
        if (
          val.jumpUrl &&
          val.jumpUrl.indexOf("topic") > 0 &&
          (val.jumpUrl.indexOf("uiType=2") > 0||val.jumpUrl.indexOf("uiType=3") > 0)
        ) {
          val.putArr = [];
          val.isVip = true
          let newArr = [];
          val.onIndex = 0;
          val.items.map((val2,index2) => {
            newArr.push(val2);
            if (newArr.length == 3) {
              val.putArr.push(newArr);
              newArr = [];
            } else if (index2 == val.items.length-1) {
              val.putArr.push(newArr);
            }
          });
          list.push(val);
        } else {
          if (val.type == "spikeProduct") {
            that.spikeListData = val.seckill
            let time1 = new Date().getTime()
            val.seckill.map((val2,index2)=>{
              if(val2.startTime<=time1&&val2.endTime>time1){
                that.onSkillIndex = index2
              }
              val2.inStart = true
              if(val2.startTime>time1){
                val2.inStart = false
              }
            })
            that.intoView = 'item'+that.onSkillIndex
          }
          if (val.type == "carouselProduct") {
            val.putArr = [];
            let newArr = [];
            val.onIndex = 0;
            val.items.map((val2,index2) => {
              newArr.push(val2);
              if (newArr.length == 3) {
                val.putArr.push(newArr);
                newArr = [];
              } else if (index2 == val.items.length-1) {
                val.putArr.push(newArr);
              }
            });
          }
          list.push(val);
        }
      })
      this.list = list
      this.getDome()
    },
    gopage(item) {
      console.log('跳页',item)
      if(item.jumpUrl.indexOf('http')==0||item.jumpUrl.indexOf('https')==0){
        let getStr = getQueryString(item.jumpUrl)
        let str = ''
        let num1 = item.jumpUrl.indexOf('?')
        let url = item.jumpUrl.slice(0,num1)
        for(let i in getStr){
          str += '&'+i+'='+getStr[i]
        }
        console.log('getStr',str,url)
        wx.navigateTo({
          url: "/pages/goodsSpecial/main?url=" + url+str
        })
        return
      }
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
        case "product":
          wx.navigateTo({
            url: "/pages/go2detail/main?id=" + businessId
          });
          break;
        case "spike":
          wx.navigateTo({
            url: "/pages/go2detail/main?id=" + businessId
          });
          break;
        case "category":
          wx.navigateTo({
            url: "/pages/classify/main?cid=" + businessId
          });
          break;
        case "topic":
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
    goTospike() {
      wx.navigateTo({
        url: "/pages/spike/main"
      });
    }
  }
};
</script>
<style lang='scss'>
.swrap {
  width: 100%;
  height: 100%;
}
.wx-swiper-dots{position:relative;z-index: 10;}

.wx-swiper-dots.wx-swiper-dots-horizontal{
  margin-bottom: -5rpx;
  z-index: 10;
}
.swiper {
  width: 100vw;
  padding: 0px 5px;
  height: 100vw * 0.395;
  margin-bottom: 10px;
  margin-top: 5px;
  box-sizing: border-box;
}
.swiperItem {
  width: 100%;
  height: 100vw * 0.395;
  box-sizing: border-box;
}
.chart {
  display: flex;
  dl {
    width: 20%;
    box-sizing: border-box;
    text-align: center;
    margin: 0 0 10px 0;
    dt {
      width: 100%;
      img {
        width: 45px;
        height: 45px;
      }
    }
    dd {
      width: 100%;
      font-size: 12px;
      line-height: 2;
    }
  }
}

.swipers {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  div{
    width: 100%;
    padding-top: 39.487%;
    position: relative;
    img{
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
    }
  }
}
.spike {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;
  dl {
    width: 46%;
    height: 80px;
    display: flex;
    justify-content: space-around;
    background: #fff3f4;
    margin: 5px 2%;
    dd {
      img {
        width: 65px;
        height: 70px;
        margin-top: 5px;
      }
    }
    dt {
      h3 {
        font-size: 18px;
        color: #323a45;
        padding-top: 4px;
      }
      p {
        font-weight: 300;
        font-size: 13px;
        line-height: 2;
        color: #757575;
      }
      span {
        display: block;
        font-size: 12px;
        width: 40px;
        margin: 0 auto;
        border-radius: 5px;
        color: #fff;
        text-align: center;
        background: linear-gradient(
          180deg,
          rgba(255, 135, 140, 1) 0%,
          rgba(255, 99, 107, 1) 100%
        );
      }
    }
  }
}
.spike dl:nth-child(2) {
  background: #fffcf2;
}
.spike dl:nth-child(3) {
  background: #f8f3ff;
}
.spike dl:nth-child(4) {
  background: #f1f9fd;
}

.spike dl:nth-child(2) dt span {
  background: linear-gradient(
    180deg,
    rgba(255, 220, 122, 1) 0%,
    rgba(255, 198, 71, 1) 100%
  );
}
.spike dl:nth-child(3) dt span {
  background: linear-gradient(
    180deg,
    rgba(130, 200, 255, 1) 0%,
    rgba(75, 177, 255, 1) 100%
  );
}
.spike dl:nth-child(4) dt span {
  background: linear-gradient(
    180deg,
    rgba(255, 161, 204, 1) 0%,
    rgba(255, 107, 174, 1) 100%
  );
}
.today {
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  padding: 0 10px;
  margin: 3px 0;
  line-height: 3;
  .today1 {
    font-size: 20px;
    padding-right: 10px;
  }
  .today2 {
    border-left: 2px solid #ccc;
    padding-left: 10px;
    box-sizing: border-box;
    font-size: 16px;
  }
  .more {
    width: 36px;
    height: 16px;
    margin-top: 22px;
  }
}

.kh-list dl {
  display: flex;
  width: 100%;
  dt {
    width: 30%;
    img {
      width: 100%;
      height: 131px;
      padding: 20px 10px;
      box-sizing: border-box;
    }
  }
  dd {
    width: 70%;
    .over-h {
      overflow:hidden; 
      text-overflow:ellipsis;
      display:-webkit-box; 
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2; 
      font-weight: 300;
      font-size: 16px;
      line-height: 2;
      margin-top: 10px;
    }
    .present {
      display: flex;
      justify-content: space-between;
      font-weight: 300;
      font-size: 16px;
      line-height: 2;
      color: #999da2;
      progress {
        margin-top: 15px;
        width: 100px;
        height: 4px;
      }
      span {
        padding-right: 15px;
      }
    }
    .price {
      display: flex;
      font-size: 16px;
      justify-content: space-between;
      float: bottom;
      margin-top: 10px;
      .nprice {
        font-size: 22px;
        color: #fc5d7b;
      }
      .oprice {
        text-decoration: line-through;
        line-height: 2;
        margin-top: 7px;
        color: #aaa;
        font-size: 12px;
      }
      .zhuan {
        font-size: 12px;
        color: #fc5d7b;
        margin-top: 10px;
      }
      .btn {
        width: 80px;
        height: 33px;
        margin-top: 4px;
        margin-right: 10px;
      }
    }
  }
}

.good-thing {
  position: relative;
  height: 320px;
  .cimg {
    width: 100%;
    height: 320px;
    display: block;
    padding: 6px 10px;
    box-sizing: border-box;
    border-radius: 4px;
  }
  swiper {
    width: 90%;
    margin: -180px 5% 30px 5%;
    .imgs {
      width: 100%;
      height: 95px;
      padding: 2px;
      box-sizing: border-box;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .texts {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      font-size: 13px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .price {
      font-size: 13px;
      color: #fc5d7b;
    }
  }
}

/* 奶粉 */
.milk {
  width: 100%;
  .bigImg {
    width: 96%;
    height: 154px;
    margin: 0 2%;
    border-radius: 15px;
  }
  .bot {
    display: flex;
    margin-top: 20px;
    padding: 0 2%;
    height: 188px;
    box-sizing: border-box;
    .bot-left {
      width: 40%;
      img {
        width: 100%;
        height: 100%;
        padding-right: 2px;
        box-sizing: border-box;
      }
    }
    .bot-right {
      width: 60%;
      img {
        width: 100%;
        height: 50%;
        display: block;
      }
    }
  }
}

.milk .bot .bot-right img:nth-child(1) {
  padding-bottom: 2px;
  box-sizing: border-box;
}
.milk .bot .bot-right img:nth-child(2) {
  padding-top: 2px;
  box-sizing: border-box;
}
/* 为你精选 */
.choose {
  width: 100%;
  .milks {
    width: 100%;
    dl {
      display: flex;
      padding-right: 10px;
      box-sizing: border-box;
      margin: 10px 0;
      dt img {
        width: 100px;
        height: 108px;
        margin: 0 10px 0 10px;
      }
      dd {
        p {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 14px;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-bottom: 10px;
          line-height: 2;
        }
        .discount {
          margin-bottom: 5px;
          span {
            border: 1px solid #fc5d7b;
            color: #fc5d7b;
            font-size: 10px;
            padding: 1px 3px;
            box-sizing: border-box;
            margin: 0 5px;
          }
        }
        .milkProce {
          color: #fc5d7b;
          line-height: 2;
          img {
            width: 21px;
            height: 10px;
            margin: 0 3px;
          }
          .ft14 {
            font-size: 14px;
          }
          .ft22 {
            font-size: 22px;
          }
          .ft16 {
            font-size: 16px;
          }
          .fcg {
            margin-left: 5px;
            color: #a87831;
            font-size: 10px;
          }
          .ft10 {
            font-size: 10px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(252, 93, 123, 1);
            line-height: 12px;
            background: #ffe8ed;
            margin-left: 5px;
            padding: 2px 0;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}

.box6item {
  display: inline-block;
  width: 30vw;
  margin-left: 2.5vw;
}
.box6item .imgbox {
  width: 30vw;
  height: 30vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box6item .imgbox img {
  max-height: 100%;
  max-width: 100%;
}
.box6item .titlebox {
  font-size: 14px;
  color: #323a45;
  line-height: 20px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.box6item .moneybox {
  font-size: 14px;
  color: #fc5d7b;
}
.box6item:nth-child(3n) {
  margin-right: 2.5vw;
}
.fourBox {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.fourBox img {
  width: 50vw;
  height: 27.75vw;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.fourBox img:nth-child(2n) {
  padding-right: 10px;
  padding-left: 2px;
}
.fourBox img:nth-child(2n-1) {
  padding-right: 2px;
  padding-left:10px;
}
.slide-image {
  height: 100%;
  width: 100%;
  border-radius: 5px;
}
.carouselProduct {
  position: relative;
  box-sizing: border-box;
  min-height: 80vw;
  padding-top: 35%;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
}
.carouselProductImgBox {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  padding: 10px;
  z-index: -1;
  box-sizing: border-box;
}
.carouselProductImgBox > img {
  width: 100%;
  height: 80vw;
  border-radius: 5px;
}
.swiperBox {
  box-sizing: border-box;
  min-height: 40vw;
  box-shadow: 2px 4px 4px #ebebeb;
  position: relative;
}
.thisSwiper {
  width: 100%;
  min-height: 55vw;
}
.thisSwiperItem {
  display: flex;
}
.itemImgBox {
  width: 100%;
  padding-top: 100%;
  position: relative;
  background-color: #fff;
}
.itemImgBox > div {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  font-size: 0px;
}
.itemImgBox img {
  max-width: 100%;
  max-height: 100%;
}
.thisSwiperItemDiv {
  width: 31.33%;
  height: 100%;
  margin-left: 1.5%;
}
.carouselProductText {
  overflow:hidden; 
  text-overflow:ellipsis;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2; 
  font-size: 12px;
  color: #323a45;
  height: 34px;
}
.carouselProductPrice {
  display: flex;
  /*justify-content: center;*/
  font-size: 12px;
}
.carouselProductPriceSales {
  color: #fc5d7b;
  margin-right: 5px;
}
.carouselProductPriceEarn {
  background-color: rgba(255, 232, 237, 1);
  border-radius: 3px;
  color: #fc5d7b;
  padding: 0px 4px;
}
.div3imgBox{
  margin: 10px;
}
.div3imgBoxLeft{
  width: 39.6%;
  position: relative;
  padding-top: 48.45%;
}
.div3imgBoxLeft img{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.newSpikeBox{
  
}
.newSpikeTop{
  padding: 10px;
}
.newSpikeTop>.more img{
  color: #FC748D;
  font-size: 14px;
  height: 15px;
  font-size: 0px;
  width: 41.785px;
}
.newSpikeTop .span2{
  border-left: 2px solid #323A45;
  padding-left:10px;
  margin-left: 10px;
}
.newSpikeTag{
  padding: 10px 0px;
  background: #FFF6F6;
  white-space:nowrap;
  height: 38px;
  position: relative;
}
.newSpikeTagItem{
  width: 20vw;
  text-align: center;
  display: inline-block;
}
.newSpikeTagItem>div:nth-child(1){
  font-weight: bold;
  height: 20px;
  line-height: 20px;
}
.newSpikeTagItem>div:nth-child(2){
  font-size: 12px;
  height: 18px;
  line-height: 18px;
}
.newSpikeTagItem.on>div:nth-child(1){
  color: #FC5D7B;
}
.newSpikeTagItem.on>div:nth-child(2){
  background-color: #FC5D7B;
  color: #fff;
  border-radius: 4px;
}
.isBindTop{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
}
.none{
  display: none;
}
.shareListImg{
  width: 102px;
  height: 30px;
  position: fixed;
  top:52px;
  left:50%;
  margin-left: -51px;
}
.shareListImg>div{
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.shareListImg img{
  width: 100%;
  height: 100%;
}
.scrollBox{
  position: relative;
  height: 58px;
}
.fs20{
  font-size: 20px;
}

.choose .list{
    display: flex;
    flex-wrap: wrap;
  }
  .choose .list dl{
    width: 50vw;
    padding: 5px;
    box-sizing: border-box;
  }
  .choose .list dd{
    background-color: #fff;
    padding: 5px;
  }
  .choose .imgbox{
    width: 100%;
    padding-top: 100%;
    position: relative;
    background-color: #fff;
  }
  .choose .imgbox img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }
 .choose .titles{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #323A45;
    font-size: 14px;
    line-height: 20px;
  }
.choose  .prices{
    color: #FF527F;
    font-size: 14px;
  }
.choose  .vipSpan{
    color: #A87831;
    font-size: 10px;
    margin-right: 5px;
  }
.choose  .earnSpan{
    padding: 0px 5px;
    display: inline-block;
    border-radius: 3px;
    background-color: rgba(255,232,237,1);
    color: #FC5D7B;
    font-size: 10px;
  }
.choose .prices2{
    height: 15px;
    line-height: 15px;
  }
.choose .prices2 img{
    width: 20px;
    margin-right: 5px;
  }
.choose .tabBox{
    min-height: 25px;
  }
.choose .tabBox span{
    display: inline-block;
    border:1px solid rgba(252,93,123,1);
    border-radius: 3px;
    padding: 0px 3px;
    color: #FC5D7B;
    font-size: 10px;
    margin-right: 5px;
  }
  .choose{
    padding-bottom: 60px;
  }
/* #A87831 */
</style>
