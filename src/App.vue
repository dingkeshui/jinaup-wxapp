<script>
import { getUser,appInt } from "@/api/index"
import { getQueryString } from '@/utils/index'
export default {
	async onLaunch(e){
    console.log('onLaunch')
    let that = this
    let res = await appInt()
    wx.getSystemInfo({
      success (res) {
        if(res.model.indexOf('iPhone X')>-1){
          console.log('ok')
          that.$store.state.iPhoneX = true
        }
      }
    })
    if(res.data.res_code==1){
      if(res.data.result.maxDistance){
        that.$store.state.maxDistance = res.data.result.maxDistance
      } else {
        that.$store.state.maxDistance = 20
      }
      if(res.data.result.appletsReviewVersion==that.$store.state.appIndex){
        that.$store.state.requsetUrl = res.data.result.appletsReviewDomain+'/'
        that.$store.state.showB = false
      } else {
      }
    }else{

    }
    console.log('store',that.$store.state)
    this.getUrl(e,'launch')
  },
  onShow(e){
    console.log('app onShow',e)
    this.getUrl(e,'show')
    this.getUpdate()
  },
  methods:{
    async getUrl(e,type){
      // 获取进入小程序的url链接
      let haveCode = false
      let that = this
      let str = e.path
      if (str[0]=='/') {

      } else {
        str = '/'+str
      }
      let str2 = '?'
      for(let i in e.query){
        if(i=='q'){
          console.log('app普通扫码进入的二维码哈哈')
          let getStr = getQueryString(decodeURIComponent(e.query.q))
          console.log('getStr==',getStr)
          for(let k in getStr){
            if(k == 'fromInviteCode'){
              console.log('app别人分享的普通二维码有邀请码')
              wx.setStorageSync('fromInviteCode',getStr.fromInviteCode)
              this.$store.state.fromInviteCode = getStr.fromInviteCode
              haveCode = true
            }
            if(k == 'rid'){
              wx.setStorageSync('rid',getStr.rid)
            }
            if (str2[str2.length-1]=='?') {
              str2 += k+'='+getStr[k]
            } else {
              str2 += '&'+k+'='+getStr[k]
            }
          }
        } else {
          if (i == 'fromInviteCode') {
            console.log('app别人分享的小程序')
            wx.setStorage('fromInviteCode',e.query.fromInviteCode)
            this.$store.state.fromInviteCode = e.query.fromInviteCode
            haveCode = true
          }
          if(i=='rid'){
             wx.setStorage('rid',e.query.rid)
          }
          if (str2[str2.length-1]=='?') {
            str2 += i+'='+e.query[i]
          } else {
            str2 += '&'+i+'='+e.query[i]
          }
        }
      }
      if(haveCode){
        if( str2!='?'){
          wx.setStorage({key:'isLoginUrl',data:str + str2})
          this.$store.state.isLoginUrl = str + str2
        } else {
          wx.setStorage({key:'isLoginUrl',data:str})
          this.$store.state.isLoginUrl = str
        }
      }
      let trackId = wx.getStorageSync('trackId')
      let loginResult = wx.getStorageSync('loginResult')
      console.log('loginResult1',loginResult)
      if(!loginResult){
        // wx.reLaunch({url:'/pages/login/main'})
        return
      }
      if(loginResult.wxOauthJson&&!loginResult.userInfo){
          wx.reLaunch({ url: "/pages/phone/main" })
          return
      }
      if(!loginResult.wxOauthJson&&!loginResult.userInfo){
          wx.removeStorageSync('loginResult')
          return
      }
      if (trackId) {
        console.log('app已经登陆')
        if (type == "launch"||!loginResult.userInfo) {
          console.log('app获取用户信息')
          let res = await getUser()
          console.log('app获取的用户信息',res)
          if(res.data.res_code==1){
            if(!res.data.result.phoneNumber){
              loginResult.isBindPhone = 0
            }
            if(res.data.result.userType==2){
              let time = new Date().getTime()
              if(time>=res.data.result.expireDate){
                res.data.result.userType = 0
              }
            }
            loginResult.userInfo = res.data.result
            wx.setStorage({key:'loginResult',data:loginResult})
          } else {
            if (res.data.res_code==5001) {
                // wx.reLaunch({url:'/pages/login/main'})
            }
          }
        }
        if(loginResult.isBindPhone!=1){
          console.log('未绑定手机号')
          wx.reLaunch({ url: "/pages/phone/main" })
          return
        }
        if(!loginResult.userInfo.parentId){
          console.log('未填写推荐人')
          wx.reLaunch({ url: "/pages/referrer/main" })
          return
        }
      } else {
        console.log('app未登陆')
        // wx.reLaunch({url:'/pages/login/main'})
      }
    },
    getUpdate(){
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
      })
    }
  }
}
</script>

<style>
page{
  width: 100%;
  height: 100%;
}

button{
  padding: 0;
  margin: 0;
}
.container {
  height: 100%;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
