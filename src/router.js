import Vue from 'vue'
import VueRouter from 'vue-router'
import menu from './components/menu.vue'
import employees from './components/employees.vue'
import showTabel from './components/showTabel.vue'
import editTabel from './components/editTabel.vue'
import showActivities from './components/showActivities.vue'

Vue.use(VueRouter)



const routes = [
  
    { path: '/employees', component: employees },
    { path: '/show-tabel', component: showTabel },
    { path: '/edit-tabel', component: editTabel },
    { path: '/show-activities', component: showActivities },
    { path: '*', component: menu }
  ]
const router = new VueRouter({
  routes
})


  export default router