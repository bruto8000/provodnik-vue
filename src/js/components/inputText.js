 Vue.component('inputTextComponent',{
    props: ['value','miniHeader','placeholder'],
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
    template: `  <div>
    <div class="center"
  >{{miniHeader}}</div> 
    <input 
    v-model="innerText"
    type="text"
    class="center input"
    :placeholder="placeholder">
</div>`
  });
  