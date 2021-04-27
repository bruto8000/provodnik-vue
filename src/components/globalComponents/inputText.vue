<template>
    <div>
    <div class="center"
  >{{header}}</div> 
    <input 
    v-model="innerText"
    type="text"
    class="center input"
    :placeholder="placeholder">
</div>
</template>
  
<script>
export default {
    props: ['value','header','placeholder'],
    data() {
      return {

        innerText: ''
      };
    },
  
    created() {
        this.innerText = this.value; 
    },
    destroyed() {},
    computed: {
    
    },
    methods: {},
    watch: {
        innerText(n) {
          this.$emit("update:value", n);
        }
    },
}
</script>

<style>

</style>