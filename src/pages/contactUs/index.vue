<template>
	<web-view src="https://h5.jinaup.com/business_contact/index.html" binderror="binderrorFun"></web-view>
</template>

<script type="text/javascript">
export default {
	data () {
		return {

		}
	},
	methods:{
		binderrorFun(){
			wx.showToast({
			  title: '加载失败,请重试',
			  icon: 'none',
			  duration: 2000
			})
		}
	}
}	
</script>