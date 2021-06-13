<template>
  <div class="container">
    <div>
      <h3 class="center title is-3">Добавление сотрудника</h3>
      <br />

      <div class="columns">
        <div class="column is-5">Сотрудник (ФИО)</div>
        <div class="column is-2">Логин *</div>
        <div class="column is-2">Уникальный ID</div>
        <div class="column is-3">Роль</div>
      </div>

      <div class="columns">
        <div class="column is-5">
          <input class="input" type="text" name="" v-model="full_name" />
        </div>
        <div class="column is-2">
          <input class="input" type="text" name="" v-model="login" />
        </div>
        <div class="column is-2">
          <input class="input" type="text" name="" v-model="nid" />
        </div>
        <div class="column is-3 p-0">
          <input-select
            :options="roles"
            type="text"
            name=""
            :value.sync="role"
          />
        </div>
      </div>

      <div class="columns center">
        <div class="button is-large is-primary column p-2" @click="addToServ">
          Добавить <i class="mdi mdi-account-plus mdi-24px"></i>
        </div>
      </div>
    </div>

    <div class="columns my-5">
      <div class="column">
        <h3 class="title is-3 center">Список сотрудников</h3>
      </div>
    </div>
    <div class="columns" v-for="employee in employees" :key="employee.nid">
      <div class="column is-4">{{ employee.full_name }}</div>
      <div class="column is-2">{{ employee.login }}</div>
      <div class="column is-2">{{ employee.nid }}</div>
      <div class="column is-2">{{ roles[employee.role] }}</div>
      <div class="column is-2">
        <span class="icon is-large">
          <i
            class="mdi mdi-account-edit mdi-36px"
            @click="editModalOpen(employee)"
            style="cursor: pointer"
          ></i>
        </span>
        <span class="icon is-medium">
          <i
            @click="deleteModalOpen(employee)"
            class="mdi mdi-account-remove mdi-36px"
            style="cursor: pointer"
          ></i>
        </span>
      </div>
    </div>

    <div id="editModal" class="modal">
      <div class="modal-content">
        <h4 class="title is-4">Редактирование сотрудника</h4>
        <div class="columns my-2">
          <div class="column is-5">Сотрудник (ФИО)</div>
          <div class="column is-2">Логин</div>
          <div class="column is-2">Уникальный ID</div>
          <div class="column is-3">Роль</div>
        </div>

        <div class="columns my-2">
          <div class="column is-5">
            <input
              class="input"
              type="text"
              name=""
              id=""
              v-model="EditableEmployee.full_name"
            />
          </div>
          <div class="column is-2">
            <input
              class="input"
              type="text"
              name=""
              id=""
              v-model="EditableEmployee.login"
              disabled
            />
          </div>
          <div class="column is-2">
            <input
              class="input"
              type="text"
              name=""
              id=""
              v-model="EditableEmployee.nid"
              disabled
            />
          </div>
          <div class="column is-3 p-1">
            <input-select
              :options="roles"
              type="text"
              name=""
              id=""
              :value.sync="EditableEmployee.role"
              :disabled="currentLogin == EditableEmployee.login"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a class="button is-info modal-close mx-2" @click="editOnServ"
          >Изменить</a
        >
        <a class="button is-primary modal-close">Закрыть</a>
      </div>
    </div>
    <div id="deleteModal" class="modal">
      <div class="modal-content">
        <h4 class="title is-4">Удаление сотрудника</h4>
        <p class="my-2">
          Внимание, сотрудник будет удален! Данные связанные с сотрудником
          останутся, но отображаться не будут. Вы уверены?
        </p>

        <div class="columns">
          <div class="column is-5">Сотрудник (ФИО)</div>
          <div class="column is-2">Логин</div>
          <div class="column is-2">Уникальный ID</div>
          <div class="column is-3">Роль</div>
        </div>
        <div class="columns">
          <div class="column is-5">
            {{ EditableEmployee.full_name }}
          </div>
          <div class="column is-2">
            {{ EditableEmployee.login }}
          </div>
          <div class="column is-2">
            {{ EditableEmployee.nid }}
          </div>
          <div class="column is-3">
            {{ EditableEmployee.nid }}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a
          href="#!"
          class="modal-close button is-danger mx-2"
          @click="deleteFromServ"
          >Удалить</a
        >
        <a href="#!" class="modal-close button is-primary">Закрыть</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      full_name: "",
      nid: "",
      login: "",
      role: "",
      EditableEmployee: {},
      roles: { admin: "Администратор", moderator: "Модератор" },
      modals: {
        editModal: null,
        deleteModal: null,
      },
    };
  },

  mounted() {
    this.modals.editModal = M.Modal.init(document.getElementById("editModal"));
    this.modals.deleteModal = M.Modal.init(
      document.getElementById("deleteModal")
    );
  },
  methods: {
    addToServ: function (event) {
      if (!this.full_name || !this.nid || !this.login || !this.role) {
        M.toast({ html: "Упс, что-то пусто" });
        return;
      }
      event.target.classList.toggle("is-loading");
      this.$store
        .dispatch("addEmployee", {
          full_name: this.full_name,
          nid: this.nid,
          login: this.login,
          role: this.role,
        })
        .then(() => {
          M.toast({ html: `Сотрудник успешно добавлен` });
        })

        .catch((err) => {
          M.toast({ html: `Ошибка ${err}` });
        })
        .finally(() => {
          event.target.classList.toggle("is-loading");
        });
    },
    deleteFromServ: function (employee) {
      this.$store.dispatch("deleteEmployee", this.EditableEmployee);
    },

    editOnServ: function (employee) {
      if (!this.EditableEmployee.full_name || !this.EditableEmployee.login) {
        M.toast({ html: "Упс, что-то пусто" });
        return;
      }
      this.$store.dispatch("editEmployee", this.EditableEmployee);
    },
    deleteModalOpen(employee) {
      this.EditableEmployee = Object.assign({}, employee);
      this.modals.deleteModal.open();
    },
    editModalOpen(employee) {
      this.EditableEmployee = Object.assign({}, employee);
      this.modals.editModal.open();
    },
  },
  computed: {
    employees() {
      return this.$store.state.employees;
    },
    currentLogin() {
      return this.$store.state.login;
    },
  },
};
</script>
