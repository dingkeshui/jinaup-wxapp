<template>
	<div class="box">
		<button open-type="getUserInfo"  @getuserinfo="e=>getUserInfo(e.target)"></button>
      <!-- <img class="bgImg" mode="aspectFill" src="/static/images/bgImg.png"> -->
	    <img class="bgImg" mode="aspectFill" src="./img/bgImg.png">
	    <div class="loginBut">点击登录</div>
	</div>
</template>

<script type="text/javascript">
import { getAuth, getCode } from "@/utils/index";
import { mapActions, mapMutations } from "vuex";
import { getUser } from "@/api/index";
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
              console.log('获取用户信息前')     
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
      // 存储个人信息
      wx.setStorage({
        key: "user",
        data: res
      });
      store.state.userinfo = res
      // 调用登陆接口获取trackId
      let result = await this.login({
        encryptedData: res.encryptedData,
        iv: res.iv
      });
      wx.setStorage({
        key: "trackId",
        data: result.result.trackId
      });
      wx.setStorage({key:'loginResult',data:result.result})
      // 存储邀请码
      if (result.result.userInfo) {
        wx.setStorage({
          key: "inviteCode",
          data: result.result.userInfo.inviteCode
        });
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
        // let str = '/pages/go2detail/main?pid=50759&scancode_time=1560405980'
        console.log(' store.state.isLoginUrl===', store.state.isLoginUrl)
        wx.reLaunch({ url: store.state.isLoginUrl })
        // wx.reLaunch({ url: str })
      }
    }
  }
}
	
</script>

<style type="text/css" scoped>
button {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index:100;
}
</style>