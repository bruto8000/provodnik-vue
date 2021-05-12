<template>
  <div>
    <div class="center text2 ">{{ header }}</div>
    <select
      v-model="innerSelected"
      type="text"
      class="center"
      :id="'sel' + rnd_id"
    >
      <option value="" :disabled="required">{{ placeholder }}</option>
      <template v-if='Array.isArray(options)'>
   <option v-for="(option, idx) in options" :key="idx" :value="option">{{
        option
      }}</option>
      </template>
      <template v-else>
         <option v-for="(option, prop) in options" :key="prop" :value="prop">{{
        option
      }}</option>  
      </template>
   
      <slot></slot>
    </select>
  </div>
</template>

<script>
export default {
  props: ["value", "header", "options", "placeholder", "required"],

  data() {
    return {
      innerSelected: "",
      rnd_id: "",
      me: null,
    };
  },

  created() {
    this.innerSelected = this.value;
  },
  destroyed() {
    console.log(this.me);
    this.me && this.me.destroy();
  },
  computed: {},

  mounted() {
    this.initMe();
  },
  methods: {
    initMe() {
    
      if (!!this.me) {
        this.me.destroy();
        this.me = null;
      }

      if (!this.rnd_id) {
        while (true) {
       this.rnd_id = (Math.random() * 2000).toFixed();

          if (!document.getElementById("sel" + this.rnd_id)) break;
        }
      }
      this.$nextTick((n) => {
        this.me = M.FormSelect.init(
          document.getElementById("sel" + this.rnd_id)
        );
      });
    },
  },
  watch: {
    innerSelected(n) {
      if (n != this.value) this.$emit("update:value", n);
    },
    value(n) {
      this.innerSelected = n;
    },
    options() {
      this.initMe();
    },
  },
  activated(){
        this.initMe();
  }
};
</script>

<style></style>
