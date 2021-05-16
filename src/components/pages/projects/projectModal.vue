<template>
  <vs-popup :active.sync="active" class="holamundo" :title="project.nazvanie">
    <div class="m-5 ">
      <div v-if="project.accompanying" class="m-2 is-size-5">
        Инициатор : {{ project.accompanying }}
      </div>
      <div v-if="project.fdate" class="m-2 is-size-5">
        Дата старта : {{ project.fdate }}
      </div>
      <div v-if="project.sdate" class="m-2 is-size-5">
        Дата завершения : {{ project.sdate }}
      </div>
      <div v-if="project.title" class="m-2 is-size-5">
        Название проекта : {{ project.title }}
      </div>
      <div v-if="project.description" class="m-2 is-size-5">
        Описание : {{ project.description }}
      </div>
      <div v-if="project.businessType" class="m-2 is-size-5">
        Вид бизнеса: {{ project.businessType }}
      </div>
      <div v-if="project.workGroup && project.workGroup.length" class="m-2 is-size-5">
        Рабочая группа :

        <div class="field is-grouped is-grouped-multiline">
          <div
            v-for="(tag, idx) in project.workGroup"
            :key="idx"
            class="tags has-addons m-2"
          >
            <span class="tag is-medium is-info">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div v-if="project.status" class="m-2 is-size-5">
        Статус : {{ project.status }}
      </div>
      <div v-if="project.CA" class="m-2 is-size-5">ЦА : {{ project.CA }}</div>
      <div v-if="project.projectType" class="m-2 is-size-5">
        Тип проекта : {{ project.projectType }}
      </div>
      <div v-if="project.efficiency" class="m-2 is-size-5">
        Эффективность :
        <span v-if="project.projectType == 'Качественный'">{{
          project.efficiency.title
        }}</span>
      </div>

      <div
        v-if="project.projectType == 'Количественный'"
        class="m-4 box is-size-5"
      >
        <div v-if="project.efficiency.rows.length">
          <div class="columns">
            <div class="column is-4">Влияние</div>
            <div class="column is-4">Было</div>
            <div class="column is-4">Стало</div>
          </div>

          <div
            class="columns"
            :key="idx"
            v-for="(row, idx) in project.efficiency.rows"
          >
            <div class="column is-4">
              <span>{{ row.influence }}</span>
            </div>
            <div class="column is-4">
              <span>{{ row.was }}</span>
            </div>
            <div class="column is-4">
              <span>{{ row.now }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <vs-button
          class="my-2 mx-3 p-4 is-size-5"
          @click="editProject()"
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
export default {
  props: ["show", "project"],

  data() {
    return {};
  },
  watch: {
    project: function(n, o) {},
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
  },
  mounted() {},
  methods: {
    editProject() {
      this.$store.commit("setEditingProject", this.project);
      this.hideMe();
      this.$router.push({ path: "/edit-project" });
    },

    hideMe() {
      this.$emit("update:show", false);
    },
  },
};
</script>
