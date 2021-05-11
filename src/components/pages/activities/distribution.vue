<template>
  <div>
    
    <div class="columns">
    
      <div class="column is-2 px-5 has-text-centered ">
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
            <a class="is-primary button" 
                    :class="{ 'is-large is-danger': currentYear == year && currentQuarter == i }"
            >{{ i }}Q</a>
          </li>
        </ul>
      </div>
      <div class="column is-10 box my-4 p-4">
        <h1 class="title is-1 has-text-centered">
      Распределение за {{currentYear}} {{currentQuarter == "4" ? 'IV' : (new Array(currentQuarter).fill('I').join(''))}}
    </h1>
        <div style="overflow-x:scroll; overflow-y:hidden">
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
            <div class="columns column mx-0  is-6 is-justify-content-center">
              <div class="">
                <h3 class="title is-3  has-text-centered">
                  Поступило
                </h3>
              </div>
            </div>
            <div class="columns column mx-0  is-6 is-justify-content-center">
              <div class="">
                <h3 class="title is-3 has-text-centered">
                  В работе
                </h3>
              </div>
            </div>
            <div class="columns column mx-0  is-6 is-justify-content-center">
              <div class="">
                <h3 class="title is-3 has-text-centered">
                  Выполнено
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
              class="columns column py-0 mx-0  is-6 is-justify-content-center"
            >
              <div class="has-text-centered" style="width:90px">
                1-1.5
              </div>
              <div class="has-text-centered" style="width:90px">
                2-2,5
              </div>
              <div class="has-text-centered" style="width:90px">
                3-3.5
              </div>
              <div class="has-text-centered" style="width:90px">
                ДФ
              </div>
            </div>
            <div
              class="columns column py-0 mx-0 is-6 is-justify-content-center"
            >
              <div class="has-text-centered" style="width:90px">
                1
              </div>
              <div class="has-text-centered" style="width:90px">
                1.5
              </div>
              <div class="has-text-centered" style="width:90px">
                2
              </div>

              <div class="has-text-centered" style="width:90px">
                2,5
              </div>

              <div class="has-text-centered" style="width:90px">
                3
              </div>
              <div class="has-text-centered" style="width:90px">
                3.5
              </div>
              <div class="has-text-centered" style="width:90px">
                ДФ
              </div>
            </div>
            <div
              class="columns column py-0 mx-0 is-6 is-justify-content-center"
            >
              <div class="has-text-centered" style="width:90px">
                1
              </div>
              <div class="has-text-centered" style="width:90px">
                1.5
              </div>
              <div class="has-text-centered" style="width:90px">
                2
              </div>

              <div class="has-text-centered" style="width:90px">
                2,5
              </div>

              <div class="has-text-centered" style="width:90px">
                3
              </div>
              <div class="has-text-centered" style="width:90px">
                3.5
              </div>
              <div class="has-text-centered" style="width:90px">
                ДФ
              </div>
            </div>
          </div>
          <div
            v-for="(row, idx) in filtredActivitiesForTableView"
            class="columns"
            :key="idx"
          >
            <div
              v-for="(column, prop) in row"
              :key="prop"
              class=" columns column  py-0 mx-0"
              :class="[
                { 'is-justify-content-center': prop != 'full_name' },
                [prop != 'full_name' ? 'is-6' : 'is-3'],
              ]"
            >
              <div
                v-if="prop == 'full_name'"
                style="position:absolute; background: white; width:22%"
                class="py-3"
              >
                {{ column }}
              </div>
              <div
                style="width: 90px"
                v-else
                class="has-text-centered py-3"
                v-for="(activities, idx) in column"
                :key="idx"
                :style="getColor(prop, Object.keys(column).indexOf(idx))"
              >
                {{ activities.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      years: [2021, 2022, 2023],
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
      },
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
    getColor(prop, idx) {
      return {
        backgroundColor: this.colors[prop] ? this.colors[prop][idx] : "red",
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
        let inWorkActivities = employeeActivities.filter(
          (activity) => activity.status.trim() == "В работе"
        );
        let receivedActivities = employeeActivities.filter((activity) => {
          return (
            this.getYear(activity.fdate) == this.currentYear &&
            this.getQuarter(activity.fdate) == this.currentQuarter
          );
        });

        return {
          full_name: employee.full_name,
          receivedActivities,
          inWorkActivities,
          doneActivities,
        };
      });
    },
    filtredActivitiesForTableView() {
      return this.filtredActivitiesPerEmployeesAndDate.map(
        (employeeActivities) => {
          function sortByDifficulty(mainArray, difficulties) {
            let normalized = {};

            for (let prop in difficulties) {
              normalized[prop] = mainArray.filter((el) =>
                difficulties[prop].includes(el.difficulty)
              );
            }

            return normalized;
          }

          let normalizedForTableView = {
            full_name: employeeActivities.full_name,
            receivedActivities: sortByDifficulty(
              employeeActivities.receivedActivities,
              {
                "1-1.5": [1, 1.5],
                "2-2.5": [2, 2.5],
                "3-3.5": [3, 3.5],
                ДПП: ["ДПП"],
              }
            ),
            inWorkActivities: sortByDifficulty(
              employeeActivities.inWorkActivities,
              {
                "1": [1],
                "1.5": [1.5],
                "2": [2],
                "2.5": [2.5],
                "3": [3],
                "3.5": [3.5],
                ДПП: ["ДПП"],
              }
            ),
            doneActivities: sortByDifficulty(
              employeeActivities.doneActivities,
              {
                "1": [1],
                "1.5": [1.5],
                "2": [2],
                "2.5": [2.5],
                "3": [3],
                "3.5": [3.5],
                ДПП: ["ДПП"],
              }
            ),
          };

          return normalizedForTableView;
        }
      );
    },
  },
};
</script>

<style></style>
