<template>
    <button id="loginBut" v-if="showDialog" open-type="getUserInfo"  @getuserinfo="e=>getUserInfo(e.target)"></button>
</template>

<script>
import { getAuth, getCode } from "@/utils/index";
import { mapActions, mapMutations } from "vuex";
import { getUser } from "@/api/index";
import { getQueryString } from '@/utils/index'
import store from '@/store/index'

export default {
  data() {
    return {
      showDialog: false
    };
  },
  async mounted() {
    // 前置获取code
    console.log('登陆组件creat',this.showDialog)
    let code = await getCode();
    this.updateState({ code });
    getAuth(
      "scope.userInfo",
      res => {
        console.log('获取授权情况',res)
        if(res=='noScope'){
          this.$emit('noScope')
          this.showDialog = true
        }else{
          this.showDialog = false;
          console.log('点击了授权,',res)
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log('获取用户信息前',res)     
              this.getUserInfo(res);
            }
          });
        }
      },
      false
    );
  },
  methods: {
    ...mapActions({
      login: "user/login"
    }),
    ...mapMutations({
      updateState: "user/updateState"
    }),
    async getUserInfo(res) {
      console.log('获取用户信息')
      if(res.userInfo){
        console.log('同意授权')
      }else{
        console.log('拒绝授权')
        wx.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 2000
        })
        return
      }
      var pages = getCurrentPages()
      let lastPage = pages[pages.length-1]
      let str = '/'+lastPage.route
      let str2 = '?'
      for(let i in lastPage.options){
        if (i=='q') {
          let num1 = lastPage.options[i].indexOf('?')
          let url = lastPage.options[i].slice(0,num1)
          let getStr = getQueryString(decodeURIComponent(lastPage.options[i]))
          getStr.url = url
          for(let k in getStr){
            if (str2[str2.length-1]=='?') {
              str2 += k+'='+getStr[k]
            } else {
              str2 += '&'+k+'='+getStr[k]
            }
          }
        } else {
          if (str2[str2.length-1]=='?') {
            str2 += i+'='+lastPage.options[i]
          } else {
            str2 += '&'+i+'='+lastPage.options[i]
          }
        }
      }
      if( str2!='?'){
        str = str + str2
      }
      wx.setStorage({
        key: "loginUrl",
        data: str
      });
      console.log('isLoginUrl===============',lastPage,str)
      // 存储个人信息
      wx.setStorage({
        key: "user",
        data: res
      });
      store.state.userinfo = res
      // console.log('res')
      // let results = await getUser();
      // console.log("result....sss", results);
      // 调用登陆接口获取trackId
      let result = await this.login({
        encryptedData: res.encryptedData,
        iv: res.iv
      });
      wx.setStorageSync( "trackId", result.result.trackId)
      wx.setStorageSync('loginResult',result.result)
      // 存储邀请码
      if (result.result.userInfo) {
        wx.setStorage({
          key: "inviteCode",
          data: result.result.userInfo.inviteCode
        });
        if(result.result.userInfo.userType==2){
          let tiem = new Date().getTime()
          if(tiem>=result.result.userInfo.expireDate){
            result.result.userInfo.userType=0
          }
        }
        console.log('登陆',result.result.userInfo)
        store.state.loginUserinfo = result.result.userInfo
        store.state.loginResult = result.result
      }
      console.log('登陆成功123',result)
      this.showDialog = false;
      if (!result.result.isBindPhone) {
        wx.reLaunch({ url: "/pages/phone/main" })
      } else if (!result.result.userInfo.parentId) {
        wx.reLaunch({ url: "/pages/referrer/main" })
      } else {
        this.$emit('loginFun')
        // wx.reLaunch({ url: store.state.isLoginUrl })
        // console.log('url======'+str)
        // wx.reLaunch({ url: str });
      }
    }
  }
};
</script>

<style scoped>
#loginBut,button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index:100;
}
#loginBut:after{
  display: none;
}
#loginBut:before{
  display: none;
}
</style>
