<template>
	<div class="minBox bgf3" style="padding-bottom:60px;">
		<div class="message pad10 fs16">
			<span>审核状态:</span>
			<span>已通过</span>
			<span>审核中</span>
			<span class="mgr10">已拒绝</span>
			<span>佣金太低佣金太低佣金太低佣金太低佣金太低佣金太低佣金太低佣金太低</span>
		</div>
		<div class="pad10 bgfff fs16 rel mgb10">
			<textarea class="textarea" v-model="title" placeholder="请输入商品标题" maxlength="46" />
			<span class="num col999">{{title.length}}/46</span>
		</div>
		<div class="pad10 bgfff fs16 rel mgb10">
			<textarea class="textarea" v-model="description" placeholder="描述(最多200字)" maxlength="200" />
		</div>
		<div class="pad10 mgb10 bgfff">
			<div class="">
				<span class="titleSpan">头图上传</span>
				<span class="titleSpan2">(支持上传3-6张图)</span>
			</div>
			<div class="imgBox">
				<div v-for="(item,index) in imgArr" :key="index" class="imgItem">
					<div><image class="box" model="aspectFit" :src="item.imgUrl"></image></div>
					<span class="closeImgSpan" @click="closeImgFun(index)">x</span>
				</div>
				<div v-if="imgArr.length<6" class="imgItem addImg" @click="addImg">
					<div></div>
				</div>
			</div>
		</div>
		<div class="pad10 bgfff mgb10 flex flexvcenter" @click="chooseGoodsTypeBut">
			<span class="titleSpan">类型</span>
			<template v-if="goodsType">
				<span  v-if="goodsType==1" class="titleSpan3 flex1">新店开张</span>
				<span  v-if="goodsType==2" class="titleSpan3 flex1">普通商品</span>
				<span  v-if="goodsType==3" class="titleSpan3 flex1">9.9</span>
				<span  v-if="goodsType==4" class="titleSpan3 flex1">爆品</span>
			</template>
			<span v-else class="titleSpan3 flex1">选择类型</span>
			<img style="width:10px;height:10px;" src="/static/images/jt.png">
		</div>
		<picker
			mode="multiSelector"
			:range="onClassList"
			range-key="cname"
			@change="bindMultiPickerChange"
	        @columnchange="bindMultiPickerColumnChange"
	        :value="classValue"
		>
			<div class="pad10 bgfff mgb10 flex flexvcenter">
				<span class="titleSpan">分类</span>
				<span class="titleSpan3 flex1">{{categoryName?categoryName:'选择分类'}}</span>
				<img style="width:10px;height:10px;" src="/static/images/jt.png">
			</div>
		</picker>
		<div v-if="goodsType" class="pad10 mgb10 bgfff">
			<div class="mgb10 flex">
				<span class="titleSpan flex1">定价/数量</span>
				<span v-if="goodsType==1||goodsType==3" class="red fs14">佣金不能低于50%</span>
				<span v-if="goodsType==2" class="red fs14">佣金不能低于10%</span>
				<span v-if="goodsType==4" class="red fs14">佣金不能低于30%</span>
			</div>
			<div class="flex mgb10">
				<div class="flex1 fs14 flex flexvcenter mgr10">
					<span class="mgr10">门市价</span>
					<input class="flex1 blue" placeholder="请输入" type="number" v-model="retailPrice">
					<span>元</span>
				</div>
				<div class="flex1 fs14 flex flexvcenter">
					<span class="mgr10">现价</span>
					<input class="flex1 blue" placeholder="请输入" type="number" v-model="currentPrice">
					<span>元</span>
				</div>
			</div>
			<div class="flex mgb10">
				<div class="flex1 fs14 flex flexvcenter mgr10">
					<span class="mgr10">佣金</span>
					<input class="flex1 blue" placeholder="请输入" type="number" v-model="commission">
					<span>元</span>
				</div>
				<div class="flex1 fs14 flex flexvcenter">
					<span class="mgr10">库存</span>
					<input class="flex1 blue" placeholder="请输入" type="number" v-model="stock">
					<span>件</span>
				</div>
			</div>
			<div v-if="goodsType==1||goodsType==3||goodsType==4" class="flex">
				<div class="flex1 fs14 flex flexvcenter mgr10">
					<span class="mgr10">限购</span>
					<input class="flex1 blue" placeholder="请输入" type="number" v-model="purchaseLimit">
					<span>件</span>
				</div>
				<div class="flex1 fs14 flex flexvcenter"></div>
			</div>
		</div>
		<div v-if="goodsType==1||goodsType==3||goodsType==4" class="pad10 mgb10 bgfff">
			<div class="mgb10 flex">
				<span class="titleSpan flex1">抢购时间</span>
				<span class="titleSpan2">最多可选择七天</span>
			</div>
			<div class="imgBox flex">
				<div class="flex1 pickerBox mgr10">
					<picker
					class="picker"
					mode="date"
					@change="res=>changeDate(res,'c')"
					>
					<div class="dateSpan">{{rushStartTimeStr?rushStartTimeStr:'开始时间'}}</div>
					</picker>
				</div>
				<div class="flex1 pickerBox">
					<picker
					class="picker"
					mode="date"
					@change="(res)=>changeDate(res,'d')"
					>
					<div class="dateSpan">{{rushEndTimeStr?rushEndTimeStr:"结束时间"}}</div>
					</picker>
				</div>
			</div>
		</div>
		<div class="pad10 mgb10 bgfff">
			<div class="mgb10 flex">
				<span class="titleSpan flex1">有效期</span>
				<span v-if="goodsType==1||goodsType==3||goodsType==4" class="titleSpan2">不可小于抢购时间</span>
			</div>
			<div class="imgBox flex">
				<div class="flex1 pickerBox mgr10">
					<picker
					class="picker"
					mode="date"
					@change="res=>changeDate(res,'a')"
					>
					<div class="dateSpan">{{expiryStartDateStr?expiryStartDateStr:'开始时间'}}</div>
					</picker>
				</div>
				<div class="flex1 pickerBox">
					<picker
					class="picker"
					mode="date"
					@change="(res)=>changeDate(res,'b')"
					>
					<div class="dateSpan">{{expiryEndDateStr?expiryEndDateStr:"结束时间"}}</div>
					</picker>
				</div>
			</div>
		</div>
		<div class="pad10 mgb10 bgfff">
			<div class="mgb10 flex">
				<span class="titleSpan flex1">发货方式</span>
				<span class="titleSpan2">可多选</span>
			</div>
			<div class="">
				<div class="flex mgb10 flexvcenter">
					<div class="flex1 titleSpan">本地自取</div>
					<checkbox :checked="wlType['0']" @click="clickWlType(0)" />
				</div>
				<div class="flex flexvcenter">
					<div class="flex1 titleSpan">快递</div>
					<checkbox :checked="wlType['1']" @click="clickWlType(1)" />
				</div>
			</div>
		</div>
		<div class="pad10 mgb10 bgfff flex flexvcenter" @click="chooseAdress('a')">
			<div class="titleSpan mgr10">不发货地区</div>
			<div class="flex1 line1 titleSpan2" style="text-align:right;">
				<template v-if="allNoDeliveryArea">
					<span>全选</span>
				</template>
				<template v-else>
					<span v-for="(item,index) in addressList" :key="index" v-if="item.isNoDeliveryArea">{{item.name}} </span>
				</template>
			</div>
			<img style="width:10px;height:10px;" src="/static/images/jt.png">
		</div>
		<div class="pad10 bgfff flex flexvcenter" @click="chooseAdress('b')">
			<div class="titleSpan mgr10">不包邮地区</div>
			<div class="flex1 line1 titleSpan2" style="text-align:right;">
				<template v-if="allNoPackagedArea">
					<span>全选</span>
				</template>
				<template v-else>
					<span v-for="(item,index) in addressList" :key="index" v-if="item.isNoPackagedArea">{{item.name}} </span>
				</template>
			</div>
			<img style="width:10px;height:10px;" src="/static/images/jt.png">
		</div>
		<div class="pad10 bgfff mgb10 flex flexvcenter">
			<span class="flex1 titleSpan2">邮费</span>
			<input class="fs14" style="width:70px;text-align:right;" placeholder="￥0.00" type="number" v-model="freight">
		</div>
		<!-- <div class="pad10 mgb50 bgfff">
			<div class="mgb10 flex">
				<span class="titleSpan flex1">状态</span>
			</div>
			<div class="">
				<div class="flex mgb10 flexvcenter">
					<div class="flex1 titleSpan">上架</div>
					<radio @click="changRadio('1')" :checked="state==1" />
				</div>
				<div class="flex flexvcenter">
					<div class="flex1 titleSpan">下架</div>
					<radio @click="changRadio('0')"  :checked="state==0" />
				</div>
			</div>
		</div> -->
		<div class="add fs16" @click="add">提交</div>
		<!-- 选择类型 -->
		<div class="modelBox" v-if="showGoodsType" @click="closeModel('a')">
			<div @click.stop class="modelBoxMain bgfff">
				<div class="modelBoxtitle rel pad10">
					<div class="titleSpan2">请选择类型</div>
					<span @click="closeModel('a')" class="closeSpan">X</span>
				</div>
				<div class="modelBoxDiv pad10 mgb50">
					<div class="flex flexvcenter mgb10" @click="chooseGoodsTypeFun('1')">
						<div :class="['flex1','titleSpan2',{'on':chooseGoodsType==1}]">新店开张</div>
						<img v-if="chooseGoodsType==1" style="width:14px;height:9px;" src="/static/images/right.png">
					</div>
					<div class="flex flexvcenter mgb10" @click="chooseGoodsTypeFun('2')">
						<div :class="['flex1','titleSpan2',{'on':chooseGoodsType==2}]">普通商品</div>
						<img v-if="chooseGoodsType==2" style="width:14px;height:9px;" src="/static/images/right.png">
					</div>
					<div class="flex flexvcenter mgb10" @click="chooseGoodsTypeFun('3')">
						<div :class="['flex1','titleSpan2',{'on':chooseGoodsType==3}]">9.9</div>
						<img v-if="chooseGoodsType==3" style="width:14px;height:9px;" src="/static/images/right.png">
					</div>
					<div class="flex flexvcenter mgb10" @click="chooseGoodsTypeFun('4')">
						<div :class="['flex1','titleSpan2',{'on':chooseGoodsType==4}]">爆品</div>
						<img v-if="chooseGoodsType==4" style="width:14px;height:9px;" src="/static/images/right.png">
					</div>
				</div>
				<div class="add" @click="sureGoodsType">
					确定
				</div>
			</div>
		</div>
		<!-- 选择不发货区域 -->
		<div class="modelBox" v-if="showAdress" @click="closeModel('b')">
			<div @click.stop class="modelBoxMain bgfff">
				<div class="modelBoxtitle rel pad10">
					<div class="titleSpan2 center">选择不发货区域</div>
					<span @click="closeModel('b')" class="closeSpan">X</span>
				</div>
				<div class="modelBoxDiv pad10 mgb50">
					<div class="flex flexvcenter fs16 mgb10">
						<div class="flex1 blue"><span>选择地区</span></div>
						<span :class="['qxBut',{'on':allNoDeliveryArea}]" @click="chooseAll('a')">全选</span>
					</div>
					<div class="flex butBox fs16">
						<div v-for="(item,index) in addressList" :key="index" @click="clickAdress(item,'a',index)" :class="[{'on':item.isNoDeliveryArea}]">{{item.name}}</div>
					</div>
				</div>
				<div class="add" @click="closeModel('b')">
					确定
				</div>
			</div>
		</div>
		<!-- 选择不包邮区域 -->
		<div class="modelBox" v-if="showAdressB" @click="closeModel('c')">
			<div @click.stop class="modelBoxMain bgfff">
				<div class="modelBoxtitle rel pad10">
					<div class="titleSpan2 center">选择不包邮区域</div>
					<span @click="closeModel('c')" class="closeSpan">X</span>
				</div>
				<div class="modelBoxDiv pad10 mgb50">
					<div class="flex flexvcenter fs16 mgb10">
						<div class="flex1 blue"><span>选择地区</span></div>
						<span :class="['qxBut',{'on':allNoPackagedArea}]" @click="chooseAll('b')">全选</span>
					</div>
					<div class="flex butBox fs16">
						<div v-for="(item,index) in addressList" :key="index" @click="clickAdress(item,'b',index)" :class="{'on':item.isNoPackagedArea}">{{item.name}}</div>
					</div>
				</div>
				<div class="add" @click="closeModel('c')">
					确定
				</div>
			</div>
		</div>
		<!--  -->
	</div>
</template>

<script type="text/javascript">
import { 
	productMicroAreaQuery,
	productMicroCategoryQuery,
	productMicroInfoInsert,
	productMicroInfoDetails,
	productMicroInfoUp
} from '@/pages/b/api/index'
import { chinaAdress2 } from '@/api/index'
import { formatTime } from '@/utils/index'

export default {
	data () {
		return {
			id:'', // 商品id
			canClickAdd:true, // 能否点击添加按钮
			title:'', //标题
			description:'',  //描述
			goodsType:'', // 商品类型
			chooseGoodsType:'', // 选择的商品类型
			imgArr:[], // 图片数组
			wlType:[false,false],  //发货方式
			state:'1',
			showGoodsType:false,// 商品类型
			showAdress:false,
			showAdressB:false,
			retailPrice:'', // 门市价
			currentPrice:'', // 现价
			commission:'', // 佣金
			stock:'', // 库存
			purchaseLimit:'', // 限购
			expiryStartDateStr:'', //有效期开始时间
			expiryEndDateStr:'', //有效期结束时间
			rushStartTimeStr:'', //抢购开始时间
			rushEndTimeStr:'', //抢购结束时间
			delivery:'', //发货方式 1 自提 2 快递 3都选
			noDeliveryArea:'', //不发货区域
			allNoDeliveryArea:false, // 全部不发货
			noPackagedArea:'', //不包邮
			allNoPackagedArea:false, // 全部不包邮
			freight:'', // 邮费
			addressList:'',  // 省份列表
			classValue:[0,0,0], // 选中的class的index
			onClassList:[], // picler显示的class
			classList1:'',
			classList2:'',
			classList3:'',
			fCategoryId:'',
			sCategoryId:'',
			tCategoryId:'',
			categoryName:''
		}
	},
	onLoad(e){
		console.log('e',e)
		if (e.id) {
			this.id = e.id
			console.log('编辑商品')
			this.getGoodsInfoFun()
		} else {
			// 获取省分
			this.getAdressList()
		}
		// 获取省分
		// this.getAdressList()
		// 获取分类
		this.getGoodsClass(0)
	},
	methods:{
		// 获取商品详情
		async getGoodsInfoFun () {
			let res = await productMicroInfoDetails({pid:this.id})
			console.log('商品信息',res)
			if (res.data.res_code==1) {
				let result = res.data.result
				this.title = result.title
				this.description = result.description?result.description:''
				this.goodsType = result.type
				this.fCategoryId = result.fCategoryId 
				this.sCategoryId = result.sCategoryId
				this.tCategoryId = result.tCategoryId
				this.categoryName = result.categoryName 
				this.retailPrice = result.retailPrice?result.retailPrice:''
				this.currentPrice = result.currentPrice 
				this.commission = result.commission 
				this.stock = result.stock 
				this.purchaseLimit = result.purchaseLimit?purchaseLimit:'' 
				this.expiryStartDateStr = formatTime(result.expiryStartDate,'day')
				this.expiryEndDateStr = formatTime(result.expiryEndDate,'day')
				this.rushStartTimeStr = result.rushStartTimeStr?formatTime(result.rushStartTime,'day'):'' 
				this.rushEndTimeStr = result.rushEndTimeStr?formatTime(result.rushEndTimeStr,'day'):''
				if (result.delivery==1) {
					this.wlType = [true,false]
				} else if (result.delivery==2) {
					this.wlType = [false,true]
				} if (result.delivery==3) {
					this.wlType = [true,true]
				}
				if(result.list){
					this.imgArr = result.list
				}
				this.noDeliveryArea = result.noDeliveryArea?result.noDeliveryArea:''
				this.noPackagedArea = result.noPackagedArea?result.noPackagedArea:''
				this.freight = result.freight?result.freight:''
				console.log('imgarr',this.imgArr)
				// 获取省分
				this.getAdressList()
			} else {
				wx.showToast({
					title:'商品信息获取失败！',
	                icon: 'none',
	                duration: 2000
				})
			}
		},
		async add () {
			let that = this
			console.log('添加产品')
			if(!this.canClickAdd){
				console.log('重复点击')
				return
			}
			if(!this.title){
				wx.showToast({
                  title:'标题不能为空！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(1)
			if(!this.goodsType){
				wx.showToast({
                  title:'商品类型不能为空！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(2)
			if(!this.currentPrice){
				wx.showToast({
                  title:'商品现价不能为空！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(3)
			if(!this.commission){
				wx.showToast({
                  title:'商品佣金不能为空！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(4)
			if(!this.stock){
				wx.showToast({
                  title:'商品库存不能为空！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(5)
			if(!this.expiryStartDateStr||!this.expiryEndDateStr){
				wx.showToast({
                  title:'商品有效期不完整！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			let expiryStartDateStr = new Date(this.expiryStartDateStr).getTime()
			let expiryEndDateStr = new Date(this.expiryEndDateStr).getTime()
			console.log(6)
			if(expiryStartDateStr>=expiryEndDateStr){
				wx.showToast({
                  title:'商品有效期不正确！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(7)
			if(this.wlType.indexOf(true)<0){
				wx.showToast({
                  title:'发货方式不能为空！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(8)
			if(this.imgArr.length<3){
				wx.showToast({
                  title:'图片最少三张!',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(9)
			if(this.imgArr.length>6){
				wx.showToast({
                  title:'图片最多六张!',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(10)
			if(!this.fCategoryId||!this.sCategoryId||!this.tCategoryId){
				wx.showToast({
                  title:'商品分类不能为空！',
                  icon: 'none',
                  duration: 2000
                })
                return
			}
			console.log(11)
			if(this.goodsType==1||this.goodsType==3||this.goodsType==4){
				console.log(12)
				console.log('rushStartTimeStr',this.rushStartTimeStr,'rushEndTimeStr',this.rushEndTimeStr,'expiryStartDateStr',this.expiryStartDateStr,'rushEndTimeStr',this.rushEndTimeStr)
				if(!this.rushStartTimeStr||!this.rushEndTimeStr){
					wx.showToast({
	                  title:'抢购时间不完整！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
				let rushStartTimeStr = new Date(this.rushStartTimeStr).getTime()
				let rushEndTimeStr = new Date(this.rushEndTimeStr).getTime()
				if(rushStartTimeStr<expiryStartDateStr||rushStartTimeStr>expiryEndDateStr||rushEndTimeStr<expiryStartDateStr||rushEndTimeStr>expiryEndDateStr||rushStartTimeStr>rushEndTimeStr){
					console.log(13)
					wx.showToast({
	                  title:'抢购时间不正确！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
				if((rushEndTimeStr-rushStartTimeStr)/24/60/60/1000>7){
					console.log(14)
					wx.showToast({
	                  title:'抢购时间过长！',
	                  icon: 'none',
	                  duration: 2000
	                })
				}
			}
			console.log(15)
			if(this.goodsType==1){
				if(this.commission<this.currentPrice/2){
					wx.showToast({
	                  title:'佣金过低！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
			}
			console.log(16)
			if(this.goodsType==2){
				if(this.commission<this.currentPrice/10){
					wx.showToast({
	                  title:'佣金过低！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
			}
			console.log(17)
			if(this.goodsType==3){
				if(this.commission<this.currentPrice/2){
					wx.showToast({
	                  title:'佣金过低！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
				if(this.currentPrice>9.9){
					wx.showToast({
	                  title:'价格不得高于9.9！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
			}
			console.log(18)
			if(this.goodsType==4){
				if(this.commission<this.currentPrice/3){
					wx.showToast({
	                  title:'佣金过低！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
			}
			console.log(19)
			let formdata = {}
			console.log(20)
			formdata.title = this.title
			console.log(21)
			formdata.description = this.description?this.description:''
			console.log(22)
			formdata.type  = this.goodsType
			console.log(23)
			formdata.retailPrice  = this.retailPrice?this.retailPrice:''
			console.log(24)
			formdata.currentPrice  = this.currentPrice
			console.log(25)
			formdata.commission  = this.commission
			console.log(26)
			formdata.stock = this.stock
			console.log(27)
			formdata.fCategoryId = this.fCategoryId
			console.log(28)
			formdata.sCategoryId = this.sCategoryId
			console.log(29)
			formdata.tCategoryId = this.tCategoryId
			console.log(30)
			formdata.categoryName = this.categoryName
			console.log(31)
			formdata.expiryStartDateStr  = this.expiryStartDateStr
			console.log(32)
			formdata.expiryEndDateStr  = this.expiryEndDateStr
			console.log(33)
			let base64Image = {}
			console.log('imgArr',this.imgArr)
			this.imgArr.map((val,index)=>{
				base64Image[index] = "data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(val.imgUrl, "base64")
				// base64Image.push("data:image/jpg;base64,"+wx.getFileSystemManager().readFileSync(val.imgUrl, "base64"))
			})
			console.log(34)
			base64Image = JSON.stringify(base64Image)
			console.log(35)		
			formdata.base64Image = base64Image
			console.log(36)	
			if(this.goodsType==1||this.goodsType==3||this.goodsType==4){
				formdata.purchaseLimit = this.purchaseLimit?this.purchaseLimit:''
				formdata.rushStartTimeStr = this.rushStartTimeStr
				formdata.rushEndTimeStr = this.rushEndTimeStr
			}
			console.log(37)	
			if(this.wlType.indexOf(false)<0){
				formdata.delivery = 3
			} else {
				if(this.wlType[0]){
					formdata.delivery = 1
				}
				if(this.wlType[1]){
					formdata.delivery = 2
				}
			}
			console.log(38)
			let noDeliveryArea = ""
			let noPackagedArea = ""
			this.addressList.map(val=>{
				if(val.isNoDeliveryArea){
					noDeliveryArea += (noDeliveryArea?','+val.id:val.id)
				}
				if(val.isNoPackagedArea){
					noPackagedArea += (noPackagedArea?','+val.id:val.id)
				}
			})
			console.log(39)
			if(noDeliveryArea){
				formdata.noDeliveryArea = noDeliveryArea
			}
			console.log(40)
			if(noPackagedArea){
				formdata.noPackagedArea = noPackagedArea
				if(!this.freight){
					wx.showToast({
	                  title:'邮费不能为空！',
	                  icon: 'none',
	                  duration: 2000
	                })
	                return
				}
				formdata.freight = this.freight
			}
			console.log('formdata',formdata)
			this.canClickAdd = false
			if(this.id){
				formdata.pid = this.id
				let res = await productMicroInfoUp(formdata)
				this.canClickAdd = true
				console.log('编辑商品',res)
			}else{
				let res = await productMicroInfoInsert(formdata)
				console.log('添加商品结果,res',res)
				if (res.data.res_code==1) {
					wx.showToast({
	                  title:'添加成功！',
	                  icon: 'none',
	                  duration: 2000
	                })
				} else {
					wx.showToast({
	                  title:res.data.message?res.data.message:'添加失败',
	                  icon: 'none',
	                  duration: 2000
	                })
				}
				this.canClickAdd = true
			}
		},
		// 点击省
		clickAdress(item,type,index){
			if(type=='a'){
				console.log('不发货区域',item)
				if(item.isNoDeliveryArea){
					this.allNoDeliveryArea = false
				}
				this.$set(this.addressList[index],'isNoDeliveryArea',!item.isNoDeliveryArea)
			}else{
				console.log('不包邮区域')
				if(item.isNoPackagedArea){
					this.allNoPackagedArea = false
				}
				this.$set(this.addressList[index],'isNoPackagedArea',!item.isNoPackagedArea)
			}
		},
		// 获取省份
		async getAdressList(){
			let that = this
			let res = await chinaAdress2({pid:1})
			console.log('获取省份',res)
			if(res.data.res_code==1){
				let arr1
				let arr2
				if (that.noDeliveryArea) {
					arr1 = that.noDeliveryArea.split(',')
					if(arr1.length == res.data.result.length){
						this.allNoDeliveryArea = true
					}
				}
				if (that.noPackagedArea) {
					arr2 = that.noPackagedArea.split(',')
					if(arr2.length == res.data.result.length){
						this.allNoPackagedArea = true
					}
				}
				console.log('arr==',arr1,arr2)
				res.data.result.forEach(val=>{
					val.isNoDeliveryArea = false
					val.isNoPackagedArea = false
					if (arr1) {
						if(arr1.indexOf(val.id+'')>=0){
							val.isNoDeliveryArea = true
						}
					}
					if (arr2) {
						if(arr2.indexOf(val.id+'')>=0){
							val.isNoPackagedArea = true
						}
					}
				})
				this.addressList = res.data.result
				console.log('addressList',this.addressList)
			}else{

			}
		},
		// 确定选择分类事件
		bindMultiPickerChange(e){
			console.log('确定选择分类事件')
			console.log(e.mp.detail.value,this.classValue)
			let str = ''
			this.classValue.map((val,index)=>{
				if(index==0){
					this.fCategoryId = this.classList1[val].cid
					str += this.classList1[val].cname+'-'
				}
				if(index==1){
					this.sCategoryId = this.classList2[val].cid
					str += this.classList2[val].cname+'-'
				}
				if(index==2){
					this.tCategoryId = this.classList3[val].cid
					str += this.classList3[val].cname
				}
			})
			this.categoryName = str
		},
		// 滑动分类事件
		bindMultiPickerColumnChange(e){
			console.log('滑动分类事件',e)
			this.classValue.splice(e.mp.detail.column,3-e.mp.detail.column,e.mp.detail.value)
			// this.onClassList.splice(e.mp.detail.column+1,2-e.mp.detail.column)
			// this.onClassList = []
			for(let i = 0;i<3;i++){
				if(!this.classValue[i]){
					this.classValue[i] = 0
				}
			}
			this.getGoodsClass(e.mp.detail.column+1)
			console.log('this.classValue',this.classValue,this.onClassList)
		},
		// 获取分类
		async getGoodsClass(item){
			console.log('获取分类',item)
			let id = 0
			if(item==0){
				let res = await productMicroCategoryQuery({parentId:id})
				if (res.data.res_code==1) {
					this.classList1 = res.data.result
				} else {
					console.log('else')
				}
				let res2 = await productMicroCategoryQuery({parentId:this.classList1[0].cid})
				if (res2.data.res_code==1) {
					this.classList2 = res2.data.result
				} else {
					console.log('else')
				}
				let res3 = await productMicroCategoryQuery({parentId:this.classList2[0].cid})
				if (res3.data.res_code==1) {
					this.classList3 = res3.data.result
				} else {
					console.log('else')
				}
			} else if (item==1) {
				let res2 = await productMicroCategoryQuery({parentId:this.classList1[this.classValue[0]].cid})
				if (res2.data.res_code==1) {
					this.classList2 = res2.data.result
				} else {
					console.log('else')
				}
				let res3 = await productMicroCategoryQuery({parentId:this.classList2[0].cid})
				if (res3.data.res_code==1) {
					this.classList3 = res3.data.result
				} else {
					console.log('else')
				}
			} else {
				let res3 = await productMicroCategoryQuery({parentId:this.classList2[this.classValue[1]].cid})
				if (res3.data.res_code==1) {
					this.classList3 = res3.data.result
				} else {
					console.log('else')
				}
			}
			this.onClassList = [this.classList1,this.classList2,this.classList3]
			console.log('this.onClass',this.onClassList)
		},
		// 选择不发货区域
		chooseAdress(item){
			if(item=='a'){
				this.showAdress = true
			} else {
				this.showAdressB = true
			}
		},
		// 地址 全选
		chooseAll(type){
			if(type=='a'){
				this.allNoDeliveryArea = !this.allNoDeliveryArea
				this.addressList.forEach((val,index)=>{
					this.$set(this.addressList[index],'isNoDeliveryArea',this.allNoDeliveryArea)
				})
			}else{
				this.allNoPackagedArea = !this.allNoPackagedArea
				this.addressList.forEach((val,index)=>{
					this.$set(this.addressList[index],'isNoPackagedArea',this.allNoPackagedArea)
				})
			}
		},
		// 选择类型
		chooseGoodsTypeBut(){
			this.showGoodsType = true
		},
		// 确定选择商品类型
		chooseGoodsTypeFun(item){
			this.chooseGoodsType = item
		},
		// 关闭模态框
		closeModel(item){
			if(item=='a'){
				this.showGoodsType = false
			} else if (item=='b') {
				this.showAdress = false
			} else if (item=='c') {
				this.showAdressB = false
			}
		},
		// 点击商品类型确定按钮
		sureGoodsType(){
			this.goodsType = this.chooseGoodsType
			this.showGoodsType =false
		},
		// 添加图片
		addImg(){
			let that = this
			let count = 6
			if(this.imgArr&&this.imgArr.length){
				count = 6 - this.imgArr.length
			}
			wx.chooseImage({
			  count: count,
			  sizeType: ['compressed'],
			  sourceType: ['album', 'camera'],
			  success(res) {
			  	res.tempFilePaths.map(val=>{
			  		that.imgArr.push({imgUrl:val})
			  	})
			  	console.log('arr',that.imgArr)
			  }
			})
		},
		// 点击发货方式
		clickWlType(item){
			this.wlType[item] = !this.wlType[item]
		},
		// 删除图片
		closeImgFun(index){
			console.log('index',index)
			this.imgArr.splice(index,1)
		},
		// 选择时间
		changeDate(res,type){
			console.log('时间改变',res,type)
			if (type=='a') {
				this.expiryStartDateStr = res.target.value
			} else if (type=='b') {
				this.expiryEndDateStr = res.target.value
			} else if (type=='c') {
				this.rushStartTimeStr = res.target.value
			} else if (type=='d') {
				this.rushEndTimeStr = res.target.value
			}
		},
		// 单选按钮
		changRadio(item){
			this.state = item
		}
	}
}
</script>

<style type="text/css" scoped>
.textarea{
	width: 100%;
}
.num{
	position: absolute;
	bottom: 10px;
	right: 10px;
}
.titleSpan{
	color: #323A45;
	font-size: 16px;
}
.titleSpan2{
	color: #999DA2;
	font-size: 14px;
}
.imgItem{
	width: 25%;
	position: relative;
	padding-top: 25%;
	float: left;
}
.imgItem>div{
	position: absolute;
	top: 5px;
	left: 5px;
	right: 5px;
	bottom: 5px;
}
.imgBox{
	width: 100%;
	overflow: hidden;
}
.addImg>div{
	border-radius: 5px;
	border:1px dashed #5D9AFC;
}
.addImg>div:after{
	content:'';
	display: inline-block;
	width: 1px;
	height: 60%;
	background-color: #5D9AFC;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -0.5px;
	margin-top: -30%;
}
.addImg>div:before{
	content:'';
	display: inline-block;
	width: 60%;
	height: 1px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -30%;
	margin-top: -0.5px;
	background-color: #5D9AFC; 
}
.closeImgSpan{
	position: absolute;
	right: 0px;
	top: 0px;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	text-align: center;
	background-color: rgba(0,0,0,0.5);
	color: #fff;
	line-height: 20px;
	font-size: 12px;
}
.titleSpan3{
	text-align: right;
	color: #323A45;
	font-size: 14px;
}
.pickerBox{
	height: 30px;
	line-height: 30px;
}
.picker{
	height: 100%;
	width: 100%;
}
.dateSpan{
	font-size: 14px;
	text-align: center;
	color: #484848;
}
.add{
	text-align: center;
	background-color: #5D9AFC;
	color: #fff;
	height: 50px;
	line-height: 50px;
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	z-index: 1;
}
.modelBox{
	position: fixed;
	top: 0px;
	left: 0px;
	height: 100vh;
	width: 100vw;
	background-color: rgba(0,0,0,0.5);
	z-index: 2;
}
.modelBoxMain{
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	z-index: 3;
}
.closeSpan{
	position: absolute;
	right: 0px;
	top: 0px;
	padding: 10px;
}
.modelBoxDiv .on{
	color: #FC5D7B;
}
.blue{
	color: #5D9AFC;
}
.qxBut{
	border: 1px solid #5D9AFC;
	border-radius: 5px;
	padding: 0px 10px;
	color: #5D9AFC;
}
.qxBut.on{
	background-color: #5D9AFC;
	color: #fff;
}
.butBox{
	flex-wrap: wrap;
}
.butBox>div{
	background-color: rgba(246,246,246,1);
	border-radius: 5px;
	width: 22.5%;
	text-align: center;
	color: #999DA2;
	padding: 5px 0px;
	margin-right: 3.33%;
	margin-bottom: 10px;
}
.butBox>div:nth-child(4n){
	margin-right: 0px;
}
.butBox .on{
	background-color: #5D9AFC;
	color: #fff;
}
.message{
	background-color: #FDEFD6;
	color: #FF9A0D;
}
</style>