<template>
  <div id="app" >
        <preloader :status="status"></preloader>
        
        
        
        
        <div class="menu" v-if="!screen">
        
        <div class="all">
            <div class="lefter center" @click='setScreen("employees")'>
                <i class="mdi mdi-account-plus-outline w100 f100 "></i>
              <div class="text">Добавление сотрудника</div>
            </div>
            <div class="left center" @click='setScreen("show-calendar")'>
                <i class="mdi mdi-calendar-outline w100 f100 "></i>
              <div class="text"> Просмотр календаря</div>
            </div>
            <div class="centerm center" @click='setScreen("edit-tabel")'>
              <div class="explainer"> <span>ProjectMS</span>   </div>

              <div class="text">Редактирование табеля</div>
              </div>
            <div class="right center" @click='setScreen("show-proj")'>
                <i class="mdi mdi-briefcase-outline w100 f100 "></i>
              <div class="text">Просмотр активностей</div>
            </div>
            <div class="righter center" @click='setScreen("show-tabel")'>
                <i class="mdi mdi-table-eye w100 f100 "></i>
              <div class="text">Табель</div>
            </div>
            </div>
        </div>  
          
      
        
        
        
        
        
        <div id="menu" class="sidenav">
         
    <ul>
        <li><a @click='setScreen("show-tabel")'><i class="mdi mdi-table-eye mdi-36px"></i> Табель</a></li>
        <li><a @click='setScreen("edit-tabel")'><i class="mdi mdi-table-edit mdi-36px"></i> Редактирование табеля</a></li>
        <li><a @click='setScreen("show-proj")'><i class="mdi mdi-briefcase-outline mdi-36px"></i>  Просмотр активностей</a></li>
        <li><a @click='setScreen("add-proj")'><i class="mdi mdi-briefcase-edit-outline mdi-36px"></i>Добавление активностей</a></li>
        <li><a @click='setScreen("employees")'> <i class="mdi mdi-account-plus-outline mdi-36px"></i>  Добавление сотрудника</a></li>

        <li><a @click='setScreen("show-calendar")'><i class="mdi mdi-calendar-outline mdi-36px"></i> Просмотр календаря</a></li>
      </ul>  


        </div>

        <keep-alive>
        <component :is="screen" @edit-proj='editProj' :project-from-parent="editableProject" ></component>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>






</style>
