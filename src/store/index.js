import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

// 挂载modules
import special from './modules/special'
import newadd from './modules/newadd'
import myorder from './modules/myorder'
import getAddressList from './modules/getAddressList'
import shopDetail from "./modules/shopDetail"
import phone from './modules/phone'
import user from './modules/user'

import spike from './modules/spike'
import invite from "./modules/invite"
import classify from "./modules/classify";

import coupon from './modules/coupon.js'  //优惠券页面
import settlement from './modules/settlement'
import seek from './modules/seek' // 搜索

//import upPicture from './modules/upPicture'

import mutations from './mutations.js'

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    special,
    user,
    seek,
    phone,
    getAddressList,
    coupon,
    newadd,
    myorder,
    shopDetail,
    spike,
    invite,
    classify,
    settlement,
    shopDetail
  },
  mutations,
  state:{
    appIndex:'1.7.4',
    maxDistance:10,
    isLoginUrl:'/pages/index/main',
    fromInviteCode:'',
    userinfo:'',
    loginUserinfo:'',
    requsetUrl:'https://upapi.jinaup.com',
    // requsetUrl:'https://xcxapi.jinaup.com',
    location:'',//经纬度
    showB:true,
    iPhoneX:false,
    code:'',
    mapKey:'8783da16e79938c5dd36d48038b63da0'
  },
  plugins: [createLogger()]
})
