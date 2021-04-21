import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import axios from 'axios'
Vue.config.productionTip = false


import './js/components/preloader.js'
import './js/materializeWithKvartal.js'


import router from './router.js'
import store from './store.js'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
  