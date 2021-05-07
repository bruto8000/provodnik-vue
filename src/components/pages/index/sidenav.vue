<template>
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
          if (!this.sidenav.isOpen) this.sidenav.open();
          else this.sidenav.close();
        }
      }.bind(this)
    );
  },
  methods: {
    routeTo(route) {
      this.sidenav.close();
      this.$router.push(route);
    },
  },
};
</script>

<style></style>
