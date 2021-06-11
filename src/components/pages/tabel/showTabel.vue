<template>
  <div>
    <div class="columns">
      <div class="column is-3 is-offset-3 center">
        <span>Дата начала:</span>
        <input type="text" class="datepicker input" v-model.lazy="date1" />
      </div>

      <div class="column is-3 center">
        <span>Дата конца:</span>
        <input type="text" class="datepicker input" v-model.lazy="date2" />
      </div>

      <description-table></description-table>
    </div>

    <h1 class="center title is-1">Табель</h1>
    <div class="column is-12 p-0" style="overflow: auto">
      <table class="table is-hoverable" id="allTable">
        <tbody>
          <tr>
            <th></th>
            <th v-for="day in tabelFiltred" class="center" :key="day.date">
              {{ day.date | cutYear }}
            </th>
          </tr>
          <tr>
            <th style="text-align: center">ФИО</th>
            <th v-for="day in tabelFiltred" class="center" :key="day.date">
              {{ day.date | dayOfWeek }}
            </th>
          </tr>
          <tr class="center" v-for="employee in employees" :key="employee.nid">
            <td
              style="
                width: 1%;
                white-space: nowrap;
                text-align: left;
                position: sticky;
                left: 0;
                z-index: 2;
                background: white;
              "
            >
              {{ employee["full_name"] }}
            </td>
            <td
              v-for="day in tabelFiltred"
              :key="day.date"
              class="center ma vam"
              :class="classObjForTd(day, employee)"
            >
              {{ day.body[employee.nid] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr />

    <div class="block">
      <h2 class="center fluid-text title is-2">План/Факт</h2>

      <div class="columns">
        <div class="column is-offset-4 is-4 center">
          <table
            class="table is-striped is-hoverable center w100"
            id="planFact"
          >
            <tr>
              <th>ФИО</th>
              <th>План</th>
              <th>Факт без замещения</th>
              <th>Общий Факт</th>
              <th>Коэфф</th>
            </tr>

            <tr v-for="employee in employees" :key="employee.nid">
              <td style="text-align: left">{{ employee["full_name"] }}</td>
              <td>{{ employee.plan | filterDotZeroZero }}</td>
              <td>{{ employee.factWithoutZ | filterDotZeroZero }}</td>
              <td>{{ employee.fact | filterDotZeroZero }}</td>
              <td>{{ employee.koeff }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import descriptionTable from "./descriptionTable.vue";
export default {
  components: { descriptionTable },
  data() {
    return {
      history: {
        write: true,
        arrOfHistory: [],
        copy: false,
        isLast: true,
        isFirst: true,
        diff: 0,
      },
      kalendar: [],
      date1: "",
      date2: "",

      range: [],
      some: {
        OFF: false,
        clicked: false,
        step: -1,
        F: {
          X: "",
          Y: "",
        },
        L: {
          X: "",
          Y: "",
        },
        PRE: {
          X: "",
          Y: "",
        },
        somes: [],
        presomes: [],
        input: "",
      },
      employees: [],
    };
  },
  mounted: function () {
    this.employees = this.$store.state.employees;
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let kvartal = "";
    switch (true) {
      case month >= 0 && month <= 2:
        kvartal = "I";
        break;
      case month >= 3 && month <= 5:
        kvartal = "II";
        break;
      case month >= 7 && month <= 9:
        kvartal = "III";
        break;
      case month >= 9:
        kvartal = "IV";
        break;
    }
    this.date1 = kvartal + " " + year;
    this.kalendar = this.$Kalendar.set({
      showMonthBtn: true,
      showKvartalBtn: true,
      // showYearBtn: true
    });
  },

  methods: {
    dateRange: function () {
      let date1 = this.date1;
      let date2 = this.date2;

      ///DATE
      let parts = date1.split(" ");

      let startDate;
      let endDate;
      if (parts.length === 3) {
        startDate = new Date(parts[2], parts[1] - 1, parts[0]);

        parts = date2.split(" ");

        endDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else if (parts.length == 2) {
        if (isNaN(Number(parts[0]))) {
          switch (parts[0]) {
            case "I":
              startDate = new Date(parts[1], "0", "1");
              endDate = new Date(parts[1], "3", "0");
              break;
            case "II":
              startDate = new Date(parts[1], "3", "1");
              endDate = new Date(parts[1], "6", "0");
              break;
            case "III":
              startDate = new Date(parts[1], "6", "1");
              endDate = new Date(parts[1], "9", "0");
              break;
            case "IV":
              startDate = new Date(parts[1], "9", "1");
              endDate = new Date(parts[1], "11", "31");
              break;
          }
        } else {
          //MONTH SELECTED

          startDate = new Date(parts[1], parts[0] - 1, "1");
          endDate = new Date(parts[1], parts[0], "0");
        }
      } else {
        startDate = new Date(parts[0], 0, 1);
        endDate = new Date(parts[0], 11, 31);
      }

      if (endDate < startDate) {
        let y;
        y = startDate;
        startDate = endDate;
        endDate = y;
      }

      let dates = [];
      //to avoid modifying the original date
      const theDate = new Date(startDate);

      while (theDate < endDate) {
        let dateForPush = "";

        if (theDate.getDate() < 10) {
          dateForPush += "0" + theDate.getDate() + " ";
        } else {
          dateForPush += theDate.getDate() + " ";
        }

        if (theDate.getMonth() < 9) {
          dateForPush += "0" + (theDate.getMonth() + 1) + " ";
        } else {
          dateForPush += theDate.getMonth() + 1 + " ";
        }
        dateForPush += theDate.getFullYear();
        dates.push(dateForPush);
        theDate.setDate(theDate.getDate() + 1);
      }

      let dateForPush = "";

      if (theDate.getDate() < 10) {
        dateForPush += "0" + theDate.getDate() + " ";
      } else {
        dateForPush += theDate.getDate() + " ";
      }

      if (theDate.getMonth() < 9) {
        dateForPush += "0" + (theDate.getMonth() + 1) + " ";
      } else {
        dateForPush += theDate.getMonth() + 1 + " ";
      }
      dateForPush += theDate.getFullYear();
      dates.push(dateForPush);

      // dates //

      this.range = dates;
      return dates;
    },
    createTable: function () {
      //THIS IS FOR BACKEND
      //             let range = this.dateRange();
      // range.forEach((element,idx) => {
      //     setTimeout(() => {
      //         axios.post('../vendor/test.php', JSON.stringify({
      //             date: element
      //         }))
      //         .then(res=>console.log(res.data))
      //     }, idx * 100);
      // });
    },
    planFactCalculate() {
      this.employees.forEach((em) => {
        em.fact = 0;
        em.factWithoutZ = 0;
        em.plan = 0;
      });

      this.tabelFiltred.forEach((v, idx) => {
        this.employees.forEach((em, eidx) => {
          for (let nid in v.body) {
            if (em.nid == nid) {
              if (!v.vixod && v.body[em.nid] && v.body[em.nid].trim().length) {
                if (v.isNextDayVixod) {
                  em.plan += 7;
                } else {
                  em.plan += 8.25;
                }
              }

              if (v.body[nid].trim().toUpperCase() == "З") {
                em.fact += 8.25;
              } else if (
                !isNaN(Number(v.body[nid].trim().replace(/\,/g, ".")))
              ) {
                em.fact += Number(v.body[nid].trim().replace(/\,/g, "."));
                em.factWithoutZ += Number(
                  v.body[nid].trim().replace(/\,/g, ".")
                );
              }
            }
          }
        });
      });

      this.employees.forEach((employee) => {
        employee.koeff =
          ((1 - employee.factWithoutZ / (employee.plan || 1)) * 100).toFixed(
            0
          ) + "%";
      });
    },
    classObjForTd(day, employee) {
      if (!day.body[employee.nid]) {
        return;
      }
      let dataOfDay = day.body[employee.nid].trim().toUpperCase();
      return {
        "has-background-info has-text-white": dataOfDay == "З",
        "has-background-primary-dark has-text-white": dataOfDay == "Д",
        "has-background-success-dark has-text-white": dataOfDay == "С",
        "has-background-danger has-text-white": dataOfDay == "В",
        "has-background-primary has-text-white": dataOfDay == "О",
        "has-background-warning ": dataOfDay == "Б",
        "has-background-success has-text-white": [7, 8, 8.25].includes(
          Number(dataOfDay.replace(",", "."))
        ),
      };
    },
  },
  watch: {
    someInput: function (n, o) {
      if (this.some.step === 3) {
        this.some.somes.forEach((element) => {
          element.somes.forEach((v) => {
            element.body[v] = n.toUpperCase();
          });
        });
      }
    },
    date1: function (n, o) {
      if (n.split(" ").length == 3 && this.date2.split(" ").length == 3) {
        this.dateRange();
        return;
      }
      if (n.split(" ").length == 2 || n.split(" ").length == 1) {
        this.date2 = n;
        this.dateRange();
      }
      return;
    },
    date2: function (n, o) {
      if (n.split(" ").length == 3 && this.date1.split(" ").length == 3) {
        this.dateRange();
        return;
      }
      if (n.split(" ").length == 2 || n.split(" ").length == 1) {
        this.date1 = n;
        this.dateRange();
        return;
      }
      return;
    },
    tabelFiltred: function (n) {
      this.planFactCalculate();
    },
    employeesFromState(n) {
      this.employees = this.$store.state.employees.map((employee) => {
        return Object.assign({}, employee);
      });
      this.planFactCalculate();
    },
  },
  computed: {
    tabelFiltred: function () {
      if (!this.range.length) return [];

      try {
        return this.$store.state.tabel.filter((v) => {
          if (!v.somes) v.somes = [];
          return this.range.includes(v.date);
        });
      } catch {
        return [];
      }
    },
    trueNID() {
      return this.$store.getters.trueNID;
    },
    tabel() {
      return this.$store.state.tabel;
    },
    employeesFromState() {
      return this.$store.state.employees;
    },
  },
  filters: {
    dayOfWeek: function (val) {
      let parts = val.split(" ");

      let filtredDate = new Date(parts[2], parts[1] - 1, parts[0]);

      switch (filtredDate.getDay()) {
        case 0:
          return "ВСК";
        case 1:
          return "ПН";
        case 2:
          return "ВТ";
        case 3:
          return "СР";
        case 4:
          return "ЧТ";
        case 5:
          return "ПТ";
        case 6:
          return "СБ";
        case 7:
          return "ВСК";
      }
    },
    filterDotZeroZero(val) {
      return val.toFixed(2);
    },
    cutYear(val) {
      return val.split(" ").slice(0, -1).join(" ");
    },
  },
};
</script>
