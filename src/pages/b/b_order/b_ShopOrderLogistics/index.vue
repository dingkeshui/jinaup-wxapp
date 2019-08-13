<template>
  <!-- <div>物流信息</div> -->
   <div class="wrap">
    <scroll-view scroll-y>
       <!-- 头部信息 -->
    <div class="header">
      <dl class="Box">
        <dt class="dtimg"><img src="/static/images/wl.png"/></dt>
        <dd class="cont">
          <h4 class="txt">中通快递</h4>
          <p class="text">
            <span class="numbers">快递单号：123456789876</span>
            <span class="copy" @click="copyClick(123456789876)">复制</span>
          </p>
        </dd>
      </dl>
    </div>
    <!-- 物流详情信息 -->
    <div class="massage">
      <div class="msgBox">
        <div class="leftTxt">
          <div class="add">收</div>
        </div>
        <div class="rightTxt">
           <div class="rightTxtCont">
              <p>已签收</p>
              <p>签收人：<span class="name">张晓倩</span>感谢中通快递,期待为您服务</p>
           </div>
           <p class="time">2018-10-11 10:23:45</p>
        </div>
      </div>
      <div class="box">
        <div class="left"></div>
        <div class="right">
          <div class="mgb5">北京市]北京市【北京垡头分部】，【王志才/ 朝阳区焦化厂 已收入</div>
          <div>2018-10-11 10:23:45</div>
        </div>
      </div>
      <div class="box">
        <div class="left"></div>
        <div class="right">
          <div class="mgb5">北京市朝阳区焦化厂 正法网【北京市发头分布垡头】</div>
          <div>2018-10-11 10:23:45</div>
        </div>
      </div>
      <div class="box">
        <div class="left"></div>
        <div class="right">
          <div class="mgb5">北京市朝阳区焦化厂 正法网【北京市发头分布垡头】</div>
          <div>2018-10-11 10:23:45</div>
        </div>
      </div>
      <div class="box">
        <div class="left"></div>
        <div class="right">
          <div class="mgb5">北京市朝阳区焦化厂 正法网【北京市发头分布垡头】</div>
          <div>2018-10-11 10:23:45</div>
        </div>
      </div>
      <div class="box">
        <div class="left"></div>
        <div class="right">
          <div class="mgb5">北京市朝阳区焦化厂 正法网【北京市发头分布垡头】</div>
          <div>2018-10-11 10:23:45</div>
        </div>
      </div>
      <div class="box">
        <div class="left"></div>
        <div class="right">
          <div class="mgb5">北京市朝阳区焦化厂 正法网【北京市发头分布垡头】</div>
          <div>2018-10-11 10:23:45</div>
        </div>
      </div>
      <!-- <div v-for="item in info" class="msgBox">
        <div class="leftTxted">
          <div class="added"></div>
        </div>
        <div class="rightTxt">
           <div class="rightTxtCont">
              <p class="product">{{item.context}}</p>
           </div>
           <p class="timed">{{item.time}}</p>
        </div>
      </div> -->
    </div>
    </scroll-view>


    <div class="nullBox">
			<img mode="aspectFit" src="/static/images/dsh.png">
			<span>暂无物流消息哦~</span>
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    // 复制快递单号
    copyClick (num) {
      wx.setClipboardData({
		    data: num.toString(),
		    success(res) {
		      wx.showToast({
		        title: "复制成功", //提示的内容,
		        icon: "none" //图标,
		      })
		    }
		  })
    }
  }
}
</script>

<style scoped>
  /* 盒子 */
.wrap{
  width: 100%;
  height: 100%;
  background: rgba(243, 247, 247, 1);
}
/* 无物流盒子 */
.nullBox{
	height: 60vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
  display: none;
}
.nullBox img{
	width: 138px;
	height: 138px;
	margin-bottom: 10px;
}
.nullBox span{
	color: #999DA2;
	font-size: 16px;
}
/* 有物流 */
scroll-view{
  width: 100%;
  height: 100%;
  /* padding:0 9px;
  box-sizing: border-box; */
  display: flex;
  flex-direction: column;
}

/* 头部 */
.header{
  width: 100%;
  height: 97px;
  background: #fff;
  margin-top:10px;
}
.Box{
  display: flex;
}
.header>dl .dtimg>img{
  width: 61px;
  height: 65px;
  margin-top:19px;
  margin-left:12px;
}
.txt{
  width: 72px;
  height: 25px;
  font-size: 18px;
  color:#323A45;
  margin-top:25px;
  font-weight: bold;

}
.text{
  display: flex;
  margin-top:3px;
}
.numbers{
  width: 169px;
  height: 20px;
  color:#323A45;
  font-size: 14px;
}
.copy{
  display: block;
  width: 38px;
  height: 18px;
  color:#FC5D7B;
  font-size: 11px;
  border:solid 1px #FC5D7B;
  border-radius: 3px;
  margin-left:5px;
  text-align: center;
  line-height: 18px;
}
.cont{
  margin-left:9px;
}
/* 物流详情 */
.massage{
  width: 100%;
  margin-top:10px;
  /* position: relative; */
}
.msgBox{
  width: 100%;
  height: 62px;
  background: #fff;
  padding: 19px 29px 0 10px;
  box-sizing: border-box;
  display: flex;
  line-height: 100%;
  /* margin-top:19px; */
}
.rightTxtCont{
  width: 318px;
  height: auto;
  font-size: 16px;
  color:#323A45;
}
.rightTxtCont>p:nth-child(2){
  font-size: 14px;
}
.product{
  width: 283px;
  height: 40px;
  color:#999DA2;
  font-size: 14px;
  margin-top:24px;
}
.producted{
  width: 332px;
  height: auto;
  color:#999DA2;
  font-size: 14px;
  margin-top:24px;
}
/* .rightTxted{
  height: auto;
} */
.rightTxt{
  display: flex;
  flex-direction: column;
  justify-content:center;
  margin-left:12px;
}
.time{
  /* width: 133px; */
  height: 20px;
  font-size: 14px;
  color:#323A45;
}
.timed{
  color:#999DA2;
  font-size: 14px;
  /* margin-top:-20px; */
}
.name{
  margin-left:3px;
  margin-right:3px;
}
/* 收 */
.leftTxt{
  width:24px;
  height:24px;
  border-radius: 12px;
  background: #31D3F3;
  color:#fff;
  font-size: 12px;
  flex-shrink: 0;
  text-align: center;
  line-height: 24px;
  margin-top:8px;
  z-index: 99;
  position: relative;
}

.leftTxt::before{
  content:'';
  display: inline-block;
  width: 2px;
  background-color: rgba(246,246,246,1);
  height: 100%;
  position: absolute;
  z-index: 1;
  left: 10px;
  top: 24px;
}

.leftTxted{
  width:8px;
  height:8px;
  border-radius: 4px;
  background: #ccc;
  color:#fff;
  font-size: 12px;
  flex-shrink: 0;
  text-align: center;
  line-height: 24px;
  margin-top:30px;
  margin-left:8px;
  z-index: 99;
}
/* 左边的线 */
/* .line{
  width:2px;
  height:100%;
  background:rgba(246,246,246,1);
  position: absolute;
  top:150px;
  left:32px;
} */
.box{
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  font-size: 14px;
  color: #999DA2;
}
.left{
  width: 30px;
  position: relative;
}
.left:after{
  content:'';
  display:inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #BBBBBB;
  position: absolute;
  left: 15px;
  top: 30px;
  z-index: 2;
}
.left:before{
  content:'';
  display: inline-block;
  width: 2px;
  background-color: rgba(246,246,246,1);
  height: 100%;
  position: absolute;
  z-index: 1;
  left: 20px;
  top: 0px;
}
.mgb5{
  margin-bottom: 5px;
}
.right{
  padding: 20px 15px 0 25px;
}
</style>
