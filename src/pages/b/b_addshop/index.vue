<template>
	<div class="minbox bg padb50">
		<div class="top">
			店铺认证
		</div>
		<div v-if="auditState" class="typebox pad10">
			<div v-if="auditState==1">
				<span class="mgr10">审核状态:</span>
				<span>审核中</span>
			</div>
			<div v-if="auditState==2">
				<span class="mgr10">审核状态:</span>
				<span>审核通过</span>
			</div>
			<div v-if="auditState==3">
				<span class="mgr10">拒绝原因:</span>
				<span>{{auditExplain}}</span>
			</div>
		</div>
		<div class="bgfff mgb10">
			<div class="flex pad10 inputItem">
				<div class="inpuTitle mgr10">店铺头像</div>
				<div class="flex1 inputBox">
				</div>
				<div class="inputFoot flex flexvcenter" @click="chooseImg('e')">
					<img class="headimg mgr5" :src="headImg">
					<span>></span>
				</div>
			</div>
			<div class="flex pad10 inputItem">
				<div class="inpuTitle mgr10">小店昵称</div>
				<div class="flex1 inputBox">
					<input placeholder="请输入小店昵称" maxlength="20" v-model="storeName" @blur="handleStoreName">
				</div>
			</div>
			<div class="flex pad10 inputItem">
				<div class="inpuTitle mgr10">真实姓名</div>
				<div class="flex1 inputBox">
					<input placeholder="请输入您的真实姓名" v-model="realName" @blur="handleRealName">
				</div>
			</div>
			<div class="flex pad10 inputItem" @click="changNumber('a')">
				<div class="inpuTitle mgr10">手机号</div>
				<div class="flex1 inputBox">
					<span>{{phone}}</span>
				</div>
				<div class="inputFoot">
					<span class="mgr5">去更改</span>
					<span>></span>
				</div>
			</div>
			<div class="flex pad10 inputItem">
				<div class="inpuTitle mgr10">身份证号</div>
				<div class="flex1 inputBox">
					<input placeholder="请输入身份证号" v-model="idCard" @blur.stop="handleIdCard">
				</div>
			</div>
			<div class="flex pad10 inputItem" @click="changNumber('b')">
				<div class="inpuTitle mgr10">客服电话</div>
				<div class="flex1 inputBox">
					<span>{{servicePhone}}</span>
				</div>
				<div class="inputFoot">
					<span class="mgr5">去更改</span>
					<span>></span>
				</div>
			</div>
			<div class="flex pad10 inputItem" @click="changeItem">
				<div class="inpuTitle mgr10">经营项目</div>
				<div class="flex1 inputBox line1">
					<template v-if="onGetShopItemTypeListData.length">
						<span v-for="(item,index) in onGetShopItemTypeListData" :key="index">{{item.cname}}{{index==onGetShopItemTypeListData.length-1?'':'/'}}
						</span>
					</template>
					<span v-else>请选择经营项目</span>
				</div>
				<div class="inputFoot">
					<span class="mgr5">去更改</span>
					<span>></span>
				</div>
			</div>
			<div class="flex pad10 inputItem" @click="chooserAdressMap">
				<div class="inpuTitle mgr10">所在地区</div>
				<div class="flex1 inputBox">
					<span v-if="mapAdress">{{mapAdress.address}}</span>
					<span v-else>请选择您的店铺地址</span>
				</div>
				<div class="inputFoot">
					<span class="mgr5">去更改</span>
					<span>></span>
				</div>
			</div>
			<div class="flex pad10 inputItem">
				<div class="inpuTitle mgr10">详细地址</div>
				<div class="flex1 inputBox">
					<input placeholder="请输入您的详细地址" v-model="storeAddressDetail" @blur="handleDetailAddr">
				</div>
			</div>
			<div class="flex pad10 inputItem">
				<div class="inpuTitle mgr10">统一社会信用代码</div>
				<div class="flex1 inputBox">
					<input placeholder="请输入统一社会信用代码" v-model="unifiedSocialCreditCode" @blur.stop="creditCode">
				</div>
			</div>
		</div>
		<div class="bgfff mgb10">
			<div class="pad10">
				<span class="titleSpan mgr10">上传身份证照片</span>
				<span class="titleSpan2">(图片png,jpg格式,大小不超过2M)</span>
			</div>
			<div class="flex">
				<div class="pad10 imgItemBox" @click="chooseImg('a')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/idimgb.png" />
						<img class="showimg" v-if="idimga" mode="aspectFill" :src="idimga" />
					</div>
				</div>
				<div class="pad10 rel imgItemBox" @click="chooseImg('b')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/idimga.png" />
						<img class="showimg" v-if="idimgb" mode="aspectFill" :src="idimgb" />
					</div>
				</div>
			</div>
		</div>
		<div class="bgfff mgb10">
			<div class="pad10">
				<span class="titleSpan mgr10">上传营业执照，门脸照</span>
			</div>
			<div class="flex">
				<div class="pad10 imgItemBox" @click="chooseImg('c')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/rz_img_2.png" />
						<img class="showimg" v-if="idimgc" mode="aspectFill" :src="idimgc" />
					</div>
				</div>
				<div class="pad10 rel imgItemBox" @click="chooseImg('d')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/rz_img_1.png" />
						<img class="showimg" v-if="idimgd" mode="aspectFill" :src="idimgd" />
					</div>
				</div>
			</div>
		</div>
		<div class="bgfff mgb10">
			<div class="pad10">
				<span class="titleSpan mgr10">上传资质证明</span>
				<span class="titleSpan2">(资质证明最多上传四个)</span>
			</div>
			<div class="flex">
				<div class="pad10 imgItemBox" @click="chooseImg('1')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/rz_img_3.png" />
						<img class="showimg" v-if="imgarr['0']" mode="aspectFill" :src="imgarr['0']" />
					</div>
				</div>
				<div class="pad10 rel imgItemBox" @click="chooseImg('2')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/rz_img_3.png" />
						<img class="showimg" v-if="imgarr['1']" mode="aspectFill" :src="imgarr['1']" />
					</div>
				</div>
			</div>
			<div class="flex">
				<div class="pad10 rel imgItemBox" @click="chooseImg('3')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/rz_img_3.png" />
						<img class="showimg" v-if="imgarr['2']" mode="aspectFill" :src="imgarr['2']" />
					</div>
				</div>
				<div class="pad10 rel imgItemBox" @click="chooseImg('4')">
					<div class="rel">
						<img mode="widthFix" src="/static/images/rz_img_3.png" />
						<img class="showimg" v-if="imgarr['3']" mode="aspectFill" :src="imgarr['3']" />
					</div>
				</div>
			</div>
		</div>
		<!-- <div class="add" @click="add" v-if="auditState!=1&&auditState!=2" >
			提交
		</div> -->
		<div class="add" v-if="auditState!=2" @click="add" >
			提交
		</div>
		<!-- 经营项目 -->
		<div v-if="showItem" @click="closeShowItem" class="pro">
			<div class="proBox bgfff">
				<div class="rel fs14 pad10">
					<span>经营项目</span>
					<span @click.stop="closeShowItem" class="closeSpan">X</span>
				</div>
				<scroll-view @click.stop scroll-y="true" class="proBoxMain">
					<div class="proBoxMainItem"><span class="ontitle">请选择</span></div>
					<div
					v-for="(item,index) in getShopItemTypeListData"
					:key="index"
					:class="['proBoxMainItem','flex','flexvcenter',{'on':item.state==1}]"
					@click="chooseItemType(item,index)">
						<span class="flex1">{{item.cname}}</span>
						<img v-if="item.state==1" style="width:14px;height:9px;" src="/static/images/right.png">
					</div>
				</scroll-view>
				<div @click.stop="sureShowItem" class="addProBut">
					确定
				</div>
			</div>
		</div>
		<!-- 认证协议 -->
		<div v-if="showModel" class="modelBox flex flexcenter" catchtouchmove="ture">
			<div class="modelMian flex2">
				<!-- <div class="pad10">
					<h2 class="center">纳小店技术服务协议</h2>
				</div> -->
				<img class="closeImg" @click="backPage" src="/static/images/close.png">
				<div class="flex1 pad10">
					<scroll-view @scrolltolower="bindscrolltolowerFun" lower-threshold="100" style="height:50vh;" scroll-y><rich-text :nodes="htmlString"></rich-text></scroll-view>
				</div>
				<div class="">
					<div @click='sureModel' :class="['modelBut',{'on':isbindscrolltolower}]">同意</div>
					<div>- 请下拉阅读全文 -</div>
				</div>
			</div>
		</div>
		<!-- 下载App模态框 -->
	    <div v-if="showModel2" class="model flex flexcenter" catchtouchmove="ture">
	      <div class="modelmain">
	        <img class="img3" src="/static/images/close.png" @click="showModel2 = false">
	        <img class="img2 mgb10" src="/static/images/jina.png">
	        <div class="text">店铺认证提交成功</div>
	        <div class="text">请在客服对话回复“1”</div>
	        <div class="text mgb10">下载APP</div>
	        <div class="butBox">
	          <button class="but" open-type="contact"></button>
	          打开客服会话
	        </div>
	      </div>
	    </div>
	</div>
</template>

<script type="text/javascript">
import { getShopItemTypeList,addShop,getShopInfo,changeShopInfo,bShopAddPprotocol } from '@/pages/b/api/index'

var amapFile = require('@/utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
export default {
	data () {
		return {
			myAmapFun:'', // 高德地图对象
			id:'', // 店铺id
			headImg:'/static/images/jina.png',
			headImg64:'',
			idimga:'',//身份证正面
			idimga64:'',
			idimgb:'',//身份证背面
			idimgb64:'',
			idimgc:'',//营业执照
			idimgc64:'',
			idimgd:'',//门脸照
			idimgd64:'',
			imgarr:[],
			imgarr64:[],
			showItem:false,
			mapAdress:'', //地图选择的位置
			storeAddressDetail:'', // 详细地址
			storeName:'', //小店昵称
			realName:'', // 真实姓名
			idCard:'', //身份证号码
			getShopItemTypeListData:'', // 经营项目列表
			onGetShopItemTypeListData:[], //选中的经营项目列表
			loginUserinfo:'',
			servicePhone:'',  // 客服电话
			phone:'',
			auditState:'', // 审核状态
			auditExplain:'', // 拒绝原因
			adcode:'',
			citycode:'',
			unifiedSocialCreditCode: '',// 统一社会信用代码
			showModel:false,
			isbindscrolltolower:false, // 服务协议到底
			htmlString:'',
			showModel2:false
 		}
	},
	onLoad(){
		console.log('店铺认证',this.$store.state.showB)
		let that = this
		this.imgarr = []
		this.myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
		this.loginUserinfo = wx.getStorageSync('loginResult').userInfo
		this.phone = this.loginUserinfo.phoneNumber
		this.servicePhone = this.loginUserinfo.phoneNumber
		this.getShopInfoFun()
		this.showModel = false
		this.isbindscrolltolower = false
	},
	onShow(){
		console.log('添加商品show')
		let that = this
		wx.getStorage({
		  key: 'bindNumber',
		  success(res) {
		  	console.log('bindNumber',res.data)
		  	if (res.data.type=='a') {
		  		that.phone = res.data.num
		  	} else {
		  		that.servicePhone = res.data.num
		  	}
		  	wx.removeStorage({
			  key: 'bindNumber',
			  success(res) {
			    console.log(res)
			  }
			})
		  }
		})
	},
	methods:{
		backPage(){
			console.log('返回')
			wx.navigateBack({
				delta:1
			})
		},
		// 获取认证服务
		async getBShopService(){
			let res = await bShopAddPprotocol()
			if(res.data.res_code==1){
				console.log('协议获取',res)
				this.htmlString = res.data.result
				this.showModel = true
			}
		},
		// 同意服务
		sureModel(){
			if(this.isbindscrolltolower){
				this.showModel = false
			}
		},
		// 服务协议
		bindscrolltolowerFun(){
			console.log('到底啦')
			this.isbindscrolltolower = true
		},
		// 获取认证信息
		async getShopInfoFun(){
			let res = await getShopInfo()
			console.log('res2',res)
			if (res.data.res_code==1) {
				if(res.data.result){
					this.unifiedSocialCreditCode = res.data.result.unifiedSocialCreditCode
					this.id = res.data.result.id
					this.idimga = res.data.result.idImgPositive
					if(res.data.result.idImgPositive){
						this.headImg = res.data.result.headIco
					}
					this.idimgb = res.data.result.idImgOpposite
					this.idimgc = res.data.result.businessLicensePhoto
					this.storeName = res.data.result.storeName
					this.realName = res.data.result.realName
					this.phone = res.data.result.phone
					this.idCard = res.data.result.idCard
					this.servicePhone = res.data.result.servicePhone
					this.citycode = res.data.result.citycode
					this.adcode = res.data.result.adcode
					this.storeAddressDetail = res.data.result.storeAddressDetail
					this.mapAdress = {
						address:res.data.result.storeRegion,
						longitude:res.data.result.longitude,
						latitude:res.data.result.latitude
					}
					this.idimgd = res.data.result.storePhoto?res.data.result.storePhoto:''
					if(res.data.result.qualificationPhoto1){
						this.imgarr.push(res.data.result.qualificationPhoto1)
					}
					if(res.data.result.qualificationPhoto2){
						this.imgarr.push(res.data.result.qualificationPhoto2)
					}
					if(res.data.result.qualificationPhoto3){
						this.imgarr.push(res.data.result.qualificationPhoto3)
					}
					if(res.data.result.qualificationPhoto4){
						this.imgarr.push(res.data.result.qualificationPhoto4)
					}
					this.auditState = res.data.result.auditState
					this.auditExplain = res.data.result.auditExplain
				}
			} else {
				this.getBShopService()
				// wx.showToast({
				// 	title:res.data.message?res.data.message:'获取失败',
				// 	icon:'none',
				// 	duration:2000
				// })
			}
			this.getShopItemTypeList()
		},
		// 确定选择经营项目
		sureShowItem(){
			if(this.getShopItemTypeListData){
				this.onGetShopItemTypeListData = []
				this.getShopItemTypeListData.map(val=>{
					if(val.state==1){
						this.onGetShopItemTypeListData.push(val)
					}
				})
			}
			this.closeShowItem()
			console.log('onGetShopItemTypeListData',this.onGetShopItemTypeListData)
		},
		// 选择一个经营项目列表
		chooseItemType(item,index){
			let num = 0
			if(!item.state){
				this.getShopItemTypeListData.map(val=>{
					if(val.state==1){
						num++
					}
				})
				if(num>=5){
					wx.showToast({
						title:'经营项目最多五个',
						icon:'none',
						duration:2000
					})
					return
				}
			}
			this.$set(this.getShopItemTypeListData[index],'state',item.state==1?0:1)
			console.log('this.getShopItemTypeListData',this.getShopItemTypeListData)
		},
		async getShopItemTypeList(){
			let res = await getShopItemTypeList({id:this.id?this.id:0})
			console.log('res',res)
			if(res.data.res_code==1){
				this.getShopItemTypeListData = res.data.result
				if(this.getShopItemTypeListData){
					this.onGetShopItemTypeListData = []
					this.getShopItemTypeListData.map(val=>{
						if(val.state==1){
							this.onGetShopItemTypeListData.push(val)
						}
					})
				}
			} else {
				wx.showToast({
					title:res.data.message?res.data.message:'项目列表获取失败',
					icon:'none',
					duration:2000
				})
			}
		},
		chooserAdressMap(){
			let that = this
			console.log('选择位置')
			wx.chooseLocation({
				success:(res)=>{
					console.log('成',res)
					that.mapAdress = res
					that.myAmapFun.getRegeo({
					  location:res.longitude+','+res.latitude,
				      success: function(data){
				        //成功回调
				        console.log('高德经纬度',data)
				       	that.adcode = data[0].regeocodeData.addressComponent.adcode
				       	that.citycode = data[0].regeocodeData.addressComponent.citycode
				      },
				      fail: function(info){
				        //失败回调
				        console.log(info)
				      }
				    })
				}
			})
		},
		// // 小店昵称
		// handleStoreName () {
		// 	// this.storeName
		// 	let reg =/^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/
		// 	let res = this.storeName.trim().match(reg)
		// 	console.log('小店昵称',res)
		// 	if (!res) {
		// 		return wx.showToast({
		// 			title: '昵称为20字符以内且不包含特殊字符',
		// 			icon: 'none'
		// 		})
		// 	}
		// },
		// // 真实姓名字符判断
		// handleRealName () {
		// 	// this.realName
		// 	let reg =/^[\u4E00-\u9FA5A-Za-z]{1,20}$/
		// 	let res = this.realName.trim().match(reg)
		// 	console.log('真实姓名字',res)
		// 	 if (!res) {
		// 		return wx.showToast({
		// 			title: '姓名为20字符以内中文、英文',
		// 			icon: 'none'
		// 		})
		// 	}
		// },
		// 详细地址
		// handleDetailAddr () {
		// 	// this.storeAddressDetail
		// 	if (!(this.storeAddressDetail.trim().length)) {
		// 		return wx.showToast({
		// 			title: '详细地址不能为空',
		// 			icon: 'none'
		// 		})
		// 	}
		// },
		// // 身份证格式判断
		// handleIdCard () {
		// 	let reg =/^\d{15}|\d{18}$/
		// 	let res = this.idCard.match(reg)
		// 	console.log('身份证格式判断',res)
		// 	if (!res) {
		// 		return wx.showToast({
		// 			title: '身份证格式不正确',
		// 			icon: 'none'
		// 		})
		// 	}
		// },
		// 统一社会信用代码格式判断
		creditCode () {
			// let reg =/[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g
			// let res = this.unifiedSocialCreditCode.match(reg)
			let res = this.unifiedSocialCreditCode.length <= 18
			console.log('统一社会信用代码格式判断',res)
			if (!res) {
				wx.showToast({
					title: '统一社会信用代码格式不正确',
					icon: 'none'
				})
				return
			}
		},
		// 修改经营项目
		changeItem(){
			console.log('经营项目')
			this.showItem = true
		},
		chooseImg(item){
			let that = this
			wx.chooseImage({
			  count: 1,
			  sizeType: ['compressed'],
			  sourceType: ['album', 'camera'],
			  success(res) {
			  	console.log('图片流',res)
			  	if(res.tempFiles[0].size>1024*1024*2){
			  		wx.showToast({
						title: '图片不得大于2M',
						icon: 'none'
					})
					return
			  	}
			  	switch(item){
			  		case 'a':
			  			that.idimga = res.tempFilePaths
			  			that.idimga64 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
			  		break;
			  		case 'b':
			  			that.idimgb = res.tempFilePaths
			  			that.idimgb64 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
			  		break;
			  		case 'c':
			  			that.idimgc = res.tempFilePaths
			  			that.idimgc64 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
			  		break;
			  		case 'd':
			  			that.idimgd = res.tempFilePaths
			  			that.idimgd64 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
			  		break;
			  		case 'e':
			  			that.headImg = res.tempFilePaths
			  			that.headImg64 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
			  		break;
			  		default:
			  		if (item>that.imgarr.length) {
			  			that.imgarr.push(res.tempFilePaths[0])
			  		} else {
			  			that.$set(that.imgarr,item-1,res.tempFilePaths[0])
			  		}
			  		if (item>that.imgarr64.length) {
			  			that.imgarr64.push(res.tempFilePaths[0])
			  		} else {
			  			that.$set(that.imgarr64,item-1,res.tempFilePaths[0])
			  		}
			  		console.log('imgarr',that.imgarr)
			  	}
			  }
			})
		},
		changNumber (item) {
			console.log('改变手机',item)
			wx.navigateTo({
			  url: '/pages/b/b_iphone/main?type='+item
			})
		},
		closeShowItem(){
			this.showItem = false
		},
		goMap(){
			wx.navigateTo({
			  url: '/pages/b/b_map/main'
			})
		},
		async add () {
			console.log('提交审核')
			let that = this
			if (!this.storeName.trim().length) {
				wx.showToast({
					title:'小店昵称不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.realName.trim().length) {
				wx.showToast({
					title:'真实姓名不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.idCard.trim().length ) {
				wx.showToast({
					title:'身份证号不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.unifiedSocialCreditCode ) {
				wx.showToast({
					title:'统一社会信用代码不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.onGetShopItemTypeListData||!this.onGetShopItemTypeListData.length ) {
				wx.showToast({
					title:'经营项目不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.storeAddressDetail ) {
				wx.showToast({
					title:'详细地址不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.mapAdress ) {
				wx.showToast({
					title:'地址不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.idimga||!this.idimgb) {
				wx.showToast({
					title:'身份证不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.idimgc) {
				wx.showToast({
					title:'营业执照不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.citycode) {
				wx.showToast({
					title:'城市定位不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			if (!this.adcode) {
				wx.showToast({
					title:'地址定位不能为空',
					icon:'none',
					duration:2000
				})
				return
			}
			console.log(111)
			let formData = {}
			console.log(222)
			let microBusinessItems = []
			console.log(2220)
			this.onGetShopItemTypeListData.map(val=>{
				microBusinessItems.push(val.cid)
			})
			console.log(2221)
			microBusinessItems = JSON.stringify(microBusinessItems)
			formData.microBusinessItems = microBusinessItems
			if(this.idimga64){
				formData.idImgPositive = this.idimga64
			}
			console.log(333)
			if(this.idimgb64){
				formData.idImgOpposite = this.idimgb64
			}
			console.log(444)
			if(this.idimgc64){
				formData.businessLicensePhoto = this.idimgc64
			}
			console.log(555)
			formData.storeName = this.storeName
			console.log(666)
			formData.uid = this.loginUserinfo.uid
			console.log(777)
			formData.realName = this.realName
			console.log(888)
			formData.phone = this.phone
			console.log(999)
			formData.idCard = this.idCard
			formData.unifiedSocialCreditCode = this.unifiedSocialCreditCode
			console.log(112)
			formData.servicePhone=this.servicePhone
			console.log(113)
			formData.storeRegion=this.mapAdress.address
			console.log(114)
			formData.storeAddressDetail=this.storeAddressDetail
			console.log(115)
			formData.longitude=this.mapAdress.longitude
			console.log(116)
			formData.latitude=this.mapAdress.latitude
			console.log(117)
			formData.citycode = this.citycode
			formData.adcode = this.adcode
			if(this.idimgd64){
				formData.storePhoto = this.idimgd64
			}
			if(this.headImg64){
				formData.headIco = this.headImg64
			}
			if(this.imgarr64&&this.imgarr64.length){
				this.imgarr64.map((val,index)=>{
					if (index==0) {
						formData.qualificationPhoto1 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(val, "base64")
					}
					if (index==1) {
						formData.qualificationPhoto2 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(val, "base64")
					}
					if (index==2) {
						formData.qualificationPhoto3 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(val, "base64")
					}
					if (index==3) {
						formData.qualificationPhoto4 = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(val, "base64")
					}
				})
			}
			wx.showLoading({
			  title: '提交中',
			  mask:true
			})
			if(this.id){
				let result = await changeShopInfo(formData)
				wx.hideLoading()
				console.log('修改',result)
				if(result.data.res_code==1){
					// wx.showToast({
					// 	title:'申请成功',
					// 	icon:'none',
					// 	duration:2000
					// })
					this.getShopInfoFun()
					let loginResult = wx.getStorageSync('loginResult')
					loginResult.addShop = result.data.result
					wx.setStorage({
		      		  key: "loginResult",
		      		  data: loginResult
		      		})
		      		console.log('10001',)
		      		that.showModel2 = true
				}else{
					wx.showToast({
						title:result.data.message?result.data.message:'申请失败',
						icon:'none',
						duration:2000
					})
				}
			}else{
				console.log('添加店铺')
				let result = await addShop(formData)
				wx.hideLoading()
				console.log('result',result)
				if(result.data.res_code==1){
					let loginResult = wx.getStorageSync('loginResult')
					loginResult.addShop = result.data.result
					wx.setStorage({
		      		  key: "loginResult",
		      		  data: loginResult
		      		})
		      		that.showModel2 = true
					// wx.showToast({
					// 	title:'申请成功',
					// 	icon:'none',
					// 	duration:2000
					// })
					// wx.navigateBack({
					// 	delta: 1
					// })
				}else{
					wx.showToast({
						title:result.data.message?result.data.message:'申请失败',
						icon:'none',
						duration:2000
					})
				}
			}
		}
	}
}
</script>

<style type="text/css" scoped>
.bg{
	background:rgba(243,247,247,1);
}
.rztop{
	width: 100vw;
}
.titleSpan{
	color: #323A45;
	font-size: 16px;
}
.titleSpan2{
	color: #999DA2;
	font-size: 14px;
}
.imgItemBox{
	width: 50vw;
}
.imgItemBox img{
	width: 100%;
}
.showimg{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	z-index: 1;
}
.add{
	height: 50px;
	text-align: center;
	line-height: 50px;
	background:rgba(93,154,252,1);
	color: #fff;
	font-size: 14px;
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	z-index: 1;
}
.typebox{
	background-color: rgba(253,239,214,1);
	color: #FF9A0D;
	font-size: 16px;
}
.top{
	text-align: center;
	background-color: #6DC5FF;
	color: #fff;
	font-size: 24px;
	padding: 30px 0px;
}
.closeSpan{
	position: absolute;
	right: 0px;
	top: 0px;
	padding: 10px;
}
.proBoxMain{
	height: 300px;
	padding: 0px 10px;
	box-sizing: border-box;
}
.proBoxMain .proBoxMainItem{
	font-size: 14px;
	height: 40px;
	line-height: 40px;
}
.proBoxMainItem.on{
	color: #FC5D7B;
}
.addProBut{
	background: #5D9AFC;
	text-align: center;
	color: #fff;
	height: 50px;
	line-height: 50px;
	font-size: 14px;
}
.pro{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	z-index: 10;
	background: rgba(0,0,0,0.5);
}
.proBox{
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	z-index: 11;
}
.ontitle{
	color: #FC5D7B;
	border-bottom: 1px solid #FC5D7B;
}
.modelBox{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	z-index: 10;
	background-color: rgba(0,0,0,0.3);
}
.modelMian{
	width: 80vw;
	background-color: #fff;
	border-radius: 10px;
	position: relative;
}
.modelBut{
	width: 80%;
	height: 40px;
	line-height: 40px;
	text-align: center;
	background-color: #CBCBCB;
	color: #fff;
	margin: 0px auto;
	border-radius: 5px;
}
.modelBut~div{
	color: #999DA2;
	text-align: center;
	margin: 10px 0px;
	font-size: 14px;
}
.modelBut.on{
	background-color: #5D9AFC;
}
.closeImg{
	width: 30px;
	height: 30px;
	position: absolute;
	top: -50px;
	right:0px;
	z-index: 1;
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
  .headimg{
  	width: 30px;
  	height: 30px;
  	border-radius: 50%;
  }
</style>
