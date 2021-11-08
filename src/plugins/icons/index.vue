<template>
  <svg class="svg-icon" :class="svgClass">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IconSvg",
  props: {
    svgClass: {
      type: String,
    },
    svgName: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconName(): string {
      return `#icon-${this.svgName}`;
    },
  },
});
</script>

<style lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
