<template>
  <div>

     <vs-tabs v-model="currentTabIdx">
      <vs-tab label="Таблица по кварталам">
          <div class="table columns">
      <div class="column is-2 px-5 has-text-centered ">
            <label>
        <input type="checkbox" v-model='showOnlyInWorkActivities' />
        <span>Показывать только в работе</span>
      </label>
        <ul v-for="year in years" class="box" :key="year">
          <li>
            <span class="title is-3">{{ year }}</span>
          </li>
          <li
            class="m-1 is-clickable"
            :class="{ 'is-size-3': currentYear == year && currentQuarter == i }"
            @click="setCurrentDate(i, year)"
            v-for="i in 4"
            :key="i"
          >
            <a
              class="is-primary button"
              :class="{
                'is-large is-danger':
                  currentYear == year && currentQuarter == i,
              }"
              >{{ i }}Q</a
            >
          </li>
        </ul>

     
      </div>
      <div class="column is-10 box my-4 p-4">
        <h1 class="title is-1 has-text-centered">
          Распределение за {{ currentYear }}
          {{
            currentQuarter == "4"
              ? "IV"
              : new Array(currentQuarter).fill("I").join("")
          }}
        </h1>
        <div style="overflow-x:scroll; overflow-y:hidden" v-dragscroll>
          <div class="columns py-3">
            <div class="columns column mx-0  is-3">
              <div
                class=""
                style="position:absolute; background: white; width:22%"
              >
                <h3 class="is-3 title p-1">
                  ФИО
                </h3>
              </div>
            </div>
            <div v-if="!showOnlyInWorkActivities" class="columns column mx-0  is-8 is-justify-content-center">
              <div class="">
                <h3 class="title is-3  has-text-centered">
                  Поступило
                </h3>
              </div>
            </div>
            <div  class="columns column mx-0  is-8 is-justify-content-center">
              <div class="">
                <h3 class="title is-3 has-text-centered">
                  В работе
                </h3>
              </div>
            </div>
            <div v-if="!showOnlyInWorkActivities" class="columns column mx-0  is-8 is-justify-content-center">
              <div class="">
                <h3 class="title is-3 has-text-centered">
                  Выполнено
                </h3>
              </div>
            </div>
            <div  v-if="!showOnlyInWorkActivities" class="columns column mx-0  is-8 is-justify-content-center">
              <div  class="">
                <h3 class="title is-3 has-text-centered">
                  Замещения
                </h3>
              </div>
            </div>
              <div  v-if="!showOnlyInWorkActivities" class="columns column mx-0  is-3 is-justify-content-center">
              <div class="">
                <h3 class="title is-3 has-text-centered">
                  Итого
                </h3>
              </div>
            </div>
          </div>

          <div class="columns ">
            <div class="columns column py-1 mx-0 is-3">
              <div 
                      
                class=""
                style="position:absolute; background: white; width:22%; height:22%"
              ></div>
            </div>
            <div 
             v-if="!showOnlyInWorkActivities"
              class="columns column py-0 mx-0  is-8 is-justify-content-center"
            >
              <div class="has-text-centered" :style="getStyleForCell()">
                1-1.5
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                2-2,5
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                3-3.5
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                ДПП
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                Итого
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                Доля поступивших
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                Доля поступивших с учетом отработки
              </div>
            </div>
            <div
         
              class="columns column py-0 mx-0 is-8 is-justify-content-center"
            >
              <div class="has-text-centered" :style="getStyleForCell()">
                1
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                1.5
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                2
              </div>

              <div class="has-text-centered" :style="getStyleForCell()">
                2,5
              </div>

              <div class="has-text-centered" :style="getStyleForCell()">
                3
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                3.5
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                ДПП Актив
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                ДПП Пассив
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                Итого
              </div>
            </div>
            <div
             v-if="!showOnlyInWorkActivities"
              class="columns column py-0 mx-0 is-8 is-justify-content-center"
            >
              <div class="has-text-centered" :style="getStyleForCell()">
                1
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                1.5
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                2
              </div>

              <div class="has-text-centered" :style="getStyleForCell()">
                2,5
              </div>

              <div class="has-text-centered" :style="getStyleForCell()">
                3
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                3.5
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                ДПП
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                Итого
              </div>
            </div>

            <div
             v-if="!showOnlyInWorkActivities"
              class="columns column py-0 mx-0 is-8 is-justify-content-center"
            >
              <div class="has-text-centered" :style="getStyleForCell()">
                <div>Завершено</div>
                <div>1-1.5</div>
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                <div>В работе</div>
                <div>      1-1.5</div>
           
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                <div>
                  Завершено
                </div>
                <div>
                  2-2.5
                </div>
              </div>

              <div class="has-text-centered" :style="getStyleForCell()">
                <div>
                  В работе
                </div>
                <div>
                  2-2.5
                </div>
              </div>

              <div class="has-text-centered" :style="getStyleForCell()">
                <div>
                  Завершено
                </div>
                <div>
                  3-3.5
                </div>
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                <div>
                  В работе
                </div>
                <div>
                  3-3.5
                </div>
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                ДПП
              </div>
              <div class="has-text-centered" :style="getStyleForCell()">
                Итого
              </div>
            </div>

             <div
    
              class="columns column py-0 mx-0 is-3 is-justify-content-center"
            >
           
              <div class="has-text-centered" :style="getStyleForCell()">
                Итого
              </div>
            </div>
          </div>
          <div
            v-for="(row, idx) in tableRows"
            class="columns"
            
            :key="idx"
          >
            <div
              v-for="(difficultTypes, prop) in row"
              :key="prop"
              class=" columns column  py-0 mx-0"
              :class="[
                { 'is-justify-content-center': prop != 'full_name' },
                [ ['full_name','all'].includes(prop) ? 'is-3' : 'is-8'],
              ]"
            >
              <div
                v-if="prop == 'full_name'"
                style="position:absolute; background: white; width:22%"
                class="py-3"
              >
                {{ difficultTypes }}
              </div>
              <div
                v-else
              
                class="has-text-centered py-3"
                v-for="(activities, idx) in difficultTypes"
                :key="idx"
                :style="{
                  ...getColorForCell(prop, Object.keys(difficultTypes).indexOf(idx)),
                  ...getStyleForCell(),
                }"
              >
              <span   
              class="is-clickable"
              @click="openActivitiesTab(activities,{
                  employee: row['full_name'],
                  type: prop,
                  difficult :idx
                  }
                  )">
         {{ activities.length }}
              </span>
       
              </div>

              <div
                :style="{
                  ...getStyleForCell(),
                }"
                v-if="prop == 'receivedActivities'"
                class="has-text-centered py-3"
              >
                <!-- Доля поступивших -->
                {{
                  Math.round(
                    difficultTypes["Все"].length /
                      (receivedActivitiesPerPercent / 100 || 1)
                  )
                }}%
              </div>

              <div
                :style="{
                  ...getStyleForCell(),
                }"
                v-if="prop == 'receivedActivities'"
                class="has-text-centered py-3"
              >
                <!-- Доля поступивших с учетом план/факта -->
                {{
                  Math.round(
                    difficultTypes["Все"].length /
                      (receivedActivitiesPerPercent / 100 || 1)
                  ) +
                    Math.round(
                      difficultTypes["Все"].length /
                        (receivedActivitiesPerPercent / 100 || 1)
                    ) *
                      (coefficientPerEmployee[idx].coefficient / 100).toFixed(
                        1
                      )
                }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </vs-tab>

      <vs-tab label="Список Активностей">
        <div style="overflow: auto; ">
          <h3 class="title is-3">
            {{ textHeader }}
          </h3>

          <table class="table is-fullwidth">
            <tr>
              <th class="">Дата спуска</th>
              <th class="">Дата запуска</th>
              <th class="">Вид бизнеса</th>
              <th class="">Тип запуска</th>
              <th class="">Название</th>
              <th class="">Описание</th>

              <th class="">Сопровождающий</th>
              <th class="">Заказчик</th>
              <th class="">Статус</th>
            </tr>

            <tr
              class=" hover__bg"
              v-for="activity in currentActivities"
              :key="activity.id"
              @click="openActivity(activity)"
            >
              <td class="">{{ activity.fdate }}</td>
              <td class="">{{ activity.sdate }}</td>
              <td class="">{{ activity.bizness }}</td>
              <td class="">{{ activity.zapusk }}</td>
              <td class="">{{ activity.nazvanie }}</td>
              <td class="">{{ activity.opisanieBodyCuted }}</td>
              <td class="">{{ activity.soprovod }}</td>
              <td class="">{{ activity.zakazchik }}</td>
              <td class="">{{ activity.status }}</td>
            </tr>
          </table>
        </div>
      </vs-tab>
    </vs-tabs>
 

 <activityModal
  :show.sync="needActivityModal"
     role="admin"
  ></activityModal>
  </div>
</template>

<script>
import activityModal from "./global/activityModal.vue";
export default {
  data() {
    return {
      activityTypes: [
        
,"receivedActivities"
,"inWorkActivities"
,"doneActivities"
,"replacementActivities"
,"all"

      ],
      textHeader: '',
      needActivityModal: false,
      currentActivities: [],
      currentTabIdx: 0,
   showOnlyInWorkActivities: true
,      years: [2021, 2022, 2023],
      currentQuarter: "",
      currentYear: "",
      colors: {
        receivedActivities: ["#E2EFDA", "#FFF2CC", "#FFC5C5", "#FFC5C5"],
        inWorkActivities: [
          "#C6E0B4",
          "#A9D08E",
          "#FFE699",
          "#FFD966",
          "#FF8585",
          "#F9393E",
          "#F9393E",
          "#F9393E",
        ],
        doneActivities: [
          "#C6E0B4",
          "#A9D08E",
          "#FFE699",
          "#FFD966",
          "#FF8585",
          "#F9393E",
          "#F9393E",
        ],
        replacementActivities: [
          "#A9D08E",
          "#A9D08E",
          "#FFD966",
          "#FFD966",
          "#F9393E",
          "#F9393E",
          "#F9393E",
        ],
        all: [
          '#ED7D31'
        ]
      },
      columnNames:{
        receivedActivities: "Получено",
        inWorkActivities: "В работе",
        doneActivities: "Выполнено",
        replacementActivities: "Замещения",
        all: "Все",
      }
    };
  },
  created() {
    let date = new Date();
    let quarter = Math.ceil((date.getMonth() + 1) / 3);
    this.setCurrentDate(quarter, date.getFullYear());
  },
  methods: {
    setCurrentDate(quarter, year) {
      this.currentQuarter = quarter;
      this.currentYear = year;
    },
     openActivitiesTab(activitiesArray,activitiesProperty) {
       this.textHeader  = `${activitiesProperty.employee}, Активности [${this.columnNames[activitiesProperty.type]}]  сложность [${activitiesProperty.difficult}]`;
     this.currentActivities = activitiesArray;
     this.currentTabIdx =1;

    },
    openActivity(activity){
     this.$store.commit("setDisplayingActivity", activity);
   this.needActivityModal = true;
    },
    
    getColorForCell(prop, idx) {
      return {
        backgroundColor: this.colors[prop] ? this.colors[prop][idx] : "purple",
      };
    },
    getStyleForCell() {
      return {
        width: "200px",
      };
    },
    getQuarter(dateInStringFormat) {
      let quarter;
      let splitedDate = dateInStringFormat.split(" ");

      if (splitedDate.length == 3) {
        quarter = Math.ceil(splitedDate[1] / 3);
      } else if (splitedDate.length == 2) {
        if (splitedDate[0] == "IV") {
          quarter = 4;
        } else {
          quarter = splitedDate[0].length * 3;
        }
      }

      return quarter;
    },
    getYear(dateInStringFormat) {
      let splitedDate = dateInStringFormat.split(" ");

      return splitedDate.pop() || null;
    },
  },
  computed: {
    employees() {
      return this.$store.state.employees;
    },
    activities() {
      return this.$store.state.activities;
    },
    filtredActivitiesPerEmployeesAndDate() {
      return this.employees.map((employee) => {
        let employeeActivities = this.activities.filter(
          (activity) => activity.soprovod == employee.full_name
        );
        let doneActivities = employeeActivities
          .filter((activity) => activity.status.trim() == "Выполнено")
          .filter((activity) => {
            {
              return (
                this.getYear(activity.sdate) == this.currentYear &&
                this.getQuarter(activity.sdate) == this.currentQuarter
              );
            }
          });
        let inWorkActivities = employeeActivities.filter((activity) =>
          ["В работе", "ДПП актив", "ДПП пассив"].includes(
            activity.status.trim()
          )
        );
        let receivedActivities = employeeActivities.filter((activity) => {
          return (
            this.getYear(activity.fdate) == this.currentYear &&
            this.getQuarter(activity.fdate) == this.currentQuarter
          );
        });
        let replacementActivities = [];
        this.activities.forEach((activity) =>
          activity.zamenas.forEach((replacement) => {
            if (
              replacement.employee == employee.full_name &&
              this.getYear(replacement.fdate) == this.currentYear &&
              this.getQuarter(replacement.fdate) == this.currentQuarter
            ) {
              replacementActivities.push(activity);
            }
          })
        );

let all = [doneActivities, receivedActivities, inWorkActivities,replacementActivities].reduce((accumulator,currentValue)=>currentValue.concat (accumulator),[])
.filter((value, index, self) =>{
  return self.indexOf(value) === index;
})  ; 
   return {
          full_name: employee.full_name,
          receivedActivities,
          inWorkActivities,
          doneActivities,
          replacementActivities,
          all
        };
      });
    },
    filtredActivitiesForTableView() {
      return this.filtredActivitiesPerEmployeesAndDate.map(
        (employeeActivities) => {
          function filterByDifficultAndStatus(
            mainArray,
            difficulties,
            statuses
          ) {
            let normalized = {};

            for (let prop in difficulties) {
              normalized[prop] = mainArray.filter(
                (activity) =>
                  difficulties[prop].includes(activity.difficulty.toString()) &&
                  (!statuses ||
                    !statuses.length ||
                    statuses.includes(activity.status))
              );
            }

            return normalized;
          }

          let normalizedForTableView = {
            full_name: employeeActivities.full_name,
            receivedActivities: {
              ...filterByDifficultAndStatus(
                employeeActivities.receivedActivities,
                {
                  "1-1.5": ["1", "1.5"],
                  "2-2.5": ["2", "2.5"],
                  "3-3.5": ["3", "3.5"],
                  ДПП: ["ДПП"],
                  Все: ["1", "1.5", "2", "2.5", "3", "3.5",'ДПП'],
                }
              ),
            },
            inWorkActivities: {
              ...filterByDifficultAndStatus(
                employeeActivities.inWorkActivities,
                {
                  "1": ["1"],
                  "1.5": ["1.5"],
                  "2": ["2"],
                  "2.5": ["2.5"],
                  "3": ["3"],
                  "3.5": ["3.5"],
                }
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.inWorkActivities,
                {
                  "ДПП актив": [ "ДПП"],
                },
                ["ДПП актив"]
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.inWorkActivities,
                {
                  "ДПП пассив": [ "ДПП"],
                },
                ["ДПП пассив"]
              ),

              ...filterByDifficultAndStatus(
                employeeActivities.inWorkActivities,
                {
                  Все: ["1", "1.5", "2", "2.5", "3", "3.5",'ДПП'],
                }
              ),
            },
            doneActivities: filterByDifficultAndStatus(
              employeeActivities.doneActivities,
              {
                "1": ["1"],
                "1.5": ["1.5"],
                "2": ["2"],
                "2.5": ["2.5"],
                "3": ["3"],
                "3.5": ["3.5"],
                ДПП: ["ДПП"],
                Все: ["1", "1.5", "2", "2.5", "3", "3.5"],
              }
            ),
            replacementActivities: {
              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  "Завершено 1-1.5": ["1", "1.5"],
                },
                ["Выполнено"]
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  "В работе 1-1.5": ["1", "1.5"],
                },
                ["В работе", "ДПП актив", "ДПП пассив"]
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  "Завершено 2-2.5": ["2", "2.5"],
                },
                ["Выполнено"]
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  "В работе 2-2.5": ["2", "2.5"],
                },
                ["В работе", "ДПП актив", "ДПП пассив"]
              ),

              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  "Завершено 3-3.5": ["3", "3.5"],
                },
                ["Выполнено"]
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  "В работе 3-3.5": ["3", "3.5"],
                },
                ["В работе", "ДПП актив", "ДПП пассив"]
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  ДПП: ["ДПП"],
                }
              ),
              ...filterByDifficultAndStatus(
                employeeActivities.replacementActivities,
                {
                  Все: ["1", "1.5", "2", "2.5", "3", "3.5"],
                }
              ),
            },
            all: {
           Все:   employeeActivities.all
              } 
              
          };
          return normalizedForTableView;
        }
      );
    },
    tableRows(){
      if(this.showOnlyInWorkActivities){
        return this.filtredActivitiesForTableView.map(employee=>{
          return {
            full_name:employee.full_name,
  inWorkActivities: employee.inWorkActivities,
  all: employee.all,
          }
        })
      }else{
        return this.filtredActivitiesForTableView
      }
    },
    currentActivityTypeForShow(){
      let typesWillBeShow = {}
    for(let type in this.activityTypesShow )  {
    if(this.activityTypesShow[type]){
      typesWillBeShow[type] = this.filtredActivitiesForTableView[type]
    }
    }
    return typesWillBeShow
    },
    receivedActivitiesPerPercent() {
      let currentAllreceivedActivities = this.filtredActivitiesForTableView
        .map((employee) => {
          return employee.receivedActivities["Все"];
        })
        .reduce(
          (accumulator, currentValue) => currentValue.length + accumulator,
          0
        );
      return currentAllreceivedActivities;
    },
    tabelFiltred() {
      return this.$store.state.tabel.filter((day) => {
        return (
          this.getYear(day.date) == this.currentYear &&
          this.getQuarter(day.date) == this.currentQuarter
        );
      });
    },
    plan() {
      let plan = 0;
      this.tabelFiltred.forEach((day) => {
        if (!day.vixod) {
          if (day.isNextDayVixod) {
            plan += 7;
          } else {
            plan += 8.25;
          }
        }
      });
      return plan;
    },
    coefficientPerEmployee() {
      return this.employees.map((employee, eidx) => {
        let fact = 0;

        this.tabelFiltred.forEach((day, idx) => {
          for (let nid in day.body) {
            if (employee.nid == nid) {
              fact += Number(day.body[nid].trim().replace(/\,/g, ".")) || 0;
            }
          }
        });
        return {
          full_name: employee.full_name,
          coefficient: ((1 - fact / (this.plan || 1)) * 100).toFixed(0),
        };
      });
    },
  },
  components:{
    activityModal
  }
};
</script>

<style></style>
