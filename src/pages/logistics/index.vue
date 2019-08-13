<template>
  <div class="wrap">
    <!-- 头部信息 -->
    <div class="header">
      <dl class="Box">
        <dt class="img2"><img src="/static/images/wl.png"/></dt>
        <dd class="cont">
          <h4 class="txt">{{name}}</h4>
          <p class="text"><span class="numbers">快递单号：{{num}}</span><span class="copy" @tap="copyClick">复制</span></p>
        </dd>
      </dl>
    </div>
    <!-- 下边物流详情信息 -->
    <div class="massage">
      <!-- <div class="msgBox">
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
      </div> -->
      <div class="box" v-for="(item,index) in info" :key="index">
        <div class="left"></div>
        <div class="right">
          <div class="mgb5">{{item.context}}</div>
          <div>{{item.time}}</div>
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
   <!--  <div class="line">
    </div> -->
  </div>
</template>

<script>
import { kauDiInfo } from '@/api/index'

export default {
  data(){
    return {
      name:'',
      num:'',
      info:''
    }
  },
  async onLoad(options){
    console.log('物流',options)
    this.name = options.company
    this.num = options.num
    let result = await kauDiInfo({
      com: options.com,
      num: options.num,
      phone:options.phone
    })
    console.log('result',result)
    if(result.data.res_code==1){
      this.info = result.data.result
    } else {
      wx.showToast({
        title: '未查询到',
        icon: 'none',
        duration: 2000
      })
    }
    wx.setNavigationBarTitle({
      frontColor: '#000',
      title: '物流信息'
    })
  },
  methods:{
    copyClick:function(){
      wx.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 2000
      })
    }
  }

}
</script>

<style scoped>
/* 大盒子 */
.wrap{
  width: 100%;
  height: 100%;
  padding:0 9px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(243, 247, 247, 1);
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
.header>dl .img2>img{
  width: 61px;
  height: 65px;
  margin-top:19px;
  margin-left:12px;
}
.txt{
  /*width: 72px;*/
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
/* 下边物流详情 */
.massage{
  width: 100%;
  /* background: #ccc; */
  margin-top:10px;
  /* position: relative; */
}
.msgBox{
  width: 100%;
  height: 62px;
  background: #fff;
  padding: 0 29px 0 13px;
  box-sizing: border-box;
  display: flex;
  line-height: 100%;
  padding-top:19px;

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
.line{
  width:2px;
  height:100%;
  background:rgba(246,246,246,1);
  position: absolute;
  top:150px;
  left:32px;
}
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
  top: 15px;
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
  left: 18px;
  top: 15px;
}
.mgb5{
  margin-bottom: 5px;
}
.right{
  padding: 10px;
}
</style>
