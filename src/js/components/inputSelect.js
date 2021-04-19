Vue.component('inputSelectComponent',{
    props: ['value','miniHeader','options','placeholder'],
  
    data() {
      return {
        innerSelected: '',
        rnd_id: ""
      };
    },
  
    created() {
        this.innerSelected = this.value; 
    },
    destroyed() {},
    computed: {
    
    },
    mounted(){

        while (true) {
            let RND = (this.rnd_id = (Math.random() * 2000).toFixed());
      
            if (
              !document.getElementById("sel" + this.rnd_id)
      
            )
              break;
          }
          this.$nextTick((n) => {
M.FormSelect.init(document.getElementById("sel" + this.rnd_id))
          });

    },
    methods: {},
    watch: {
        innerSelected(n) {
          this.$emit("update:value", n);
        }
    },
    template: `  
    <div>
      <div class="center"
    >{{miniHeader}}</div> 
      <select 
      v-model="innerSelected"
      type="text"
      class="center"
      :id="'sel'+rnd_id"
      >
      <option value="" disabled>{{placeholder}}</option>
      <option v-for="option in options" :value="option">{{option}}</option>
  
      
  </select>
  
  </div>`
  });
  