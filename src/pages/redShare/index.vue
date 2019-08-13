<template>
	<div>
		<div class="minBox">
			<canvas :style="{width: canW+'px',height: canH+'px',margin:'0px auto'}" canvas-id="firstCanvas"></canvas>
		</div>
		<canvas style="width: 300px; height: 300px;position:absolute;z-index:-1;top:0px;left:-400px;options:0;" canvas-id="canvas"></canvas>
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
</template>

<script type="text/javascript">
import {getStoreInfoByStoreId} from '@/pages/b/api/index'
import { downFile } from '@/utils/index';
import { getRed,redShare } from '@/api/index';
var qrCodeJs = require("@/utils/qrCode.js")

export default {
	data () {
		return {
			canW:'',
			canH:'',
			shareRed:'',
			shopInfo:'',
			redInfo:''
		}
	},
	onLoad () {
		let shareRed = wx.getStorageSync('shareRed')
		if(shareRed){
			this.shareRed = shareRed
			this.onFun()
		}else{
			wx.navigateBack({delta:1})
		}
	},
	methods:{
		async shareToUser(){
			let that = this
			let data = {
				source:1,
				id:that.shareRed.id,
				redEnvelopeType:that.shareRed.redEnvelopeType
			}
			if(that.shareRed.redEnvelopeType==2){
				data.sid = that.redInfo.sid
			}
			let res = await getRed(data)
			console.log('分享获取红包',res,data)
		},
		async onFun(){
			let res2 = await redShare({id:this.shareRed.id})
			if(res2.data.res_code==1){
				this.redInfo = res2.data.result
			}
			console.log('res2',res2)
			if (this.shareRed.redEnvelopeType==2) {
				let res = await getStoreInfoByStoreId({id:this.shareRed.sid})
				if(res.data.res_code==1){
					this.shopInfo = res.data.result
				}
				this.nextFun()
			} else {
				this.nextFun()
			}
		},
		nextFun(){
			let that = this
			// 获取海报信息
			wx.showLoading({
		      title: '分享图生成中', //提示的内容,
		      mask: true, //显示透明蒙层，防止触摸穿透,
			})
			// 获取用户信息
    		let user = wx.getStorageSync('user')
    		console.log(1001)
    		// 获取邀请码
    		let inviteCode = wx.getStorageSync('loginResult').userInfo.inviteCode
    		console.log(1002)

    		// 获取屏幕宽高
		    const telInfo = wx.getSystemInfoSync()
		    let telWidth = telInfo.screenWidth
		    let telHeight = telInfo.screenHeight
		    let canW = telWidth*0.7
     		let canH = canW*736/414
     		this.canW = canW
     		this.canH = canH
     		// 绘制白色背景
		    const context = wx.createCanvasContext("firstCanvas")
		    context.rect(0, 0, canW, canH)
		    context.save();
		    context.setFillStyle('#fff')
		    context.fill()
    		console.log(10031)
		    context.draw(true, async ()=>{
    			console.log(1004)
		    	context.restore()
    			console.log(1005)
		    	wx.showLoading({
				    title: '海报下载中', //提示的内容,
				    mask: true, //显示透明蒙层，防止触摸穿透,
				})
    			console.log(1006)
				let downImgUrl  = await downFile(that.redInfo.backgroundImage)
				context.drawImage(downImgUrl, 0, 0, canW,canH)
				console.log(1007)
				if(that.shareRed.redEnvelopeType==2&&that.shopInfo){
					// 绘制头像
					wx.showLoading({
					  title: '绘制头像中', //提示的内容,
					  mask: true, //显示透明蒙层，防止触摸穿透,
					})
					let avatarPath  = await downFile(that.shopInfo.headIco?that.shopInfo.headIco:'https://jnup.oss-cn-beijing.aliyuncs.com/micro/store/896ae1ca019d4b0bb6730a4bb7c3e525.png')
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
					this.drawText(context,that.shopInfo.storeName,((canW*50/414)/2)+22,canW-35-(canW*50/414),(canW*50/414)+25)
				}
				console.log(1008)
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
				context.setFontSize(13)
				context.fillText('邀请码：'+inviteCode,(canW/2)-(textw2/2),textCodeTop,textw2)
				context.setFillStyle('#fff')
				context.setFontSize(13)
				let textw3 = context.measureText(user.userInfo.nickName).width
	      		context.fillText(user.userInfo.nickName,(canW/2)-(textw3/2),(508*canH/736)+18+(94*canW/414),textw3)
	      		qrCodeJs.api.draw(that.redInfo.shareUrl, 'canvas', 300, 300)
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
					    wx.hideLoading();
					  },
					  fail: function (res) {
					    console.log(res);
					    wx.hideLoading();
					  }
					});
				}, 1000);
		    })
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
			this.shareToUser()
			let that = this
		    wx.canvasToTempFilePath({
		      x: 0,
		      y: 0,
		      width: that.canW,
		      height: that.canH,
		      destWidth: that.canW*2,
		      destHeight: that.canH*2,
		      fileType: 'jpg',
		      quality: 1,
		      canvasId: 'firstCanvas',
		      success(res) {
		        wx.saveImageToPhotosAlbum({
		          filePath: res.tempFilePath,
		          success(res) {
		            wx.showToast({
		              title: '已保存到相册', //提示的内容,
		              icon: 'success', //图标,
		            });
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
		}
	},
	onShareAppMessage(res) {
		console.log('调用转发')
		let inviteCode = wx.getStorageSync('loginResult').userInfo.inviteCode
		if (res.from === 'button') {
		  // 来自页面内转发按钮
		}
		let path = ''
		if(this.shareRed.redEnvelopeType==2){
			path = 'pages/b/b_shopInfo/b_shopGoods/main?id='+this.shareRed.sid+'&fromInviteCode='+inviteCode+'&rid='+this.shareRed.id
		} else {
			path = 'pages/index/main?fromInviteCode='+inviteCode+'&rid='+this.shareRed.id
		}
		return {
		  title: this.shopInfo.storeName,
		  imageUrl:this.shopInfo.headIco,
		  path: path
		}
	},
}
</script>

<style type="text/css" scoped>
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
</style>