<template>
  <div class="cwrap" @click="close">
    <div class="bot">
      <h3 class="tit">优惠券</h3>
      <p class="littile">优惠券列表</p>
      <ul class="list">
        <div class="auto">
          <template v-for="item in list">
            <li v-if="item.isAvailability==1||type=='goods'">
              <div class="left">
                <p class="money">
                  ￥
                  <span>{{item.reduction}}</span>
                </p>
                <p class="tj">满￥{{item.full}}使用</p>
              </div>
              <dl class="right">
                <dd>
                  <p class="newPeo">{{item.description}}</p>
                  <p v-if="item.endTime" class="dqTime">{{item.endTime}}到期</p>
                </dd>
                <dt>
                  <button v-if="type=='order'" @click.stop="useCoupon(item)">使用</button>
                  <button v-else @click.stop="chooseCoupon(item)">领取</button>
                </dt>
              </dl>
            </li>
            <div v-else class="sx">
              <div class="overdue">
                <div class="left">
                  <p class="money">
                    ￥
                    <span>{{item.reduction}}</span>
                  </p>
                  <p class="tj">满￥{{item.full}}使用</p>
                </div>
                <dl class="right">
                  <dd>
                    <p class="newPeo">{{item.description}}</p>
                    <p v-if="item.endTime" class="dqTime">{{item.endTime}}</p>
                  </dd>
                  <dt>
                    <span></span>
                  </dt>
                </dl>
              </div>
              <p class="fail">{{item.availabilityMsg}}</p>
            </div>
          </template>
        </div>
      </ul>
      <button @click.stop="close" class="btn">完成</button>
    </div>
  </div>
</template>
<script>
import { receiveCoupon } from '@/api/index'

export default {
  props: ["list", "type"],
  data() {
    return {};
  },
  onShow() {
    console.log("优惠券组件onshow", this.list, this.type);
  },
  onLoad() {
    console.log("优惠券组件onLoad", this.list,this.type);
    this.list.map(item => {
      item.endTime = this.getTime(item.endTime,'day');
      console.log("item.endTime", item.endTime);
    });
  },
  methods: {
    //格式化时间
    close() {
      this.$emit("close");
    },
    getTime(str, year, type) {
      let time = new Date(str);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      let typestr = "-";
      if (type || type == "") {
        typestr = type;
      }
      if (year == "day") {
        return (
          y +
          typestr +
          (m < 10 ? "0" + m : m) +
          typestr +
          (d < 10 ? "0" + d : d)
        );
      } else {
        return (
          y +
          typestr +
          (m < 10 ? "0" + m : m) +
          typestr +
          (d < 10 ? "0" + d : d) +
          " " +
          (h < 10 ? "0" + h : h) +
          ":" +
          (mm < 10 ? "0" + mm : mm) +
          ":" +
          (s < 10 ? "0" + s : s)
        );
      }
    },
    useCoupon(item) {
      this.$emit("choose", item);
      this.$emit("close");
    },
    async chooseCoupon(item) {
      console.log("领取");
      let that = this;
      let res = await receiveCoupon({cid: item.cid})
      if (res.data.res_code==1) {
        that.$emit("choose", item);
      } else {
        wx.showToast({
          title: res.data.message?res.data.message:'领取失败',
          icon: "none",
          duration: 2000
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.cwrap {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.bot {
  width: 100%;
  background: #fff;
  position: fixed;
  bottom: 0;

  .tit {
    font-size: 16px;
    text-align: center;
    line-height: 2;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .littile {
    font-size: 14px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .list {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    color: rgba(252, 93, 123, 1);
    overflow: hidden;
    height: 300px;
    .auto {
      max-height: 300px;
      overflow-y: auto;
    }
    li {
      display: flex;
      width: 95%;
      font-size: 12px;
      background: rgba(255, 246, 248, 1);
      margin: 10px;
      padding: 0 10px;
      box-sizing: border-box;
      border: 1px solid rgba(252, 93, 123, 1);
      border-radius: 10px;

      .left {
        font-size: 12px;
        width: 30%;
        text-align: center;
        margin-top: 7px;
        border-right: 1px dashed rgba(252, 93, 123, 1);

        .money {
          font-size: 13px;

          span {
            font-size: 20px;
          }
        }

        .tj {
          line-height: 2;
        }
      }

      .right {
        width: 70%;
        display: flex;
        justify-content: space-around;
        font-size: 12px;
        padding-top: 14px;
        box-sizing: border-box;
        dd {
          padding-left: 10px;
          box-sizing: border-box;
        }
        .newPeo {
          font-size: 14px;
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dqTime {
          line-height: 2;
        }

        button {
          width: 62px;
          height: 28px;
          line-height: 26px;
          background: #fc5d7b;
          font-size: 12px;
          color: #fff;
          text-align: center;
        }

        .alread {
          background: rgba(255, 168, 184, 1);
        }
      }
    }
  }
}
.sx {
  margin-bottom: 5px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;

  .overdue {
    color: #999999;
    display: flex;
    width: 100%;
    font-size: 12px;
    background: #fafafa;
    border: 1px solid #ccc;
    // border-radius: 10px;
    box-sizing: border-box;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .left {
      font-size: 12px;
      width: 30%;
      text-align: center;
      border-right: 1px dashed #ccc;

      .money {
        font-size: 15px;

        span {
          font-size: 30px;
        }
      }

      .tj {
        line-height: 2;
      }
    }

    .right {
      width: 70%;
      font-size: 12px;
      padding-top: 14px;
      box-sizing: border-box;
      padding-left: 15px;
      box-sizing: border-box;

      .newPeo {
        font-size: 14px;
      }

      .dqTime {
        line-height: 2;
      }

      button {
        margin-top: 7px;
        width: 62px;
        height: 28px;
        line-height: 26px;
        background: #fc5d7b;
        font-size: 12px;
        color: #fff;
        text-align: center;
      }

      .alread {
        background: rgba(255, 168, 184, 1);
      }
    }
  }
  .fail {
    width: 100%;
    font-size: 12px;
    line-height: 2;
    padding-left: 15px;
    color: #bbbec1;
    box-sizing: border-box;
    background: #f1f1f1;
    border: 1px solid #ccc;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
.btn {
  width: 100%;
  height: 55px;
  line-height: 55px;
  margin-top: 30px;
  background: linear-gradient(
    217deg,
    rgba(248, 99, 103, 1) 0%,
    rgba(251, 37, 121, 1) 100%
  );
  text-align: center;
  font-size: 18px;
  color: #fff;
}
</style>
