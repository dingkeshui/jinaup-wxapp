<template>
	<div>
		<img class="topimg" src="../img/rz.png">
		<div class="title">
			纳小店服务商申请条件
		</div>
		<div class="pad10 textMain mgb20">
			<div class="fs14 flex">
				<div>1.</div>
				<div>积纳平台下属团队会员数量100人以上的团队有权申请;</div>
			</div>
			<div class="fs14 flex">
				<div>2.</div>
				<div>积纳平台总监级别会员可直接申请纳小店服务商资格;</div>
			</div>
			<div class="fs14 flex">
				<div>3.</div>
				<div>省、地、市、县一级分销商、批发商可申请纳小店服务商资格，母婴、产品类或服务类经销者优先;</div>
			</div>
			<div class="fs14 flex">
				<div>4.</div>
				<div>微电商团队长，社群会员人数500人以上。</div>
			</div>
		</div>
		<div class="title mgb10">
			缴纳保证金
		</div>
		<div class="center textMain fs14 mgb20">
			<div>纳小店服务商缴纳<span class="bspan">39900元保证金</span></div>
			<!-- <div>(门店功能上线三个月内，<span class="bspan">前100名</span>纳小店服务商免费)</div> -->
		</div>
		<h3 class="center fa14">报名信息</h3>
		<div class="pad10">
			<div class="fs14 mgb10">
				<input :disabled="isRz" v-model="trueName" type="" class="inp" placeholder="填写姓名" name="">
			</div>
			<div class="fs14 mgb10">
				<input :disabled="isRz" v-model="phoneNumber" type="number" class="inp" placeholder="手机号" name="">
			</div>
			<div v-if="!isRz" class="fs14 codeBox flex mgb10">
				<input type="" v-model="code" class="inp" placeholder="验证码" name="">
				<div @click="getIdentify" class="flex1">{{cont}}</div>
			</div>
			<picker
				:disabled="isRz"
                mode="multiSelector"
                :range="multiArray"
                range-key="name"
                @change="bindMultiPickerChange"
                @columnchange="bindMultiPickerColumnChange"
                :value="multiIndex"
            >
				<div class="adressBox flex mgb10">
					<div class="pad10 flex flexcenter">
						<div :class="['flex1',{'on':obj1}]">{{obj1?obj1.name:'省'}}</div>
						<img class="imgIcon" src="/static/images/jt.png">
					</div>
					<div class="pad10 flex flexcenter">
						<div :class="['flex1',{'on':obj2}]">{{obj2?obj2.name:'市'}}</div>
						<img class="imgIcon" src="/static/images/jt.png">
					</div>
					<div class="pad10 flex flexcenter">
						<div :class="['flex1',{'on':obj3}]">{{obj3?obj3.name:'区'}}</div>
						<img class="imgIcon" src="/static/images/jt.png">
					</div>
				</div>
			</picker>
			<div class="fs14 mgb10">
				<textarea :disabled="isRz" class="textarea" maxlength="200" v-model="description" placeholder="优势介绍(200字以内)"></textarea>
			</div>
			<div v-if="!isRz" class="but" @click="addFun">提交</div>
		</div>
		<div v-if="showModel" class="modelBox flex flexcenter">
			<div class="model">
				<img class="mgb10" src="/static/images/jycg.jpg">
				<div>申请提交成功</div>
				<div class="mgb10">请耐心等待审核</div>
				<div @click="goHomeFun" class="goHome">返回首页</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import { chinaAdress2 } from '@/api/index'
import { serviceAdd,serviceGetCode,registrationDetail } from '@/pages/b/api/index'

export default {
	data(){
		return {
			identifyBtn:false,
			num:59,
			cont:'获取验证码',
			phoneNumber:'',
			multiArray:[],//中国地址
            multiIndex:[0,0,0],
            arr1:'',
            arr2:'',
            arr3:'',
            obj1:'',
            obj2:'',
            obj3:'',
            trueName:'',
            description:'',
            code:'',
            showModel:false,
            isRz:false
		}
	},
	async onLoad(){
		let adressChina = await chinaAdress2({pid:1})
        let adressChina2 = await chinaAdress2({pid:adressChina.data.result[0].id})
        let adressChina3 = await chinaAdress2({pid:adressChina2.data.result[0].id})
        adressChina2.data.result[0].htLocationVoList = adressChina3.data.result
        adressChina.data.result[0].htLocationVoList = adressChina2.data.result
        this.arr1 = adressChina.data.result
        this.arr2 = adressChina2.data.result
        this.arr3 = adressChina3.data.result
        let temp = adressChina.data.result
        this.multiArray = [this.arr1,this.arr2,this.arr3]
        this.multiIndex = [0,0,0]
        this.getInfo()
	},
	methods:{
		async getInfo(){
			let that = this
			let res = await registrationDetail()
			console.log('res',res)
			if (res.data.res_code==1) {
				this.isRz = true
				that.trueName = res.data.result.trueName
				that.phoneNumber = res.data.result.phoneNumber
				that.obj1 = {
					name:res.data.result.firstCategoryName
				}
				that.obj2 = {
					name:res.data.result.secondCategoryName
				}
				that.obj3 = {
					name:res.data.result.thirdCategoryName
				}
				that.description = res.data.result.description
			}
		},
		goHomeFun(){
			wx.reLaunch({
				url:'/pages/b/b_index/main'
			})
		},
		async addFun () {
			if(!this.trueName){
				wx.showToast({
		            title: "姓名不能为空",
		            icon: "none",
		            duration: 1000
		        })
		        return
			}
			if(!this.phoneNumber){
				wx.showToast({
		            title: "手机号不能为空",
		            icon: "none",
		            duration: 1000
		        })
		        return
			}
			if(!this.code){
				wx.showToast({
		            title: "验证码不能为空",
		            icon: "none",
		            duration: 1000
		        })
		        return
			}
			if(!this.obj1||!this.obj2||!this.obj3){
				wx.showToast({
		            title: "省市区不能为空",
		            icon: "none",
		            duration: 1000
		        })
		        return
			}
			let postData = {
				trueName:this.trueName,
				phoneNumber:this.phoneNumber,
				firstCategoryId:this.obj1.id,
				firstCategoryName:this.obj1.name,
				secondCategoryId:this.obj2.id,
				secondCategoryName:this.obj2.name,
				thirdCategoryId:this.obj3.id,
				thirdCategoryName:this.obj3.name,
				code:this.code,
				description:this.description
			}
			let res = await serviceAdd(postData)
			if(res.data.res_code==1){
				this.showModel = true
			}else{
				wx.showToast({
		            title: res.data.message?res.data.message:"申请失败",
		            icon: "none",
		            duration: 1000
		        })
			}
		},
		// 地址选择
        bindMultiPickerChange(e){
            console.log('地址改变',e)
            this.multiIndex=e.mp.detail.value
            this.obj1 = this.arr1[e.mp.detail.value[0]]
            this.obj2 = this.arr2[e.mp.detail.value[1]]
            this.obj3 = this.arr3[e.mp.detail.value[2]]
            console.log('obj',this.obj1,this.obj2,this.obj3)
        },
        async bindMultiPickerColumnChange(e){
            let that = this
            console.log('bindMultiPickerColumnChange',e)
            let data = {
                multiArray: this.multiArray,
                multiIndex: this.multiIndex
            }
            e.detail = e.mp.detail
            console.log('e',e)
            //更新滑动的第几列e.detail.column的数组下标值e.detail.value
            data.multiIndex[e.detail.column] = e.detail.value;
            console.log(1)
            //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
            if (e.detail.column == 0){
                data.multiIndex = [e.detail.value,0,0];
                let adressChina1 = await chinaAdress2({pid:that.arr1[data.multiIndex[0]].id})
                let adressChina2 = await chinaAdress2({pid:adressChina1.data.result[0].id})
                that.arr2 = adressChina1.data.result
                that.arr3 = adressChina2.data.result
            } else if (e.detail.column == 1){
                //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
                data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
                let adressChina1 = await chinaAdress2({pid:that.arr2[e.detail.value].id})
                that.arr3 = adressChina1.data.result
            console.log(3)
            } else if (e.detail.column == 2) {
                //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
                data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
            }
            this.multiArray = [this.arr1,this.arr2,this.arr3]
            this.multiIndex = data.multiIndex
            console.log('数据改变结束',that.multiArray)
        },
		//获取验证码
	    async getIdentify() {
	        console.log('点击了')
	        //判断手机号
	        let that = this;
	        if(this.identifyBtn){
	          return
	        }
	        if (this.phoneNumber == "") {
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
	              clearInterval(timer);
	              this.cont = "获取验证码";
	              that.identifyBtn = false;
	            }
	          }, 1000);
	          let result = await serviceGetCode({
	            phoneNumber: this.phoneNumber
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
	}
}
</script>

<style type="text/css">
.modelBox{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	z-index: 10;
	background-color: rgba(0,0,0,0.3);
}
.model{
	background-color: #fff;
	padding: 20px;
	border-radius: 5px;
	text-align: center;
	color: #323A45;
	font-size: 18px;
	width: 70%;
}
.model img{
	width: 60px;
	height: 60px;
}
.goHome{
	height: 40px;
	line-height: 40px;
	width: 80%;
	border-radius: 7px;
	background-color: rgba(93,154,252,1);
	color: #fff;
	margin: 10px auto;
}
.title{
	text-align: center;
	color: #5D9AFC;
}
.textMain{
	color: #484848;
}
.bspan{
	color: #484848;
	font-weight: bold;
}
.inp{
	height: 40px;
	background-color: #F6F6F6;
	padding: 10px;
	border-radius: 5px;
	box-sizing: border-box;
}
.codeBox{
	position: relative;
	background-color: #F6F6F6;
	border-radius: 5px;
}
.codeBox div{
	position: absolute;
	right: 10px;
	top: 0px;
	height: 40px;
	line-height: 20px;
	padding: 10px;
	box-sizing: border-box;
	color: #FC5D7B;
	z-index: 1;
}
.textarea{
	background-color: #F6F6F6;
	border-radius: 5px;
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
}
.but{
	text-align: center;
	height: 40px;
	line-height: 40px;
	background-color: #5D9AFC;
	color: #fff;
	border-radius: 5px;
}
.imgIcon{
	width: 15px;
	height: 15px;
	transform: rotate(90deg);
}
.adressBox>div{
	background-color: #F6F6F6;
	border-radius: 5px;
	height: 40px;
	line-height: 20px;
	padding: 10px;
	box-sizing: border-box;
	width: 32%;
	margin-right: 2%;
	color: #999DA2;
	font-size: 14px;
}
.adressBox>div:nth-child(3n){
	margin-right: 0px;
}
.adressBox .on{
	color: #484848;
}
.topimg{
	width: 100vw;
	height: 33.333vw;
	margin-bottom: 20px;
}
</style>