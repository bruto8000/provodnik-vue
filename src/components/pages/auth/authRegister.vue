<template>
  <div
    style="height: 100vh"
    class="
      is-flex
      is-flex-direction-column
      is-justify-content-center
      is-align-items-center
      is-align-content-center
      columns
    "
  >
    <div class="box column is-3">
      <h1 class="title is-1 has-text-centered">Регистрация</h1>
      <p class="has-text-centered">
        Логин должен быть как от учетки, чтобы вы получили доступ к системе.
      </p>
      <input-text class="my-2" placeholder="Логин" v-model="login"></input-text>
      <input-text
        class="my-2"
        placeholder="Пароль"
        v-model="password"
        type="password"
      ></input-text>
      <input-text
        class="my-2"
        v-model="rePassword"
        placeholder="Повторите пароль"
        type="password"
      ></input-text>
      <div class="has-text-centered">
        <button
          class="button mx-2 is-primary"
          @click="register"
          :class="{
            'is-loading': waitingForResponce,
          }"
          :disabled="!canRegister || waitingForResponce"
        >
          Регистрация
        </button>
        <div class="button mx-2 is-danger" @click="gotoLogin">Вход</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "authRegister",
  data() {
    return {
      login: "",
      password: "",
      rePassword: "",
      waitingForResponce: false,
    };
  },
  methods: {
    gotoLogin() {
      this.$router.push({ path: "/login" });
    },
    async register() {
      this.waitingForResponce = true;
      try {
        let respnoce = await axios.post("/vendor/auth/register", {
          login: this.login,
          password: this.password,
        });

        this.$vs.notify({
          title: "Успех",
          text: "Вы успешно зарегестрировались.",
          color: "success",
        });
        this.gotoLogin();
        this.clearInputs();
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
    canRegister() {
      return (
        !!this.login && !!this.password && this.password === this.rePassword
      );
    },
  },
};
</script>

<style>
</style>