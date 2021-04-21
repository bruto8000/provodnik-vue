<template>
  <div class="menu">
    <div class="all">
      <div class="lefter center" @click="routeTo('employees')">
        <i class="mdi mdi-account-plus-outline w100 f100 "></i>
        <div class="text">Добавление сотрудника</div>
      </div>
      <div class="left center" @click="routeTo('show-calendar')">
        <i class="mdi mdi-calendar-outline w100 f100 "></i>
        <div class="text">Просмотр календаря</div>
      </div>
      <div class="centerm center" @click="routeTo('edit-tabel')">
        <div class="explainer"><span>ProjectMS</span></div>

        <div class="text">Редактирование табеля</div>
      </div>
      <div class="right center" @click="routeTo('show-proj')">
        <i class="mdi mdi-briefcase-outline w100 f100 "></i>
        <div class="text">Просмотр активностей</div>
      </div>
      <div class="righter center" @click="routeTo('show-tabel')">
        <i class="mdi mdi-table-eye w100 f100 "></i>
        <div class="text">Табель</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    routeTo(route) {
      this.$router.push(route);
    },
  },
  mounted(){

  }
};
</script>
