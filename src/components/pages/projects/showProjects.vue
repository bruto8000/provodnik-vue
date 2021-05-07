<template>
  <div>
    <div class="block">
      <div class="columns">
        <div class="is-absolute m-5">
          <span class="m-0 p-0">Колличество</span>
          <input
            type="number"
            class="input "
            v-model="paginationCount"
            placeholder="Колличество показываемого"
          />
        </div>
        <div
          class="center column is-12 is-justify-content-center is-flex is-align-items-center"
        >
          <h1 class="title is-1 mx-2">
            Проекты {{ $store.state.projects.length }}
          </h1>

          <div class="button is-small is-primary mx-2" @click="resetFilter">
            СБРОС
          </div>
          <div
            class="button z-depth-3"
            mx-2
            style="width: 40px; padding: 0; border-radius: 50%;"
          >
            <img
              src="../../../assets/EX.png"
              width="100%"
              style="border-radius: 50%;"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns center m-0" >
      <div
        class="column center sort__button  "
        :class="'is-' + projectName.columns"
        :key="name"
        v-for="(projectName, name) in projectNames"
      >
        <button
          @click="sortChange(name)"
          class="button is-small is-primary"
          :class="[
            {
              'is-danger': sort.column == name && sort.r == 1,
              'is-info': sort.column == name && sort.r == -1,
            },
          ]"
        >
          {{ projectName.name }}
        </button>
      </div>
    </div>
    <div class="columns m-0">
      <div
              class="center mx-0"
        :class="[
          'column is-' + projectName.columns,
          { 'p-0': projectName.type == 'select' },
        ]"
        :key="name"
        v-for="(projectName, name) in projectNames"
      >
        <div v-if="projectName.type == 'text'">
          <input-text :value.sync="filterInput[name]"></input-text>
        </div>
        <div v-else-if="projectName.type == 'select'" class="p-0">
          <input-select
            :options="allOptions[name + 'Options']"
            :value.sync="filterSelect[name]"
          ></input-select>
        </div>
        <div v-else>
          <input-date :value.sync="filterSelect[name]"> </input-date>
        </div>
      </div>
    </div>
    <div
      class="center"
      style="max-height: 75vh; overflow-y: auto; overflow-x: hidden;"
    >
      <div
        class="columns hover__bg "
        v-for="project in projectsFiltredPaginated"
        :key="project.id"
        @click='openproject(project)'
      >
        <div
          class="center column "
          :class="'is-' + projectName.columns"
          v-for="(projectName, name) in projectNames"
          :key="name"
        >
          {{ project[name] }}
        </div>
      </div>
    </div>
<projectModal  :project='currentDisplayingproject'      :show.sync="needprojectModal"></projectModal>
  </div>
</template>

<script>
import projectModal from './projectModal.vue'
export default {
   components: {
      projectModal
  },
  mounted: function() {
    this.readQueryParams();
    M.FormSelect.init(
      document.querySelectorAll("select", {
        dropdownOptions: {
          constrainWidth: false,
        },
      })
    );
  },
  data() {
    return {
        needprojectModal: false,
      filters: ["filterSelect", "filterInput", "sort"],
      paginationCount: 30,
      kalendar: "",
      currentDisplayingproject: {},
      projectNames: {
        accompanying: { name: "Сопровождающий", columns: 2, type: "select" },
        fdate: { name: "Дата старта", columns: 1, type: "date" },
        sdate: { name: "Дата завершения", columns: 1, type: "date" },
        title: { name: "Название", columns: 1, type: "text" },
        description: { name: "Описание", columns: 1, type: "text" },
        businessType: { name: "Вид бизнеса", columns: 1, type: "select" },
        workGroup: { name: "Рабочая группа", columns: 1, type: "text" },
        status: { name: "Статус", columns: 1, type: "select" },
        CA: { name: "ЦА", columns: 1, type: "select" },
        projectType: {
          name: "Тип проекта",
          columns: 2,
          type: "select",
        }
      },
      filterSelect: {
        fdate: "",
        sdate: "",
        businessType: "",
        workGroup: "",
        status: "",
        CA: "",
        projectType: "",
      },
      filterInput: {
        title: "",
        description: ""
      },

      sort: {
        column: "",
        r: "",
      },
    };
  },
  methods: {
    resetFilter: function() {
      for (let prop in this.filterSelect) {
        this.filterSelect[prop] = "";
      }
      for (let prop in this.filterInput) {
        this.filterInput[prop] = "";
      }

      this.sort.r = 1;
      this.sort.column = "";

      this.$nextTick(function() {
        M.FormSelect.init(
          document.querySelectorAll("select", {
            dropdownOptions: {
              constrainWidth: false,
            },
          })
        );
      });
    },

    sortChange(column) {
      if (this.sort.column == column) {
        if (this.sort.r == 1) {
          this.sort.r = -1;
        } else {
          this.sort.r = 1;
        }
        this.sort.column = "";
        this.sort.column = column;
      } else {
        this.sort.column = column;
        this.sort.r = 1;
      }
    },
    setQueryParams() {
      let urls = window.location.href.split("?");
      if (urls.length > 2) return;

      let query = "";
      this.filters.forEach((filter) => {
        for (let prop in this[filter]) {
          if (!this[filter][prop]) continue;
          if (query.length) query += "&";
          query += `${prop}=${this[filter][prop]}`;
        }
      });

      window.history.replaceState("", "", urls[0] + "?" + query);
    },
    readQueryParams() {
      this.filters.forEach((filter) => {
        for (let prop in this[filter]) {
          this.$route.query[prop] &&
            (this[filter][prop] = this.$route.query[prop]);
        }
      });
    },
    openproject(project){
    
    this.needprojectModal = true;
    this.currentDisplayingproject = project;
    }
  },

  computed: {
    projectsFiltred() {
      return this.projects
        .filter((v, i, arr) => {
            console.log('1')
            console.log(this.filterSelect)
          for (let prop in this.filterSelect) {
            if (this.filterSelect[prop]) {
                       
                    console.log(this.filterSelect[prop],v[prop] )
         
              if (v[prop] != this.filterSelect[prop]) return false;
            }
  
          }
               console.log('3')
          for (let prop in this.filterInput) {
            if (this.filterInput[prop]) {
                      console.log('4')
              if (
                !v[prop]
                  .toUpperCase()
                  .includes(this.filterInput[prop].toUpperCase())
              )
                return false;
            }
     
          }

                 return true
        })
        .sort((a, b) => {
          if (!this.sort.column) return 1;
          if (this.sort.column == "sdate" || this.sort.column == "fdate") {
            let fakeA = a[this.sort.column];
            let fakeB = b[this.sort.column];
            fakeA = fakeA
              .split(" ")
              .reverse()
              .join(" ");
            fakeB = fakeB
              .split(" ")
              .reverse()
              .join(" ");
            fakeA = fakeA.replace(/\s/g, "");
            fakeB = fakeB.replace(/\s/g, "");
            if (fakeA > fakeB) return 1 * this.sort.r;
            else return -1 * this.sort.r;
          } else {
            if (a[this.sort.column] > b[this.sort.column])
              return 1 * this.sort.r;
            else {
              return -1 * this.sort.r;
            }
          }
        });
    },
    projectsFiltredPaginated() {
      return this.projectsFiltred.slice(0, this.paginationCount || 30);
    },
    projects() {
      return this.$store.state.projects;
    },
    employees() {
      return this.$store.getters.employees;
    },
    CAOptions() {
      return this.$store.state.projectsSelectOptions.CAOptions;
    },
    businessTypeOptions() {
      return this.$store.state.projectsSelectOptions.businessTypeOptions;
    },
    statusOptions() {
      return this.$store.state.projectsSelectOptions.statusOptions;
    },
    projectTypeOptions() {
      return this.$store.state.projectsSelectOptions.projectTypeOptions;
    },

    allOptions() {
      return {
        CAOptions: this.CAOptions,
        businessTypeOptions: this.businessTypeOptions,
        accompanyingOptions: this.employees,
       statusOptions: this.statusOptions,
      projectTypeOptions: this.projectTypeOptions,
    }
    }
  }
 
};
</script>

<style></style>
