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
import Sidenav from "./components/sidenav.vue";
import preloader from "./components/helpers/preloader.vue";
export default {
  created() {

this.preloader = true;
setTimeout(() => {
  this.preloader = false
}, 200);



    this.$router.beforeEach((to, from, next) => {
      // if(to.path == from.path){
      //   next()
      //   return;
      // }
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
  },

  watch: {
    // route(n, o) {
    //     if (n == this.screen) {
    //         return;
    //     } else {
    //         console.log('setting New')
    //         this.setScreen(n)
    //     }
    // }
  },
};
</script>

<style></style>
