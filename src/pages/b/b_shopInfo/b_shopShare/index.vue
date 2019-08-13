<template>
<div>
	<!-- 店铺分享 -->
	<swiper class="swiper" :current="index" @change="itemChange" previous-margin="35px" next-margin="35px">
		<swiper-item class="swiperItem" v-for="(item,index) in imgArr" :key="index">
			<div class="minBox">
				<canvas :style="{width: canW+'px',height: canH+'px',margin:'0px auto'}" :canvas-id="'firstCanvas'+index"></canvas>
			</div>
		</swiper-item>
	</swiper>
	<canvas style="width: 300px; height: 300px;position:absolute;z-index:-1;top:0px;left:-400px;options:0;" canvas-id="canvas"></canvas>
	<div class="share" @click="shareFun">分享</div>
	<div v-if="showModel" class="model" @click="closeModel">
		<div class="goShare flex pad10">
			<div class="flex1 center shareButBox">
				<button
				open-type="share"
				class="shareBut"
				@click="shareToUser"
				hover-class="none"
				plain></button>
				<img src="/static/images/7.png">
				<div>微信好友</div>
			</div>
			<div class="flex1 center" @click="saveImage">
				<img src="/static/images/6.png">
				<div>保存到相册</div>
			</div>
		</div>
	</div>
</div>
</template>

<script type="text/javascript">
import {getStoreInfoByStoreId} from '@/pages/b/api/index'
import {shareNum} from '@/api/index'
import { downFile } from '@/utils/index';
var qrCodeJs = require("@/utils/qrCode.js")
export default {
	data () {
		return {
			showModel:false,
			userInfo: '',
			inviteCode: '',
			storeId: '',
			canW:'',
			canH:'',
			storeInfo: '',
			imgArr:'',
			index:0,
			// 判断是否已经生成了图片
			arr:[]
		}
	},
	onLoad (option) {
		console.log('店铺分享参数',option)
		// // 获取用户信息
		// let info = wx.getStorageSync('user')
		// this.userInfo = JSON.parse(info.rawData)
		// this.inviteCode = wx.getStorageSync('inviteCode')
		// 获取要分享的店铺的信息
		this.storeId = option.id
		this.arr = []
		this.index = 0
		this.imgArr = '',
		this.createdFun()
	},
	onShareAppMessage(res) {
    console.log('调用转发')
		let inviteCode = wx.getStorageSync('inviteCode')
    if (res.from === 'button') {
      // 来自页面内转发按钮
			console.log(res.target)
    }

    return {
      title: this.storeInfo.storeName,
      imageUrl:this.storeInfo.headIco,
      path: 'pages/b/b_shopInfo/b_shopGoods/main?id='+this.storeId+'&fromInviteCode='+inviteCode
		}
  },
	methods:{
		itemChange(e){
			console.log('轮播',e,this.index)
			this.index = e.mp.detail.current
			if(!this.arr[this.index]){
				this.imgFun()
			}
		},
		async createdFun(){
			let that = this
			const res = await getStoreInfoByStoreId({id:that.storeId})
			if(res.data.res_code==1){
				// if (this.type!=1) {
					res.data.result.specialShareImg = res.data.result.storePhoto
				// }
				that.storeInfo = res.data.result
				that.imgArr = JSON.parse(res.data.result.storePosters)
				that.imgArr.map(val=>{
					that.arr.push(false)
				})
				console.log('imgArr',that.imgArr)
				that.imgFun(that.imgArr.length>1?1:'')
			}else{
				wx.showToast({
		          title: res.data.message?res.data.message:'信息获取失败',
		          icon: 'none', //图标,
		        })
        		return
			}
		},
		async imgFun(imgIndexData){
			let that = this
			// 获取海报信息
			wx.showLoading({
		      title: '分享图生成中', //提示的内容,
		      mask: true, //显示透明蒙层，防止触摸穿透,
			})
			// 获取用户信息
    		let user = wx.getStorageSync('user')
    		// 获取邀请码
    		let inviteCode = wx.getStorageSync('loginResult').userInfo.inviteCode
    		// 获取屏幕宽高
		    const telInfo = wx.getSystemInfoSync()
		    let telWidth = telInfo.screenWidth
		    let telHeight = telInfo.screenHeight
		    let canW = telWidth*0.7
     		let canH = canW*736/414
     		this.canW = canW
     		this.canH = canH
    		// 绘制白色背景
		    const context = wx.createCanvasContext("firstCanvas"+(imgIndexData?imgIndexData:that.index));
		    context.rect(0, 0, canW, canH)
		    context.save();
		    context.setFillStyle('#fff')
		    context.fill()
		    context.draw(true, async ()=>{
			  context.restore()
			  // 绘制图片
		   	  wx.showLoading({
			    title: '海报下载中', //提示的内容,
			    mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      let downImgUrl  = await downFile(that.imgArr[imgIndexData?imgIndexData:that.index].imgUrl)
		      context.drawImage(downImgUrl, 0, 0, canW,canH);
		      wx.showLoading({
			    title: '海报绘制完成', //提示的内容,
			    mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      // 绘制头像
		      wx.showLoading({
			      title: '绘制头像中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      let avatarPath  = await downFile(that.storeInfo.headIco?that.storeInfo.headIco:'https://jnup.oss-cn-beijing.aliyuncs.com/micro/store/896ae1ca019d4b0bb6730a4bb7c3e525.png')
		      context.drawImage(avatarPath, 20, 20, (canW*50/414), (canW*50/414));
		      context.setFontSize(13)
		      context.setStrokeStyle("#ccc");
		      context.setLineWidth(0.7);
		      // 绘制名字
		      wx.showLoading({
			      title: '绘制名字中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      context.setFillStyle('#484848')
		      let textw1 = context.measureText(that.storeInfo.storeName).width
		      this.drawText(context,that.storeInfo.storeName,((canW*50/414)/2)+22,canW-35-(canW*50/414),(canW*50/414)+25)
		      // context.fillText(that.storeInfo.storeName,(canW*50/414)+25,((canW*50/414)/2)+22,textw1)
		      let textw2 = context.measureText('邀请码：'+inviteCode).width
		      let textCodeTop = (508*canH/736)+40+(94*canW/414)
		      // 画圆
		      context.beginPath()
		      context.arc((canW/2)-(textw2/2)-10,textCodeTop-5, 10, 0.5 * Math.PI, 1.5 * Math.PI)
		      context.setFillStyle('rgba(0,0,0,0.3)')
			  context.fill()
			  context.beginPath()
			  context.arc((canW/2)+(textw2/2)+10,textCodeTop-5, 10, 1.5 * Math.PI, 2.5 * Math.PI)
		      context.setFillStyle('rgba(0,0,0,0.3)')
			  context.fill()
			  // 画方
			  context.beginPath()
			  context.rect((canW/2)-(textw2/2)-10,textCodeTop-15,textw2+20,20)
			  context.setFillStyle('rgba(0,0,0,0.3)')
			  context.fill()
			  context.beginPath()
			  context.setFillStyle('#fff')
		      context.fillText('邀请码：'+inviteCode,(canW/2)-(textw2/2),textCodeTop,textw2)
		      context.setFillStyle('#fff')
		      let textw3 = context.measureText(user.userInfo.nickName).width
		      context.fillText(user.userInfo.nickName,(canW/2)-(textw3/2),(508*canH/736)+18+(94*canW/414),textw3)
		      console.log('进入画二维码')
		      qrCodeJs.api.draw(that.storeInfo.xcxFriendShareUrl, 'canvas', 300, 300)
			  wx.showLoading({
			      title: '绘制二维码中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      setTimeout(() => {
		        wx.canvasToTempFilePath({
		          canvasId: 'canvas',
		          // height: 300,
		          success: function (res) {
		            var tempFilePath = res.tempFilePath;
		            console.log('临时路径',tempFilePath);
		            context.drawImage(tempFilePath, (canW/2)-(94*canW/414/2), (508*canH/736), 94*canW/414, 94*canW/414);
		            context.rect(0, 0, canW, canH);
		            context.stroke();
		            context.draw(true);
		            that.arr[that.index] = true
		            wx.hideLoading();
		            if(imgIndexData){
		            	that.arr[imgIndexData] = true
		            	that.imgFun()
		            }
		          },
		          fail: function (res) {
		            console.log(res);
		            wx.hideLoading();
		          }
		        });
		      }, 1000);
		      // context.draw(true)
			})
		},
		// 分享好友
		async shareToUser () {
			console.log('分享给朋友')
			let resNum = await shareNum()
		},
		drawText(ctx, str, initHeight=245, canvasWidth=177,startX=10,addH = 14) {
	      var lineWidth = 0;
	      var lastSubStrIndex = 0; //每次开始截取的字符串的索引
	      for (let i = 0; i < str.length; i++) {
	        lineWidth += ctx.measureText(str[i]).width;
	        if (lineWidth > canvasWidth) {
	          ctx.fillText(str.substring(lastSubStrIndex, i), startX, initHeight);//绘制截取部分
	          initHeight += addH;//12为字体的高度
	          lineWidth = 0;
	          lastSubStrIndex = i;
	        }
	        if (i == str.length - 1) {//绘制剩余部分
	          ctx.fillText(str.substring(lastSubStrIndex, i + 1), startX, initHeight);
	        }
	      }
	    },
		// 保存到相册
		async saveImage () {
			console.log('保存到相册')
			let that = this
			let resNum = await shareNum()
	    wx.canvasToTempFilePath({
	      x: 0,
	      y: 0,
	      width: that.canW,
	      height: that.canH,
	      destWidth: that.canW*2,
	      destHeight: that.canH*2,
	      fileType: 'jpg',
	      quality: 1,
	      canvasId: 'firstCanvas'+that.index,
	      success(res) {
	        wx.saveImageToPhotosAlbum({
	          filePath: res.tempFilePath,
	          success(res) {
	            wx.showToast({
	              title: '已保存到相册', //提示的内容,
	              icon: 'success', //图标,
	            });
	            // console.log('res...', res)
	          },
	          fail(err) {
	            wx.showToast({
	              title: '保存到相册失败', //提示的内容,
	              icon: 'none', //图标,
	            })
	          }
	        })
	      }
	    })
		},
		shareFun(){
			this.showModel = true
		},
		closeModel(){
			this.showModel = false
		}
	}
}
</script>

<style type="text/css">
.goShare{
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	background-color: #fff;
	box-sizing: border-box;
}
.goShare img{
	width: 40px;
	height: 40px;
}
.goShare div{
	color: #70757D;
	font-size: 14px;
}

.wrap{
	margin: 20px  auto 0 ;
	border:6px solid;
  border-image:linear-gradient(67deg, rgba(238,194,151,1), rgba(214,170,137,1)) 6 6;
	/* height: 520px; */
	width: 290px;
	background-color: #f3f6f5;
}
.wrap .title{
	margin: 20px;
	display: flex;
	align-items:center;
}
.wrap .title>img{
	margin-right: 5px;
}
.wrap .title .text{
	width: 86px;
	height: 44px;
	font-size:16px;
	color:rgba(213,169,123,1);
	/* line-height:22px; */
}

.info{
	width: 200px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.info .infoName{
	font-size:18px;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(72,72,72,1);
	line-height:25px;
	margin: 10px 0 8px 0;
}

.info .infoother{
	width:169px;
	height:28px;
	background:linear-gradient(67deg,rgba(238,194,151,1) 0%,rgba(214,170,137,1) 100%);
	border-radius:16px;
	font-size:16px;
	font-family:PingFangSC-Medium;
	font-weight:500;
	color:rgba(255,255,255,1);
	line-height:28px;
	text-align: center;
}

.storeInfo{
	padding: 20px 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
	width: 100%;
	/* height: 100%; */
	background-color: #5c99fb;
}
.storeInfo p{
	font-size:16px;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(255,229,178,1);
	line-height:22px;
	margin-top: 17px;
}

.share{
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
	height: 50px;
	line-height: 50px;
	background-color: #5D9AFC;
	color: #fff;
	font-size: 16px;
	text-align: center;
}
.model{
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	z-index: 2;
	background-color: rgba(0,0,0,0.5);
}
.modelMain{
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100vw;
}
.closeBut{
	height: 50px;
	text-align: center;
	line-height: 50px;
	font-size: 16px;
	color: #323A45;
	background-color: #fff;
}
.itemBox{
	color: #70757D;
	background-color: #E9E9E9;
	padding: 20px 0px;
}
.swiperItem{
	width: 100vw;
}
.swiper{
	height: 80vh;
}
</style>
