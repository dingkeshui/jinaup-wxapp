<template>
  <div class="wrap">
    <div v-if="user" class="flex2 flexcenter headImgBox">
        <img :src="user.userInfo.avatarUrl">
        <span>{{user.userInfo.nickName}}</span>
    </div>
    <ul class="list">
      <li>
        <!-- <div class="label">手机号</div> -->
        <input type="number" v-model="userphone" style="width:130px;" placeholder="请输入新手机号">
        <div class="flex1"></div>
        <div class="bindwx">绑定微信手机号<button plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumberFun"></button></div>
      </li>
      <li>
        <!-- <div class="label">验证码</div> -->
        <input type="number" style="width:100px;" v-model="identifyCode" placeholder="请输入验证码">
        <button v-if="showBtn" class="yzm" :class="identifyBtn?'yzmdis':''" @click="getIdentify">{{cont}}</button>
      </li>
    </ul>
    <div v-if="getNum" @click="usVoiceCode" :class="['text2','label',identifyBtn?'on2':'on']">使用语音验证码</div>
    <button @click="save" id="btn">绑定</button>
    <!-- <button @click='autonym'>实名</button> -->
  </div>
</template>

<script>
  import store from '@/store/index'
  import { voiceCode,getWxPhone } from '@/api/index'
  import {
    mapState,
    mapMutations,
    mapActions
  } from "vuex";
  export default {
    data() {
      return {
        cont: "获取验证码",
        userphone: "", //手机号
        identifyCode: "", //验证码
        num: 59,
        identifyBtn: false,
        getNum:0,
        user:''
      };
    },
    computed: {
      ...mapState({
        wxOauthJson: state => state.user.wxOauthJson
      }),
      showBtn(){
        return this.userphone != 13261886030;
      }
    },
    onLoad() {
      let that = this
      wx.setNavigationBarTitle({
        title: "绑定手机号"
      });
      wx.getStorage({
        key:'user',
        success(res){
          console.log('用户信息',res)
          that.user = res.data
        }
      })
    },
    methods: {
      ...mapActions({
        etIdentify: "phone/etIdentify",
        bindPhone: "phone/bindPhone"
      }),
      ...mapMutations({
        updateState: "user/updateState",
      }),
      getPhoneNumberFun(e){
        console.log('获取电话',e)
        let that = this
        if(!e.mp.detail.encryptedData||!e.mp.detail.iv){
          return
        }
        wx.login({
          async success(res){
            console.log('coderes',res)
            let loginResult = wx.getStorageSync('loginResult')
            console.log('loginResult',loginResult)
            let wxOauthJson = JSON.stringify(loginResult.wxOauthJson)
            let data = {
              encryptedData:e.mp.detail.encryptedData,
              iv:e.mp.detail.iv,
              platform:4,
              code:res.code,
              wxOauthJson:wxOauthJson
            }
            console.log('data,',data)
            let res2 = await getWxPhone(data)
            that.nextFun(res2,loginResult)
          }
        })
      },
      // 使用语音验证码
      async usVoiceCode(){
        let that = this
        console.log('带年纪了')
        if(this.identifyBtn){
          return
        }
        if (this.userphone == "") {
          wx.showToast({
            title: "手机号不能为空",
            icon: "none",
            duration: 1000
          });
          return false;
        } else {
          //请求获取验证码
          that.identifyBtn = true;
          that.num = 59;
          wx.showToast({
              title: "请注意语音来电", //提示的内容,
              icon: 'none', //图标,
          })
          let timer = setInterval(() => {
            that.cont = that.num-- + "s重新发送";
            if (this.num < 0) {
              this.getNum ++
              clearInterval(timer);
              this.cont = "获取验证码";
              that.identifyBtn = false;
            }
          }, 1000)
          let result = await voiceCode({
            phoneNumber: this.userphone
          })
          if (result.data.res_code==1) {
          } else {
            that.identifyBtn = false;
            clearInterval(timer);
            this.cont = "获取验证码";
            wx.showToast({
              title: result.data.message?result.data.message:"发送失败", //提示的内容,
              icon: 'none', //图标,
            })
            return
          }
        }
      },
      //获取验证码
      async getIdentify(ev) {
        console.log('点击了')
        //判断手机号
        let that = this;
        if(this.identifyBtn){
          return
        }
        if (this.userphone == "") {
          wx.showToast({
            title: "手机号不能为空",
            icon: "none",
            duration: 1000
          });
          return false;
        } else {
          //请求获取验证码
          that.identifyBtn = true;
          that.num = 59;
          let timer = setInterval(() => {
            that.cont = that.num-- + "s重新发送";
            if (this.num < 0) {
              this.getNum ++
              clearInterval(timer);
              this.cont = "获取验证码";
              that.identifyBtn = false;
            }
          }, 1000);
          let result = await this.etIdentify({
            userphone: this.userphone
          });
          console.log("getcode", result)
          if (result.data.res_code==1) {
          } else {
            that.identifyBtn = false;
            clearInterval(timer);
            this.cont = "获取验证码";
            wx.showToast({
              title: result.data.message?result.data.message:"发送失败", //提示的内容,
              icon: 'none', //图标,
            })
            return
          }
        }
      },
      //绑定手机号
      async save() {
        let that = this
        let userphone = this.userphone;
        let phoneCode = this.identifyCode;
        console.log('userphone',userphone,'phoneCode',phoneCode)
        if (!userphone) {
          wx.showToast({
            title: '请输入手机号', //提示的内容,
            icon: 'none', //图标,
          });
          return
        }
        if (!phoneCode) {
          wx.showToast({
            title: '请输入验证码', //提示的内容,
            icon: 'none', //图标,
          });
          return
        }
        let loginResult = wx.getStorageSync('loginResult')
        console.log('loginResult=====',loginResult)
        let wxOauthJson = loginResult.wxOauthJson
        let result = await this.bindPhone({
          userphone: userphone,
          phoneCode: phoneCode,
          wxOauthJson: wxOauthJson
        });
        console.log('result...', result)
        that.nextFun(result,loginResult)
      },
      nextFun(result,loginResult){
        let that = this
        if (result.data.res_code == 1) {
          loginResult.isBindPhone = 1
          loginResult.userInfo = result.data.result
          wx.setStorage({key:'loginResult',data:loginResult})
          wx.setStorage({key:'trackId',data:result.data.result.trackId})
          // 更新trackId
          that.updateState({
            trackId: result.data.result.trackId
          })
          // 判断是否有parentId
          if (!result.data.result.parentId){
            wx.reLaunch({ url: '/pages/referrer/main' });
            return;
          }
          // 回首页
          let str = wx.getStorageSync('loginUrl')
          console.log('str',str)
          wx.reLaunch({
            url:str?str:'/pages/index/main',
            fail(){
              wx.reLaunch({ url: '/pages/index/main' })
            }
          });
        } else {
          wx.showToast({
            title: result.data.message?result.data.message:'验证失败，请重试', //提示的内容,
            icon: 'none', //图标,
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(243, 247, 247, 1);
  }
  .list {
    width: 100%;
    height: 180rpx;
    display: flex;
    flex-direction: column;
    padding: 0 24rpx;
    box-sizing: border-box;
    background: #fff;
    li {
      width: 100%;
      height: 90rpx;
      display: flex;
      align-items: center;
      position: relative;
      .yzm {
        width: 100px;
        height: 30px;
        padding: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(252, 93, 123, 1);
        line-height: 30px;
        background: #fff;
        border-radius: 15px;
        border: 1px solid rgba(252, 93, 123, 1);
        position: absolute;
        z-index:10;
        right: 0;
      }
      button.yzmdis {
        color: rgba(153, 157, 162, 1);
      }
    }
    .label {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(50, 58, 69, 1);
      line-height: 20px;
      padding-left: 10px;
      min-width:70px;
      box-sizing: border-box;
    }
    input {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 157, 162, 1);
    }
    li:first-child {
      border-bottom: 2rpx solid rgba(243, 247, 247, 1);
      box-sizing: border-box;
    }
  }
  .wrap>button {
    width: 92%;
    height: 50px;
    margin: 60px auto;
    background: rgba(51, 214, 197, 1);
    border-radius: 7px;
    font-size: 18px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 50px;
    text-align: center;
  }
  .disable {
    background: rgba(51, 214, 197, 1);
    opacity: 0.5;
  }
  .label.on{
    color:#5D9AFC !important;
  }
  .label.on2{
    color:#999DA2 !important;
  }
  .text2{
    padding:10px 22px;
    font-size:14px;
  }
  .bindwx{
    color:#02C160;
    border:1px solid #02C160;
    border-radius:20px;
    padding:0px 10px;
    position:relativere;
    height:30px;
    line-height:30px;
    font-size:14px;
  }
  .bindwx button{
    opacity:1;
    position:absolute;
    left:0px;
    top:0px;
    width:100%;
    height:100%;
    border:0px;
    display: inline-block;
  }
  .bindwx button:after{
    content:'';
    display:none;
  }
  .bindwx button:before{
    content:'';
    display:none;
  }
  .headImgBox{
    background:#fff;
    padding-bottom:30px;
    color:#484848;
  }
  .headImgBox img{
    width:60px;
    height:60px;
    margin-bottom:20px;
    border-radius:50%;
  }
</style>
