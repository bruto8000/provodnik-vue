<template>
  <div>
    <div class="field is-grouped is-grouped-multiline">
      <div v-for="(tag, idx) in tags" :key="idx" class="tags has-addons m-2">
        <span
          @click="showTagBody(tag)"
          class="tag is-clickable is-medium"
          data-position="bottom"
          :data-tooltip="tag.label"
          :class="[{
            'is-danger': tag.body,
            'is-info': !tag.body,
         
          },  tag.label.length > 20 ?   tooltipsRandomClass : '']"
          >{{
            tag.label.length > 20 ? tag.label.slice(0, 17) + "..." : tag.label
          }}</span
        >
      </div>
    </div>

    <div class="modal" :id="modalRandomId">
      <div class="modal-content">
        <h3 class="is-title is-3">Тело тега:</h3>
        <p class="is-size-4">{{ currentTag.body }}</p>
      </div>

      <div class="modal-footer">
        <button class="is-primary modal-close button">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  props: ["tags"],
  data() {
    return {
      tagBodyModal: null,
      initedTooltips: [],
      currentTag: {
        body: "",
      },
      modalRandomId: nanoid(),
      tooltipsRandomClass: nanoid(),
    };
  },
  activated() {
    this.initTooltips();
  },
  deactivated() {
    this.destroyTooltips();
  },
  mounted() {
          this.initTooltips();
          this.initModal();
 
  
  },
  methods: {
      initModal(){
  this.tagBodyModal = M.Modal.init(
      document.getElementById(this.modalRandomId),
      {
        inDuration: 0,
        outDuration: 0,
      }
    );
      },
    async initTooltips() {
      this.destroyTooltips();
      await this.$nextTick();
   
      this.initedTooltips = M.Tooltip.init(
        document.querySelectorAll(`.${this.tooltipsRandomClass}`)
      );

    },
    destroyTooltips() {
      this.initedTooltips.forEach((tooltip) => tooltip.destroy());
    },

    showTagBody(tag) {
      this.currentTag = tag;
      this.openTagBodyModal();
    },
    openTagBodyModal() {
    
      this.tagBodyModal.open();
    },
    deleteTag(tag) {
      let idx = this.tags.indexOf(tag);
      this.tags.splice(idx, 1);
    },
  },
  watch: {
      tags(){
          this.initTooltips();
      }
  }
};
</script>

<style></style>
