<template>
  <div>
    <div id="sidenav" class="sidenav">
      <vs-collapse accordion open-hover>
        <div class="is-clickable p-1" @click="routeTo('/')">
          <span class="is-size-3">Главная</span>
        </div>

        <vs-collapse-item>
          <div slot="header">
            <span class="is-size-3">Активности</span>
          </div>
          <ul>
            <li class="is-clickable" @click="routeTo('show-activities')">
              Просмотр
            </li>
            <li class="is-clickable" @click="routeTo('add-activity')">
              Добавление
            </li>
            <li class="is-clickable" @click="routeTo('public-calendar')">
              Календарь
            </li>
            <li class="is-clickable" @click="routeTo('distribution')">
              Распределение
            </li>
          </ul>
        </vs-collapse-item>

        <vs-collapse-item>
          <div slot="header">
            <span class="is-size-3">Инфозапросы</span>
          </div>
          <ul>
            <li class="is-clickable" @click="routeTo('show-info-queries')">
              Просмотр
            </li>
            <li class="is-clickable" @click="routeTo('add-info-query')">
              Добавление
            </li>
          </ul>
        </vs-collapse-item>
        <vs-collapse-item>
          <div slot="header">
            <span class="is-size-3">Проекты</span>
          </div>
          <ul>
            <li class="is-clickable" @click="routeTo('show-projects')">
              Просмотр
            </li>
            <li class="is-clickable" @click="routeTo('add-project')">
              Добавление
            </li>
          </ul>
        </vs-collapse-item>

        <vs-collapse-item>
          <div slot="header">
            <span class="is-size-3">Сотрудники</span>
          </div>
          <ul>
            <li class="is-clickable" @click="routeTo('employees')">
              Управление
            </li>
          </ul>
        </vs-collapse-item>

        <vs-collapse-item>
          <div slot="header">
            <span class="is-size-3">Табель</span>
          </div>
          <ul>
            <li @click="routeTo('show-tabel')" class="is-clickable p-1">
              Просмотр
            </li>
            <li @click="routeTo('edit-tabel')" class="is-clickable p-1">
              Редактирование
            </li>
          </ul>
        </vs-collapse-item>
      </vs-collapse>
    </div>

    <div
      v-if="$route.path == '/'"
      style="height: 100vh"
      class="
        is-flex
        is-flex-direction-column
        is-justify-content-center
        is-align-items-center
        is-align-content-center
      "
    >
      <div class="p-6 has-text-centered">
        <h1 class="is-2 title">ПРОЕКТ МИ</h1>
        <h5 class="title is-5">Роль [{{ roleName }}]</h5>
      </div>
      <div class="is-flex is-align-items-center">
        <button
          @click="openMe"
          class="title mx-2 my-1 is-3 has-text-centered is-info button"
        >
          Открыть меню
        </button>

        <button
          @click="openArchivingModal"
          class="title mx-2 is-3 has-text-centered is-primary button"
        >
          Загрузить архив
        </button>
      </div>

      <div
        v-if="role == 'guest'"
        class="is-align-items-center has-text-centered"
      >
        <div class="">
          <button
            @click="gotoAuthPage"
            class="title mx-2 my-1 is-3 has-text-centered is-danger button"
          >
            Войти в систему
          </button>
        </div>
        <div class="">
          <p>
            Для роли [Гость] Доступна только страница [Календарь], в разделе
            [Активности]
          </p>
        </div>
      </div>
    </div>

    <vs-popup
      class="holamundo"
      title="Выберите даты для загрузки архива"
      :active.sync="archiveModalShow"
    >
      <p class="is-size-4">Загруженные данные заменят текущие</p>
      <p class="is-size-4">Загружаем:</p>
      <input-select
        class=""
        :value.sync="archive.propertyToGet"
        :options="allDataTypes"
      ></input-select>
      <div class="columns my-4">
        <div class="column is-6">
          <input-date :value.sync="archive.fdate" header="Начало"></input-date>
        </div>
        <div class="column is-6">
          <input-date :value.sync="archive.sdate" header="Конец"></input-date>
        </div>
      </div>
      <div class="is-flex is-justify-content-center">
        <div class="">
          <button
            @click="getArchived"
            :disabled="!catGetArchive"
            class="button is-danger"
            :class="{ 'is-loading': waitingForBackend }"
          >
            Загрузить
          </button>
        </div>
      </div>
    </vs-popup>

    <div class="fixed-button">
      <vs-button
        @click="openMe"
        color="#00d1b2"
        type="border"
        icon="menu"
      ></vs-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidenav: null,
      archiveModalShow: false,
      archive: {
        fdate: null,
        sdate: [
          new Date().getDate() > 9
            ? new Date().getDate()
            : "0" + new Date().getDate(),
          new Date().getMonth() + 1 > 9
            ? new Date().getMonth() + 1
            : "0" + (new Date().getMonth() + 1),
          new Date().getFullYear(),
        ].join(" "),
        propertyToGet: null,
      },
      allDataTypes: {
        infoQueries: "Инфозапросы",
        activities: "Активности",
        projects: "Проекты",
      },
      waitingForBackend: false,
      roles: {
        admin: "Администратор",
        guest: "Гость",
        user: "Пользователь",
      },
    };
  },
  mounted() {
    this.sidenav = M.Sidenav.init(document.getElementById("sidenav"));

    document.addEventListener(
      "keydown",
      function (key) {
        if (key.code == "Escape") {
          if (!this.sidenav.isOpen) this.openMe();
          else this.closeMe();
        }
      }.bind(this)
    );
  },
  methods: {
    routeTo(path) {
      this.closeMe();
      if (this.$route.path == path) {
        return;
      }
      this.$router.push(path).catch((err) => {
        console.dir(err);
      });
    },
    openArchivingModal() {
      this.archiveModalShow = true;
    },
    closeArchivingModal() {
      this.archiveModalShow = false;
    },
    openMe() {
      this.sidenav.open();
    },
    closeMe() {
      this.sidenav.close();
    },
    getArchived() {
      this.waitingForBackend = true;
      this.$store
        .dispatch("getArchived", {
          fdate: this.archive.fdate,
          sdate: this.archive.sdate,
          dataType: this.archive.propertyToGet,
        })
        .then(
          () => {
            this.$vs.notify({
              title: "Архив загружен",
              text: "Данные успешно добавлены",
            });
          },
          (err) => {
            this.$vs.notify({
              title: "Ошибка",
              text: `Данные не добавлены, ошибка [${err}]`,
              color: "red",
            });
          }
        )
        .finally(() => {
          this.waitingForBackend = false;
        });
    },
    gotoAuthPage() {
      this.$router.push({ path: "/login" }).catch((err) => {
        console.log(err);
      });
    },
  },
  computed: {
    path() {
      return this.$route.path;
    },
    roleName() {
      return this.roles[this.$store.state.role] || "Гость";
    },
    role() {
      return this.$store.state.role;
    },
    catGetArchive() {
      let fdate = this.archive.fdate;
      let sdate = this.archive.sdate;
      if (!fdate || !sdate) return false;
      let fdateSplitted = fdate.split(" ");
      let sdateSplitted = sdate.split(" ");

      return (
        this.archive.propertyToGet &&
        new Date(fdateSplitted[2], fdateSplitted[1] - 1, fdateSplitted[0]) <
          new Date(sdateSplitted[2], sdateSplitted[1] - 1, sdateSplitted[0])
      );
    },
  },
  watch: {
    path(n, o) {
      if (n != "/") {
        this.archiveModalShow = false;
      }
    },
  },
};
</script>

<style>
.fixed-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  background-color: white;
}

ul + .dropdown-content {
  z-index: 100001;
}
</style>
