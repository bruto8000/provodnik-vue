import Vue from "vue";
import VueRouter from "vue-router";

// Index //

// Employees //
const employees = () => import("./components/pages/employees/employees.vue");

// Tabel //
const showTabel = () => import("./components/pages/tabel/showTabel.vue");
const editTabel = () => import("./components/pages/tabel/editTabel.vue");

// Activities //
const distribution = () =>
  import("./components/pages/activities/distribution.vue");
const addActivity = () =>
  import("./components/pages/activities/addActivity.vue");
const showActivities = () =>
  import("./components/pages/activities/showActivities.vue");
const editActivity = () =>
  import("./components/pages/activities/editActivity.vue");
const publicCalendar = () =>
  import("./components/pages/activities/publicCalendar.vue");

// InfoQueries //
const addInfoQuery = () =>
  import("./components/pages/infoQueries/addInfoQuery.vue");
const showInfoQueries = () =>
  import("./components/pages/infoQueries/showInfoQueries.vue");
const editInfoQuery = () =>
  import("./components/pages/infoQueries/editInfoQuery.vue");

// Projects //
const addProject = () => import("./components/pages/projects/addProject.vue");
const showProjects = () =>
  import("./components/pages/projects/showProjects.vue");
const editProject = () => import("./components/pages/projects/editProject.vue");

const test = () => import("./components/globalComponents/inputEmployee.vue");

// Auth //
const authLogin = () => import("./components/pages/auth/authLogin.vue");
const authRegister = () => import("./components/pages/auth/authRegister.vue");

Vue.use(VueRouter);

const routes = [
  { path: "/", component: null },
  { path: "/employees", component: employees },
  { path: "/show-tabel", component: showTabel },
  { path: "/edit-tabel", component: editTabel },
  { path: "/distribution", component: distribution },
  { path: "/show-activities", component: showActivities },
  { path: "/add-activity", component: addActivity },
  { path: "/edit-activity", component: editActivity },
  { path: "/public-calendar", component: publicCalendar },
  { path: "/add-info-query", component: addInfoQuery },
  { path: "/show-info-queries", component: showInfoQueries },
  { path: "/edit-info-query", component: editInfoQuery },
  { path: "/add-project", component: addProject },
  { path: "/show-projects", component: showProjects },
  { path: "/edit-project", component: editProject },
  { path: "/test", component: test },
  { path: "/login", component: authLogin },
  { path: "/register", component: authRegister },
  { path: "*", redirect: "/" },
];
const router = new VueRouter({
  routes,
});

export default router;
