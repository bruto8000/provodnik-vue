<template>
  <div
    style="height: 100vh"
    class="
      columns
      is-flex
      is-flex-direction-column
      is-justify-content-center
      is-align-items-center
      is-align-content-center
    "
  >
    <div class="box column is-3">
      <h1 class="title is-1 has-text-centered">Вход в систему</h1>
      <input-text class="my-2" placeholder="Логин" v-model="login"></input-text>
      <input-text
        class="my-2"
        placeholder="Пароль"
        v-model="password"
        type="password"
      ></input-text>
      <div class="has-text-centered">
        <button
          class="button mx-2 is-primary"
          :disabled="!canLogin || waitingForResponce"
          @click="signIn"
          :class="{
            'is-loading': waitingForResponce,
          }"
        >
          Войти
        </button>
        <div class="button mx-2 is-danger" @click="gotoRegister">
          Регистрация
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      login: "",
      password: "",
      waitingForResponce: false,
    };
  },
  methods: {
    gotoRegister() {
      this.$router.push({ path: "/register" });
    },
    gotoMain() {
      this.$router.push({ path: "/" });
    },
    setMyRoleAndLogin(role, login) {
      this.$store.commit("setRole", role);
      this.$store.commit("setLogin", login);
    },
    async signIn() {
      try {
        this.waitingForResponce = true;
        let respnoce = await axios.post("/vendor/auth/login", {
          login: this.login,
          password: this.password,
        });

        this.$vs.notify({
          title: "Успех",
          text: "Вы успешно вошли в систему.",
          color: "success",
        });

        this.clearInputs();
        this.gotoMain();
        console.log(respnoce.data);
        this.setMyRoleAndLogin(respnoce.data.role, respnoce.data.login);
      } catch (err) {
        console.dir(err);
        if (err.response && err.response.data) {
          this.$vs.notify({
            title: "Ошибка",
            text: err.response.data,
            color: "danger",
          });
        } else {
          this.$vs.notify({
            title: "Ошибка",
            text: "Неизвестная ошибка. В консоли можно увидеть подробности.",
            color: "danger",
          });
        }
      } finally {
        setTimeout(() => {
          this.waitingForResponce = false;
        }, 500);
      }
    },

    clearInputs() {
      this.login = "";
      this.password = "";
      this.rePassword = "";
    },
  },
  computed: {
    canLogin() {
      return !!this.login && !!this.password;
    },
  },
};
</script>

<style>
</style>