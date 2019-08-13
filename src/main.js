var bus = new Vue();
import Vue from 'vue'
import App from './App'
// 引入store
import store from '@/store/index'

import '@/common/css/common.css'

Vue.config.productionTip = false
App.mpType = 'app'

// 挂载store到原型链上
Vue.prototype.$store = store;
const app = new Vue(App)
app.$mount()