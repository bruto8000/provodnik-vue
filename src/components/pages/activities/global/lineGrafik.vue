<template>
  <canvas :id="myRandomId"> </canvas>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  props: ["table"],
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


        let ctx = document.getElementById(
         this. myRandomId
        );

     this.me = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.table.range,
            datasets: this.table.TRs.map((TR, idxOfTR) => {
              return {
                data: TR.inputs.map((input) => input.value),
                label: TR.type,
                fill: false,
                borderColor: this.table.colors[idxOfTR],
                backgroundColor: this.table.colors[idxOfTR],
              };
            }),
          },
        });

    },
    destroyMe(){
        this.me.destroy();
    }
  },
  destroyed(){
      this.destroyMe();
  }
};
</script>


<style></style>
