<template>
<!-- 认证资质 -->
  <div class="wrap">
    <scroll-view scroll-y>
      <div class="title">积纳有品网店经营者资质认证信息</div>
      <div class="info">
        <p>根据国家工商总局《网络交易管理办法》要求对网店营业执照等信 息公示如下：</p>
        <img v-for="(item,index) in codeInfo" :key="index" :src="item" alt="" mode="aspectFit">
        <!-- <img src="../img/zhizhao-2.png" alt=""> -->
      </div>
      <div class="other">
        注：以上营业执照和资质信息来源于卖家自行申报或工商系统数据，具体以工商部门]登记为准。经营者需确保信息真实有效，平台也将定期核查。如与实际不符，为避免违规，请联系当地工商部门或平台客服更新。
      </div>
    </scroll-view>

  </div>
</template>

<script>
import {getStoreQualification} from '@/pages/b/api/index'
export default {
  data() {
    return {
      storeId: '',
      codeInfo: ''
    }
  },
  async onLoad (params) {
    this.storeId = params.id
    const res = await getStoreQualification({id:params.id})
    console.log('资质认证',res)
    if (res.data.res_code ===1){
      this.codeInfo = res.data.result
    }
  }
}
</script>

<style scoped  type="text/css">
  .wrap{
    width: 100%;
    height: 100%;
  }
  scroll-view{
    width: 100%;
    padding: 0 40rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    top: 0;
    bottom: 0;
  }
  .wrap .title{
    font-size:32rpx;
    color:rgba(50,58,69,1);
    text-align: center;
    padding: 40rpx 0;
    font-weight:500;
  }
  .wrap .info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .wrap .info p{
    font-size:28rpx;
    color:rgba(120,120,120,1);
    line-height:40rpx;
    text-align: left;
  }
  .wrap .info img{
    width:285px;
    height:379px;
    /* background:rgba(216,216,216,1); */
    margin-top: 40rpx;
  }
  .wrap .other{
    font-size:24rpx;
    color:rgba(153,157,162,1);
    text-align: left;
    padding: 40rpx 41rpx 26rpx 41rpx;
  }
</style>
