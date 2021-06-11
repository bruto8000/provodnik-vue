<template>
  <div class="container">
    <h1 class="center title is-1">Добавление активности</h1>
    <div class="columns">
      <div class="column is-3">
        <div class="center">Дата спуска</div>
        <input
          v-model.lazy="activity.fdate"
          id="fdate"
          type="text"
          class="datepicker center input"
          value=""
          placeholder="Выберите дату"
        />
      </div>
      <div class="column is-3">
        <div class="center" @click="undateZapusk" ref="sdate">Дата запуска</div>
        <input
          :disabled="undate"
          v-model.lazy="activity.sdate"
          id="sdate"
          type="text"
          class="datepicker center input"
          value=""
          placeholder="Выберите дату"
        />
      </div>
      <div class="column is-6 center">
        <div class="">Название</div>
        <input
          placeholder="Введите Название"
          v-model="activity.nazvanie"
          id="nazvanie"
          type="text"
          class="validate input"
        />
      </div>
    </div>
    <div class="columns">
      <div class="column is-3 p-1 center">
        <div class="">Вид бизнеса</div>
        <div class="">
          <select v-model="activity.bizness" id="bizness">
            <option value="" disabled selected>Вид бизнеса</option>
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
      </div>
      <div class="column is-3 p-1 center">
        <div class="">Тип запуска</div>
        <div class="">
          <select v-model="activity.zapusk" id="zapusk">
            <option value="" disabled selected>Тип запуска</option>
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
      </div>

      <div class="column is-3 center p-1">
        <div class="">Сложность</div>
        <select v-model="activity.difficulty" id="difficulty">
          <option value="1">1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
          <option value="2.5">2.5</option>
          <option value="3">3</option>
          <option value="3.5">3.5</option>
          <option value="ДПП">ДПП</option>
        </select>
      </div>

      <div class="column is-3 center">
        <input-employee
          v-model="activity.zakazchik"
          placeholder="Введите заказчика"
          header="Заказчик"
        >
        </input-employee>
        <!-- <input
          placeholder="Введите заказчика"
          v-model="activity.zakazchik"
          id="zakazchik"
          type="text"
          class="validate input"
        /> -->
      </div>
    </div>
    <div class="columns">
      <div class="column is-6 p-1">
        <div class="center">Сопровождающий</div>
        <div class="">
          <select v-model="activity.soprovod" id="soprovod">
            <option value="" selected>Сопровождающий</option>
            <option
              v-for="employee in employees"
              :key="employee.id"
              :value="employee['full_name']"
            >
              {{ employee["full_name"] }}
            </option>
          </select>
        </div>
      </div>

      <div class="column is-3 p-1 center">
        <div class="">Статус</div>
        <div class="">
          <select v-model="activity.status" id="status">
            <option value="" disabled selected>Статус</option>
            <option value="В работе">В работе</option>
            <option value="Выполнено">Выполнено</option>
            <option value="Отложено">Отложено</option>
            <option value="Отменено">Отменено</option>
            <option value="ДПП актив">ДПП актив</option>
            <option value="ДПП пассив">ДПП пассив</option>
          </select>
        </div>
      </div>

      <div class="column is-3 center p-1">
        <div class="">Флаги</div>
        <select
          placeholder="Флаги"
          v-model="activity.flags"
          id="zakazchik"
          type="text"
          class="validate"
          multiple
        >
          <option disabled value="">Выбор</option>
          <option value="Влияние">Влияние</option>
          <option value="Экстренный запуск">Экстренный запуск</option>

          <option value="Конфиденциальность">Конфиденциальность</option>
        </select>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12">
        <div class="froala">
          <label for="pbody">Описание</label>
          <textarea
            class="form-control"
            columnss="7"
            wrap="hard"
            id="pbody"
            name="pbody"
          ></textarea>
        </div>
      </div>
    </div>
    <div class="columns">
      <div
        @click="addActivity"
        class="
          button
          has-text-white
          is-large is-primary
          column
          is-12
          black-text
          title
          is-3
        "
      >
        Добавить активность
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activity: {
        fdate: "",
        sdate: "",
        nazvanie: "",
        bizness: "",

        zapusk: "",
        soprovod: "",
        status: "",
        zakazchik: "",
        flags: [],
        difficulty: "",
        statusZapusk: [],
        risks: [],
        audits: [],
        AB: [],
        bugs: [],
        //  opisanieBody: "", Will added Automaticly
        //   opisanie: "", OLD
      },

      editor: "",
      undate: false,

      kalendar: [],
      donut: "",
      audits: [
        //     {
        //     name: "Название аудита",
        //     subname: ""
        //     rows: [{
        //         propName: "Причина ...",
        //         propInt: 25,
        //         propColor: ""
        //     }],
        //     type: 'public | private | secret'
        // }
      ],
      activityNameErrors: {
        fdate: "Дата спуска",
        sdate: "Дата запуска",
        nazvanie: "Название",
        bizness: "Вид бизнеса",
        opisanie: "Описание",
        zapusk: "Тип запуска",
        soprovod: "Сопровождающий",
        status: "Статус",
        zakazchik: "Заказчик",
        difficulty: "Сложность",
      },
    };
  },
  mounted: function () {
    this.initSelects();
    this.editor = new FroalaEditor("#pbody", {
      // Set the file upload URL.

      toolbarButtons: [
        [
          "bold",
          "italic",
          "underline",
          "|",
          "fontSize",
          "color",
          "formatOL",
          "formatUL",
          "insertLink",
          "insertTable",
          "insertImage",
          "html",
          "insertFileRR",
        ],
      ],
      fileUploadURL: "upload_file.php",
      fileUploadParams: {
        id: "my_editor",
      },
      imageUploadURL: "upload_image.php",
      imageUploadParams: {
        id: "my_editor2",
      },
      language: "ru",
    });
    this.initDateSelects();
  },
  methods: {
    addActivity: function (event) {
      event.target.classList.toggle("is-loading");
      if (!this.validateMainRows()) {
        setTimeout(() => {
          event.target.classList.toggle("is-loading");
        }, 400);
        return;
      }
      this.activity.opisanieBody = this.editor.html.get().replace(/'/gi, '"');

      if (this.activity.sdate == "Не определена") this.activity.sdate = "";

      this.$store
        .dispatch("addActivity", _.cloneDeep(this.activity))

        .then(() => {
          this.$vs.notify({ title: "Активность добавлена" });

          for (let prop in this.activity) {
            if (prop == "flags") {
              this.activity[prop] = [];
              continue;
            }

            this.activity[prop] = "";
          }

          this.editor.html.set(" ");
          delete this.activity["opisanieBody"];
        })
        .catch((e) => {
          this.$vs.notify({
            title: `Активность НЕ добавлена [${e}]`,
            color: "red",
          });
        })
        .finally(() => {
          setTimeout(() => {
            event.target.classList.toggle("is-loading");
          }, 400);
        });
    },
    initDateSelects() {
      let dateNow = new Date();
      this.kalendar[0] = this.$Kalendar.set(
        {
          showMonthBtn: true,
          events: [dateNow.toDateString()],
        },
        "#sdate"
      );
      this.kalendar[1] = this.$Kalendar.set({}, "#fdate");

      this.$refs.sdate.dataset.tooltip = "Нажмите чтобы сделать неопределенной";
      this.$refs.sdate.dataset.position = "top";
      M.Tooltip.init(this.$refs.sdate);
    },
    undateZapusk: function () {
      this.undate = !this.undate;
      this.activity.sdate = this.undate ? "Не определена" : "";
    },
    validateMainRows() {
      try {
        for (let prop in this.activity) {
          if (prop == "sdate") continue;
          if (!this.activity[prop]) {
            throw new Error(
              `Пусто,  не хватает: [ ${this.activityNameErrors[prop]} ]`
            );
          }
        }

        if (this.editor.html.get().length < 50) {
          throw new Error("Описание слишком короткое.");
        }
        return true;
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
    },
    initSelects() {
      this.$nextTick(function () {
        M.FormSelect.init(document.querySelectorAll("select"));
      });
    },
  },

  watch: {
    employees() {
      this.initSelects();
    },
  },
  computed: {
    employees() {
      return this.$store.state.employees;
    },
  },
};
</script>
