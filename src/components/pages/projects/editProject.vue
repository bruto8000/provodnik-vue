<template>
  <div class="container">
    <h1 class="center title is-1 my-5">Изменение Проекта</h1>
    <div class="columns my-5">
      <div class="column is-4 p-0">
        <input-select
          :value.sync="project.accompanying"
          header="Сопровождающий"
          :options="employees"
          required
        >
        </input-select>
      </div>

      <div class="column is-4">
        <input-date :value.sync="project.fdate" header="Дата старта проекта">
        </input-date>
      </div>

      <div class="column is-4">
        <input-date
          :value.sync="project.sdate"
          header="Дата завершения проекта"
          :canUndate="true"
          :showKvartalBtn="true"
          :showMonthBtn="true"
        >
        </input-date>
      </div>
    </div>

    <div class="columns">
      <div class="column is-6">
        <input-text :value.sync="project.title" header="Название проекта">
        </input-text>
      </div>

      <div class="column is-6">
        <input-text :value.sync="project.description" header="Описание проекта">
        </input-text>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12 my-2">
        <h4 class="title is-4 center my-1">
          Рабочая группа
          <button
            class="button is-danger"
            @click="deleteWorkGroupItem(-1)"
            :disabled="!project.workGroup.length"
          >
            -
          </button>
          <button class="button is-primary" @click="addWorkGroupItem">+</button>
        </h4>
        <input-employee
          v-model="workGroupInput"
          @keyup.enter.native="addWorkGroupItem"
          placeholder=" (Нажмите Enter или + сверху)"
        >
        </input-employee>

        <div class="field is-grouped is-grouped-multiline">
          <div
            v-for="(workGroupItem, idx) in project.workGroup"
            :key="idx"
            class="tags has-addons m-2"
          >
            <span class="tag is-clickable is-medium is-info">
              {{ workGroupItem }}</span
            >
            <a
              class="tag is-delete is-medium"
              @click="deleteWorkGroupItem(idx)"
            ></a>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-4 p-0">
        <input-select
          :options="businessTypeOptions"
          :value.sync="project.businessType"
          header="Вид бизнеса"
        >
        </input-select>
      </div>

      <div class="column is-4 p-0">
        <input-select
          :value.sync="project.status"
          header="Статус"
          :options="statusOptions"
        >
        </input-select>
      </div>

      <div class="column is-4 p-0">
        <input-select :value.sync="project.CA" header="ЦА" :options="CAOptions">
        </input-select>
      </div>
    </div>

    <div class="">
      <input-select
        :value.sync="project.projectType"
        header="Тип проекта"
        :options="projectTypeOptions"
        required
      >
      </input-select>

      <div class="my-6" v-if="project.projectType == 'Качественный'">
        <input-text
          v-model="project.efficiency.title"
          header="Эффективность"
          required
        >
        </input-text>
      </div>
    </div>
    <div v-if="project.projectType == 'Количественный'">
      <div class="my-5 is-flex is-justify-align-center">
        <vs-dropdown>
          <button class="button is-primary" href="#">
            Добавить влияние
            <vs-icon class="" icon="expand_more"></vs-icon>
          </button>

          <vs-dropdown-menu>
            <vs-dropdown-item @click="addEfficiency('AHT')">
              AHT
            </vs-dropdown-item>
            <vs-dropdown-item @click="addEfficiency('tNPS')">
              tNPS
            </vs-dropdown-item>
            <vs-dropdown-item @click="addEfficiency('FCR')">
              FCR
            </vs-dropdown-item>

            <vs-dropdown-item @click="addEfficiency('CR')">
              CR
            </vs-dropdown-item>
            <vs-dropdown-item @click="addEfficiency('AWT')">
              AWT
            </vs-dropdown-item>
            <vs-dropdown-item @click="addEfficiency('Ресурсы')">
              Ресурсы
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
        <button
          class="button is-danger mx-2"
          :disabled="!project.efficiency.rows.length"
          @click="deleteEfficiency()"
        >
          -
        </button>
      </div>

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
          <div class="column is-4">{{ row.influence }}</div>
          <div class="column is-4"><input-text v-model="row.was" /></div>
          <div class="column is-4"><input-text v-model="row.now" /></div>
        </div>
      </div>
    </div>
    <div class="columns">
      <input-text
        class="column is-12"
        v-model="project.comment"
        placeholder="Комментарий"
      >
      </input-text>
    </div>
    <div class="columns my-4">
      <div
        @click="editProject"
        class="button column is-12 is-primary my-4 title is-3"
      >
        Изменить проект
      </div>
    </div>
    <div class="columns">
      <div
        @click="openDeletingModal"
        class="
          button
          my-4
          has-text-white
          is-large is-danger
          column
          is-12
          black-text
          title
          is-3
        "
      >
        Удалить проект
      </div>
    </div>

    <vs-popup :active.sync="needDeletingModal" title="Удаление">
      <h2 class="is-title is-2 my-4">
        Вы уверены что хотите удалить этот проект?
      </h2>
      <p class="my-4">
        Проект уйдет в удаленные. Данные останутся но тянутся не будут.
      </p>

      <div class="has-text-right">
        <vs-button @click="deleteProject" class="mx-4 px-5" color="black">
          Да</vs-button
        >
        <vs-button class="mx-4" @click="hideDeletingModal" color="black">
          Нет, закрыть</vs-button
        >
      </div>
    </vs-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workGroupInput: "",
      needDeletingModal: false,
      projectNameErrors: {
        accompanying: "Сопровождающий",
        fdate: "Дата старта проекта",
        sdate: "Дата завершения проекта",
        title: "Название проекта",
        description: "Описание проекта",
        businessType: "Вид бизнеса",
        workGroup: "Рабочая группа",
        status: "Статус",
        CA: "ЦА",
        projectType: "Тип проекта",
        efficiency: "Эффективность",
      },

      requiredRows: [
        "accompanying",
        "fdate",
        "title",
        "description",
        "businessType",
        "status",
        "CA",
        "projectType",
      ],
    };
  },
  created: function () {
    if (!this.project.id) {
      M.toast({
        html: "Неверная ссылка,  перенаправление...",
      });
      this.$router.push({ path: "/show-projects" });
    }
  },
  methods: {
    addWorkGroupItem() {
      console.log(this.workGroupInput);
      if (!this.workGroupInput.length) {
        this.$vs.notify({ text: "Пусто.", title: "Ошибка", color: "red" });
        return;
      }
      this.project.workGroup.push(this.workGroupInput);
      this.workGroupInput = "";
    },
    deleteWorkGroupItem(idx) {
      this.project.workGroup.splice(idx, 1);
    },
    openDeletingModal() {
      this.needDeletingModal = true;
    },
    hideDeletingModal() {
      this.needDeletingModal = false;
    },
    addEfficiency(type) {
      this.project.efficiency.rows.push({
        influence: type,
        was: "",
        now: "",
      });
    },
    deleteEfficiency() {
      this.project.efficiency.rows.length && this.project.efficiency.rows.pop();
    },
    editProject: function (event) {
      event.target.classList.toggle("is-loading");
      if (!this.validateAll()) {
        setTimeout(() => {
          event.target.classList.toggle("is-loading");
        }, 400);
        return;
      }

      this.$store
        .dispatch("editProject", _.cloneDeep(this.project))
        .then(() => {
          this.$vs.notify({ text: "Проект успешно изменен" });
        })
        .catch((err) => {
          this.$vs.notify({
            text: `Проект не изменен [${err}]`,
            color: "red",
            title: "Ошибка",
          });
        })
        .finally(() => {
          setTimeout(() => {
            event.target.classList.toggle("is-loading");
          }, 400);
        });
    },

    deleteProject() {
      this.$store
        .dispatch("deleteProject", this.project)
        .then((z) => {
          this.$vs.notify({ title: "Успех", text: "Проект удален" });
          this.hideDeletingModal();
          this.goToShowPage();
        })
        .catch((err) =>
          this.$vs.notify({
            title: "Ошибка",
            color: "red",
            text: `Проект не удален [${err}]`,
          })
        );
    },
    goToShowPage() {
      this.$router.push({ path: "/show-projects" });
    },
    validateAll() {
      return this.validateRows() && this.validateEfficiency();
    },
    validateRows() {
      try {
        for (let prop of this.requiredRows) {
          if (!this.project[prop]) {
            throw new Error(
              ` Вы пропустили что-то :  [${this.projectNameErrors[prop]}]`
            );
          }
        }
      } catch (e) {
        M.toast({
          html: e.message,
        });

        return false;
      }
      return true;
    },
    validateEfficiency() {
      if (
        !this.project.efficiency.title &&
        this.project.projectType == "Качественный"
      ) {
        M.toast({
          html: `Не заполнено поле ${this.projectNameErrors.efficiency}`,
        });
        return false;
      }
      return true;
    },
  },
  computed: {
    employees() {
      return this.$store.state.employees.map((employee) => employee.full_name);
    },
    CAOptions() {
      return this.$store.state.projectsSelectOptions.CAOptions;
    },
    businessTypeOptions() {
      return this.$store.state.projectsSelectOptions.businessTypeOptions;
    },
    statusOptions() {
      return this.$store.state.projectsSelectOptions.statusOptions;
    },
    projectTypeOptions() {
      return this.$store.state.projectsSelectOptions.projectTypeOptions;
    },
    project() {
      return this.$store.state.currentEditingProject;
    },
  },
  watch: {},
};
</script>

<style></style>
