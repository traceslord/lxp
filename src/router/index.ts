import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import Store from "@/store/index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter);

const router: any = new VueRouter({
  mode: "history",
  routes,
});

router.firstInit = false;

router.beforeEach(
  async (
    to: AnyObject,
    from: AnyObject,
    next: (params?: AnyObject) => void
  ) => {
    NProgress.start();
    if (to.meta.title) document.title = to.meta.title;
    try {
      const TOKEN = localStorage.getItem("jk_lxp_token");
      if (!TOKEN && to.name !== "AccountLogin") {
        next({ name: "AccountLogin", replace: true });
        return;
      }
      if (TOKEN && to.name === "AccountLogin") {
        next({ name: "Home", replace: true });
        return;
      }
      if (!router.firstInit && TOKEN) {
        router.firstInit = true;
        Store.commit("getUserPhone", TOKEN);
      }
      next();
    } catch {
      next();
    }
  }
);

router.afterEach(() => {
  NProgress.done();
});

export default router;
