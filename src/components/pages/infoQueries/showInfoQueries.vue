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
            Инфозапросы {{ $store.state.infoQueries.length }}
          </h1>

          <div class="button is-small is-primary mx-2" @click="resetFilter">
            СБРОС
          </div>
          <div
            @click="exportToExcel"
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
    <div class="columns center">
      <div
        class="column center sort__button  "
        :class="'is-' + infoQueryName.columns"
        :key="name"
        v-for="(infoQueryName, name) in infoQueryNames"
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
          {{ infoQueryName.name }}
        </button>
      </div>
    </div>
    <div class="columns">
      <div
        class="center mx-0"
        :class="[
          'column is-' + infoQueryName.columns,
          { 'p-0': infoQueryName.type == 'select' },
        ]"
        :key="name"
        v-for="(infoQueryName, name) in infoQueryNames"
      >
        <div v-if="infoQueryName.type == 'text'">
          <input-text :value.sync="filterInput[name]"></input-text>
        </div>
        <div v-else-if="infoQueryName.type == 'select'" class="p-0">
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
        v-for="infoQuery in infoQueriesFiltredPaginated"
        :key="infoQuery.id"
        @click="openInfoQuery(infoQuery)"
      >
        <div
          class="center column "
          :class="'is-' + infoQueryName.columns"
          v-for="(infoQueryName, name) in infoQueryNames"
          :key="name"
        >
          {{ infoQuery[name] }}
        </div>
      </div>
    </div>
    <infoQueryModal
      :infoQuery="currentDisplayingInfoQuery"
      :show.sync="needInfoQueryModal"
    ></infoQueryModal>
  </div>
</template>

<script>
import infoQueryModal from "./infoQueryModal.vue";
export default {
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
      needInfoQueryModal: false,
      filters: ["filterSelect", "filterInput", "sort"],
      paginationCount: 30,
      kalendar: "",
      currentDisplayingInfoQuery: {},
      infoQueryNames: {
        inicatior: { name: "Инициатор", columns: 1, type: "text" },
        fdate: { name: "Дата получения", columns: 1, type: "date" },
        sdate: { name: "Дата отработки", columns: 1, type: "date" },
        nazvanie: { name: "Название запроса", columns: 2, type: "text" },
        otvetstveniy: { name: "Ответственный", columns: 1, type: "select" },
        otchot: { name: "Отчет о выполнении", columns: 2, type: "text" },
        classification: { name: "Классификация", columns: 1, type: "select" },
        problem: { name: "Проблема", columns: 1, type: "select" },
        produkt: { name: "Продукт", columns: 2, type: "text" },
        // otvetfrom: {
        //   name: "Кто от маркетинга предоставил ответ",
        //   columns: 2,
        //   type: "text",
        // },
        // statuses: "Статус",
        // days: "Время обработки дни",
      },
      table: {
        created: false,
      },
      filterSelect: {
        fdate: "",
        sdate: "",
        otvetstveniy: "",
        classification: "",
        problem: "",
      },
      filterInput: {
        inicatior: "",
        nazvanie: "",
        otchot: "",
        produkt: "",
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
    // openinfoQuery(infoQuery) {
    //   this.$store.commit("setDisplayinginfoQuery", infoQuery);
    //   this.needinfoQueryModal = true;
    // },
    setQueryParams() {
      console.log("ss");
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
    openInfoQuery(infoQuery) {
      this.needInfoQueryModal = true;
      this.currentDisplayingInfoQuery = infoQuery;
    },
    exportToExcel() {
      let wb = this.$XLSX.utils.book_new();
      wb.Props = {
        Title: "Экспорт инфозапросов",
        Subject: "Проект МИ",
        Author: "Проект МИ",
        CreatedDate: new Date(),
      };

      wb.SheetNames.push("Инфозапросы");
      let ws_data = this.infoQueriesFiltredPaginated.map((infoQuery) => {
        return {
          Инициатор: infoQuery.inicatior,
          "Дата получения": infoQuery.fdate,
          "Дата отработки": infoQuery.sdate,
          "Название запроса": infoQuery.nazvanie,
          Ответственный: infoQuery.otvetstveniy,
          "Отчет о выполнении": infoQuery.otchot,
          Класификация: infoQuery.classification,
          Проблема: infoQuery.problem,
          Продукт: infoQuery.produkt,
        };
      });

      let ws = this.$XLSX.utils.json_to_sheet(ws_data);
      wb.Sheets["Инфозапросы"] = ws;
      let wbout = this.$XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }

      saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        "ЭкспортИнфозапросов.xlsx"
      );
    },
  },
  deactivated() {
    this.needInfoQueryModal = false;
  },
  computed: {
    infoQueriesFiltred() {
      return this.infoQueries
        .filter((v, i, arr) => {
          for (let prop in this.filterSelect) {
            if (this.filterSelect[prop]) {
              if (v[prop] != this.filterSelect[prop]) return false;
            }
          }

          for (let prop in this.filterInput) {
            if (this.filterInput[prop]) {
              if (
                !v[prop]
                  .toUpperCase()
                  .includes(this.filterInput[prop].toUpperCase())
              )
                return false;
            }
          }

          return true;
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
    allFilters() {
      return {
        filterSelect: this.filterSelect,
        filterInput: this.filterInput,
        sort: this.sort,
      };
    },
    infoQueriesFiltredPaginated() {
      return this.infoQueriesFiltred.slice(0, this.paginationCount || 30);
    },
    infoQueries() {
      return this.$store.state.infoQueries;
    },
    employees() {
      return this.$store.state.employees;
    },
    problemOptions() {
      return this.$store.state.infoQueriesSelectOptions.problemOptions;
    },
    classificationOptions() {
      return this.$store.state.infoQueriesSelectOptions.classificationOptions;
    },

    allOptions() {
      return {
        classificationOptions: this.classificationOptions,
        problemOptions: this.problemOptions,
        otvetstveniyOptions: this.employees.map(
          (employee) => employee.full_name
        ),
      };
    },
  },
  components: {
    infoQueryModal,
  },
  watch: {
    allFilters: {
      deep: true,
      handler: function() {
        this.setQueryParams();
      },
    },
  },
};
</script>

<style></style>
