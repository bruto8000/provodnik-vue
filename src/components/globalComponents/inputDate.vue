<template>
  <div>
    <div
      class="center"
      data-position="tooltipPos || top"
      @click="undate"
      :id="'tltp' + rnd_id"
      data-tooltip="Нажмите чтобы сделать неактивной"
    >
      {{ header }}
    </div>
    <input
      v-model.lazy="innerDate"
      :id="'inp' + rnd_id"
      type="text"
      class="datepicker center input"
      placeholder="Выберите дату"
    />
  </div>
</template>

<script>
export default {
  props: [
    "value",
    "header",
    "canUndate",
    "showYearBtn",
    "showMonthBtn",
    "showKvartalBtn",
  ],
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
      this.rnd_id = (Math.random() * 2000).toFixed();

      if (
        !document.getElementById("inp" + this.rnd_id) &&
        !document.getElementById("tltp" + this.rnd_id)
      )
        break;
    }
    this.$nextTick((n) => {
      if (this.canUndate)
        this.tooltipMe = M.Tooltip.init(
          document.getElementById("tltp" + this.rnd_id)
        );

      this.me = this.$Kalendar.set(
        {
          showMonthBtn: this.showMonthBtn,
          showKvartalBtn: this.showKvartalBtn,
          showYearBtn: this.showYearBtn,
          showClearBtn: true,
        },
        "#inp" + this.rnd_id
      )[0];
    });
  },
  destroyed() {
    this.me && this.me.destroy();
  },
  computed: {},
  methods: {},
  watch: {
    innerDate(n) {
      if (this.value != n) this.$emit("update:value", n);
    },
    value(n) {
      this.innerDate = n;
    },
  },
};
</script>

<style></style>
