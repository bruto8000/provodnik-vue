<template>
  
  <div>
    <div class="center" data-position="tooltipPos || top"
     @click="undate" 
     :id="'tltp'+rnd_id"
     data-tooltip="Нажмите чтобы сделать неактивной" >{{header}}</div> 
    <input 
    v-model.lazy="innerDate" 
    :id="'inp'+rnd_id"  
    type="text"
    class="datepicker center input"
    placeholder="Выберите дату">
</div>

</template>

<script>
export default {
  props: ['value','header','canUndate','showYearBtn','showMonthBtn','showKvartalBtn'],
  data() {
    return {
      // date: "", //FRIN PARENT
      // header: "Дата Спуска",
      rnd_id: "",
      innerDate: "",
      me: null,
      tooltipPos: null,
      undate: "",
    };
  },
  created() {
    this.innerDate = this.value;
  },
  mounted() {
    while (true) {
      let RND = (this.rnd_id = (Math.random() * 2000).toFixed());

      if (
        !document.getElementById("inp" + this.rnd_id) &&
        !document.getElementById("tltp" + this.rnd_id)
      )
        break;
    }
    this.$nextTick((n) => {
  if(this.canUndate)    this.tooltipMe =  M.Tooltip.init(document.getElementById('tltp'+this.rnd_id));
console.log({showMonthBtn: this.showMonthBtn,
  showKvartalBtn: this.showKvartalBtn,
  showYearBtn: this.showYearBtn

})
      this.me = this.$Kalendar.set({showMonthBtn: this.showMonthBtn,
        showKvartalBtn: this.showKvartalBtn,
        showYearBtn: this.showYearBtn
      
      }, "#inp" + this.rnd_id);
    });


  },
  destroyed() {
    console.log('oh no i am destroyed')
  },
  computed: {
  
  },
  methods: {},
  watch: {
    innerDate(n) {
      this.$emit("update:value", n);
    },
  },
}
</script>

<style>

</style>