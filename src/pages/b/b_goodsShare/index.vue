<template>
  <div class="ShareWrap">
    <h2>{{info.title}}</h2>
    <div class="price">【在售价】{{info.currentPrice}}元</div>

    <div class="center">
      <div class="left">
         <canvas v-for="(item,index) in imgMap" v-show="onImgIndex==index" style="width: 52.7vw; height: 93.2vw;" :canvas-id="'firstCanvas'+index"></canvas>
      </div>
      <div class="prolist">
        <div
          class="prolists"
          v-for="(item,index) in imgMap"
          :key="index"
          @click="handleImg(item,index)"
        >
          <image v-if="item.on" class="img1" src="/static/images/true2.png"/>
          <image class="img2" :src="item.url"/>
        </div>
      </div>
    </div>
    <div class="footer">
      <ul>
        <!-- <li>
          <img src="/static/images/7.png">
          <span>复制文案</span>
        </li>
        <li>
          <img src="/static/images/5.png"/>
          <span>朋友圈</span>
        </li> -->
        <li @click="saveImage">
          <img src="/static/images/6.png"/>
          <span>保存到相册</span>
        </li>
        <li class="shareButBox">
          <button
          open-type="share"
          class="shareBut"
          @click="shareToUser"
          hover-class="none"
          plain></button>
          <img src="/static/images/7.png"/>
          <span>微信好友</span>
        </li>
        <!-- <li>
          <img src="/static/images/4.png"/>
          <span>复制文案</span>
        </li> -->
      </ul>
    </div>
    <canvas style="width: 300px; height: 300px;position:absolute;z-index:-1;top:0px;left:-400px;options:0;" canvas-id="canvas"></canvas>
  </div>
</template>

<script>
// import {getDetail} from '@/api/index'
import {downFile} from '@/utils/index'
import {imgToBase64,shareNum} from '@/api/index'
import {productShare,getDetail} from '@/pages/b/api/index'

var qrCodeJs = require("@/utils/qrCode.js");

export default {
  data() {
    return {
      info: {},
      imgMap:[],
      idMiaoSha:false,
      canW:'',
      canH:'',
      onImgIndex:0,
      id: '',
      storeId: '',
      imgurl: 'https://jnup.oss-cn-beijing.aliyuncs.com/product/9fd2e33bf74b3ae2a652cd5a8e525949.jpg' // 没有商品图片时的备用图片
    };
  },
  async onLoad(options){
  	// options.id=522
    this.id = options.id
    this.storeId = options.storeId
    wx.showShareMenu({
      withShareTicket: true
    })
    this.onImgIndex = 0
    let that = this
    // 1.获取商品详情信息
    let result = await getDetail({pid: that.id})
    console.log('result...', result)
    if (result.data.res_code !== 1){
        wx.showToast({
          title: '获取商品信息失败', //提示的内容,
          icon: 'none' //图标,
        });
      return;
    }
    this.info = result.data.result
    console.log('获取商品详情',result.data.result)
    // let goodsDetail = [result.data.result]
    // console.log('获取商品详情',goodsDetail)
    const inviteCode = wx.getStorageSync('inviteCode')
    // this.info.xcxFriendShareUrl = `${that.$store.state.requsetUrl}/pages/b/b_goodsInfo/main?id=${that.id}&fromInviteCode=${inviteCode}`
    // this.imgMap = [result.data.result.mainImgUrl]
    this.imgMap = []
    if(this.info.pictures&&this.info.pictures.length){
      this.info.pictures.map((val,index)=>{
        if(index===0){
          this.imgMap.push({url:val.imgUrl,on:true})
        }else{
          this.imgMap.push({url:val.imgUrl,on:false})
        }
        
      })
    }
    else{
      this.imgMap.push({url:this.imgurl,on:true})
    }
    console.log('img数组',this.imgMap)
    this.canvasFun()
  },
  onShareAppMessage(res) {
    console.log('调用转发')
    let that = this
    let inviteCode = wx.getStorageSync('loginResult').userInfo.inviteCode
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      // 2.
      this.saveProShare()

    }
    return {
      title: this.info.title,
      imageUrl:this.imgMap[0].url,
      path: 'pages/b/b_goodsInfo/main?id='+that.id+'&fromInviteCode='+inviteCode+'&storeId='+that.storeId
    }
  },
  methods: {
    // 2.储存商品分享信息
    async saveProShare () {
      let that = this
      const res = await productShare({
        pid: that.info.pid
        // sid:that.info.swid,
        // uid:that.info.uid,
        // createTime:that.info.createTime,
        // updateTime:that.info.updateTime
      })
      console.log('储存商品分享信息',res)
      // if (res.data.res_code === 1){
      //   console.log('')
      // }
    },
    // 画图
  async canvasFun () {
    wx.showLoading({
      title: '分享图生成中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
    });
    let that=  this
      // 绘制canvas
    const context = wx.createCanvasContext("firstCanvas"+this.onImgIndex);

    // 获取用户信息
    let user = wx.getStorageSync('user');
    console.log('user...', user, 'mainImgUrl...', this.imgMap[0]);
    // 获取邀请码
    let inviteCode = wx.getStorageSync('inviteCode');
    console.log('111',inviteCode)
    // 获取屏幕宽高
     const telInfo = wx.getSystemInfoSync()
     let telWidth = telInfo.screenWidth
     console.log('屏幕信息',telInfo,telWidth)
     let canW = telWidth*0.527
     let canH = telWidth*0.932
     this.canH = canH
     this.canW = canW
     console.log('画布宽度',canW,canH)
    // 绘制白色背景
    // context.rect(0, 0, 197, 350)
    context.rect(0, 0, canW, canH)
    context.save();
    context.setFillStyle('#fff')
    context.fill()
    context.draw(true, async ()=>{
      context.restore();
       // 绘制头像
      wx.showLoading({
        title: '下载头像中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      let avatarPath  = await downFile(user.userInfo.avatarUrl);
      wx.showLoading({
        title: '绘制头像中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      context.drawImage(avatarPath, 5, 10, 30, 30);
      context.setFontSize(7)
      context.setStrokeStyle("#ccc");
      context.setLineWidth(0.5);
      // 绘制名字
      context.setFillStyle('#000')
      // this.drawText(context,user.userInfo.nickName+'分享给你一个商品',17,canW-50,40,10);
      context.fillText('邀请码：'+inviteCode,40,23,100,20)

      // 绘制商品
      console.log('改变为base64',this.imgMap[0].url+'')
      wx.showLoading({
        title: '下载详情图中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });

      let imgToBase64Url = await imgToBase64({imgUrl:this.imgMap[this.onImgIndex].url+''})
      wx.showLoading({
        title: '绘制详情图中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      console.log('imgToBase64Url',imgToBase64Url)
      let imgPath;
      //
      const fsm = wx.getFileSystemManager();
      let filePath
      const base64src = function (base64data) {
        return new Promise((resolve, reject) => {
          let FILE_BASE_NAME = 'tmp_base64src' + new Date().getTime();
          console.log('FILE_BASE_NAME',FILE_BASE_NAME)
          const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
          if (!format) {
            reject(new Error('ERROR_BASE64SRC_PARSE'));
          }
          filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
          const buffer = wx.base64ToArrayBuffer(bodyData);
          console.log('本地函数前面',buffer,filePath)
          wx.showLoading({
            title: '缓存详情图中', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
          });
          fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success() {
              console.log('本地函数成')
              resolve(filePath);
            },
            fail(data) {
              console.log('本地函数失败',data)
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '缓存过多,清理后重试',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                  that.clearImg()
                }
              })
              return
              reject(new Error('ERROR_BASE64SRC_WRITE'));
            },
          });
        });
      };

      let srcc;
      if(imgToBase64Url.data.res_code==1){
        console.log('img专程64成功')
        srcc = await base64src(imgToBase64Url.data.result)
        console.log('srcc',srcc)
        imgPath = srcc;
        console.log('end',imgPath)
      }else{
        imgPath = await downFile(this.imgMap[onImgIndex].url);
      }
      context.drawImage(imgPath, 10, 50, canW-20, canW-20);
      // 绘制商品标题
      wx.showLoading({
        title: '绘制价格标题中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      context.save();
      context.setFillStyle('#000')
      context.setFontSize(8)
      this.drawText(context, this.info.title,canW+45,canW-15);
      context.restore();

      // 绘制价格
      context.save();
      context.setFillStyle('red')
      if(this.info.productType==2){
        context.setFontSize(7)
        context.fillText('秒杀价',10,canH-25,160,50)
        context.restore();
        context.setFillStyle('red')
        context.fillText('￥',30,canH-25,160,90)
        context.restore();
        context.setFontSize(10)
        context.fillText(this.info.currentPrice,40,canH-25,160,90)
        context.restore();
      }else{
        context.fillText('￥',10,canH-25,160,90)
        context.restore();
        context.setFillStyle('red')
        context.setFontSize(10)
        context.fillText(this.info.currentPrice,20,canH-25,160,90)
      }
      context.restore();
      context.setFillStyle('#aaa')
      context.setFontSize(10)
      // if(this.info.productType==1){
      //   console.log('会员产品')
      // }else{
        //
        // if(this.info.marketPrice&&this.info.marketPrice>this.info.salesPrice){
        //     context.fillText('￥'+(this.info.marketPrice?this.info.marketPrice:this.info.salesPrice),60,canH-25,160,90)
        //     context.restore();
        //     context.save();
        //     context.setFillStyle('#000')
        //     let str1 = context.measureText('￥'+(this.info.marketPrice?this.info.marketPrice:this.info.salesPrice)).width
        //     console.log('长度',str1,60+str1)
        //     context.moveTo(60,canH-29)
        //     context.lineTo(60+str1, canH-29)
        //     context.restore();
        // }
      // }
      // 绘制二维码
      context.setFillStyle('#000')
      context.fillText('长按识别二维码访问',10,canH-10,160,90)
      console.log('二维码路径',this.info.baseUrl)
      qrCodeJs.api.draw(that.info.baseUrl, 'canvas', 300, 300);
      console.log('生成')
      setTimeout(() => {
        wx.showLoading({
          title: '绘制二维码中', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          // height: 300,
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            console.log('临时路径',tempFilePath);
            context.drawImage(tempFilePath, canW-65, canH-65, 60, 60);
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
    })
    },
    //清理缓存
    clearImg(){
      console.log('清理文件')
      let that = this
      wx.showLoading({
        title: '清理缓存中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      let fsm = wx.getFileSystemManager()
      fsm.readdir({
        dirPath:wx.env.USER_DATA_PATH,
        success:(res)=>{
          console.log('readdir',res,res.files.length,res.files[0])
          if(res.files&&res.files.length){
            let num = 1
            wx.showLoading({
              title: '清理缓存'+num+'/'+res.files.length, //提示的内容,
              mask: true, //显示透明蒙层，防止触摸穿透,
            });
            res.files.map(val=>{
              if(val.indexOf('tmp_base64src'>=0)){
                let str = `${wx.env.USER_DATA_PATH}/${val}`
                console.log('filePath',str)
                fsm.unlink({
                  filePath:str,
                  success:res2=>{
                    console.log('成',res2)
                    num++
                    wx.showLoading({
                      title: '清理缓存'+num+'/'+res.files.length, //提示的内容,
                      mask: true, //显示透明蒙层，防止触摸穿透,
                    });
                  },
                  fail:res2=>{
                    console.log('失败',res2)
                  }
                })
              }
            })
            this.imgMap.map((val,index)=>{
              this.onImgIndex = 0
              if(index===0){
                this.$set(this.imgMap[index],'on',true)
              }else{
                this.$set(this.imgMap[index],'on',false)
              }
            })
            that.canvasFun()
          }
        }
      })
    },
    // 分享给朋友
    async shareToUser(){
      console.log('分享给朋友')
      let resNum = await shareNum()
    },
    handleImg(item, index) {
      if(item.on){
        let num = 0
        for(let i in this.imgMap){
          if(this.imgMap[i].on){
            num++
          }
        }
        console.log('num',num)
        if(num<2){
          return
        }
      }
      console.log('哈哈啊哈哈')
      this.$set(this.imgMap[index],'on',!this.imgMap[index].on)
      console.log(this.imgMap[index].on)
      if(this.imgMap[index].on){
        this.onImgIndex = index
        this.canvasFun()
      }
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
    async saveImage() {
      let that = this
      let resNum = await shareNum()
      this.imgMap.map((val,index)=>{
        if(val.on){
          this.saveImageFun(index)
        }
      })
    },
    saveImageFun(index) {
      let that = this
      wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          // width: 197,
          width: that.canW,
          // height: 350,
          height: that.canH,
          destWidth: 591,
          destHeight: 1050,
          fileType: 'jpg',
          quality: 1,
          canvasId: 'firstCanvas'+index,
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
    }
  },
  previewImage () {
    console.log('点击二维码')
    wx.previewImage({
      current: that.info.baseUrl,
      urls: [that.info.baseUrl]
    })
  }
};
</script>

<style>
.ShareWrap {
  width: 100%;
  height: 100%;
}

.ShareWrap h2 {
  font-weight: 600;
  font-size: 40rpx;
  width: 658rpx;
  margin: 0 auto;
}

.price {
  width: 690rpx;
  height: 60rpx;
  margin: 0 auto;
  margin-top: 20rpx;
}

.center {
  /*width: 700rpx;*/
  width: 100vw;
  margin: 1vw 1vw;
  /* height: 795rpx; */
  display: flex;
  justify-content: space-between;
}

.left {
  width: 100%;
  height: 760rpx;
}

.left dl {
  width: 100%;
  display: flex;
  height: 80rpx;
  display: flex;
  align-items: center;
}
.left dl dt {
  width: 18%;
  text-align: center;
  margin-right: 17rpx;
}
.left dl dt img {
  width: 60rpx;
  height: 60rpx;
}

.left dl dd {
  font-size: 24rpx;
  flex: 1;
  line-height: 33rpx;
  display: flex;
  flex-direction: column;
}
.bigImg {
  margin-top: 25rpx;
}
.bigImg img {
  width: 412rpx;
  height: 400rpx;
}

.text {
  font-size: 30rpx;
}

.foot {
  height: 175rpx;
  display: flex;
  justify-content: space-between;
  margin-top: 25rpx;
  padding: 0 15rpx;
}

.footLeft p:first-child {
  display: flex;
  font-size: 24rpx;
  height: 50rpx;
  align-items: center;
}
.footLeft p:first-child span {
  margin: 0 3rpx;
  display: flex;
}
.footLeft p:first-child span i {
  margin-top: 10rpx;
}
.footLeft p:first-child span b {
  font-size: 36rpx;
  color: red;
  font-weight: bold;
}

.footLeft p:first-child span:last-child {
  color: #ccc;
  font-size: 24rpx;
  margin-top: 5rpx;
}

.footLeft p:last-child {
  font-size: 28rpx;
}

.footRight img {
  width: 120rpx;
  height: 120rpx;
}

.prolist {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.prolists {
  width: 20vw;
  height: 20vw;
  box-sizing: border-box;
  border: 2rpx solid #ededed;
  margin-left: 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 18rpx;
}
.prolists .img1 {
  width: 42rpx;
  height: 42rpx;
  position: absolute;
  top: 2px;
  right: 2px;
}
.prolists .img2 {
  width: 16vw;
  height: 16vw;
}

.footer {
  height: 175rpx;
}

.footer ul {
  display: flex;
  justify-content: space-around;
}

.footer ul li {
  text-align: center;
  font-size: 30rpx;
  display: flex;
  flex-direction: column;
}

.footer ul li img {
  width: 100rpx;
  height: 100rpx;
  margin: 15rpx auto;
}
</style>
