<template>
  <div id="app" >
        <!-- <preloader :status="status"></preloader> -->
        
        <div id="menu" class="sidenav">
         
    <ul>
        <li><a @click='routeTo("show-tabel")'><i class="mdi mdi-table-eye mdi-36px"></i> Табель</a></li>
        <li><a @click='routeTo("edit-tabel")'><i class="mdi mdi-table-edit mdi-36px"></i> Редактирование табеля</a></li>
        <li><a @click='routeTo("show-proj")'><i class="mdi mdi-briefcase-outline mdi-36px"></i>  Просмотр активностей</a></li>
        <li><a @click='routeTo("add-proj")'><i class="mdi mdi-briefcase-edit-outline mdi-36px"></i>Добавление активностей</a></li>
        <li><a @click='routeTo("employees")'> <i class="mdi mdi-account-plus-outline mdi-36px"></i>  Добавление сотрудника</a></li>
        <li><a @click='routeTo("show-calendar")'><i class="mdi mdi-calendar-outline mdi-36px"></i> Просмотр календаря</a></li>
      </ul>  
 

        </div>

      <router-view></router-view>

      
  </div>
</template>

<script>
export default {
   data(){return  {
        // route: window.location.hash,
        // menu: {},
        // screen: "",
        // status: "loading",
        // editableProject: {},
        // routes : ['show-proj','add-info-zapros', 'edit-proj',
        //  'edit-tabel', 'employees',
        //   'show-calendar', 'show-tabel',
        //    'add-proj']
    }
   },
   created(){

   },
    mounted() {
        this.menu = M.Sidenav.init(document.getElementById('menu'))
        document.addEventListener('keydown', function (key) {
            if (key.code == "Escape") {

                if (!this.menu.isOpen)
                    this.menu.open()
                else
                    this.menu.close()
            }
        }.bind(this))
 },
    components: {
   
   

    },
    methods: {
           routeTo(route){
this.$router.push(route)
    },
   
        editProj(project) {

            this.editableProject = project;
            this.setScreen('edit-proj')
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
    }

};
</script>

<style>






</style>
