<template>
  <vs-popup :active.sync="active" class="holamundo" :title="infoQuery.nazvanie">
    <div class="m-5">
      <div v-if="infoQuery.inicatior" class="m-2 is-size-5">
        Инициатор : {{ infoQuery.inicatior }}
      </div>
      <div v-if="infoQuery.fdate" class="m-2 is-size-5">
        Дата получения : {{ infoQuery.fdate }}
      </div>
      <div v-if="infoQuery.sdate" class="m-2 is-size-5">
        Дата отработки : {{ infoQuery.sdate }}
      </div>
      <div v-if="infoQuery.nazvanie" class="m-2 is-size-5">
        Название запроса : {{ infoQuery.nazvanie }}
      </div>
      <div v-if="infoQuery.otvetstveniy" class="m-2 is-size-5">
        Ответственный : {{ infoQuery.otvetstveniy }}
      </div>
      <div v-if="infoQuery.otchot" class="m-2 is-size-5">
        Отчет о выполнении : {{ infoQuery.otchot }}
      </div>
      <div v-if="infoQuery.classification" class="m-2 is-size-5">
        Классификация : {{ infoQuery.classification }}
      </div>
      <div v-if="infoQuery.problem" class="m-2 is-size-5">
        Проблема : {{ infoQuery.problem }}
      </div>
      <div v-if="infoQuery.produkt" class="m-2 is-size-5">
        Продукт : {{ infoQuery.produkt }}
      </div>
      <div v-if="infoQuery.otvetfrom" class="m-2 is-size-5">
        Кто от маркетинга предоставил ответ : {{ infoQuery.otvetfrom }}
      </div>
      <div class="m-2 is-size-5">
        Время обработки дни: {{ rangeOfStatusesWithTimesheet.length }}
      </div>

      <div class="modal-footer">
        <vs-button
          class="my-2 mx-3 p-4 is-size-5"
          @click="editInfoQuery()"
          size="large"
          >Изменить</vs-button
        >
        <vs-button class="my-2 mx-3 p-4 is-size-5" @click="hideMe" size="large"
          >Закрыть</vs-button
        >
      </div>
    </div>
  </vs-popup>
</template>

<script>
import dateRange from "../../../js/utils/dateRange.js";
import convertNormalDateToStringDate from "../../../js/utils/convertNormalDateToStringDate.js";
export default {
  props: ["show", "admin", "infoQuery"],

  data() {
    return {
      currentOcenka: null,
      infoQueryTypes: {
        public: "Публичный",
        private: "Приватный",
        secret: "Секретный",
      },
      ocenkaReasons: [
        "Нарушение регламента МИ, есть влияние на клиента/сотрудника",
        "Наличие багов (не технических), влияющих на клиента, процессы компании/департамента. Сопровождающий мог проработать самостоятельно",
        "Не инициировано изменение процедуры/продукта для улучшения сервиса для клиента",
        "Не инициирована подготовка инструментов/схем и процедур обслуживания клиента для сотрудников",
      ],
      needReasonModal: false,
    };
  },
  watch: {
    infoQuery: function (n, o) {
      this.calculateSubstitutionDays();
    },
  },
  computed: {
    active: {
      get() {
        return this.show;
      },
      set(n) {
        this.$emit("update:show", n);
      },
    },
    employees() {
      return this.$store.state.employees;
    },
    tabel() {
      return this.$store.state.tabel;
    },
    filtredWithStatus() {
      return this.infoQuery.statuses
        ? this.infoQuery.statuses.filter((status) => {
            if (["Назначено", "В работе"].includes(status.type)) {
              return true;
            }
            return false;
          })
        : [];
    },
    rangeOfStatusesSeperately() {
      let range = [];
      this.filtredWithStatus.forEach((status) => {
        range.push(
          ...dateRange(
            status.fdate,
            status.sdate || convertNormalDateToStringDate(new Date())
          )
        );
      });
      return range;
    },
    currentEmployee() {
      return this.employees.find(
        (employee) =>
          this.infoQuery.otvetstveniy &&
          employee.full_name.trim() == this.infoQuery.otvetstveniy.trim()
      );
    },
    employeeWorkedDays() {
      if (!this.currentEmployee) {
        return [];
      }
      return this.tabel.filter((day) => {
        return (
          this.rangeOfStatusesSeperately.includes(day.date) &&
          day.body[this.currentEmployee.nid] &&
          !isNaN(Number(day.body[this.currentEmployee.nid]))
        );
      });
    },
    rangeOfStatusesWithTimesheet() {
      return this.employeeWorkedDays
        .filter((day) => this.rangeOfStatusesSeperately.includes(day.date))
        .map((day) => day.date)
        .slice(1);
    },
  },
  mounted() {},
  methods: {
    calculateSubstitutionDays() {},
    getEmployeeWorkedDays(range) {
      return this.tabel.filter((date) => {
        return range.includes[date];
      });
    },
    editInfoQuery() {
      this.$store.commit("setEditingInfoQuery", this.infoQuery);
      this.hideMe();
      this.$router.push({ path: "/edit-info-query" });
    },
    hideMe() {
      this.$emit("update:show", false);
    },
  },
};
</script>
