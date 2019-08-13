<template>
	<web-view :src="str" binderror="binderrorFun"></web-view>
	<!-- <div>
		<button type="primary" open-type="contact">下载APP</button>
	</div> -->
</template>

<script type="text/javascript">
export default {
	data () {
		return {
			str:'https://h5.jinaup.com/download/h2.html'
		}
	},
	onLoad(e){
		if (e.id) {
			this.str += '?id='+e.id
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