<template>
	<div class="box">
	<div v-for="(item,index) in list2" class="item box-child" :key="index" style="padding:0px 10px;">
		<template v-if="item.showItem">
			<div class="addBox flex flexvcenter">
				<div @click="goPage('a')">申请服务商</div>
				<div @click="goPage('b')">去开店</div>
			</div>
			<div class="addText">当前城市暂无数据，为您推荐周边优选数据</div>
		</template>
		<template v-else>
		<div v-if="!shop" class="itemtop mgb10 flex"  @click.stop="goShop(item)" style="padding-top:30px;">
			<div class="logoBox">
				<img :src="item.storeVo && item.storeVo.headIco?item.storeVo.headIco:storeImg" mode='aspectFit'/>
			</div>
			<div class="flex1 ovh">
				<div class="h30 flex">
					<div class="flex1 title1 line1">
						<span>{{item.storeVo.storeName}}</span>
					</div>
					<!-- <div v-if="item.storeVo.isNewStore==1" class="">
						<span class="newShopTag">新店开业</span>
					</div> -->
					<!-- <div v-if="item.type==2" class="">
						<span class="newShopTag">普通商品</span>
					</div>
					<div v-if="item.type==3" class="">
						<span class="newShopTag">9.9专区</span>
					</div>
					<div v-if="item.type==4" class="">
						<span class="newShopTag">爆品</span>
					</div> -->
				</div>
				<div class="h20 flex">
					<div class="flex1 line1">
						<span class="fs12" style="color:#323A45;">{{item.storeVo.storeRegion}}{{item.storeVo.storeAddressDetail}}</span>
					</div>
					<div class="fs12" v-if="item.storeVo.isDistance != 1">
						<span class="">{{item.storeVo.distance2}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="title2 mgb10">
			<text @longtap="copeFun(item.title)" class="ellipsis1">{{item.title}}</text>
		</div>
		<div class="topTimeBox mgb10" v-if="item.delivery != 2">
			<span class="span1">可使用日期</span>
			<span class="span2">{{item.expiryStartDate2}}至{{item.expiryEndDate2}}</span>
		</div>
		<div>
			<text @longtap="copeFun(item.description)" style="font-size:14px;color:#323A45;font-family:PingFangSC-Regular;font-weight:400;line-height:20px;" :class="isExtend?'onActive' :'unActive'">{{item.description}}</text>
		</div>
		<div class="fs14 mgb10" style="text-align:right;font-weight: bold;">
			<block v-if="item.isShowExtend">
			<span v-if="isExtend" @click.stop="changeExtend">展开</span>
			<span v-else @click.stop="changeExtend">收起</span>
			</block>
		</div>
		<div class="imgbox flex" style="flex-wrap:wrap;">
			<block v-if="item.pictures">
			<div v-for="(item2,index2) in item.pictures" :key="index2">
				<div style="padding-top:100%;position:relative;">
					<img class="img"
						mode="aspectFit"
						:src="item2.imgUrl"
						:data-src="smallImg"
						@click.stop="lookImg(item.pictures,item2,index2,$event)"
					>
				</div>
			</div>
			</block>
		</div>
		<div class="flex mgb10">
			<div class="flex1">
				<span class="onpic mgr10">￥{{item.currentPrice}}</span>
				<span class="dontpic" v-if="item.retailPrice&&item.retailPrice>item.currentPrice">￥{{item.retailPrice}}</span>
			</div>
			<div>
				<img style="width:15px;height:17px;vertical-align:middle;" src="./images/hot1.png" alt="">
				<span class="fs12" style="color:#484848;"> 热度:{{item.heat}}</span>
			</div>
		</div>
		<div v-if="item.type==1||item.type==3||item.type==4" class="center fs12 mgb10" style="color:#323A45;">
			<block v-if="item.isActiveStatus ===1">
			<span class="mgr10">— —</span>
			<span>据活动结束</span>
			<span class="timeBox">{{item.activityDay}}</span>
			<span>天</span>
			<span class="timeBox">{{item.activityH}}</span>
			<span>时</span>
			<span class="timeBox">{{item.activityM}}</span>
			<span>分</span>
			<span class="timeBox">{{item.activityS}}</span>
			<span class="mgr10">秒</span>
			<span>— —</span>
			</block>
		</div>

		<div v-if="item.type==1||item.type==3||item.type==4" class="center fs12 mgb10" style="color:#323A45;">
			<block v-if="item.isActiveStatus ===0">
			<span class="mgr10">— —</span>
			<span>抢购未开始</span>
			<span>— —</span>
			</block>
		</div>

		<div v-if="item.type==1||item.type==3||item.type==4" class="center fs12 mgb10" style="color:#323A45;">
			<block v-if="item.isActiveStatus ===2">
			<span class="mgr10">— —</span>
			<span>抢购结束</span>
			<span>— —</span>
			</block>
		</div>

		<div :class="['pad10','fs14','itemButBox','flex','flexcenter',{'mgb20':shop}]">
			<div @click.stop="buyBut(item)" class="mgr10">立即购买</div>
			<div v-if="item.earnMoney" @click.stop="shareGoods(item.pid)">分享赚:￥{{item.earnMoney}}</div>
			<div v-else @click.stop="shareGoods(item.pid)">分享商品</div>
		</div>
		</template>
	</div>

	<div v-if="showModel" class="model" @click.stop="closeModel">
		<div>
			<div class="main" @click.stop>
				<div>
					<div class="fs14 pad10 rel" style="color:#323A45;">
						<span>选择数量</span>
						<span class="closeSpan" @click.stop="closeModel">X</span>
					</div>
					<div class="pad10 flex">
						<img style="width:60px;height:60px;" class="mgr10" mode="aspectFit" :src="onGoods.pictures?onGoods.pictures[0].imgUrl:storeImg" />
						<div class="flex1">
							<div class="fs14" style="color:#323A45;">￥{{onGoods.currentPrice}}</div>
							<div class="fs14" style="color:#999DA2;">
								<span>库存：</span>
								<span>{{onGoods.stock}}</span>
							</div>
						</div>
					</div>
					<div class="pad10 fs14">
						收货方式
					</div>
					<div class="flex fs14 pad10 flexcenter">
						<div :class="['typeItem',{'noClick':onGoods.delivery==1},{on:buyType=='a'},'mgr20']" @click.stop="buyTypeFun('a')">快递</div>
						<div :class="['typeItem',{'noClick':onGoods.delivery==2},{on:buyType=='b'}]" @click.stop="buyTypeFun('b')">自提</div>
					</div>
					<div class="flex pad10 fs14 flexvcenter">
						<div class="flex1">
							<span style="color:#323A45;">总计：</span>
							<!-- <span class="red">￥{{onGoods.currentPrice1*onSku.onNum}}</span> -->
							<span class="red">￥{{total}}</span>
						</div>
						<div class="flex flexvcenter">
							<span class="col999 mgr10">数量</span>
							<div class="addNumBox flex flexcenter">
								<span @click.stop="changeNum1">-</span>
          			<span class="number" style="min-width: 40px;">{{onSku.onNum?onSku.onNum:'1'}}</span>
          			<span @click.stop="changeNum2">+</span>
							</div>
						</div>
					</div>
				</div>
				<div class="sureBut" @click.stop="sureButBuyFun">确定</div>
			</div>
		</div>
	</div>
	<!-- 登陆弹框 -->
	<div v-if="showLoginModel" class="loginModelBox" catchtouchmove="ture">
		<div class="noLoginMain">
			<div>
				<img src="/static/images/headimg.png">
			</div>
			<div class="text">您还未登陆</div>
			<div class="text">请先登陆再进行操作</div>
			<div class="butBox">
				<div @click="showLoginModel = false">暂不登陆</div>
				<div>立即登陆<Login v-if="!isLogin" @loginFun="loginFun" /></div>
			</div>
		</div>
	</div>
	</div>
</template>

<script type="text/javascript">
import {advancedOrder} from '@/pages/b/api/index'
import { formatTime,space } from '@/utils/index'
import Login from "@/components/user/login"; //组件
export default {
	props:['List','inviteCode','shop'], // 商品列表
	data () {
		return {
			onGoods:'', // 选中的商品
			showModel:false,
			buyType:'',
			onSku: { //选中购买的商品信息
				onNum:1,
			},
			skuPidNums: {}, //生成预付单需要的参数
			// skuData: [], //商品的sku
			isExtend: true,
			pageIndex: 1,
			// 图片点开预览效果
			smallImg: '/static/images/wl.png',
			urlImgs:[],
			// storeImg: './images/jina.png',  //店铺默认头像
			storeImg: '/static/images/jina.png',  //店铺默认头像
			getHeight: '',
			isShowExtend: false,
			timeFunData:'',
			list2:'',
			fun2:'',
			code:'',
			isLogin:false,
			loginUserinfo:"",
			showLoginModel:false
		}
	},
	components:{
		Login
	},
	created(){
		this.onShowFun()
	},
	onShow(){
		this.onShowFun()
	},
	onLoad (params) {
	},
	onHide () {
		// clearInterval(this.timeFunData)
	},
	computed:{
		getInviteCode(){
			console.log('计算属性123',this.inviteCode)
			return this.inviteCode?this.inviteCode:''
		},
		total () {
			let a = this.onGoods.currentPrice1*this.onSku.onNum
			a = a.toFixed(2)
			return a
		},
		listTime(){
			console.log('计算属性',this.List)
			let that = this
			if (this.List) {
				this.List.map((val,index)=>{
					// 判断四行字的展开按钮显示
					if(val.showItem){

					}else{
					if(String(val.earnMoney).indexOf('.')>-1){
						val.earnMoney = (val.earnMoney*1).toFixed(2)
					}

					if (val.description.length > 100) {
						val.isShowExtend = true
					}
					// debugger
					// 处理距离
					if (val.storeVo && val.storeVo.distance) {
						if (val.storeVo.distance < 0.1 || val.storeVo.distance == '<100米') {
								val.storeVo.distance2 = '<100米'
						} else {
							val.storeVo.distance2 = `${Number(val.storeVo.distance).toFixed(1)}km`
						}
					} else {
						if(val.storeVo && val.storeVo.distance === 0){
							val.storeVo.distance2 = '<100米'
						} else{
							if(!val.storeVo){
								val.storeVo = {
									distance2:''
								}
							} else {
								val.storeVo.distance2 = ''
							}
						}
					}

					// 处理有效期时间
					// val.expiryStartDate2 = formatTime(val.expiryStartDate,'day')
					// val.expiryEndDate2 = formatTime(val.expiryEndDate,'day')
					val.expiryStartDate2 = that.formatDate(val.expiryStartDate)
					val.expiryEndDate2 = that.formatDate(val.expiryEndDate)

					// 处理活动时间倒计时
					if(val.type==1||val.type==3||val.type==4){
						let nowTime = new Date().getTime()
						let endTime = val.rushEndTime
						// let endTime = 1560741502000
						val.endTime = endTime
						if(nowTime<val.rushStartTime){
							// console.log('抢购未开始')
							val.isActiveStatus = 0
						} else if (nowTime>endTime) {
							// console.log('抢购结束')
							val.isActiveStatus = 2
						} else {
							// console.log('抢购中')
								let numStr = endTime-nowTime
								let day = parseInt(numStr/1000/60/60/24)
								day = day < 10 ? '0' + day : day
								let h = parseInt(numStr/1000/60/60%24)
								h = h < 10 ? '0' + h : h
								let m = parseInt(numStr/1000/60%60)
								m = m < 10 ? '0' + m : m
								let s = parseInt(numStr/1000%60)
								s = s < 10 ? '0' + s : s
								// console.log('活动时间',day+'-'+h+'-'+m+'-'+s+'=='+formatTime(val.rushEndTime,'day'))
								val.activityDay = day
								val.activityH = h
								val.activityM = m
								val.activityS = s
								val.isActiveStatus = 1
						}
					}
					}
				})
				this.copyFun()
				return this.List
			} else {
				return ''
			}
		}
	},
	watch:{
		List(){
			console.log('小b组件参数',this.List)
		}
	},
	methods:{
		loginFun(){
			this.showLoginModel = false
			this.$emit('login')
	    	this.onShowFun()
	    },
		onShowFun(){
			const loginResult = wx.getStorageSync('loginResult')
			console.log('loginResult=============',loginResult)
			if(loginResult){
				this.isLogin = true
				this.loginUserinfo = loginResult.userInfo
			} else {
				this.isLogin = false
				this.loginUserinfo = {
				  userType:0
				}
			}
		},
		copeFun(item){
			var that = this;
		    wx.setClipboardData({
				data: item,
				success: function (res) {
					wx.showToast({
					  title: '复制成功',
					  icon:'none'
					});
				}
		    });
		},
		goPage(item){
			let loginResult = wx.getStorageSync('loginResult')
			switch(item){
				case 'a':
					if (loginResult.userInfo.serviceProviderIdentity==1) {
						wx.showToast({
				          title: '您已是服务商',
				          icon: "none",
				          duration: 2000
				        })
					} else {
						wx.navigateTo({url:'/pages/b/b_serviceAdd/main'})
					}
					break;
				case 'b':
					if (loginResult.userInfo.userIdentity==1) {
						wx.showToast({
				          title: '您已是店主',
				          icon: "none",
				          duration: 2000
				        })
					} else {
						wx.navigateTo({url:'/pages/b/b_addshop/main'});
					}
					break;
			}
		},
		// 跳转到店铺
		goShop (item) {
			wx.navigateTo({
				// url: `/pages/b/b_shopInfo/b_shopGoods/main?id=${item.storeVo.id}`
				url: `/pages/b/b_shopInfo/b_shopGoods/main?id=${item.storeVo.id}&storeVo=${JSON.stringify(item.storeVo)}&distance=${item.storeVo.distance2}`
			})
		},
		//
		copyFun(){
			// console.log('克隆')
			this.list2 = JSON.parse(JSON.stringify(this.List))
			// console.log('object-------',this.list2);
			this.timeFun()
		},
		timeFun () {
			// console.log('倒计时函数开始')
			let that = this
			clearInterval(that.timeFunData)
			that.timeFunData = setInterval(()=>{
				// console.log('循环开始')
				// console.log('1===',that.list2[0].activityS)
				that.list2.map((val,index) => {
					if(val.showItem){

					} else {
						if(val.type==1||val.type==3||val.type==4){
							let nowTime = new Date().getTime()
							let endTime = val.endTime
							if(nowTime<val.rushStartTime){
								// console.log('抢购未开始')
								val.isActiveStatus = 0
								// clearInterval(that.timeFunData)
							} else if (nowTime>endTime) {
								// console.log('抢购结束')
								val.isActiveStatus = 2
								// clearInterval(that.timeFunData)
							} else {
								// console.log('抢购中')
								val.isActiveStatus = 1
								if(index===0){
									// console.log('val.activityS1=',val.activityS)
								}
								val.activityS--
								val.activityS = val.activityS < 10 ? '0' + val.activityS : val.activityS
								if(index===0){
									// console.log('val.activityS2=',val.activityS)
								}
								if (val.activityS <= 0) {
									val.activityS = 59
									val.activityM--
									val.activityM = val.activityM < 10 ? '0' + val.activityM : val.activityM
									if (val.activityM <= 0) {
										val.activityM = 59
										val.activityH--
										val.activityH = val.activityH < 10 ? '0' + val.activityH : val.activityH
										if (val.activityH <= 0) {
											val.activityH = 23
											val.activityDay--
											val.activityDay = val.activityDay < 10 ? '0' + val.activityDay : val.activityDay
											if (val.activityDay <= 0) {
												val.isActiveStatus = 2
												clearInterval(that.timeFunData)
											}
										}
									}
								}
								val.endTime = endTime
								that.$set(that.list2,index,val)
							}
						}
					}
				})
			},1000)
		},
		// 分享商品
		shareGoods(id){
			if(!this.isLogin){
				this.showLoginModel = true
				return
			}
			wx.navigateTo({
				url:`/pages/b/b_goodsShare/main?id=${id}`
			})
		},
		// 商品数量--
	    changeNum1() {
	      if(this.onSku){
	        if (this.onSku.onNum <= 1) {
	          this.onSku.onNum = 1
	          return
	        }
	        this.onSku.onNum--
	      }
		},
		// 商品数量++
	    changeNum2() {
	      let that = this
	      if(this.onSku){
	        // let buyerNumber = this.onSku.onNum
	        let num2 = this.onGoods.stock
	        // if(buyerNumber){
	        //   num2 = buyerNumber>this.onSku.store?this.onSku.store:buyerNumber
	        // }
	        if (this.onSku.onNum >= num2) {
	          this.onSku.onNum = num2
	          return
	        }
	        this.onSku.onNum++
	      }
        // this.$emit("getsku", that.onSku, that.indexArr)
		},
		// 购买商品弹框展示
		buyBut(item){
			if(!this.isLogin){
				this.showLoginModel = true
				return
			}
			this.code = this.getInviteCode?this.getInviteCode:''
			this.buyType = ''
			this.onSku.onNum = 1
			this.showModel = true
			item.currentPrice1 = (item.currentPrice).toFixed(2)
			this.onGoods = item
			console.log('ooo0000000000000k',this.onGoods)
		},
		// 购买商品弹框隐藏
		closeModel(){
			this.showModel = false
		},
		// 选择自提2或快递1
		buyTypeFun(item){
			if(item=='a'&&this.onGoods.delivery==1){
				return false
			}
			if(item=='b'&&this.onGoods.delivery==2){
				return false
			}
			this.buyType = item
		},
		// 确定购买生成预付订单
		sureButBuyFun(){
			this.showModel = false
			let that = this
			if (!this.buyType) {
				wx.showToast({
				  title: '请选择收货方式',
				  icon: "none",
				  duration: 2000
				})
				return
			}
			if (!this.onSku.onNum) {
				wx.showToast({
				  title: "购买数量不足",
				  icon: "none",
				  duration: 2000
				});
				return
			}
			if (this.onSku.onNum > this.onGoods.stock) {
				wx.showToast({
				  title: "库存不足",
				  icon: "none",
				  duration: 2000
				});
				return
			}
			if(this.buyType == 'b'){
				let cityChose = wx.getStorageSync('cityChose')
				let mapInfo = wx.getStorageSync('mapInfo')
				if(cityChose){
					let num = space(this.onGoods.storeVo.latitude,this.onGoods.storeVo.longitude,cityChose.lat,cityChose.lng)
					if (num*1000>that.$store.state.maxDistance) {
						wx.showModal({
						  title: '提示',
						  content: '店铺与定位位置超过'+parseInt(that.$store.state.maxDistance/1000)+'km，确认自提?',
						  success (res) {
						    if (res.confirm) {
						      that.payFun()
						    } else if (res.cancel) {
						      return
						    }
						  }
						})
					} else {
						this.payFun()
					}
				}else if (mapInfo) {
					let num = space(this.onGoods.storeVo.latitude,this.onGoods.storeVo.longitude,mapInfo[0].latitude,mapInfo[0].longitude)
					if (num*1000>that.$store.state.maxDistance) {
						wx.showModal({
						  title: '提示',
						  content: '店铺与定位位置超过'+parseInt(that.$store.state.maxDistance/1000)+'km，确认自提?',
						  success (res) {
						    if (res.confirm) {
						      that.payFun()
						    } else if (res.cancel) {
						      return
						    }
						  }
						})
					} else {
						that.payFun()
					}
				} else {
					this.payFun()
				}
			} else {
				this.payFun()
			}
			// if(this.buyType=='b'){
			// 	console.log('11111')
			// 	let cityChose = wx.getStorageSync('cityChose')
			// 	if(cityChose){
			// 		if(this.onGoods.citycode&&this.onGoods.citycode!=cityChose.citycode){
			// 			wx.showModal({
			// 			  title: '提示',
			// 			  content: '店铺城市与当前城市不同，确认自提?',
			// 			  success (res) {
			// 			    if (res.confirm) {
			// 			      that.payFun()
			// 			    } else if (res.cancel) {
			// 			      return
			// 			    }
			// 			  }
			// 			})
			// 		}else{
			// 			that.payFun()
			// 		}
			// 	}else{
			// 		let mapInfo = wx.getStorageSync('mapInfo')
			// 		console.log('mapInfo',mapInfo)
			// 		if(mapInfo&&mapInfo[0].regeocodeData.addressComponent.citycode!=this.onGoods.citycode){
			// 			wx.showModal({
			// 			  title: '提示',
			// 			  content: '店铺城市与当前城市不同，确认自提?',
			// 			  success (res) {
			// 			    if (res.confirm) {
			// 			      that.payFun()
			// 			    } else if (res.cancel) {
			// 			      return
			// 			    }
			// 			  }
			// 			})
			// 		}else{
			// 			that.payFun()
			// 		}
			// 	}
			// }
		},
		async payFun(){
			this.skuPidNums = {}
			this.skuPidNums = {
			microPid: this.onGoods.pid,
			buyNum: this.onSku.onNum,
					receivingMethod:this.buyType == 'a'? 2:1
			}
			if(this.code){
				this.skuPidNums.inviteCode = this.code
			}
			console.log('skuPidNums==',this.skuPidNums)
			let result = await advancedOrder(this.skuPidNums)
			console.log("result...预付单", result)
			if (result.data.res_code === 1) {
			wx.setStorage({
			  key: "b_orderMian",
			  data: result.data.result
			})
			wx.navigateTo({
			  url: "/pages/b/b_submitOrder/main"
			})
			} else {
			wx.showToast({
			  title: result.data.message,
			  icon: "none",
			  duration: 2000
			})
			}
		},
		// 控制文字的展开与收起
		changeExtend () {
			this.isExtend = !this.isExtend
		},
		// 图片点开预览效果
		lookImg (pictures,item,index,e) {
			let that = this
			that.urlImgs = []
			pictures.forEach((val,i) => {
				that.urlImgs.push(val.imgUrl)
			})
			// console.log('图片点开事件',pictures,item,index,e)
			if (that.urlImgs) {
				let src = pictures[index].imgUrl
	    		//图片预览
	    		wx.previewImage({
	    		  current: src, // 当前显示图片的http链接
	    		  urls: that.urlImgs // 需要预览的图片http链接列表
	    		})
			}
		},
		// 时间戳过滤成日期格式
    formatDate(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d;
    }
	}
}
</script>

<style type="text/css" scoped>
.box{
	margin-top: 10px;
}
.box-child{
	background-color: #fff;
}
.ellipsis1{
	width: 100%;
  overflow:hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient:vertical;
}
.onActive {
	width: 100%;
  overflow:hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient:vertical;
}
.unActive {
	width: 100%;
	display: -webkit-box;
  -webkit-box-orient:vertical;
  text-overflow: ellipsis;
  overflow:hidden;
	-webkit-line-clamp:0;
}
.logoBox {
	width: 50px;
	height: 50px;
	margin-right: 5px;
}
.logoBox img{
	width: 100%;
	height: 100%;
}
.h30{
	line-height: 30px;
	height: 30px;
}
.h20{
	line-height: 20px;
	height: 20px;
}
.title1{
	color: #101010;
	font-size: 16px;
	font-weight: bold;
}
.title2{
	font-size: 14px;
	color: #323A45;
	font-weight: bold;
}
.newShopTag{
	background-color: #FF6B89;
	color: #fff;
	font-size: 12px;
	padding: 2px 5px;
	border-radius: 3px;
}
.topTimeBox .span1{
	background-color: #FC5D7B;
	color: #fff;
	border:1px solid #FC5D7B;
	padding: 2px 5px;
	font-size: 12px;
}
.topTimeBox .span2{
	font-size: 12px;
	padding: 2px 10px;
	border:1px solid #FC5D7B;
	color: #FC5D7B;
}
.imgbox>div{
	width: 33.33%;
	padding: 3px;
	box-sizing: border-box;
}
.itemButBox>div{
	background-color: #FC5D7B;
	color: #fff;
	height: 35px;
	line-height: 35px;
	text-align: center;
	border-radius: 5px;
	min-width: 150px;
	position: relative;
}
.timeBox{
	background-color: #484848;
	color: #fff;
	padding: 3px 5px;
	margin:0px 5px;
	min-width: 25px;
	box-sizing: border-box;
	display: inline-block;
	text-align: center;
}
.model{
	position: fixed;
	top: 0px;
	left: 0px;
	z-index: 6;
	width: 100vw;
	height: 100vh;
	background: rgba(0,0,0,0.5);
}
.model>div{
	position: relative;
	width: 100%;
	height: 100%;
}
.main{
	position: absolute;
	bottom: 0px;
	left: 0px;
	width: 100%;
	background: #fff;
}
.sureBut{
	position: relative;
	height: 50px;
	text-align: center;
	color: #fff;
	height: 50px;
	line-height: 50px;
	font-size: 14px;
	background: linear-gradient(217deg, #f86367 0%, #fb2579 100%);
}
.closeSpan{
	position: absolute;
	right: 0px;
	top: 0px;
	padding:10px;
}
.typeItem{
	padding:5px 25px;
	border-radius: 5px;
	border: 1px solid rgba(187,187,187,1);
	color: #323A45;
}
.typeItem.on{
	background: #FC5D7B;
	color: #fff;
	border-color: #FC5D7B;
}
.addNumBox>span,.addNumBox>input{
	display: inline-block;
	width: 30px;
	height: 30px;
	line-height: 28px;
	text-align: center;
	border:1px solid #CBCBCB;
}
.addNumBox>span:nth-child(2n){
	border-left: 0px;
	border-right: 0px;
}
.noClick{
	background:#F4F4F4;
	border:1px solid rgba(187,187,187,1);
	color:rgba(187,187,187,1);
}
.addBox{
	padding:5px 10px;
}
.addBox>div{
	color: #007AFF;
	text-decoration: underline;
	text-align: center;
	border-radius: 7px;
	flex: 1;
	height: 30px;
	line-height: 30px;
}
.addText{
	color: #BABEC2;
	font-size: 14px;
	text-align: center;
}
.mgr20{
	margin-right: 40px;
}
.loginModelBox{
	background-color: rgba(0,0,0,0.4);
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 100;
	text-align: center;
}
.loginModelBox .noLoginMain{
	background-color: #fff;
	width: 70vw;
	padding: 20px 10px;
	border-radius: 10px;
}
.loginModelBox .text{
	font-weight: bold;
}
.loginModelBox img{
	width: 60px;
	height: 60px;
	margin-bottom: 20px;
}
.loginModelBox .butBox{
	display: flex;
	margin-top: 20px;
	justify-content: center;
	font-size: 14px;
}
.loginModelBox .butBox>div:nth-child(2n-1){
	color: #33D6C5;
	border:1px solid #33D6C5;
	padding: 5px 10px;
	border-radius: 5px;
	margin-right: 20px;
}
.loginModelBox .butBox>div:nth-child(2n){
	color: #fff;
	border:1px solid #33D6C5;
	background-color: #33D6C5;
	padding: 5px 10px;
	border-radius: 5px;
	position: relative;
}
</style>
