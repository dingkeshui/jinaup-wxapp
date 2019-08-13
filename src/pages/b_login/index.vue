<template>
<div class="box flex flexcenter">
	<span>加载中</span>
	<Login @loginSuc="loginSucFun" v-if="isShowLogin" />
</div>
</template>

<script type="text/javascript">
import Login from "../../components/user/login"; //组件

export default {
	data () {
		return {
			isShowLogin:false
		}
	},
	components:{
		Login
	},
	onLoad (e) {
		let that = this
		// wx.getLocation({
		//   type: 'wgs84',
		//   success(res) {
		//   	console.log('定位成功,',res,that.$store)
		//   	that.$store.commit('setLocation',res)
		//   	console.log('获取位置',res,that.$store.state.location)
		//     const latitude = res.latitude
		//     const longitude = res.longitude
		//     const speed = res.speed
		//     const accuracy = res.accuracy
		//     that.gopage()
		//   }
		// })
		that.gopage()
	},
	onShow () {
		if (this.$store.state.loginStep==0) {
	      this.isShowLogin = true
	    } else if(this.$store.state.loginStep==1) {
	      this.isShowLogin = false
	    } else if(this.$store.state.loginStep==2) {
	      this.$store.state.isLoginUrl = '/pages/b/b_login/main'
	      wx.reLaunch({ url: "/pages/phone/main" });
	    } else if(this.$store.state.loginStep==3) {
	      this.$store.state.isLoginUrl = '/pages/b/b_login/main'
	      wx.reLaunch({ url: "/pages/referrer/main" });
	    } else {
	      this.isShowLogin = false
	    }
	},
	methods:{
		// 登陆成功
	    loginSucFun () {
	      this.isShowLogin = false
	      console.log('登陆成功')
	    },
	    // 跳转到小B首页
	    gopage () {
	    	wx.reLaunch({
	    		url:'/pages/b/b_index/main'
	    	})
	    }
	}
}
</script>

<style type="text/css">

</style>
