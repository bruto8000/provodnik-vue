import Vue from 'vue'
import VueRouter from 'vue-router'

// Index //
import menu from './components/pages/index/menu.vue'

// Employees //
import employees from './components/pages/employees/employees.vue'

// Tabel //
import showTabel from './components/pages/tabel/showTabel.vue'
import editTabel from './components/pages/tabel/editTabel.vue'


// Activities //
import addActivity from './components/pages/activities/addActivity.vue'
import showActivities from './components/pages/activities/showActivities.vue'
import editActivity from './components/pages/activities/editActivity.vue'
import publicCalendar from './components/pages/activities/publicCalendar.vue'

// InfoQueries //
import addInfoQuery from './components/pages/infoQueries/addInfoQuery.vue'
Vue.use(VueRouter)



const routes = [
  
    { path: '/employees', component: employees },
    { path: '/show-tabel', component: showTabel },
    { path: '/edit-tabel', component: editTabel },
    { path: '/show-activities', component: showActivities },
    { path: '/add-activity', component: addActivity },
    { path: '/edit-activity', component: editActivity },
    { path: '/public-calendar', component: publicCalendar },
    { path: '/add-info-query', component: addInfoQuery },
    { path: '*', component: menu }
  ]
const router = new VueRouter({
  routes
})


  export default router