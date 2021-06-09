<template>
  <div>
    <div class="block">
      <div
        class="
          center
          is-flex is-justify-content-space-between is-align-items-center
        "
      >
        <div style="width: 100px"></div>
        <div class="is-flex is-align-items-center">
          <h1 class="title is-1 mx-2">Активности</h1>

          <div class="button is-small is-primary mx-2" @click="resetFilter">
            СБРОС
          </div>
          <div
            class="button z-depth-3"
            mx-2
            style="width: 40px; padding: 0; border-radius: 50%"
            @click="exportToExcel"
          >
            <img
              src="../../../assets/EX.png"
              width="100%"
              style="border-radius: 50%"
              alt=""
            />
          </div>
        </div>

        <div>
          <h5 class="is title is-5 m-0">Оценка:</h5>
          <select v-model="filterOcenka">
            <option value="all" selected>Все</option>
            <option value="">Без оценки</option>
            <option value="Успешно">Успешно</option>
            <option value="С ошибкой">С ошибкой</option>
          </select>

          <div>
            <label>
              <input type="checkbox" v-model="needTagsFilter" />
              <span>Поиск по тегам</span>
            </label>
          </div>
        </div>
      </div>

      <tags v-if="needTagsFilter" class="box" :tags="tagsFilter"></tags>
    </div>

    <table id="allTable" v-show="false" v-if="table.created">
      <tr>
        <th class="" @click="sortChange('fdate')">Дата спуска</th>
        <th class="" @click="sortChange('sdate')">Дата запуска</th>
        <th class="" @click="sortChange('bizness')">Вид бизнеса</th>
        <th class="" @click="sortChange('zapusk')">Тип запуска</th>
        <th class="" @click="sortChange('nazvanie')">Название</th>
        <th class="" @click="sortChange('opisanie')">Описание</th>
        <th class="" @click="sortChange('soprovod')">Сопровождающий</th>
        <th class="" @click="sortChange('zakazchik')">Заказчик</th>
        <th class="" @click="sortChange('status')">Статус</th>
      </tr>

      <tr
        class="columns hover__bg"
        v-for="activity in activitiesFiltred"
        :key="activity.id"
        @click="openActivity(activity)"
      >
        <td class="">{{ activity.fdate }}</td>
        <td class="">{{ activity.sdate }}</td>
        <td class="">{{ activity.bizness }}</td>
        <td class="">{{ activity.zapusk }}</td>
        <td class="">{{ activity.nazvanie }}</td>
        <td class="">{{ activity.opisanie }}</td>
        <td class="">{{ activity.soprovod }}</td>
        <td class="">{{ activity.zakazchik }}</td>
        <td class="">{{ activity.status }}</td>
      </tr>
    </table>

    <div class="columns center" style="padding-right: 16px">
      <div class="column is-1 sort__button" @click="sortChange('fdate')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'fdate' && sort.r == 1,
            'is-info': sort.column == 'fdate' && sort.r == -1,
          }"
        >
          Дата спуска
        </button>
      </div>
      <div class="column is-1 sort__button" @click="sortChange('sdate')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'sdate' && sort.r == 1,
            'is-info': sort.column == 'sdate' && sort.r == -1,
          }"
        >
          Дата запуска
        </button>
      </div>
      <div class="column is-1 sort__button" @click="sortChange('bizness')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'bizness' && sort.r == 1,
            'is-info': sort.column == 'bizness' && sort.r == -1,
          }"
        >
          Вид бизнеса
        </button>
      </div>
      <div class="column is-1 sort__button" @click="sortChange('zapusk')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'zapusk' && sort.r == 1,
            'is-info': sort.column == 'zapusk' && sort.r == -1,
          }"
        >
          Тип запуска
        </button>
      </div>
      <div class="column is-1 sort__button" @click="sortChange('nazvanie')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'nazvanie' && sort.r == 1,
            'is-info': sort.column == 'nazvanie' && sort.r == -1,
          }"
        >
          Название
        </button>
      </div>
      <div class="column is-2 sort__button" @click="sortChange('opisanie')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'opisanie' && sort.r == 1,
            'is-info': sort.column == 'opisanie' && sort.r == -1,
          }"
        >
          Описание
        </button>
      </div>
      <div class="column is-2 sort__button" @click="sortChange('soprovod')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'soprovod' && sort.r == 1,
            'is-info': sort.column == 'soprovod' && sort.r == -1,
          }"
        >
          Сопровождающий
        </button>
      </div>
      <div class="column is-2 sort__button" @click="sortChange('zakazchik')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'zakazchik' && sort.r == 1,
            'is-info': sort.column == 'zakazchik' && sort.r == -1,
          }"
        >
          Заказчик
        </button>
      </div>
      <div class="column is-1 sort__button" @click="sortChange('status')">
        <button
          class="button is-small is-primary"
          :class="{
            'is-danger': sort.column == 'status' && sort.r == 1,
            'is-info': sort.column == 'status' && sort.r == -1,
          }"
        >
          Статус
        </button>
      </div>
    </div>

    <div
      class="columns"
      style="
        padding-right: 16px;
        border-bottom: 2px solid #26a69a;
        padding-bottom: 10px;
        margin-bottom: 5px;
      "
    >
      <div class="column is-1">
        <input-date :value.sync="filterSelect.fdate"></input-date>
      </div>
      <div class="column is-1">
        <input-date :value.sync="filterSelect.sdate"></input-date>
      </div>
      <div class="column is-1 p-1">
        <select v-model="filterSelect.bizness" id="bizness">
          <option value="" selected>Вид бизнеса</option>
          <option value="FMC">FMC</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
          <option value="ПК">ПК</option>
          <option value="FTTB">FTTB</option>
          <option value="FMC/FTTB">FMC/FTTB</option>
          <option value="BTB/BTC">BTB/BTC</option>
          <option value="FMC/B2C">FMC/B2C</option>
        </select>
      </div>
      <div class="column is-1 p-1">
        <select v-model="filterSelect.zapusk" id="zapusk">
          <option value="" selected>Тип запуска</option>
          <option value="Запуск ТП">Запуск ТП</option>
          <option value="Перезапуск ТП">Перезапуск ТП</option>
          <option value="Закрытие ТП">Закрытие ТП</option>
          <option value="Офсет">Офсет</option>
          <option value="Симплификация/Репайсинг">
            Симплификация/Репайсинг
          </option>
          <option value="Запуск Услуги">Запуск Услуги</option>
          <option value="Изменение условий услуги">
            Изменение условий услуги
          </option>
          <option value="Изменение условий акции">
            Изменение условий акции
          </option>
          <option value="Закрытие услуги">Закрытие услуги</option>
          <option value="Запуск акции">Запуск акции</option>
          <option value="Закрытие акции">Закрытие акции</option>
          <option value="SMS/push/email рассылка">
            SMS/push/email рассылка
          </option>
          <option value="Запуск Города">Запуск Города</option>
          <option value="Оборудование">Оборудование</option>
        </select>
      </div>
      <div class="column is-1">
        <input type="text" class="input" v-model="filterInput.nazvanie" />
      </div>
      <div class="column is-2">
        <input type="text" class="input" v-model="filterHTML.opisanie" />
      </div>
      <div class="column is-2 p-1">
        <select v-model="filterSelect.soprovod" id="soprovod">
          <option value="" selected>Сопровождающий</option>
          <option
            v-for="employee in employees"
            :key="employee.nid"
            :value="employee['full_name']"
          >
            {{ employee["full_name"] }}
          </option>
        </select>
      </div>
      <div class="column is-2">
        <input type="text" class="input" v-model="filterInput.zakazchik" />
      </div>

      <div class="column is-1 p-1">
        <select v-model="filterSelect.status" id="status">
          <option value="" selected>Статус</option>
          <option value="В работе">В работе</option>
          <option value="Выполнено">Выполнено</option>
          <option value="Отложено">Отложено</option>
          <option value="Отменено">Отменено</option>
          <option value="ДПП пассив">ДПП пассив</option>
          <option value="ДПП актив">ДПП актив</option>
        </select>
      </div>
    </div>
    <div style="max-height: 75vh; overflow-y: auto; overflow-x: hidden">
      <div
        class="columns hover__bg p-1"
        v-for="activity in activitiesFiltred"
        :key="activity.id"
        @click="openActivity(activity)"
      >
        <div class="column is-1 has-text-centered">{{ activity.fdate }}</div>
        <div class="column is-1 has-text-centered">{{ activity.sdate }}</div>
        <div class="column is-1 has-text-centered">{{ activity.bizness }}</div>
        <div class="column is-1 has-text-centered">{{ activity.zapusk }}</div>
        <div
          class="column is-1 has-text-centered"
          style="word-break: break-all"
        >
          {{ activity.nazvanie }}
        </div>
        <div
          class="column is-2 has-text-centered"
          style="word-break: break-all"
        >
          {{ activity.opisanieBodyCuted }}
        </div>
        <div class="column is-2 has-text-centered">{{ activity.soprovod }}</div>
        <div
          class="column is-2 has-text-centered"
          style="word-break: break-all"
        >
          {{ activity.zakazchik }}
        </div>
        <div class="column is-1 has-text-centered">{{ activity.status }}</div>
      </div>
    </div>

    <activity-modal
      :role="'admin'"
      :show.sync="needActivityModal"
    ></activity-modal>
  </div>
</template>

<script>
import Tags from "./global/tags.vue";
import activityModal from "./global/activityModal";
import { saveAs } from "file-saver";
export default {
  data() {
    return {
      tagsFilter: [],
      needTagsFilter: false,
      filters: ["filterSelect", "filterInput", "filterHTML", "sort"],
      paginationCount: 30,
      kalendar: "",

      table: {
        created: false,
      },
      filterSelect: {
        bizness: "",
        zapusk: "",
        status: "",
        fdate: "",
        sdate: "",
        soprovod: "",
      },
      filterInput: {
        zakazchik: "",
        nazvanie: "",
      },
      filterHTML: {
        opisanie: "",
      },
      filterOcenka: "all",
      sort: {
        column: "",
        r: "",
      },

      activityForModal: {},
      needActivityModal: false,
    };
  },
  mounted: function () {
    this.readQueryParams();
    M.FormSelect.init(
      document.querySelectorAll("select", {
        dropdownOptions: {
          constrainWidth: false,
        },
      })
    );
  },
  activated() {},
  deactivated() {
    this.needActivityModal = false;
  },
  methods: {
    resetFilter: function () {
      for (let prop in this.filterSelect) {
        this.filterSelect[prop] = "";
      }
      for (let prop in this.filterInput) {
        this.filterInput[prop] = "";
      }
      this.needTagsFilter = false;
      this.filterHTML.opisanie = "";
      this.sort.r = 1;
      this.sort.column = "";
      this.filterOcenka = "all";
      this.$nextTick(function () {
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
    openActivity(activity) {
      this.$store.commit("setDisplayingActivity", activity);
      this.needActivityModal = true;
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
    exportToExcel() {
      let wb = this.$XLSX.utils.book_new();
      wb.Props = {
        Title: "Экспорт активностей",
        Subject: "Проект МИ",
        Author: "Проект МИ",
        CreatedDate: new Date(),
      };

      wb.SheetNames.push("Активности");
      let ws_data = this.activitiesFiltred.map((activity) => {
        return {
          "Дата спуска": activity.fdate,
          "Дата запуска": activity.sdate,
          Название: activity.nazvanie,
          "Вид бизнеса": activity.bizness,
          "Тип запуска": activity.zapusk,
          Сопровождающий: activity.soprovod,
          Статус: activity.status,
          Заказчик: activity.zakazchik,
          Сложность: activity.difficulty,
        };
      });

      let ws = this.$XLSX.utils.json_to_sheet(ws_data);
      wb.Sheets["Активности"] = ws;
      let wbout = this.$XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }

      saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        "ЭкспортАктивностей.xlsx"
      );
    },
  },
  watch: {
    filterSelect: {
      deep: true,
      handler: function (params) {
        this.setQueryParams();
      },
    },
    filterInput: {
      deep: true,
      handler: function (params) {
        this.setQueryParams();
      },
    },
    filterHTML: {
      deep: true,
      handler: function (params) {
        this.setQueryParams();
      },
    },
    sort: {
      deep: true,
      handler: function (params) {
        this.setQueryParams();
      },
    },
    employees: {
      deep: true,
      handler() {
        this.$nextTick().then(() => {
          M.FormSelect.init(document.querySelectorAll("select"));
        });
      },
    },
  },
  computed: {
    activitiesFiltred() {
      return this.activities
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
          if (this.filterHTML.opisanie.length) {
            if (
              !v.opisanieBodyHTML.innerText.includes(this.filterHTML.opisanie)
            ) {
              return false;
            }
          }
          if (this.filterOcenka != "all") {
            if (this.filterOcenka == "" && !v.ocenka.type) {
              return true;
            }
            return v.ocenka.type === this.filterOcenka;
          }
          if (this.needTagsFilter && this.tagsFilter.length) {
            if (
              !this.tagsFilter
                .map((tag) => tag.label)
                .find((tagLabel) =>
                  v.tags.map((tag) => tag.label).includes(tagLabel)
                )
            ) {
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
            fakeA = fakeA.split(" ").reverse().join(" ");
            fakeB = fakeB.split(" ").reverse().join(" ");
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

    activities() {
      return this.$store.state.activities;
    },
    employees() {
      return this.$store.state.employees;
    },
  },
  components: {
    activityModal,
    Tags,
  },
};
</script>

<style></style>
