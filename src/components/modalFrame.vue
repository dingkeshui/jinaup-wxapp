<template>
  <div class="mwrap">
    <div class="cen">
      <p class="colSize">
        <span>
          <span style="margin-left:5px;" v-for="(item,index) in skuData" :key="index">{{item.aname}}</span>
        </span>
        <span class="closeSpan" @click="closeFun">X</span>
      </p>
      <dl>
        <dt style="margin-right:5px;">
          <img v-if="!skuImgUrl" :src="goodInfo.mainImgUrl" alt>
          <img v-else :src="skuImgUrl">
        </dt>
        <dd>
          <template v-if="onSku">
            <p v-if="isMiaoSha">￥{{onSku.seckillPrice?onSku.seckillPrice:onSku.salesPrice}}</p>
            <p v-else>￥{{onSku.salesPrice}}</p>
            <p v-if="onSku.store">库存：{{onSku.store}}</p>
          </template>
          <template v-else>
            <p v-if="isMiaoSha">{{goodInfo.seckillPrice?goodInfo.seckillPrice:goodInfo.salesPrice}}</p>
            <p v-else>￥{{goodInfo.salesPrice}}</p>
            <p v-if="goodInfo.totalStock">库存：{{goodInfo.totalStock}}</p>
          </template>
        </dd>
      </dl>
      <div class="colors" v-for="(item,index) in skuData" :key="index">
        <p class="aname">{{item.aname}}</p>
        <ul>
          <template v-for="(itm,idx) in item.attributeValueRelationVoList">
            <li
              v-if="itm.canClick"
              @click="btn(idx,itm,index)"
              :class="[{bg:idx==indexArr[index]?true:false},{isHaveStore:!itm.isHaveStore}]"
            >{{itm.vname}}</li>
            <li class="noSku" v-else>{{itm.vname}}</li>
          </template>
        </ul>
      </div>
      <div class="numbox">
        <span class="sl">
          数量
          <template v-if="onSku">
            <span v-if="onSku.buyerNumber" class="maxByNumSpan">每人限购{{onSku.buyerNumber}}件</span>
          </template>
        </span>
        <div class="num">
          <span @click="changeNum1">-</span>
          <span class="number">{{onSku.onNum?onSku.onNum:'1'}}</span>
          <span @click="changeNum2">+</span>
        </div>
      </div>
      <button v-if="onSku.store<=0" class="btn noStore">库存不足</button>
      <template v-else>
        <button v-if="onSku.state==0" class="btn noStore">已下线</button>
        <button v-else class="btn" @click="toShow">确定</button>
      </template>
    </div>
  </div>
</template>
<script>
import { getOneSkuInfo } from '@/api/index'

export default {
  data() {
    return {
      pid: "",
      boo: false,
      show: false,
      indexArr: [],
      onSku: "", //选中的sku信息
      isMiaoSha: false,
      skuImgUrl:''//sku的图片
    };
  },
  props: {
    goodInfo: "",//商品详情
    skuData: "", //所有的sku 列表
    onSkuIndexArr: "",
    onSkuInfo: "" 
  },
  onLoad() {
    var that = this;
    // if (!that.goodInfo.supplierProductSkuVoList&&that.goodInfo.productSeckillInfoVoList) {
    //   that.goodInfo.supplierProductSkuVoList = that.goodInfo.productSeckillInfoVoList
    // }
    if (!that.goodInfo.supplierProductSkuVoList&&that.goodInfo.seckillProductInfoVoList) {
      that.goodInfo.supplierProductSkuVoList = that.goodInfo.seckillProductInfoVoList
    }
    if (that.goodInfo.seckillEndTime&&that.goodInfo.seckillStartTime) {
      let nowTimeStr = new Date().getTime()
      if(that.goodInfo.seckillEndTime>nowTimeStr&&that.goodInfo.seckillStartTime<=nowTimeStr){
        that.isMiaoSha = true
      }
    }
    let isOnlyOne = true
    that.skuData.map((item, index) => {
      that.indexArr.push(-1)
      if (item.attributeValueRelationVoList.length>1) {
        isOnlyOne = false
      }
      item.attributeValueRelationVoList.map((val2,index2)=>{
        that.$set(this.skuData[index].attributeValueRelationVoList[index2],'canClick',true)
        that.$set(this.skuData[index].attributeValueRelationVoList[index2],'isHaveStore',true)
      })
    })
    if(isOnlyOne){
      console.log('isOnlyOne',isOnlyOne)
      for(let i in that.indexArr){
        that.indexArr[i] = 0
      }
      console.log('isOnlyOne22',JSON.stringify(that.indexArr))
    }
    that.goodInfo.supplierProductSkuVoList.map(val3=>{
      if(typeof val3.attributeValueJson == 'string'){
        val3.attributeValueJson = JSON.parse(val3.attributeValueJson)
        let str = []
        val3.attributeValueJson.map(val=>{
          str.push(val.valueVo.vid)
        })
        val3.vids = this.sortFun(str)
      }
    })
    let num = "";
    if (that.onSkuInfo && that.onSkuInfo.onNum) {
      num = that.onSkuInfo.onNum;
    }
    console.log(
      "goodInfo",
      that.goodInfo,
      that.onSkuIndexArr,
      that.onSkuInfo,
      that.skuData
    )
    that.getOnSkuInfo(num);
    that.dontCanClick()
    if (that.onSkuIndexArr) {
      that.onSkuIndexArr.map((val,index)=>{
        if(val>=0){
          that.btn(val,that.skuData[index].attributeValueRelationVoList[val],index)
        }
      })
    }
    console.log('indexArr',that.indexArr)
  },
  methods: {
    // 设置sku不可选中的状态
    dontCanClick(){
      let arr = this.goodInfo.supplierProductSkuVoList
      this.skuData.map((val,index)=>{
        val.attributeValueRelationVoList.map((val2,index2)=>{
          let isHave = true
          for(let i in arr){
            if (arr[i].vids.indexOf(val2.vid)>=0&&arr[i].store) {
              isHave = false
              return
            }
          }
          if (isHave) {
            val2.canClick = false
          }
        })
      })
    },
    // 处理按钮状态
    skuButTypeFun (itemIndexData,indexData) {
      let that = this
      let attrStr = []
      let isHaveOnArr = []
      this.indexArr.map((val,index)=>{
        isHaveOnArr.push(false)
        if (val>=0) {
          isHaveOnArr[isHaveOnArr.length-1] = true
          attrStr.push(this.skuData[index].attributeValueRelationVoList[val].vid)
        }
      })
      if (attrStr.length) {
        let arr = that.goodInfo.supplierProductSkuVoList
        let onSkuDataArr = []
        let skuDataArr = []
        isHaveOnArr.map((val,index)=>{
          if (val) {
            // if (indexData!=index) {
              onSkuDataArr.push(this.skuData[index])
            // }
          } else {
            skuDataArr.push(this.skuData[index])
          }
        })
        console.log('处理未选中的sku',skuDataArr)
        skuDataArr.map((val,index)=>{
          val.attributeValueRelationVoList.map((val2,index2)=>{
            let isHaveThis = false
            let newArr =[val2.vid] 
            newArr = newArr.concat(attrStr)
            for (let k in arr) {
              let isHave = true
              for(let i in newArr){
                if(arr[k].vids.indexOf(newArr[i])<0){
                  isHave = false
                  break
                }
              }
              if(isHave&&arr[k].store){
                isHaveThis = true
                break
              }
            }
            val2.isHaveStore = isHaveThis
          })
        })
        onSkuDataArr.map((val,index)=>{
          let newArr =[].concat(attrStr)
          val.attributeValueRelationVoList.map((val2,index2)=>{
            let isHaveThis = false
            // let newArr =[val2.vid,this.skuData[indexData].attributeValueRelationVoList[itemIndexData].vid]
            newArr[index] = val2.vid
            for (let k in arr) {
              let isHave = true
              for(let i in newArr){
                if(arr[k].vids.indexOf(newArr[i])<0){
                  isHave = false
                  break
                }
              }
              if(isHave&&arr[k].store){
                console.log('arr[k].store',arr[k],newArr.join('_'))
                isHaveThis = true
                break
              }
            }
            val2.isHaveStore = isHaveThis
          })
        })
      } else {
        let arr = this.goodInfo.supplierProductSkuVoList
        this.skuData.map((val,index)=>{
          val.attributeValueRelationVoList.map((val2,index2)=>{
            let isHave = true
            for(let i in arr){
              if (arr[i].vids.indexOf(val2.vid)>=0&&arr[i].store) {
                isHave = false
                return
              }
            }
            if (isHave) {
              val2.canClick = false
            }
          })
        })
      }
    },
    // 数组排序
    sortFun (arr) {
      function number (a,b) {
        return a-b
      }
      arr.sort(number)
      return arr.join('_')
    },
    btn(val, item, index) {
      console.log('点击按钮',val,item)
      let that = this
      if (item.imgUrl) {
        this.skuImgUrl = item.imgUrl
      }
      this.indexArr.splice(index, 1, val)
      this.skuButTypeFun(val,index)
      if (this.indexArr.length == this.skuData.length) {
        that.getOnSkuInfo()
      }
    },
    // 获取选中的sku信息
    async getOnSkuInfo(itmedata) {
      let that = this;
      let vids = [];
      this.indexArr.map((item, index) => {
        vids.push(that.skuData[index].attributeValueRelationVoList[item].vid);
      });
      console.log("this.vids", vids);
      console.log("this.indexArr", this.indexArr);
      console.log("that.skuData", that.skuData);
      let res = await getOneSkuInfo({
        pid: this.goodInfo.pid,
        vids: JSON.stringify(vids)
      })
      if (res.data.res_code == 1) {
        res.data.result.onNum = itmedata ? itmedata : 1;
        that.onSku = res.data.result;
        if (res.data.result.endTime) {
          let nowtime = new Date().getTime();
          if (nowtime < res.data.result.endTime) {
            console.log("秒杀中");
            that.isMiaoSha = true;
          } else {
            that.isMiaoSha = false;
          }
        }
        console.log("that.onSku", that.onSku);
        // that.$emit("getsku", res.data.result, that.indexArr);
      } else {
        that.onSku = {
          store:0,
          salesPrice:this.goodInfo.salesPrice,
          seckillPrice:this.goodInfo.seckillPrice?this.goodInfo.seckillPrice:this.goodInfo.salesPrice
        }
      }
    },
    // 商品数量---
    changeNum1() {
      console.log(1111);
      if(this.onSku){
        if (this.onSku.onNum <= 1) {
          this.onSku.onNum = 1
          return;
        }
        this.onSku.onNum--;
      }
      // this.$emit("getsku", this.onSku, this.indexArr);
    },
    // 商品数量+++
    changeNum2() {
      let that = this;
      console.log('buyerNumber',this.onSku)
      if(this.onSku){
        let buyerNumber = this.onSku.buyerNumber
        let num2 = this.onSku.store
        if(buyerNumber){
          num2 = buyerNumber>this.onSku.store?this.onSku.store:buyerNumber
        }
        if (this.onSku.onNum >= num2) {
          this.onSku.onNum = num2
          return;
        }
        if(this.onSku.buyerNumber>0){
          if( this.onSku.onNum>=this.onSku.buyerNumber){
            this.onSku.onNum=this.onSku.buyerNumber
            return false
          }
        }
        this.onSku.onNum++;
      }
      // this.$emit("getsku", that.onSku, that.indexArr);
    },
    toShow: function() {
      if (this.onSku&&this.onSku.onNum) {
        this.$emit("getsku", this.onSku, this.indexArr);
        this.$emit("toParent");
      }else{
        this.$emit("closeFun");
      }
    },
    closeFun () {
      this.$emit("closeFun");
    }
  }
};
</script>
<style lang='scss' scoped>
.mwrap {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  .cen {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;

    .colSize {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      padding: 0 2%;
      box-sizing: border-box;
      span:nth-child(1) {
        font-size: 15px;
      }
    }
    dl {
      display: flex;
      padding: 0 2%;
      box-sizing: border-box;
      dt img {
        width: 80px;
        height: 80px;
      }
      dd {
        p:nth-child(1) {
          font-size: 15px;
          color: #323a45;
          line-height: 2;
        }
        p:nth-child(2) {
          font-size: 15px;
          color: #999da2;
          line-height: 2;
        }
      }
    }
    .colors {
      padding: 0 2%;
      box-sizing: border-box;
      margin-top: 15px;
      .aname {
        color: #999da2;
        font-size: 15px;
        line-height: 2;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          border: 1px solid #ccc;
          padding: 3px 8px;
          box-sizing: border-box;
          margin: 5px 10px;
          font-size: 12px;
          border-radius: 5px;
        }
        .bg {
          background: #33d6c5;
          color: #fff;
          border: 1px solid #33d6c5;
        }
      }
    }
    .numbox {
      padding: 0 2%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .sl {
        font-size: 15px;
        color: #999da2;
        line-height: 2;
      }
      .num {
        display: flex;
        span {
          display: block;
          line-height: 2;
          font-size: 14px;
          text-align: center;
          padding: 0px 10px;
          box-sizing: border-box;
          border: 1px solid #ccc;
        }
        .number {
          min-width: 40px;
        }
      }
    }
    .btn {
      width: 100%;
      height: 55px;
      line-height: 55px;
      text-align: center;
      color: #fff;
      background: linear-gradient(
        217deg,
        rgba(248, 99, 103, 1) 0%,
        rgba(251, 37, 121, 1) 100%
      );
    }
  }
}
.noStore{
  background:rgba(203,203,203,1) !important;
  color: #fff !important;
}
.noSku{
  background:#eee !important;
  color: #ccc !important;
  border:1px solid #eee !important;
}
.closeSpan{
  width: 50px;
  text-align: right;
}
.isHaveStore{
  border:1px dashed #aaa !important;
  color: #aaa;
}
.isHaveStore.bg{
  background: #fff !important;
  color: #33d6c5 !important;
  border: 1px dashed #33d6c5 !important;
}
.maxByNumSpan{
  color: #FC5D7B;
}
</style>
