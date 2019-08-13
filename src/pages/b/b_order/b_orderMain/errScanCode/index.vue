<template>
  <div class="wrap">
    <div class="errImg">
      <img src="/static/images/errScanCode.png" alt="" @click="scanCode">
    </div>
    <p>扫码失败</p>
    <button @click="scanCode">重新扫描</button>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    // 扫码二维码
    scanCode () {
      wx.scanCode({
        success: (res) => {
          console.log('扫码------'+ res)
           wx.showToast({
            title: "扫码成功",
            duration: 2000
		      })
          wx.navigateTo({
            url: `/pages/b/b_order/b_orderMain/main?scanCode=200`
          })
        },
        // 扫码失败
        fail: () => {
          wx.navigateTo({
            url: `/pages/b/b_order/b_orderMain/errScanCode/main`
          })
        }
      })
    }
  },
}
</script>

<style scoped>
  .wrap{
    height: 100%;
    width: 100%;
    background:rgba(243,247,247,1);
    padding-top: 180px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .wrap .errImg{
    width: 138px;
    height: 138px;
  }
  .wrap .errImg img{
    width: 138px;
    height: 138px;
  }
  .wrap p{
    font-size:16px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(153,157,162,1);
    line-height:22px;
    margin: 26px 0;
  }
  .wrap button{
    width:220px;
    height:50px;
    background:rgba(93,154,252,1);
    border-radius:7px;
    font-size:18px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
</style>
