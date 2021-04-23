import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import _ from 'lodash'


Vue.config.productionTip = false
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' 
import 'material-design-icons-iconfont'
Vue.use(Vuesax, {
  // options here
})
// import './js/components/preloader.js'
import './js/materializeWithKvartal.js'
import './js/chart.js'
import Kalendar from './js/kalendar.js'
Vue.prototype.$Kalendar = Kalendar;
console.log(Kalendar)
import router from './router.js'
import store from './store.js'
new Vue({
  router,
  store, 
  render: h => h(App)
}).$mount('#app')
  