<template>
  <div class="container">
    <h1 class="center title is-1 my-5">Изменения Инфозапроса</h1>
    <div class="columns my-5">
      <div class="column is-4">
        <input-employee v-model="infoQuery.inicatior" header="Инициатор">
        </input-employee>
      </div>
      <div class="column is-4">
        <input-date
          :value.sync="infoQuery.fdate"
          header="Дата получения запроса"
        >
        </input-date>
      </div>

      <div class="column is-4">
        <input-date
          :value.sync="infoQuery.sdate"
          header="Дата отработки запроса"
        >
        </input-date>
      </div>
    </div>
    <div class="columns">
      <div class="column is-6">
        <input-text :value.sync="infoQuery.nazvanie" header="Название запроса">
        </input-text>
      </div>

      <div class="column is-6 p-0">
        <input-select
          :value.sync="infoQuery.otvetstveniy"
          header="Ответственный от ДОК"
          :options="employees"
          required
        >
        </input-select>
      </div>
    </div>

    <div class="columns">
      <div class="column is-6">
        <input-text :value.sync="infoQuery.otchot" header="Отчет о выполнении">
        </input-text>
      </div>
      <div class="column is-6">
        <input-text :value.sync="infoQuery.produkt" header="Продукт">
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
          class="button is-primary dropdown-trigger"
          data-target="statusesDropdown"
          @click="addStatus()"
        >
          +
        </button>

        <button
          class="button is-danger"
          :disabled="!infoQuery.statuses.length"
          @click="deleteStatus()"
        >
          -
        </button>
      </h3>

      <div class="columns p-0" v-if="infoQuery.statuses.length">
        <div class="column is-size-4 is-4 has-text-centered">Статус</div>
        <div class="column is-size-4 is-4 has-text-centered">С</div>
        <div class="column is-size-4 is-4 has-text-centered">По</div>
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

    <div class="columns my-4">
      <div
        @click="editInfoQuery"
        class="button column is-12 is-primary my-4 title is-3"
      >
        Изменить инфозапрос
      </div>
    </div>
    <div class="columns">
      <div
        @click="openDeletingModal"
        class="
          button
          my-4
          has-text-white
          is-large is-danger
          column
          is-12
          black-text
          title
          is-3
        "
      >
        Удалить инфозапрос
      </div>
    </div>

    <vs-popup :active.sync="needDeletingModal" title="Удаление">
      <h2 class="is-title is-2 my-4">
        Вы уверены что хотите удалить этот инфозапрос?
      </h2>
      <p class="my-4">
        Инфозапрос уйдет в удаленные. Данные останутся но тянутся не будут.
      </p>

      <div class="has-text-right">
        <vs-button @click="deleteInfoQuery" class="mx-4 px-5" color="black">
          Да</vs-button
        >
        <vs-button class="mx-4" @click="hideDeletingModal" color="black">
          Нет, закрыть</vs-button
        >
      </div>
    </vs-popup>
  </div>
</template>

<script>
import convertStringDateToNormalDate from "../../../js/utils/convertStringDateToNormalDate.js";
export default {
  data() {
    return {
      needDeletingModal: false,
      needArchivingModal: false,
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
  created: function () {
    if (!this.infoQuery.id) {
      M.toast({
        html: "Неверная ссылка,  перенаправление...",
      });
      this.$router.push({ path: "/show-info-queries" });
    }
  },
  methods: {
    openDeletingModal() {
      this.needDeletingModal = true;
    },
    hideDeletingModal() {
      this.needDeletingModal = false;
    },
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
    editInfoQuery: function (event) {
      event.target.classList.toggle("is-loading");
      if (!this.validateAll()) {
        setTimeout(() => {
          event.target.classList.toggle("is-loading");
        }, 400);
        return;
      }

      this.$store
        .dispatch("editInfoQuery", _.cloneDeep(this.infoQuery))
        .then(() => {
          this.$vs.notify({ text: "Инфозапрос успешно изменен" });
        })
        .catch((err) => {
          this.$vs.notify({
            text: `Инфозапрос не изменен [${err}]`,
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

    deleteInfoQuery() {
      this.$store
        .dispatch("deleteInfoQuery", this.infoQuery)
        .then((z) => {
          this.$vs.notify({ title: "Успех", text: "Инфозапрос удален" });
          this.hideDeletingModal();
          this.goToShowPage();
        })
        .catch((err) =>
          this.$vs.notify({
            title: "Ошибка",
            color: "red",
            text: `Инфозапрос не удален [${err}]`,
          })
        );
    },
    validateAll() {
      return this.validateRows() && this.validateStatuses();
    },
    goToShowPage() {
      this.$router.push({ path: "/show-info-queries" });
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
              `Некорректно заполнены даты в статусах. Поле номер ${
                idxOfStatuses + 1
              }`
            );
          }
          if (
            statuses[idxOfStatuses - 1] &&
            convertStringDateToNormalDate(status.fdate) <
              convertStringDateToNormalDate(statuses[idxOfStatuses - 1].sdate)
          ) {
            throw new Error(
              `Некорректно заполнены даты в статусах. Поле номер ${idxOfStatuses} и поле номер ${
                idxOfStatuses + 1
              }.`
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
    infoQuery() {
      return this.$store.state.currentEditingInfoQuery;
    },
  },
  watch: {},
};
</script>

<style></style>
