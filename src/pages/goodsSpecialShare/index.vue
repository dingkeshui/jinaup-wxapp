<template>
	<div class="box">
		<template v-if="isLogin">
			<div class="minBox"><canvas style="width: 70vw; height: 124.88vw;margin:0px auto;" canvas-id="firstCanvas"></canvas></div>
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
		</template>
		<template v-else>
		    <div v-if="showLoginModel" class="loginModelBox" catchtouchmove="ture">
		      <div class="noLoginMain">
		        <div>
		          <img src="/static/images/headimg.png">
		        </div>
		        <div class="logintext">您还未登陆</div>
		        <div class="logintext">请先登陆再进行操作</div>
		        <div class="loginbutBox">
		          <div @click="back">暂不登陆</div>
		          <div>立即登陆<Login v-if="!isLogin" @loginFun="loginFun" /></div>
		        </div>
		      </div>
		    </div>
	    </template>
	</div>
</template>

<script type="text/javascript">
import { getOneSpecial,shareNum } from '@/api/index'
import { downFile,getQueryString } from '@/utils/index';
import Login from "@/components/user/login"; //组件

var qrCodeJs = require("@/utils/qrCode.js");

export default {
	data () {
		return {
			canW:'',
			canH:'',
			topicId:'',
			info:"",
			isLogin:false,
			showLoginModel:false
		}
	},
	components:{
		Login
	},
	onLoad(e){
		console.log('专题分享',e)
		if(!e.topicId){
			wx.showToast({
			  title: '参数错误',
			  icon: 'none',
			  duration: 1500
			})
			setTimeout(function () {
				wx.reLaunch({
					url:'/pages/index/main'
				})
			},2000)
		}
		this.topicId = e.topicId
		// this.createdFun()
	},
	onShow(){
		this.onshowfun()
	},
	onShareAppMessage(res) {
		console.log('调用转发',this.info)
		let that =  this
		let inviteCode = wx.getStorageSync('loginResult').userInfo.inviteCode
		if (res.from === 'button') {
		  // 来自页面内转发按钮
		  console.log(res.target)
		}
		console.log('this.inviteCodeData',this.inviteCodeData)
		// let 
		let title = that.info.title
		let imageUrl = this.info.shareImgUrl
		let getStr = getQueryString(that.info.shareUrl)
        let str = ''
        let num1 = that.info.shareUrl.indexOf('?')
        let url = that.info.shareUrl.slice(0,num1)
        for(let i in getStr){
          str += '&'+i+'='+getStr[i]
        }
        console.log('getStr',str,url)
		// console.log('url1',url1)
		return {
		  title: title,
		  imageUrl:imageUrl,
		  path: "/pages/goodsSpecial/main?url=" + url+str
		}
	},
	methods:{
		back(){
			wx.navigateBack({
				delta:1
			})
		},
		loginFun(){
			console.log('登陆成')
			this.onshowfun()
		},
		onshowfun(){
			let loginResult = wx.getStorageSync('loginResult')
			if(loginResult){
				this.isLogin = true
				this.showLoginModel = false
				this.createdFun()
			}else{
				this.isLogin = false
				this.showLoginModel = true
			}
		},
		async shareToUser () {
			let numres = await shareNum()
		},
		async createdFun(){
			// 获取海报信息
			let that = this
			wx.showLoading({
		      title: '分享图生成中', //提示的内容,
		      mask: true, //显示透明蒙层，防止触摸穿透,
		    })
		    console.log('topicId',that.topicId)
			let res = await getOneSpecial({topicId:that.topicId})
			wx.showLoading({
		      title: '专题信息获取中', //提示的内容,
		      mask: true, //显示透明蒙层，防止触摸穿透,
		    })
			if(res.data.res_code==1){
				this.info = res.data.result
			}else{
				wx.showToast({
                  title: res.data.message?res.data.message:'信息获取失败', //提示的内容,
                  icon: 'none', //图标,
                });
                return
			}
			console.log('海报信息',res)
			// 获取用户信息
    		let user = wx.getStorageSync('user')
    		// 获取邀请码
    		let inviteCode = wx.getStorageSync('loginResult').userInfo.inviteCode
    		// 获取屏幕宽高
		    const telInfo = wx.getSystemInfoSync()
		    let telWidth = telInfo.screenWidth
		    let canW = telWidth*0.7
     		let canH = telWidth*1.2488
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
		      let downImgUrl  = await downFile(res.data.result.shareImgUrl)
		      console.log('downImgUrl',downImgUrl)
		      // let num = canW/res.data.result.shareImgWidth
		      // let num2 = res.data.result.shareImgHeight*num
		      // console.log('www',canW,num,num2)
		      context.drawImage(downImgUrl, 0, 0, canW,canH);
		      // 绘制白色容器
		      context.rect(0, canH-10-(canW/5), canW, (canW/5)+10)
		      context.save();
		      context.setFillStyle('#fff')
		      context.fill()
		      // 绘制头像
		      wx.showLoading({
			      title: '绘制头像中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      let avatarPath  = await downFile(user.userInfo.avatarUrl)
		      context.drawImage(avatarPath, 5, canH-5-(canW/5), (canW/5), (canW/5));
		      context.setFontSize(10)
		      context.setStrokeStyle("#ccc");
		      context.setLineWidth(0.5);
		      // 绘制名字
		      wx.showLoading({
			      title: '绘制名字中', //提示的内容,
			      mask: true, //显示透明蒙层，防止触摸穿透,
			  })
		      context.setFillStyle('#000')
		      this.drawText(context,user.userInfo.nickName,canH-(canW/5)+5,canW-20-(canW*2/5),(canW/5)+10,)
		      // context.fillText(user.userInfo.nickName,(canW/5)+10,canH-(canW/5)+5,100,20)
		      context.fillText('邀请码：'+inviteCode,(canW/5)+10,canH-15,100,20)
		      console.log('进入画二维码',res.data.result.shareUrl)
		      qrCodeJs.api.draw(res.data.result.shareUrl, 'canvas', 300, 300);
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
		            context.drawImage(tempFilePath, canW-5-(canW/5), canH-(canW/5)-5, (canW/5)+5, (canW/5)+5);
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
		async saveImage() {
	      let that = this
	      let res2 = await shareNum()
	      wx.canvasToTempFilePath({
	          x: 0,
	          y: 0,
	          // width: 197,
	          width: that.canW,
	          // height: 350,
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
	                console.log('res...', res);
	              },
	              fail(err) {
	                wx.showToast({
	                  title: '保存到相册失败', //提示的内容,
	                  icon: 'none', //图标,
	                });
	              }
	            })
	          }
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
.loginModelBox .logintext{
  font-weight: bold;
}
.loginModelBox img{
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}
.loginModelBox .loginbutBox{
  display: flex;
  margin-top: 20px;
  justify-content: center;
  font-size: 14px;
}
.loginModelBox .loginbutBox>div:nth-child(2n-1){
  color: #33D6C5;
  border:1px solid #33D6C5;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
}
.loginModelBox .loginbutBox>div:nth-child(2n){
  color: #fff;
  border:1px solid #33D6C5;
  background-color: #33D6C5;
  padding: 5px 10px;
  border-radius: 5px;
  position: relative;
}
.divBox{
	width: 100vw;
	height: 100vh;
}
</style>
