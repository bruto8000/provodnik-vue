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
  {
    path: "/employees",
    component: employees,
    meta: { requiresModerator: true, requiresAdmin: true },
  },
  {
    path: "/show-tabel",
    component: showTabel,
    meta: { requiresModerator: true },
  },
  {
    path: "/edit-tabel",
    component: editTabel,
    meta: { requiresModerator: true, requiresAdmin: true },
  },
  {
    path: "/distribution",
    component: distribution,
    meta: { requiresModerator: true },
  },
  {
    path: "/show-activities",
    component: showActivities,
    meta: { requiresModerator: true },
  },
  {
    path: "/add-activity",
    component: addActivity,
    meta: { requiresModerator: true },
  },
  {
    path: "/edit-activity",
    component: editActivity,
    meta: { requiresModerator: true },
  },
  {
    path: "/public-calendar",
    component: publicCalendar,
  },
  {
    path: "/add-info-query",
    component: addInfoQuery,
    meta: { requiresModerator: true },
  },
  {
    path: "/show-info-queries",
    component: showInfoQueries,
    meta: { requiresModerator: true },
  },
  {
    path: "/edit-info-query",
    component: editInfoQuery,
    meta: { requiresModerator: true },
  },
  {
    path: "/add-project",
    component: addProject,
    meta: { requiresModerator: true },
  },
  {
    path: "/show-projects",
    component: showProjects,
    meta: { requiresModerator: true },
  },
  {
    path: "/edit-project",
    component: editProject,
    meta: { requiresModerator: true },
  },
  { path: "/test", component: test, meta: { requiresModerator: true } },
  { path: "/login", component: authLogin },
  { path: "/register", component: authRegister },
  { path: "*", redirect: "/" },
];
const router = new VueRouter({
  routes,
});

export default router;
