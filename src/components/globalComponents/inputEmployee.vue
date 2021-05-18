<template>
  <div>
    <div class="center">
      {{ header }}
    </div>
    <div class="input-field m-0 p-0">
      <input
   autocomplete="off"
        @input="debouncedGetOutlookEmployees"
        v-model="innerEmployee"
        :id="'inp' + rnd_id"
        type="text"
        class="autocomplete center input"
        :placeholder="placeholder || 'Введите имя сотрудника'"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["value", "header",'placeholder'],
  data() {
    return {
      rnd_id: "",
      innerEmployee: "",
      me: null,
    };
  },
  created() {
    this.innerEmployee = this.value;
    this.debouncedGetOutlookEmployees = _.debounce(this.getOutlookEmployees,500)
     },
  mounted() {
    while (true) {
      this.rnd_id = (Math.random() * 2000).toFixed();

      if (
        !document.getElementById("inp" + this.rnd_id) &&
        !document.getElementById("tltp" + this.rnd_id)
      )
        break;
    }
    this.$nextTick((n) => {
      this.initMe();
    });
  },
  destroyed() {
    this.me && this.me.destroy();
  },

  computed: {
    // disabled(){
    //   return this.canUndate
    // }
  },

  watch: {
    innerEmployee(n) {
      if (this.value != n) {
        this.$emit("update:value", n)
           this.$emit("input", n)
      };
    },
    value(n) {
      this.innerEmployee = n;
    },
  },
  methods: {
    getOutlookEmployees() {
      if(!this.$employeeGettingUrl){
        return;
      }
      axios(this.$employeeGettingUrl, {
        method: "GET",
        params: {
          searchBy: "fullName",
          parameter: this.innerEmployee,
        },
      }).then((responce) => {
        console.log(responce);
        let data = [];
        responce.data.forEach((element) => {
          data[element.fullName] = null;
        });

        this.updateData(data);
      });
    },
    initMe(data) {
    
      this.$nextTick(() => {
        this.me = M.Autocomplete.init(
          document.getElementById(`inp${this.rnd_id}`),
          {
            data,
            onAutocomplete: this.autocompleteHandler
          }
        );

     
      });
    },
    updateData(data){
      this.$nextTick(()=>{
        this.me.updateData(data);
        this.me.open();
      })
    },
    autocompleteHandler(inputText){
    this.innerEmployee = inputText;
    }
 
  },
};
</script>

<style></style>
