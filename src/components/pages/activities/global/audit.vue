<template>
  <canvas class="" :id="myRandomId" width="400" height="400"> </canvas>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  props: ["audit"],
  data() {
    return {
      myRandomId: nanoid(),
      me: null,
    };
  },
  mounted() {
    this.renderMe();
  },
  methods: {
    renderMe() {
      let ctx = document.getElementById(this.myRandomId).getContext("2d");
      let data = [];
      let labels = [];

      this.audit.rows.forEach((row) => {
        data.push(row.propInt);
        labels.push(
          row.propName.length > 20
            ? row.propName.slice(0, 20) + "..."
            : row.propName
        );
      });
      this.me = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: data,
              backgroundColor: [
                "#c2185b",
                "#3949ab",
                "#2196f3",
                "#00bcd",
                "#009688",
                "#66bb6a",
                "#f4ff81",
                "#f4511e",
                "#00e676",
                "#cddc39",
              ].sort((v) => {
                return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
              }),
            },
          ],
          labels: labels,
        },

        // These labels appear in the legend and in the tooltips when hovering different arcs
      });
    },
    destroyMe() {
      this.me && this.me.destroy();
    },
  },
  destroyed() {
    this.destroyMe();
  },
};
</script>

<style></style>
