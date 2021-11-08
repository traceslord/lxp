import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    [key: string]: any;
  }
}
