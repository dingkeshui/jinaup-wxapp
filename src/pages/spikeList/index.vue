<template>
	<div>
		<div class="topImgBox"><img model="widthFix" class="topimg" src="./img/ms.jpg"></div>
    <!-- 新秒杀 -->
    <div id="newSpikeBox" :class="['newSpikeBox']">
      <!-- <div class="newSpikeTag"> -->
      <!-- <div> -->
      <scroll-view scroll-x="true" :scroll-into-view="intoView" :class="['newSpikeTag',{'isBindTop':isBindTop}]">
          <div v-for="(item8,index8) in list" :id="'item'+index8" :key="index8" :class="['newSpikeTagItem',{'on':onSkillIndex==index8}]" @click="spikeChooseTime(index8)">
            <div>{{item8.periodValue}}</div>
            <div>{{item8.description}}</div>
          </div>
        <!-- </div> -->
      </scroll-view>
      <img @click="goShareList" :class="['shareListImg',{'none':!isBindTop}]" src="/static/images/shareList.png">
      <!-- </div> -->
      <div v-for="(item81,index81) in list" :key="index81" :class="['kh-list',{'none':index81!=onSkillIndex}]">
        <dl v-for="(item811,index811) in item81.seckillProduct" v-bind:key="index811" @click="gopage(item811)">
          <dt>
            <img lazy-load :src="item811.mainImgUrl" alt>
          </dt>
          <dd>
            <p class="over-h">{{item811.title}}</p>
            <div v-if="item81.isStart" class="present">
              <progress
                activeColor="#FC5D7B"
                font-size="12px"
                color="#f3f7f7"
                :percent="item811.progress"
                show-info
              />
              <span v-if="item811.salesStore>=item811.totalStore">已抢光</span>
            </div>
            <div class="price">
              <div>
                <div>
                  <span class="vippic mgr5" v-if="item811.vipPrice">￥{{item811.vipPrice}}</span>
                  <img class="vipimg mgr5" v-if="item811.vipPrice" src="/static/images/vip.png" alt>
                  <span v-if="loginUserinfo.userType==1&&item811.earnMoney" class="carouselProductPriceEarn fs12">赚￥{{item811.earnMoney}}</span>
                </div>
                <div>
                  <span class="nprice mgr10">￥{{item811.seckillPrice}}</span>
                  <span v-if="item811.salesPrice" class="dontpic">￥{{item811.salesPrice}}</span>
                </div>
              </div>
              <img v-if="item81.isStart" :src="item811.progress>=100?'/static/images/yqg.png':'/static/images/msq.png'" class="btn" alt>
              <img v-else :src="'/static/images/ljkq.png'" class="btn" alt>
            </div>
          </dd>
        </dl>
      </div>
    </div>
   <red redEnvelopeType="1" />
   <red v-if="rid" redEnvelopeType="1" :rid="rid" />
	</div>
</template>

<script type="text/javascript">
import { getMiaoShaList,getMiaoShaListMore } from '@/api/index'
import { getQueryString } from '@/utils/index'
import red from "@/components/red/red";

export default {
	data(){
		return {
			spikeTop:'',
			spikeBottom:'',
			isBindTop:false,
      list:'',
      loginUserinfo:'',
      onSkillIndex:0,
      seckillStartTime:'',
      intoView:'',
      rid:''
		}
	},
  components:{
    red
  },
	onLoad(e){
    console.log('eeeee',e)
    let that = this
    this.startTime = ''
    if(e.q){
      let getStr = getQueryString(decodeURIComponent(e.q))
      for(let k in getStr){
        e[k]=getStr[k]
      }
      if(getStr.seckillStartTime){
        this.seckillStartTime = getStr.seckillStartTime
      }
    }
    if (e.seckillStartTime) {
      this.seckillStartTime = e.seckillStartTime
    }
    wx.getStorage({
      key:'rid',
      success(e){
        that.rid = e.data
        wx.removeStorage({
          key: 'rid',
          success (res) {
          }
        })
      }
    })
		this.getTop()
    this.getList()
	},
  onShow(){
    const loginResult = wx.getStorageSync('loginResult')
    if(loginResult){
      this.loginUserinfo = loginResult.userInfo
    } else {
      this.loginUserinfo = {
        userType:1
      }
    }
  },
	methods:{
    goShareList(){
      console.log('秒杀列表分享')
      let data = this.list[this.onSkillIndex]
      let arr = data.seckillShareUrl.split('?')
      if(!data.seckillImageUrl){
        wx.showToast({
          title: '暂无分享图片',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if(!arr[0]){
        wx.showToast({
          title: '暂无分享链接',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let url = '/pages/shareSpikeList/main?time='+data.seckillShareTitle+'&startTime='+data.startTime+'&bg='+data.seckillImageUrl+'&shareUrl='+arr[0]
      console.log('data',data,url)
      wx.navigateTo({
        url:url
      })
    },
    async getList () {
      let res = await getMiaoShaList()
      console.log('res',res)
      if(res.data.res_code==1){
        let time = new Date().getTime()
        res.data.result.seckill.map(val=>{
          val.pageIndex=1
          if (val.startTime>time) {
            val.isStart = false
          } else {
            val.isStart = true
          }
        })
        this.list = res.data.result.seckill
        if (!this.onSkillIndex) {
          let isSame = -1
          for (let i in res.data.result.seckill) {
            if (this.seckillStartTime&&this.seckillStartTime==res.data.result.seckill[i].startTime) {
              isSame = i
            }
            if (time<res.data.result.seckill[i].endTime&&time>=res.data.result.seckill[i].startTime) {
              this.onSkillIndex = i
            }
          }
          if(this.seckillStartTime&&isSame>=0){
            this.onSkillIndex = isSame
          }
        }
        this.intoView = 'item'+this.onSkillIndex
      }else{
        wx.showToast({
          title: res.data.message?res.data.message:'获取失败',
          icon: 'none',
          duration: 2000
        })
      }
    },
    // 选择时间
    spikeChooseTime (item) {
      this.onSkillIndex = item
    },
    gopage(item){
      wx.navigateTo({
            url: "/pages/go2detail/main?id=" + item.pid
      })
    },
		getTop(){
			let that = this
		    this.$nextTick(() =>{
		        console.log('dom渲染完成')
		        let query = wx.createSelectorQuery()//创建节点查询器 query
		        query.select('#newSpikeBox').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
		        query.exec(function (res) {
		            // console.log(res[0].top); // #affix节点的上边界坐
		            if(res){
		              console.log('秒杀的top',res[0].top,res)
		              that.spikeTop = res[0].top
		              that.spikeBottom = res[0].bottom
		            } 
		        })
		    })
		}
	},
   async onReachBottom(e){
    let that = this
    console.log('滚动加载',this.list,this.onSkillIndex)
    let num = this.list[this.onSkillIndex].seckillProduct.length%20
    // let num = this.list[this.onSkillIndex].seckillProduct.length%1
    if(!num){
      let res = await getMiaoShaListMore({startTime:this.list[this.onSkillIndex].startTime,pageIndex:this.list[this.onSkillIndex].pageIndex+1})
      if (res.data.res_code==1) {
        this.$set(that.list[that.onSkillIndex],'pageIndex',that.list[that.onSkillIndex].pageIndex+1)
        let arr = [].concat(this.list[this.onSkillIndex].seckillProduct,res.data.result.seckillProduct)
        this.$set(that.list[that.onSkillIndex],'seckillProduct',arr)
      } else {
        if (res.data.res_code==1004) {

        } else {
          wx.showToast({
            title: res.data.message?res.data.message:'获取失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  },
	onPageScroll(e){
		let that = this
		console.log('页面滚动',e.scrollTop)
		if(this.spikeTop){
		  if (e.scrollTop<that.spikeTop&&that.isBindTop) {
		    that.isBindTop = false
		  } else if (e.scrollTop>=that.spikeTop&&!that.isBindTop) {
		    that.isBindTop = true
		  }
		}
	},
}
</script>

<style type="text/css" scoped lang='scss'>
.topImgBox{
	font-size: 0px;
}
.topimg{
	width: 100vw;
}
.newSpikeTag{
  padding: 10px 0px;
  background: #FFF6F6;
  white-space:nowrap;
  height: 38px;
}
.newSpikeTagItem{
  width: 20vw;
  text-align: center;
  display: inline-block;
}
.newSpikeTagItem>div:nth-child(1){
  font-weight: bold;
  height: 20px;
  line-height: 20px;
}
.newSpikeTagItem>div:nth-child(2){
  font-size: 12px;
  height: 18px;
  line-height: 18px;
}
.newSpikeTagItem.on>div:nth-child(1){
  color: #FC5D7B;
}
.newSpikeTagItem.on>div:nth-child(2){
  background-color: #FC5D7B;
  color: #fff;
  border-radius: 4px;
}
.list{
	height: 1000px;
}
.isBindTop{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
}
.none{
  display: none;
}
.kh-list dl {
  display: flex;
  width: 100%;
  dt {
    width: 30%;
    img {
      width: 100%;
      height: 131px;
      padding: 20px 10px;
      box-sizing: border-box;
    }
  }
  dd {
    width: 70%;
    .over-h {
      overflow:hidden; 
      text-overflow:ellipsis;
      display:-webkit-box; 
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
      font-weight: 300;
      font-size: 16px;
      line-height: 2;
      margin-top: 10px;
    }
    .present {
      display: flex;
      justify-content: space-between;
      font-weight: 300;
      font-size: 16px;
      line-height: 2;
      color: #999da2;
      progress {
        margin-top: 15px;
        width: 100px;
        height: 4px;
      }
      span {
        padding-right: 15px;
      }
    }
    .price {
      display: flex;
      font-size: 16px;
      justify-content: space-between;
      float: bottom;
      margin-top: 10px;
      .nprice {
        font-size: 22px;
        color: #fc5d7b;
      }
      .oprice {
        text-decoration: line-through;
        line-height: 2;
        margin-top: 7px;
        color: #aaa;
        font-size: 12px;
      }
      .zhuan {
        font-size: 12px;
        color: #fc5d7b;
        margin-top: 10px;
      }
      .btn {
        width: 80px;
        height: 33px;
        margin-top: 4px;
        margin-right: 10px;
      }
    }
  }
}
.shareListImg{
  width: 102px;
  height: 30px;
  position: fixed;
  top:52px;
  left:50%;
  margin-left: -51px;
}
</style>