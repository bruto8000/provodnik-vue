<template>
  <div id="sidenav" class="sidenav">
    <ul>
      <li>
        <a @click="routeTo('show-tabel')"
          ><i class="mdi mdi-table-eye mdi-36px"></i> Табель</a
        >
      </li>

      <li>
        <a @click="routeTo('edit-tabel')"
          ><i class="mdi mdi-table-edit mdi-36px"></i> Редактирование табеля</a
        >
      </li>

      <li>
        <a @click="routeTo('show-activities')"
          ><i class="mdi mdi-briefcase-outline mdi-36px"></i> Просмотр
          активностей</a
        >
      </li>
      <li>
        <a @click="routeTo('add-activity')"
          ><i class="mdi mdi-briefcase-edit-outline mdi-36px"></i>Добавление
          активностей</a
        >
      </li>
      <li>
        <a @click="routeTo('employees')">
          <i class="mdi mdi-account-plus-outline mdi-36px"></i> Добавление
          сотрудника</a
        >
      </li>
      <li>
        <a @click="routeTo('public-calendar')"
          ><i class="mdi mdi-calendar-outline mdi-36px"></i> Просмотр
          календаря</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidenav: null,
    };
  },
  mounted() {
    this.sidenav = M.Sidenav.init(document.getElementById("sidenav"));
    document.addEventListener(
      "keydown",
      function (key) {
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
