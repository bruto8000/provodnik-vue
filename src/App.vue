<template>
  <div id="app">
    <preloader :show="preloader"></preloader>
    <sidenav></sidenav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Sidenav from "./components/pages/index/sidenav.vue";
import preloader from "./components/pages/index/preloader.vue";
export default {
  created() {
    this.preloader = true;
    setTimeout(() => {
      this.preloader = false;
    }, 200);

    this.setRouteGuardParams();
    this.setRouteLoaderParams();
  },
  data() {
    return {
      preloader: false,
      firstRouteDetected: false,
    };
  },

  components: {
    Sidenav,
    preloader,
  },
  methods: {
    editProj(project) {
      this.editableProject = project;
      this.setScreen("edit-proj");
    },
    setRouteLoaderParams() {
      this.$router.beforeEach((to, from, next) => {
        this.preloader = true;
        this.$forceUpdate();

        setTimeout(() => {
          next();
        }, 300);
      });

      this.$router.afterEach((to, from) => {
        this.$forceUpdate();
        this.preloader = false;
      });
    },
    setRouteGuardParams() {
      this.$router.beforeEach((to, from, next) => {
        console.log("from", from);
        console.log("Beffore Each");
        if (
          (to.meta.requiresModerator && this.role == "guest") ||
          (to.meta.requiresAdmin && this.role != "admin")
        ) {
          this.showRoleError();
          next(false);
        } else {
          next();
        }
      });
    },
    checkFirstRoute(route) {
      console.log("checking first route");
      console.log(this.$route);
      console.log(this.$route.path);

      if (
        (route.meta.requiresModerator && this.role == "guest") ||
        (route.meta.requiresAdmin && this.role != "admin")
      ) {
        this.showRoleError();
        this.$router.push({ path: "/" });
      }
    },
    showRoleError() {
      this.$vs.notify({
        title: "Ошибка",
        text: "Вы не имеете доступ к данному разделу",
        color: "danger",
      });
    },
  },

  computed: {
    role() {
      return this.$store.state.role;
    },
  },
  watch: {
    $route(route, from) {
      if (this.firstRouteDetected) {
        return;
      }
      this.checkFirstRoute(route);
      this.firstRouteDetected = true;
    },
  },
};
</script>

<style></style>
