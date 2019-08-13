<template>
	<div class="box">
		<div>
			<canvas :style="{width: canW+'px',height: canH+'px',margin:'0px auto'}" canvas-id="firstCanvas"></canvas>
		</div>
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
		<canvas style="width: 300px; height: 300px;position:absolute;z-index:-1;top:0px;left:-400px;options:0;" canvas-id="canvas"></canvas>
	</div>
</template>

<script type="text/javascript">
import { downFile,wxGetImgInfo } from '@/utils/index';
import { getMiaoShaListMore,shareNum } from '@/api/index'
	
var qrCodeJs = require("@/utils/qrCode.js");
export default {
	data () {
		return {
			time:'',
			bg:'',
			shareUrl:'',
			shareData:'',
			canW:'70vw',
			canH:'124.88vw',
			pixelRatio:1,
			seckillStartTime:''
		}
	},
	async onLoad(e){
		console.log('分享秒杀列表',e)
		this.time = e.time
		this.bg = e.bg
		this.shareUrl = e.shareUrl
		this.seckillStartTime = e.startTime
		this.createdFun()
	},
	onShareAppMessage(res) {
	    console.log('调用转发')
	    let that = this
	    let inviteCode = wx.getStorageSync('inviteCode');
	    if (res.from === 'button') {
	      // 来自页面内转发按钮
	      console.log(res.target)
	      // 2.

	    }
	    console.log('this.inviteCodeData',this.inviteCodeData)
	    return {
	      title: this.time,
	      path: 'pages/spikeList/main?seckillStartTime='+that.seckillStartTime+'&fromInviteCode='+inviteCode
	    }
	},
	methods:{
		async shareToUser(){
			let resNum = await shareNum()
		},
		async createdFun(){
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
		    let pixelRatio = telInfo.pixelRatio
		    that.pixelRatio = pixelRatio
		    console.log('设备像素比',pixelRatio)
		    let telWidth = telInfo.screenWidth
		    let downImgUrl  = await downFile(that.bg)
		    console.log('downImgUrl',downImgUrl)
		    let bgInfo = await wxGetImgInfo(downImgUrl)
		    console.log('bgInfo',bgInfo)
		    let canW = telWidth*0.7
		    let bgh = canW*bgInfo.height/bgInfo.width
		    let codeW = 131*canW/414
			let logoW = 82*canW/414
     		// let canH = bgh+(117)+codeW+10
     		let canH = bgh+codeW+10
     		console.log('canH',canH)
     		this.canW = canW
     		this.canH = canH
    		// 绘制白色背景
		    const context = wx.createCanvasContext("firstCanvas");
		    context.rect(0, 0, canW, canH)
		    context.save();
		    context.setFillStyle('#fff')
		    context.fill()
		    context.draw(true, async ()=>{
		      context.restore();
		      // 绘制图片
		      wx.showLoading({
			      title: '海报下载中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      // context.drawImage(downImgUrl, 0, 0, canW,num2);
		      // 绘制头部粉色容器
		      // context.rect(0, 0, canW, 117)
		      // context.save();
		      // context.setFillStyle('#FC5D7B')
		      // context.fill()
		      // 绘制分享标题
		      // context.beginPath()
		      // context.setFontSize(14)
		      // context.setFillStyle("#fff");
		      // context.setLineWidth(1);
		      // let textw1 = context.measureText(that.time).width
		      // context.fillText(that.time,(canW/2)-(textw1/2),35)
		      // 绘制头像
		   //    wx.showLoading({
			  //     title: '绘制头像中',
			  //     mask: true,
			  // })
		   //    let avatarPath  = await downFile(user.userInfo.avatarUrl)
		   //    let textw2 = context.measureText(user.userInfo.nickName).width
		   //    let textw3 = context.measureText('邀请码:'+inviteCode).width
		   //    let textw4 = textw2>textw3?textw2:textw3
		   //    context.drawImage(avatarPath,(canW/2)-((textw4+40)/2), 47, 40, 40);
		   //    context.setFontSize(12)
		   //    context.setFillStyle("#fff");
		   //    context.setLineWidth(1);
		      // 绘制名字
		   //    wx.showLoading({
			  //     title: '绘制名字中',
			  //     mask: true,
			  // })
		   //    context.fillText(user.userInfo.nickName,(canW/2)-((textw4+40)/2)+43,59)
		      // 绘制邀请码
		      // context.setFontSize(12)
		      // context.setFillStyle("#fff");
		      // context.setLineWidth(1);
		      // context.fillText('邀请码:'+inviteCode,(canW/2)-((textw4+40)/2)+43,80)
		       // context.drawImage(avatarPath,(canW/2)-((textw4+40)/2), 47, 40, 40)
		      // 绘脚部第一行
		      let font1 = context.measureText('长按图片识别二维码').width
		      context.setFontSize(10)
		      context.setFillStyle("#676767");
		      context.setLineWidth(1);
		      let numX1 = codeW+((canW-codeW-5-logoW-font1)/2)
		      context.fillText(user.userInfo.nickName,logoW+10,canH-logoW-20+(logoW/4))
		      // 绘脚部第二行
		      let font2 = context.measureText('查看更多限时特卖').width
		      context.beginPath()
		      context.setFontSize(10)
		      context.setFillStyle("#676767");
		      context.setLineWidth(1);
		      let numX2 = codeW+((canW-codeW-5-logoW-font2)/2)
		      context.fillText('邀请码:'+inviteCode,logoW+10,canH-logoW+(logoW/4))
		      // 绘制商品信息
		      wx.showLoading({
			      title: '绘制商品信息中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
			  // context.drawImage(downImgUrl,0, 117, canW, bgh);
			  context.drawImage(downImgUrl,0, 0, canW, bgh);
			  // 绘制logo
			  // wx.showLoading({
			  //     title: '绘制LOGO中',
			  //     mask: true,
			  // })
			  // let downLogoImgUrl  = await downFile('https://jnup.oss-cn-beijing.aliyuncs.com/micro/store/896ae1ca019d4b0bb6730a4bb7c3e525.png')
			  wx.showLoading({
			      title: '绘制头像中',
			      mask: true,
			  })
		      let avatarPath  = await downFile(user.userInfo.avatarUrl)
		      console.log('avatarPath',avatarPath)
			  // context.drawImage(avatarPath,canW-5, canH-(codeW+10-logoW)/2-logoW, logoW, logoW);
			  context.drawImage(avatarPath,5, canH-(codeW+10-logoW)/2-logoW, logoW, logoW);
			  // console.log('进入画二维码',that.shareUrl+'?seckillStartTime='+that.seckillStartTime+'&inviteCode='+inviteCode)
		      qrCodeJs.api.draw(that.shareUrl+'?seckillStartTime='+that.seckillStartTime+'&inviteCode='+inviteCode, 'canvas', 300, 300);
			  wx.showLoading({
			      title: '绘制二维码中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      setTimeout(() => {
		        wx.canvasToTempFilePath({
		          canvasId: 'canvas',
		          // height: 300,
		          success: function (res) {
		            var tempFilePath2 = res.tempFilePath;
		            console.log('临时路径',tempFilePath2);
		            context.drawImage(tempFilePath2, canW-codeW,canH-codeW-5, codeW, codeW);
		            context.rect(0, 0, canW, canH);
		            context.stroke();
		            context.draw(true);
		            console.log('画完了')
		            wx.hideLoading();
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
		async saveImage () {
			console.log('保存到相册')
			let that = this
			let resNum = await shareNum()
		    wx.canvasToTempFilePath({
		      x: 0,
		      y: 0,
		      width: that.canW,
		      height: that.canH,
		      destWidth: that.canW*3,
		      destHeight: that.canH*3,
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
	}
}
</script>

<style type="text/css">
.goShare{
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