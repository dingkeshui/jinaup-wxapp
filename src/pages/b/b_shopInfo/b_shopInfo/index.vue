<template>
<div class="minBox">
	<div class="flex2 bgfff flexcenter top">
		<img style="width:60px;height:60px;" @click="chooseImg('top')" :src="shopinfo.headIco?shopinfo.headIco:topimg">
		<span @click="chooseImg('top')">点击修改店铺头像</span>
	</div>
	<div class="flex bgfff flexvcenter fs14 item" @click.stop="forbidEdit">
		<div class="title">店铺名称</div>
		<!-- <input class="text flex1 mgr10" v-model="storeName" @change="changeName"> -->
		<div class="text flex1 mgr10 fontcolor">{{storeName||shopinfo.storeName}}</div>
		<!-- <img style="width:10px;height:10px;" src="/static/images/jt.png"> -->
	</div>

	<div class="flex bgfff flexvcenter fs14 item" @click="changeItem">
		<div class="title">经营项目</div>
		<div class="text flex1 mgr10 fontcolor" @click.stop="forbidEdit">
			<template v-if="onGetShopItemTypeListData2.length">
				<span v-for="(item,index) in onGetShopItemTypeListData2" :key="index">{{item.cname}}{{index==onGetShopItemTypeListData2.length-1?'':'/'}}
				</span>
			</template>
			<template v-else>
				<span v-for="(item,index) in onGetShopItemTypeListData" :key="index">{{item.cname}}{{index==onGetShopItemTypeListData.length-1?'':'/'}}
				</span>
			</template>
		</div>
		<!-- <img style="width:10px;height:10px;" src="/static/images/jt.png"> -->
	</div>
	<div class="flex bgfff flexvcenter fs14 item">
		<div class="title">所在地区</div>
		<div class="text flex1 mgr10 fontcolor" @click.stop="forbidEdit" v-if="mapAdress">{{mapAdress2 || mapAdress}} </div>
		<div class="text flex1 mgr10 fontcolor" @click.stop="forbidEdit" v-else>请选择您的店铺地址</div>
		<!-- <img style="width:10px;height:10px;" src="/static/images/jt.png"> -->
	</div>
	<div class="flex bgfff flexvcenter fs14 item">
		<div class="title">详细地址</div>
		<div class="text flex1 mgr10 fontcolor" @click.stop="forbidEdit">{{address}}</div>
		<!-- <input class="text flex1 mgr10" v-model="address" @change="changeAdress"> -->
	</div>
	<div class="flex bgfff flexvcenter fs14 item" @click="changePhone('c')">
		<div class="title">手机号</div>
		<div class="text flex1 mgr10">{{shopinfo.phone}}</div>
		<img style="width:10px;height:10px;" src="/static/images/jt.png">
	</div>
	<div class="flex bgfff flexvcenter mgb10 fs14 item" @click="changePhone('d')">
		<div class="title">客服电话</div>
		<div class="text flex1 mgr10">{{shopinfo.servicePhone}}</div>
		<img style="width:10px;height:10px;" src="/static/images/jt.png">
	</div>

	<div class="bgfff mgb10">
		<div class="pad10">
			<span class="titleSpan mgr10">上传身份证照片</span>
			<span class="titleSpan2">(图片png,jpg格式,大小不超过5M)</span>
		</div>
		<div class="flex">
			<div class="pad10 imgItemBox" @click.stop="forbidEdit">
				<div class="rel">
					<img mode="widthFix" src="/static/images/idimgb.png" />
					<img class="showimg" v-if="shopinfo.idImgPositive" mode="aspectFill" :src="shopinfo.idImgPositive" />
				</div>
			</div>
			<div class="pad10 rel imgItemBox" @click.stop="forbidEdit">
				<div class="rel">
					<img mode="widthFix" src="/static/images/idimga.png" />
					<img class="showimg" v-if="shopinfo.idImgOpposite" mode="aspectFill" :src="shopinfo.idImgOpposite" />
				</div>
			</div>
		</div>
	</div>
	<div class="bgfff mgb10">
		<div class="pad10">
			<span class="titleSpan mgr10">上传营业执照，门脸照</span>
		</div>
		<div class="flex">
			<div class="pad10 imgItemBox" @click.stop="forbidEdit">
				<div class="rel">
					<img mode="widthFix" src="/static/images/rz_img_1.png" />
					<img class="showimg" v-if="shopinfo.businessLicensePhoto" mode="aspectFill" :src="shopinfo.businessLicensePhoto" />
				</div>
			</div>
			<div class="pad10 rel imgItemBox" @click.stop="forbidEdit">
				<div class="rel">
					<img mode="widthFix" src="/static/images/rz_img_2.png" />
					<img class="showimg" v-if="shopinfo.storePhoto" mode="aspectFill" :src="shopinfo.storePhoto" />
				</div>
			</div>
		</div>
	</div>
	<div class="bgfff mgb10">
		<div class="pad10">
			<span class="titleSpan mgr10">上传资质证明</span>
			<span class="titleSpan2">选填</span>
		</div>
		<div class="flex">
			<div class="pad10 imgItemBox">
				<div class="rel">
					<img mode="widthFix" src="/static/images/rz_img_3.png" @click="chooseImg('0')" />
					<img class="showimg" v-if="imgarr['0']" mode="aspectFill" :src="imgarr['0']" @click.stop="forbidEdit"/>
				</div>
			</div>
			<div class="pad10 rel imgItemBox">
				<div class="rel">
					<img mode="widthFix" src="/static/images/rz_img_3.png" @click="chooseImg('1')" />
					<img class="showimg" v-if="imgarr['1']" mode="aspectFill" :src="imgarr['1']" @click.stop="forbidEdit"/>
				</div>
			</div>
		</div>
		<div class="flex">
			<div class="pad10 rel imgItemBox">
				<div class="rel">
					<img mode="widthFix" src="/static/images/rz_img_3.png" @click="chooseImg('2')" />
					<img class="showimg" v-if="imgarr[2]" mode="aspectFill" :src="imgarr[2]" @click.stop="forbidEdit"/>
				</div>
			</div>
			<div class="pad10 rel imgItemBox">
				<div class="rel">
					<img mode="widthFix" src="/static/images/rz_img_3.png" @click="chooseImg('3')" />
					<img class="showimg" v-if="imgarr['3']" mode="aspectFill" :src="imgarr['3']" @click.stop="forbidEdit"/>
				</div>
			</div>
		</div>
	</div>
	<div class="add" @click="add">
		提交
	</div>
	<!-- 经营项目 -->
	<!-- <div v-if="showItem" @click="closeShowItem" class="pro">
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
					<span class="flex1">{{item.itemName}}</span>
					<img v-if="item.state==1" style="width:14px;height:9px;" src="/static/images/right.png">
				</div>
			</scroll-view>
			<div @click.stop="sureShowItem" class="addProBut">
				确认
			</div>
		</div>
	</div> -->

</div>
</template>

<script type="text/javascript">
import { getShopInfo,getShopItemTypeList,changePic,changeShopType,changeAdressInfo, editStoreAttestation, changeShopInfo} from '@/pages/b/api/index'

var amapFile = require('@/utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
export default {
	data () {
		return {
			myAmapFun:'',
			adcode:'',
			citycode:'',
			shopinfo:'',
			idimga:'',
			idimgb:'',
			idimgc:'',
			idimgd:'',
			// topimg:'../img/jina.png',
			topimg:'/static/images/jina.png',
			changeTopImg:'',
			imgarr:[],
			imgarr64: [],
			showItem:false,
			getShopItemTypeListData:'', // 经营项目列表
			onGetShopItemTypeListData:[], // 获取的选中的经营项目列表
			onGetShopItemTypeListData2:[], // 修改的选中的经营项目列表
			address: '', // 详细地址
			mapAdress: '', //获取的地图选择的位置
			mapAdress2: '',//修改的地图选择的位置
			storeName: '', // 修改的店铺名字
			chooseItemId: [] // 选中的经营项目的id
		}
	},
	onShow(){
		// this.getInfo(1)
	},
	onLoad(option) {
		console.log('店铺管理修改',option)
		let that = this
		this.myAmapFun = new amapFile.AMapWX({key:that.$store.state.mapKey})
		// this.storeName = option.name1
		this.getInfo(1)
	},
	methods:{
		// 获取店铺信息
		async getInfo(item){
			console.log('type==========',item)
			let res = await getShopInfo()
			console.log('res2',res)
			if (res.data.res_code==1) {

				this.shopinfo = res.data.result
				this.adcode = res.data.result.adcode
				this.citycode = res.data.result.citycode
				// this.changeTopImg = `${this.shopinfo.headIco}?t=${Math.random()}`
				this.changeTopImg = this.shopinfo.headIco
				this.address = this.shopinfo.storeAddressDetail
				this.storeName = this.shopinfo.storeName
				this.mapAdress = res.data.result.storeRegion
				this.getShopItemTypeList()
				this.imgarr = []
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
			} else {
				wx.showToast({
					title:res.data.message?res.data.message:'获取失败',
					icon:'none',
					duration:2000
				})
			}
		},
		// // 修改店铺名字
		// changeName(){
		// 	wx.navigateTo({
		// 		url:'/pages/b/b_shopInfo/b_shopName/main?name='+this.shopinfo.storeName+'&id='+this.shopinfo.id
		// 	})
		// },
		// 修改手机号
		changePhone(item){
			wx.navigateTo({
			  url: '/pages/b/b_iphone/main?type='+item+'&id='+this.shopinfo.id
			})
		},
		forbidEdit () {
			wx.showToast({
				title: '禁止修改',
				icon:'none',
				duration:2000
			})
		},
		chooseImg(item){
			console.log('选中图片',item)
			let that = this
			wx.chooseImage({
			  count: 1,
			  sizeType: ['compressed'],
			  sourceType: ['album', 'camera'],
			  success(res) {
			  	console.log('图片流',res,item)
			  	switch(item){
			  		// case 'a':
			  		// 	that.changePicFun({type:1,id:that.shopinfo.id,file:res.tempFilePaths[0]})
			  		// break;
			  		// case 'b':
			  		// 	that.changePicFun({type:2,id:that.shopinfo.id,file:res.tempFilePaths[0]})
			  		// break;
			  		// case 'c':
			  		// 	that.changePicFun({type:3,id:that.shopinfo.id,file:res.tempFilePaths[0]})
			  		// break;
			  		// case 'd':
			  		// 	that.changePicFun({type:4,id:that.shopinfo.id,file:res.tempFilePaths[0]})
			  		// break;
			  		case 'top':
			  			that.changePicFun({type:9,id:that.shopinfo.id,file:res.tempFilePaths[0]})
			  		break;
						default:
						// console.log(that.imgarr,item,res.tempFilePaths[0])
						that.$set(that.imgarr,item,res.tempFilePaths[0])
						// console.log('======',that.imgarr)
						that.$set(that.imgarr64,item,res.tempFilePaths[0])
			  	}
			  }
			})
		},
		async changePicFun(item){
			let that = this
			wx.showLoading({
			  title: '上传中',
			})
			let res = await changePic(item)
			wx.hideLoading()
			console.log('eadimgres',res)
			if (res.res_code==1) {
				// wx.showToast({
				// 	title:'修改成功',
				// 	icon:'none',
				// 	duration:2000
				// })
				that.getInfo(2)
			} else {
				wx.showToast({
					title:res.message?res.message:'修改失败',
					icon:'none',
					duration:2000
				})
			}
		},
		// 提交修改的店铺信息
		async add () {
			// if (!this.storeName) {
			// 	wx.showToast({
			// 		title:'店铺名称不能为空',
			// 		icon:'none',
			// 		duration:2000
			// 	})
			// 	return
			// }
			// if (!this.onGetShopItemTypeListData.length&&!this.onGetShopItemTypeListData2.length) {
			// 	wx.showToast({
			// 		title:'经营项目不能为空',
			// 		icon:'none',
			// 		duration:2000
			// 	})
			// 	return
			// }
			// if (!this.mapAdress &&!this.mapAdress2) {
			// 	wx.showToast({
			// 		title:'所在地区不能为空',
			// 		icon:'none',
			// 		duration:2000
			// 	})
			// 	return
			// }
			// if (!this.address) {
			// 	wx.showToast({
			// 		title:'详细地址不能为空',
			// 		icon:'none',
			// 		duration:2000
			// 	})
			// 	return
			// }

			// let microBusinessItems = []
			// this.onGetShopItemTypeListData.map(val=>{
			// 	microBusinessItems.push(val.id)
			// })
			let formData = {
				id: this.shopinfo.id,
				// storeName: this.storeName,
				// microBusinessItems: this.chooseItemId || microBusinessItems,
				// storeRegion: this.mapAdress2 || this.mapAdress,
				// storeAddressDetail: this.address,
				adcode:this.adcode,
				citycode:this.citycode,
				unifiedSocialCreditCode: this.shopinfo.unifiedSocialCreditCode
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
			const res = await changeShopInfo(formData)
			console.log('提交店铺修改信息',res)
			if(res.data.res_code==1){
				wx.showToast({
					title:'修改成功',
					icon:'none',
					duration:2000
				})
				this.getInfo(1)
			}else{
				wx.showToast({
					title:result.data.message?result.data.message:'申请失败',
					icon:'none',
					duration:2000
				})
			}
		},
		// 获取经营项目列表
		async getShopItemTypeList(){
			let res = await getShopItemTypeList({id:this.shopinfo.id})
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
				console.log('onGetShopItemTypeListData',this.onGetShopItemTypeListData)
			} else {
				wx.showToast({
					title:res.data.message?res.data.message:'项目列表获取失败',
					icon:'none',
					duration:2000
				})
			}
		},
		// // 选择一个经营项目列表
		// chooseItemType(item,index){
		// 	this.$set(this.getShopItemTypeListData[index],'state',item.state==1?0:1)
		// 	console.log('this.getShopItemTypeListData',this.getShopItemTypeListData)
		// },
		// // 修改经营项目
		// async sureShowItem(){
		// 	console.log('经营项目')
		// 	// let arr = []
		// 	this.chooseItemId = []
		// 	this.onGetShopItemTypeListData2 = []
		// 	this.getShopItemTypeListData.map(val=>{
		// 		if(val.state==1){
		// 			this.chooseItemId.push(val.id)
		// 			this.onGetShopItemTypeListData2.push(val)
		// 		}
		// 	})
		// 	if(this.chooseItemId.length){
		// 		this.chooseItemId = JSON.stringify(this.chooseItemId)
		// 		// let res = await changeShopType({microBusinessItems:arr,id:this.shopinfo.id})
		// 		// console.log('ress',res)
		// 		// if (res.data.res_code==1) {
		// 		// 	wx.showToast({
		// 		// 		title:'修改成功',
		// 		// 		icon:'none',
		// 		// 		duration:2000
		// 		// 	})
		// 		// } else {
		// 		// 	wx.showToast({
		// 		// 		title:res.data.message?res.data.message:'修改失败',
		// 		// 		icon:'none',
		// 		// 		duration:2000
		// 		// 	})
		// 		// }
		// 		// this.getShopItemTypeList()
		// 	}else{
		// 		wx.showToast({
		// 			title:'经营项目不能为空',
		// 			icon:'none',
		// 			duration:2000
		// 		})
		// 		this.getShopItemTypeList()
		// 	}
		// 	// this.closeShowItem()
		// },

		// 修改详细地址
		// async changeAdress () {
		// 	const res = await changeAdressInfo({
		// 		id: this.shopinfo.id,
		// 		storeAddressDetail: this.address
		// 	})
		// },
		// 选择地区
		// changeAddress () {
		// 	let that = this
		// 	console.log('选择位置')
		// 	wx.chooseLocation({
		// 		success:(res)=>{
		// 			console.log('确定',res)
		// 			// console.log(that.mapAdress)
		// 			that.mapAdress2 = res.address
		// 			that.myAmapFun.getRegeo({
		// 			  location:res.longitude+','+res.latitude,
		// 		      success: function(data){
		// 		        //成功回调
		// 		        console.log('高德经纬度',data)
		// 		       	that.adcode = data[0].regeocodeData.addressComponent.adcode
		// 		       	that.citycode = data[0].regeocodeData.addressComponent.citycode
		// 		      },
		// 		      fail: function(info){
		// 		        //失败回调
		// 		        console.log(info)
		// 		      }
		// 		    })
		// 			// that.adcode =
		// 			// console.log(that.mapAdress2)
		// 		}
		// 	})
		// },


		// 修改经营项目
		// changeItem(){
		// 	this.showItem = true
		// },
		// 关闭经营项目弹出框
		// closeShowItem(){
		// 	this.showItem = false
		// },

	}
}
</script>

<style type="text/css" scoped>
.fontcolor{
	color:rgba(50,58,69,1) !important;
}
.minBox{
	background: rgba(243,247,247,1);
	padding-bottom: 60px;
}
.top img{
	border-radius: 50%;
	margin-bottom: 20px;
}
.item{
	height: 40px;
	padding: 0px 10px;
}
.text{
	text-align: right;
	color: #999DA2;
}
.title{
	color: #323A45;
}
.top{
	padding: 20px;
	color: #999DA2;
	font-size: 14px;
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
.closeSpan{
	position: absolute;
	right: 0px;
	top: 0px;
	padding: 10px;
}

.showChose{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	z-index: 10;
	background: rgba(0,0,0,0.5);
}
.showChoseBox{
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	z-index: 11;
	height: 100vw;
}
.sureChose{
	position:absolute;
	bottom:0;
	width:100%;
	z-index:99;
}
</style>
