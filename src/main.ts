import Vue from "vue";
import App from "./App.vue";
import i18n from "./locales/i18n";
import VueI18n from "vue-i18n";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import IconSvg from "./plugins/icons";

Vue.use(ElementUI, {
  i18n: (key: string, value: VueI18n.Values | undefined) => i18n.t(key, value),
});
Vue.use(IconSvg);

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
