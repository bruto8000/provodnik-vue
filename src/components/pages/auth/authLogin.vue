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
      <input-text class="my-2" placeholder="Логин"></input-text>
      <input-text
        class="my-2"
        placeholder="Пароль"
        type="password"
      ></input-text>
      <div class="has-text-centered">
        <div class="button mx-2 is-primary">Войти</div>
        <div class="button mx-2 is-danger" @click="gotoRegister">
          Регистрация
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    gotoRegister() {
      this.$router.push({ path: "/register" });
    },
  },
};
</script>

<style>
</style>