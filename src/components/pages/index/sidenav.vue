<template>
  <div>
    <div id="sidenav" class="sidenav">
      <vs-collapse accordion>
        <vs-collapse-item>
          <div slot="header">
            Табель
          </div>
          <ul>
            <li @click="routeTo('show-tabel')" class="is-clickable p-1 ">
              Просмотр
            </li>
            <li @click="routeTo('edit-tabel')" class="is-clickable p-1 ">
              Редактирование
            </li>
          </ul>
        </vs-collapse-item>
        <vs-collapse-item>
          <div slot="header">
            Активности
          </div>
          <ul>
            <li class="is-clickable " @click="routeTo('show-activities')">
              Просмотр
            </li>
            <li class="is-clickable " @click="routeTo('add-activity')">
              Добавление
            </li>
            <li class="is-clickable " @click="routeTo('public-calendar')">
              Календарь
            </li>
            <li class="is-clickable " @click="routeTo('distribution')">
              Распределение
            </li>
          </ul>
        </vs-collapse-item>

        <vs-collapse-item>
          <div slot="header">
            Инфозапросы
          </div>
          <ul>
            <li class="is-clickable " @click="routeTo('show-info-queries')">
              Просмотр
            </li>
            <li class="is-clickable " @click="routeTo('add-info-query')">
              Добавление
            </li>
          </ul>
        </vs-collapse-item>

        <vs-collapse-item>
          <div slot="header">
            Сотрудники
          </div>
          <ul>
            <li class="is-clickable " @click="routeTo('employees')">
              Управление
            </li>
          </ul>
        </vs-collapse-item>

        <vs-collapse-item>
          <div slot="header">
            Проекты
          </div>
          <ul>
            <li class="is-clickable " @click="routeTo('show-projects')">
              Просмотр
            </li>
            <li class="is-clickable " @click="routeTo('add-project')">
              Добавление
            </li>
          </ul>
        </vs-collapse-item>
      </vs-collapse>
    </div>

    <div
      v-if="$route.path == '/'"
      style="height:100vh"
      class="is-flex is-flex-direction-column  is-justify-content-center is-align-items-center is-align-content-center"
    >
      <div>
        <h1 class="is-2  title">ПРОЕКТ МИ</h1>
      </div>
      <div>
        <button
          @click="openMe"
          class="title m-6 is-1 has-text-centered is-primary button"
        >
          Открыть меню
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidenav: null,
      sidenavInner: null,
    };
  },
  mounted() {
    this.sidenav = M.Sidenav.init(document.getElementById("sidenav"));

    document.addEventListener(
      "keydown",
      function(key) {
        if (key.code == "Escape") {
          if (!this.sidenav.isOpen) this.openMe();
          else this.closeMe();
        }
      }.bind(this)
    );
  },
  methods: {
    routeTo(route) {
      this.sidenav.close();
      this.$router.push(route);
    },
    openMe() {
      this.sidenav.open();
    },
    closeMe() {
      this.sidenav.close();
    },
  },
};
</script>

<style></style>
