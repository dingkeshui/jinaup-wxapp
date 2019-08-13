<template>
  <div class="boxs">
    <div class="wrap">
      <header>
        <img class="bgImg2" src="./img/logBg.png" alt>
        <dl class="headDl">
          <dt>
            <img v-if="isLogin" :src="user.headUrl" alt>
            <img v-else src="./img/my.png" @click="showLoginModel = true" alt>
          </dt>
          <dd>
            <template v-if="isLogin">
            <p class="name flex flexvcenter">
              <span class="line1" style="display:inline-block;max-width:60vw;">{{user.nickName}}</span>
              <img v-if="user.userLevel==1" src="/static/images/my_vip1.png" alt>
              <img v-if="user.userLevel==2" src="/static/images/my_vip2.png" alt>
              <img v-if="user.userLevel==3" src="/static/images/my_vip3.png" alt>
              <img v-if="user.userType==2" src="/static/images/my_vip4.png" alt>
            </p>
            <p class="codeNum">
              邀请码：{{user.inviteCode}}
              <span @click="copy(user.inviteCode)">复制</span>
            </p>
            </template>
            <template v-else> 
              <div class="noLoginBox" @click="showLoginModel = true">点击登陆</div>
            </template>
          </dd>
        </dl>
      </header>
      <section>
        <div class="sec-top">
          <h3 @click="goTolist(0)">我的订单</h3>
          <div class="wallet">
            <dl @click="goTolist(1)">
              <dt>
                <span class="num" v-if="dd1==0?false:true">{{dd1}}</span>
                <img src="/static/images/dfk.png" alt>
              </dt>
              <dd>待付款</dd>
            </dl>
            <dl @click="goTolist(2)">
              <dt>
                <span class="num" v-if="dd2==0?false:true">{{dd2}}</span>
                <img src="/static/images/dfh.png" alt>
              </dt>
              <dd>待发货</dd>
            </dl>
            <dl @click="goTolist(3)">
              <dt>
                <span class="num" v-if="dd3==0?false:true">{{dd3}}</span>
                <img src="/static/images/dsh.png" alt>
              </dt>
              <dd>待收货</dd>
            </dl>
          </div>
        </div>
        <div class="iconBox">
          <h3 class="title">我的服务</h3>
          <div class="iconMain">
            <div  @click="goto(1)">
              <div><img src="./img/icon1.png"></div>
              <div>优惠券</div>
            </div>
            <div  @click="goto(2)">
              <div><img src="./img/icon2.png"></div>
              <div>收货地址</div>
            </div>
            <div  @click="goto(3)">
              <div><img src="./img/icon3.png"></div>
              <div>联系客服</div>
            </div>
            <div  @click="goto(4)">
              <div><img src="./img/icon4.png"></div>
              <div>实名认证</div>
            </div>
            <div v-if="showBFun" @click="goto(5)">
              <div><img src="./img/icon5.png"></div>
              <div>商家入驻</div>
            </div>
            <div v-if="showBFun" @click="goto(6)">
              <div><img src="./img/icon6.png"></div>
              <div>APP下载</div>
            </div>
            <!-- <div @click="goto(7)">
              <div><img src="./img/icon6.png"></div>
              <div>webView</div>
            </div> -->
          </div>
        </div>
      </section>
    </div>
    <div class="officialBox">
      <official-account></official-account>
    </div>
    <!-- tabber -->
    <tab onIndex='e'></tab>
    <!-- 下载App模态框 -->
    <div v-if="showModel" class="model flex flexcenter" catchtouchmove="ture">
      <div class="modelmain">
        <img class="img3" src="/static/images/close.png" @click="showModel = false">
        <img class="img2 mgb10" src="/static/images/jina.png">
        <div class="text">请在客服对话回复“1”</div>
        <div class="text mgb10">下载APP</div>
        <div class="butBox">
          <button class="but" open-type="contact"></button>
          打开客服会话
        </div>
      </div>
    </div>
    <!-- 登陆弹框 -->
    <div v-if="showLoginModel" class="loginModelBox" catchtouchmove="ture">
      <div class="noLoginMain">
        <div>
          <img src="/static/images/headimg.png">
        </div>
        <div class="logintext">您还未登陆</div>
        <div class="logintext">请先登陆再进行操作</div>
        <div class="loginbutBox">
          <div @click="showLoginModel = false">暂不登陆</div>
          <div>立即登陆<Login v-if="!isLogin" @loginFun="loginFun" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import tab from "../../components/tab/tab";
import { ddNum } from "@/api/index";
import { getUser } from "@/api/index";
import Login from "@/components/user/login"; //组件
// /{version}
export default {
  data() {
    return {
      userInfo: "",
      inviteCode: "",
      boo: false,
      trackId: "",
      dd1: "",
      dd2: "",
      dd3: "",
      user: "",
      showModel:false,
      isLogin:false,
      showLoginModel:false
    };
  },
  components: {
    tab,
    Login
  },
  computed:{
    showBFun(){
      return this.$store.state.showB
    }
  },
  onLoad(){
  },
  onShow() {
    this.showfun()
  },
  methods: {
    loginFun(){
      console.log('loginFun')
      this.showfun()
    }, 
    showfun(){
      console.log('showfun')
      let loginResult = wx.getStorageSync('loginResult')
      console.log('showfun',loginResult)
      this.showLoginModel = false
      if(loginResult){
        this.isLogin = true
        this.onShowFun()
      }else{
        this.isLogin = false
      }
    },
    // 初始化
    async onShowFun(){
      var that = this;
      // let trackId = wx.getStorageSync('trackId')
      let loginResult = wx.getStorageSync('loginResult')
      let res = await getUser()
      if(res.data.res_code==1){
        if(res.data.result.userType==2){
          let tiem = new Date().getTime()
          if(tiem>=res.data.result.expireDate){
            res.data.result.userType=0
          }
        }
      }
      console.log('myresult',res)
      that.user = res.data.result
      loginResult.userInfo = res.data.result
      wx.setStorage({
        key: "loginResult",
        data: loginResult
      });
      console.log('user',that.user)
      wx.getStorage({
        key: "inviteCode",
        success: function(res) {
          console.log("666666666", res);
          that.inviteCode = res.data;
        }
      });
      let data = await ddNum();
      console.log("订单数。。。", data.data.result);
      that.dd1 = data.data.result.pendingPaymentNumber;
      that.dd2 = data.data.result.pendingDeliverNumber;
      that.dd3 = data.data.result.pendingReceivingNumber;
      console.log("that.dddddd", that.dd1, that.dd2, that.dd3);
      // let result = await getUser();
      // console.log('获取个人信息',result)
      // that.user = result.data.result;
      // console.log("result....sss", result.data.result);
    },
    copy(val) {
      wx.setClipboardData({
        data: val,
        success(res) {
          wx.showToast({
            title: "已复制邀请码到剪切板", //提示的内容,
            icon: "none" //图标,
          });
        }
      });
    },
    goTolist(idx) {
      if(!this.isLogin){
        this.showLoginModel = true
        return
      }
      wx.navigateTo({
        url: "/pages/myorder/main?orderStatus=" + idx
      });
    },
    goto(index) {
      if (index == 1) {
        if(!this.isLogin){
          this.showLoginModel = true
          return
        }
        console.log("去优惠券界面");
        wx.navigateTo({
          url: "/pages/conponlist/main"
        });
      } else if (index == 2) {
        if(!this.isLogin){
          this.showLoginModel = true
          return
        }
        console.log("去收货地址界面");
        wx.navigateTo({
          url: "/pages/shoppingadress/main"
        });
      } else if (index == 3) {
        console.log("联系客服");
        wx.navigateTo({
          url: "/pages/artificial/main"
        });
      } else if (index == 4) {
        if(!this.isLogin){
          this.showLoginModel = true
          return
        }
        console.log("实名认证");
        wx.navigateTo({
          url: "/pages/autonym/main"
        });
      } else if (index == 5) {
        console.log("商家入驻");
        wx.navigateTo({
          url: "/pages/contactUs/main"
        });
      } else if (index == 6) {
        console.log("app下载");
        this.showModel = true
      } else if (index == 7) {
        console.log("app下载");
        wx.navigateTo({url:'/pages/appDown/main?id=49784'})
      }
    }
  }
};
</script>

<style scoped>
page,
.boxs {
  width: 100%;
  min-height: 100%;
  background: rgba(243, 247, 247, 1)
}
.wrap {
  position: relative;
  min-height: 100%;
  width: 100%;
  /*background: rgba(243, 247, 247, 1);*/
}
.loginwrap {
  width: 100%;
  height: 100%;
}
.bgImg2 {
  width: 100%;
  height: 110px !important;
}
.loginwrap .login {
  position: absolute;
  width: 100px;
  bottom: 30%;
  left: 50%;
  margin-left: -50px;
  font-size: 14px;
}
header {
  width: 100%;
  height: 110px;
  position: relative;
}
header .login {
  display: inline-block;
  padding: 3px 5px;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 14px;
  border: ;
}
header .headDl {
  display: flex;
  color: #fff;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 10;
}
header .headDl dt img {
  width: 64px;
  height: 64px;
  margin: 19px;
  border-radius: 50%;
}
header .headDl dd {
  margin: 11px 10px 0 10px;
}
header .headDl dd .name {
  font-size: 20px;
  line-height: 2;
}
header .headDl dd .codeNum {
  font-size: 14px;
}
header .headDl dd .codeNum span {
  margin-left: 5px;
  line-height: 2;
  font-size: 10px;
  background: #35cdd0;
  color: #fff;
  padding: 3px 5px;
  box-sizing: border-box;
  border-radius: 5px;
  opacity: 0.7239;
}
header .headDl dd img {
  width: 34px;
  height: 15.21px;
}
section {
  width: 100%;
  position: relative;
  z-index: 11;
  margin-top: -20px;
}
section .sec-top {
  width: 96%;
  margin: 0 2%;
  height: 110px;
  background: #fff;
  border-radius: 5px;
}

section .sec-top h3 {
  line-height: 2;
  padding-left: 10px;
  box-sizing: border-box;
}
section .sec-top .wallet {
  display: flex;
  justify-content: space-around;
}
section .sec-top .wallet dl dt img {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
}
section .sec-top .wallet dl dt {
  position: relative;
}
section .sec-top .wallet dl dt .num {
  position: absolute;
  left: 30px;
  top: -5px;
  padding: 1px;
  font-size: 12px;
  border: 1px solid rgba(252, 93, 123, 1);
  border-radius: 50%;
  color: #fc5d7b;
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 15px;
}
section .sec-top .wallet dl dd {
  font-size: 12px;
  color: #70757d;
  text-align: center;
}

.line1{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.officialBox{
  padding: 10px 2% 60px 2%;
}
.model{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 20;
    background-color: rgba(0,0,0,0.4);
  }
  .modelmain{
    background-color: #fff;
    position: relative;
    width: 70vw;
    padding: 10px;
    margin: 0px auto;
    text-align: center;
    border-radius: 10px;
  }
  .modelmain .img2{
    width: 60px;
    height: 60px;
    border-radius: 5px;
  }
  .modelmain .text{
    font-weight: bold;
  }
  .butBox{
    position: relative;
    background-color: #33D6C5;
    color: #fff;
    height: 40px;
    line-height: 40px;
    width: 200px;
    border-radius: 10px;
    margin: 10px auto;
  }
  .butBox .but{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .img3{
    position: absolute;
    top: -40px;
    right: 0px;
    width: 30px;
    height: 30px;
  }
  .iconBox{
    border-radius: 8px;
    margin: 10px 2%;
    background-color: #fff;
  }
  .iconBox h3{
    line-height: 2;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .iconMain{
    overflow: hidden;
    margin-top: 10px;
    color: #70757D;
    font-size: 12px;
  }
  .iconMain img{
    width: 30px;
    height: 30px;
    margin-bottom: 5px;
  }
  .iconMain>div{
    float: left;
    width: 25%;
    text-align: center;
    margin-bottom: 10px;
  }
  .noLoginBox{
    box-sizing: border-box;
    /*padding-top: 35%;*/
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    height: 100%;
    position: relative;
  }
.loginModelBox{
  background-color: rgba(0,0,0,0.4);
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  text-align: center;
}
.loginModelBox .noLoginMain{
  background-color: #fff;
  width: 70vw;
  padding: 20px 10px;
  border-radius: 10px;
}
.loginModelBox .logintext{
  font-weight: bold;
}
.loginModelBox img{
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}
.loginModelBox .loginbutBox{
  display: flex;
  margin-top: 20px;
  justify-content: center;
  font-size: 14px;
}
.loginModelBox .loginbutBox>div:nth-child(2n-1){
  color: #33D6C5;
  border:1px solid #33D6C5;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
}
.loginModelBox .loginbutBox>div:nth-child(2n){
  color: #fff;
  border:1px solid #33D6C5;
  background-color: #33D6C5;
  padding: 5px 10px;
  border-radius: 5px;
  position: relative;
}
</style>
