<template>
	<div class="minBox bgf3">
		<div class="flex bgfff pad10 inputItem">
			<div class="inpuTitle mgr10 h30">手机号</div>
			<div class="flex1 inputBox h30">
				<input placeholder="手机号" v-model="iphoneNum" type="number">
			</div>
		</div>
		<div class="flex pad10 bgfff inputItem">
			<div class="inpuTitle mgr10 h30">验证码</div>
			<div class="flex1 inputBox h30">
				<input placeholder="验证码" v-model="codeNum" type="number" >
			</div>
			<!-- <div class="inputFoot h30"> -->
			<span @click="getCode" :class="['yzm','fs16','h30']">{{cont}}</span>
			<!-- </div> -->
		</div>
		<div class="but" @click="bindNumberFun">
			验证后绑定新手机
		</div>
	</div>
</template>

<script type="text/javascript">
import { sendCode,bindNumber,changeShopPhone } from '@/pages/b/api/index'

export default {
	data () {
		return {
			iphoneNum:'',
			bindNumber:'', // 验证的手机
			codeNum:'',
			cont:'获取验证码',
			num:60,
			identifyBtn:false,
			type:'',  // a店铺认证手机号，b店铺客服手机号
			id:''
		}
	},
	onLoad(e){
		console.log('改变手机号',e)
		this.type = e.type
		this.id = e.id
	},
	methods:{
		async bindNumberFun(){
			let that = this
			if (this.iphoneNum == "") {
	          wx.showToast({
	            title: "手机号不能为空",
	            icon: "none",
	            duration: 1000
	          });
	          return false;
	        }
	        if (this.iphoneNum.length!=11) {
	          wx.showToast({
	            title: "请输入正确手机号",
	            icon: "none",
	            duration: 1000
	          });
	          return false;
	        }
	        if (this.codeNum == "") {
	          wx.showToast({
	            title: "请输入验证码",
	            icon: "none",
	            duration: 2000
	          });
	          return false;
	        }
	        if (this.type=='a'||this.type=='b') {
		        wx.showLoading({
				  title: '验证中',
				})
		        let res = await bindNumber({phoneNumber:this.iphoneNum,verificationCode:this.codeNum})
		        wx.hideLoading()
		        if(res.data.res_code==1){
		        	wx.showToast({
			            title: res.data.message?res.data.message:"验证成功",
			            icon: "none",
			            duration: 2000
			        })
			        wx.setStorage({
					  key: 'bindNumber',
					  data: {
					  	type:that.type,
					  	num:that.iphoneNum
					  },
					  success(res) {
					    wx.navigateBack({
							delta:1
						})
					  }
					})
		        } else {
		        	wx.showToast({
			            title: res.data.message?res.data.message:"验证失败",
			            icon: "none",
			            duration: 2000
			        })
		        }
	        } else if (this.type=='c'||this.type=='d') {
	        	wx.showLoading({
				  title: '修改中',
				})
		        let res = await changeShopPhone({phoneNumber:this.iphoneNum,verificationCode:this.codeNum,
		        	type:this.type=='c'?1:2,id:this.id})
		        wx.hideLoading()
		        if(res.data.res_code==1){
		        	wx.showToast({
			            title: res.data.message?res.data.message:"修改成功",
			            icon: "none",
			            duration: 2000
			        })
			        wx.navigateBack({
						delta:1
					})
		        } else {
		        	wx.showToast({
			            title: res.data.message?res.data.message:"修改失败",
			            icon: "none",
			            duration: 2000
			        })
		        }
	        }
		},
		async getCode () {
			let that = this
			console.log('yz',this.iphoneNum,this.codeNum)
			if(this.identifyBtn){
				return
			}
			if (this.iphoneNum == "") {
	          wx.showToast({
	            title: "手机号不能为空",
	            icon: "none",
	            duration: 1000
	          });
	          return false;
	        }
	        if (this.iphoneNum.length!=11) {
	          wx.showToast({
	            title: "请输入正确手机号",
	            icon: "none",
	            duration: 1000
	          });
	          return false;
	        }
	        this.identifyBtn = true
	        let res = await sendCode({phoneNumber:this.iphoneNum})
	        console.log('res',res)
	        if(res.data.res_code==1){
	        	let timer = setInterval(() => {
	        		console.log('111')
	              that.cont = that.num-- + "s重新发送";
	              if (this.num < 0) {
	                clearInterval(timer);
	                this.cont = "获取验证码";
	                that.num = 60
	                this.identifyBtn = false;
	              }
	            }, 1000);
	        } else {
	        	wx.showToast({
		            title: res.data.message?res.data.message:"请输入正确手机号",
		            icon: "none",
		            duration: 2000
		          });
	        	this.identifyBtn = false
	        }
		}
	}
}
</script>

<style type="text/css">
.yzm{
	border:1px solid #FC5D7B;
	color: #FC5D7B;
	border-radius: 10px;
	padding: 0px 10px;
}
.but{
	width: 80%;
	margin: 20px auto;
	text-align: center;
	color: #fff;
	height: 50px;
	line-height: 50px;
	font-size: 16px;
	background: #5D9AFC;
	border-radius: 10px;
}
</style>
