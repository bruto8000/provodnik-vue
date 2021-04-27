<template>
  <div class="container">
    <h1 class="center title is-1">Добавление Инфозапроса</h1>
    <div class="columns">
      <div class="column is-3">
        <input-text :value.sync="infoQuery.inicatior" header="Инициатор">
        </input-text>
      </div>

      <div class="column is-3 ">
        <input-date
          :value.sync="infoQuery.fdate"
          header="Дата получения запроса"
        >
        </input-date>
      </div>


       <div class="column is-3 ">
        <input-date
          :value.sync="infoQuery.sdate"
          header="Дата отработки запроса"
        >
        </input-date>
      </div>
 <div class="column is-3">
        <input-text :value.sync="infoQuery.sdate" header="Название запроса">
        </input-text>
      </div>








    </div>

    <div class="columns">

      <div class="column is-3">
        <input-text :value.sync="infoQuery.otvetstveniy" header="Ответственный за ДОК">
        </input-text>
      </div>
  <div class="column is-3">
        <input-text :value.sync="infoQuery.otchot" header="Отчет о выполнении">
        </input-text>
      </div>
  <div class="column is-3">
        <input-text :value.sync="infoQuery.status" header="Статус">
        </input-text>
      </div>
  <!-- <div class="column is-3">
        <input-text :value.sync="infoQuery.status" header="Статус">
        </input-text>
      </div> -->
    </div>
  </div>
</template>

<script>
import InputText from "../../globalComponents/inputText.vue";
export default {
  data() {
    return {
      date: "",
      infoQuery: {
        inicatior: "",
        fdate: "",
        sdate: "",
        nazvanie: "",
        otvetstveniy: "",
        otchot: "",
        statuses: "",
        classification: "",
        problema: "",
        produkt: "",
        otvetfrom: "",
        days: "",
      },
      infoQueryNameErrors: {
        fdate: "Дата получения",
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
  mounted: function() {},
  methods: {
    addInfoQuery: function(event) {
      event.target.classList.toggle("is-loading");
      if (!this.validateMainRows()) {
        setTimeout(() => {
          event.target.classList.toggle("is-loading");
        }, 400);
        return;
      }
      this.infoQuery.opisanieBody = this.editor.html.get().replace(/'/gi, '"');

      axios
        .post("../vendor/addInfoQuery.php", JSON.stringify(this.infoQuery))
        .then((r) => {
          setTimeout(() => {
            event.target.classList.toggle("is-loading");
          }, 400);
          console.log(r.data);
          if (r.data == "OK") {
            M.toast({
              html: "Активность добавлена",
            });
            for (prop in this.infoQuery) {
              if (prop == "flags") {
                this.infoQuery[prop] = [];
                continue;
              }

              this.infoQuery[prop] = "";
            }

            this.editor.html.set(" ");
            delete this.infoQuery["opisanieBody"];
          } else {
            throw new Error(r.data);
          }
        })
        .catch((e) => {
          M.toast({
            html: "Активность НЕ добавлена " + e,
          });
        });
    },
    undateZapusk: function() {
      this.undate = !this.undate;
      this.infoQuery.sdate = this.undate ? "Не определена" : "";
    },
    validateMainRows() {
      try {
        for (prop in this.infoQuery) {
          if (!this.infoQuery[prop]) {
            throw new Error(
              "Пусто, чего-то не хватает: " + this.infoQueryNameErrors[prop]
            );
          }
        }

        console.log("validateMainRows");
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
  },
  computed: {
    infoQueries() {},
  },
  watch: {},
};
</script>

<style></style>
