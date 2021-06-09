import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import axios from "axios";
import _ from "lodash";

import config from "../public/config";

// !!!!!!!!!!! FROALA EDITOR IN PUBLIC  !!!!!!!!!!!!!!!!
Vue.prototype.$FroalaEditor = FroalaEditor;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

Vue.prototype.$employeeGettingUrl = config.employeeGettingUrl;

import "./js/materializeWithKvartal.js";
import "./js/chart.js";
// Load a plugin.

Vue.config.productionTip = false;

import Vuesax from "vuesax";
import "vuesax/dist/vuesax.css";
import "material-design-icons-iconfont";
Vue.use(Vuesax);
import VueDragscroll from "vue-dragscroll";
Vue.use(VueDragscroll);

import XLSX from "xlsx";
Vue.prototype.$XLSX = XLSX;
import Kalendar from "./js/kalendar.js";
Vue.prototype.$Kalendar = Kalendar;

import GlobalComponentsInit from "./components/globalComponents/init.js";

import router from "./router.js";
import store from "./store.js";
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
