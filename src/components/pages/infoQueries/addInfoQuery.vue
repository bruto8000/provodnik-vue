<template>
  <div class="container">
    <h1 class="center title is-1 my-5">Добавление Инфозапроса</h1>
    <div class="columns my-5">
      <div class="column is-4">
        <input-employee v-model="infoQuery.inicatior" header="Инициатор">
        </input-employee>
    
      </div>
      <div class="column is-4 ">
        <input-date
          :value.sync="infoQuery.fdate"
          header="Дата получения запроса"
        >
        </input-date>
      </div>

      <div class="column is-4 ">
        <input-date
          :value.sync="infoQuery.sdate"
          header="Дата отработки запроса"
   
        >
        </input-date>
      </div>
    </div>

    <div class="columns">
      <div class="column is-4">
        <input-text :value.sync="infoQuery.nazvanie" header="Название запроса">
        </input-text>
      </div>

      <div class="column is-4 p-0">
        <input-select
          :value.sync="infoQuery.otvetstveniy"
          header="Ответственный от ДОК"
          :options="employees"
          required
        >
        </input-select>
      </div>
      <div class="column is-4">
        <input-text :value.sync="infoQuery.otchot" header="Отчет о выполнении">
        </input-text>
      </div>
    </div>

    <div class="columns">
      <div class="column is-4 p-0">
        <input-select
          :options="classificationOptions"
          :value.sync="infoQuery.classification"
          header="Классификация запроса"
        >
        </input-select>
      </div>

      <div class="column is-4 p-0">
        <input-select
          :options="problemOptions"
          :value.sync="infoQuery.problem"
          header="Проблема"
        >
        </input-select>
      </div>

      <div class="column is-4">
        <input-text
          :value.sync="infoQuery.otvetfrom"
          header="Кто от маркетинга предоставил ответ"
        >
        </input-text>
      </div>
    </div>

    <div class="statues">
      <h3 class="title is-3">
        Статусы
        <button
          class="button is-primary dropdown-trigger "
          data-target="statusesDropdown"
          @click="addStatus()"
        >
          +
        </button>

        <button
          class="button is-danger "
          :disabled="!infoQuery.statuses.length"
          @click="deleteStatus()"
        >
          -
        </button>
      </h3>

      <div class="columns p-0" v-if="infoQuery.statuses.length">
        <div class="column   is-size-4 is-4 has-text-centered  ">Статус</div>
        <div class="column is-size-4 is-4 has-text-centered ">С</div>
        <div class="column is-size-4  is-4 has-text-centered ">По</div>
      </div>
      <div
        class="columns"
        v-for="(status, idx) in infoQuery.statuses"
        :key="idx"
      >
        <div class="column is-4 p-0">
          <input-select
            :options="statusOptions"
            :value.sync="infoQuery.statuses[idx].type"
          ></input-select>
        </div>
        <div class="column is-4">
          <input-date :value.sync="infoQuery.statuses[idx].fdate"></input-date>
        </div>
        <div class="column is-4">
          <input-date :value.sync="infoQuery.statuses[idx].sdate"></input-date>
        </div>
      </div>
    </div>

    <div class="columns">
      <div
        @click="addInfoQuery"
        class="button column is-12 is-primary m-4 p-4 title is-3"
      >
        Добавить инфозапрос
      </div>
    </div>
  </div>
</template>

<script>
import convertStringDateToNormalDate from '../../../js/utils/convertStringDateToNormalDate'
export default {
  data() {
    return {
      InputSelectdate: "",
      infoQuery: {
        inicatior: "",
        fdate: "",
        sdate: "",
        nazvanie: "",
        otvetstveniy: "",
        otchot: "",
        statuses: [],
        classification: "",
        problem: "",
        produkt: "",
        otvetfrom: "",
        days: "",
      },
      infoQueryNameErrors: {
        inicatior: "Инициатор",
        fdate: "Дата получения запроса",
        sdate: "Дата отработки запроса",
        nazvanie: "Название запроса",
        otvetstveniy: "Ответственный от ДОК",
        otchot: "Отчет о выполнении",
        statuses: "Статус",
        classification: "Классификация запроса",
        problem: "Проблема",
        produkt: "Продукт",
        otvetfrom: "Кто от маркетинга предоставил ответ",
        days: "Время обработки дни",
      },

      requiredRows: ["nazvanie", "otvetstveniy"],
    };
  },
  mounted: function() {},
  methods: {
    addStatus() {
      this.infoQuery.statuses.push({
        type: "",
        fdate: "",
        sdate: "",
      });
    },
    deleteStatus() {
      this.infoQuery.statuses.length && this.infoQuery.statuses.pop();
    },
    addInfoQuery: function(event) {
      event.target.classList.toggle("is-loading");
      if (!this.validateAll()) {
        setTimeout(() => {
          event.target.classList.toggle("is-loading");
        }, 400);
        return;
      }

      this.$store
        .dispatch("addInfoQuery", this.infoQuery)
        .then(() => {
          this.$vs.notify({ text: "Инфозапрос успешно добавлен" });
        })
        .catch((err) => {
          this.$vs.notify({
            text: `Инфозапрос не добавлен [${err}]`,
            color: "red",
            title: "Ошибка",
          });
        })
        .finally(() => {
          setTimeout(() => {
            event.target.classList.toggle("is-loading");
          }, 400);
        });
    },
    validateAll() {
      return this.validateRows() && this.validateStatuses();
    },
    validateRows() {
      try {
        for (let prop of this.requiredRows) {
          if (!this.infoQuery[prop]) {
            throw new Error(
              ` Вы пропустили что-то :  [${this.infoQueryNameErrors[prop]}]`
            );
          }
        }
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
      return true;
    },
   validateStatuses() {
      try {
        this.infoQuery.statuses.forEach((status, idxOfStatuses, statuses) => {
          if (
            !status.fdate ||
            !status.type ||
            (idxOfStatuses != statuses.length - 1 && !status.sdate)
          ) {
            throw new Error(
              `Не заполнено поле в статусах. Поле номер ${idxOfStatuses + 1}`
            );
          }

          if (
            status.sdate &&
            convertStringDateToNormalDate(status.fdate) >
              convertStringDateToNormalDate(status.sdate)
          ) {
            throw new Error(
              `Некорректно заполнены даты в статусах. Поле номер ${idxOfStatuses +
                1}`
            );
          }
          if (
            statuses[idxOfStatuses - 1] &&
            convertStringDateToNormalDate(status.fdate) <
              convertStringDateToNormalDate(statuses[idxOfStatuses - 1].fdate)
          ) {
            throw new Error(
              `Некорректно заполнены даты в статусах. Поле номер ${idxOfStatuses} и поле номер ${idxOfStatuses+1}.`
            );
          }
        });
      } catch (err) {
        this.$vs.notify({
          title: "Ошиба",
          text: err.message,
          color: "red",
          time: 5000,
        });
        return false;
      }
      return true;
    },
  },
  computed: {
    employees() {
      return this.$store.state.employees.map((employee) => employee.full_name);
    },
    problemOptions() {
      return this.$store.state.infoQueriesSelectOptions.problemOptions;
    },
    classificationOptions() {
      return this.$store.state.infoQueriesSelectOptions.classificationOptions;
    },
    statusOptions() {
      return this.$store.state.infoQueriesSelectOptions.statusOptions;
    },
  },
  watch: {},
};
</script>

<style></style>
