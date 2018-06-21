import 'babel-polyfill'             // 写在第一行
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/css/index.less'

import VConsole from 'vconsole'
/* eslint-disable no-unused-vars */
var vConsole = new VConsole()
// console.log('bbb')

fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
    loading: require('common/image/default.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
})
