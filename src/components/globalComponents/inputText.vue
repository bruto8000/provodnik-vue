<template>
  <div>
    <div class="text2 center ">{{ header }}</div>
    <input
      v-model="innerText"
      type="text"
      class="center input"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
export default {
  props: ["value", "header", "placeholder"],
  data() {
    return {
      innerText: "",
    };
  },

  created() {
    this.innerText = this.value;
  },
  destroyed() {},
  computed: {},
  methods: {},
  watch: {
    innerText(n) {
      if (this.value != n) {this.$emit("update:value", n);

 this.$emit("input", n);
      }
    },
    value(n) {
      this.innerText = n;
    },
  },
};
</script>

<style></style>
