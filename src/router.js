import Vue from 'vue'
import VueRouter from 'vue-router'
import menu from './components/menu.vue'
import employees from './components/employees.vue'

Vue.use(VueRouter)



const routes = [
  
    { path: '/employees', component: employees },
    { path: '*', component: menu }
  ]
const router = new VueRouter({
  routes
})


  export default router