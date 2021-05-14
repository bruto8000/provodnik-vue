<template>
  <div>
    <h1 class="title is-2 has-text-centered">
      Календарь активностей
    </h1>
    <vs-tabs v-model="currentTab">
      <vs-tab label="Календарь">
        <calendar
          style="overflow-x:inherit"
          language="ru"
          :data-source="activities"
          always-half-day="true"
          enable-range-selection="true"
          render-style="background"
          @select-range="setRange"
          display-week-number="true"
          class="table-no-100"
        >
        </calendar>
      </vs-tab>
      <vs-tab label="Таблица">
        <div style="overflow: auto; ">
          <h3 class="title is-3">
            {{ header }}
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
              @click="openactivity(activity)"
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

    <activity-modal
      :show.sync="needActivityModal"
      :admin="false"
    ></activity-modal>
  </div>
</template>

<script>
import activityModal from "./global/activityModal.vue";

import Calendar from "./publicCalendar/Calendar.js";
Calendar.locales["ru"] = {
  days: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
  daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  months: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthsShort: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ],
  weekShort: "н",
  weekStart: 1,
};
export default {
  data() {
    return {
      currentTab: 0,
      selected: false,
      canReWriteSelected: true,
      header: "",
      currentActivities: [],
      activityForModal: {},
      monthSpans: [],
      monthWrappers: [],
      needActivityModal: false,
      months: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
      currentMonth: 0,
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      this.monthSet();
    });
  },
  methods: {
    monthSet() {
      this.monthWrappers = [];
      this.monthSpans = [];
      // Here Is magic, and please, dount touch. Please. Dont Fu#$@ng touch this.
      this.$nextTick(() => {
        for (let i = 0; i < 12; i++) {
        
          this.monthSpans.push(document.getElementById("monthSpan" + i));
          this.monthWrappers.push(document.getElementById("monthWrapper" + i));
        }
        this.monthWrappers.forEach((e, idx) => {
          if(!e)return;
          e.onclick = () => {
            this.monthCheck(idx);
          };
        });

        this.monthSpans.forEach((e, idx) => {
    if(!e)return;
          if (this.monthsWithUnsetDate.includes(idx)) {
          e.classList.add("mdi");
          e.classList.add("mdi-message-alert");

            this.monthWrappers[idx].dataset.position = "bottom";
            this.monthWrappers[idx].classList.add("tooltipped");
            this.monthWrappers[idx].dataset.tooltip =
              "В этом месяце есть проекты с  неназначенной датой запуска.<br> Кликнине чтобы посмотреть";
          }
        });

        M.Tooltip.init(document.querySelectorAll(".tooltipped"));
      });
    },
    monthCheck(idx) {
      
      if (
        (this.currentActivities = this.unsetDateActivities.filter((v) => {
          return v.month == idx;
        })).length
      ) {
        this.showUnsetDate = true;
        this.currentMonth = idx;
        this.header = ` Активности без даты старта на ${
          this.months[this.currentMonth]
        }  - ${this.currentActivities.length} :`;
        this.stopSelect();
        this.currentTab = 1;
      }
      return;
    },
    setDay({ date, events }) {
      if (this.selected && this.canReWriteSelected) {
        this.selected = false;
      }
      if (this.selected) return;
      this.currentActivities = events;
      this.header = `Активности на выбранный день - ${this.currentActivities.length}  :`;
    },
    setRange({ startDate, endDate }) {
      if (
        (this.currentActivities = this.activities.filter((v) => {
          if (v.startDate >= startDate && v.endDate <= endDate) return true;
          return false;
        })).length
      ) {
        this.header = `Активности на выбранный период - ${this.currentActivities.length}  :`;
        this.stopSelect();
        this.currentTab = 1;
      }

      return;
    },
    openactivity(activity) {
      this.$store.commit("setDisplayingActivity", activity);
      this.needActivityModal = true;
      //   this.activityForModal = activity;
    },
    stopSelect(ms) {
      if (!ms) ms = 3000;
 
      this.canReWriteSelected = false;
      this.selected = true;
      setTimeout(() => {
        this.canReWriteSelected = true;
        this.showUnsetDate = false;
      }, ms);
    },
  },
  components: {
    Calendar,
    activityModal,
  },
  computed: {
    unsetDateActivities() {
      return this.activities.filter((v) => {
        return !!v.unseted;
      });
    },
    activities() {
      return this.activitiesOriginal.map((activityOriginal) => {
        let activity = _.cloneDeep(activityOriginal);

        if (
          (activity.flags && activity.flags.includes("Влияние")) ||
          (activity.status && activity.status.includes("ДПП"))
        ) {
          activity.color = "#ef5350";
        } else {
          activity.color = "#81c784";
        }
        let splitedDate = activity.sdate.split(" ");

        if (splitedDate.length === 1) return activity;
        if (splitedDate.length == 3) {
          splitedDate[1] = splitedDate[1] - 1;
          activity.startDate = new Date(...splitedDate.reverse());
          activity.endDate = activity.startDate;
        } else if (splitedDate.length == 2 && !isNaN(splitedDate[0])) {
          activity.unseted = true;
          activity.month = splitedDate[0] - 1;
        }

        return activity;
      });
    },
    activitiesOriginal() {
      return this.$store.state.activities;
    },
    monthsWithUnsetDate() {
      let months = [];
      this.activities.forEach((activity) => {
        let splitedDate = activity.sdate.split(" ");
        if (
          splitedDate.length === 2 &&
          !isNaN(splitedDate[0]) &&
          !months.includes(splitedDate[0] - 1)
        ) {
          months.push(splitedDate[0] - 1);
        }
      });

      return months;
    },
  },
  watch: {
    monthsWithUnsetDate(n) {
      this.monthSet();
    },
  },
};
</script>

<style></style>
