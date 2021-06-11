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
        console.log("eror?");
        if (
          to.matched.some(
            (record) =>
              record.meta.requiresModerator || record.meta.requiresAdmin
          )
        ) {
          if (this.role == "guest") {
            this.showRoleError();
            next({ path: "/" });
          } else {
            next();
          }
        } else {
          next();
        }
      });
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
};
</script>

<style></style>
