import Home from "@/views/Home";
import Detail from "@/views/Detail";
import AccountLogin from "@/views/AccountLogin";
import i18n from "@/locales/i18n";

export default [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: `${i18n.t("common.name")} - ${i18n.t("common.brand")}`,
    },
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: Detail,
    meta: {
      title: `${i18n.t("common.name")} - ${i18n.t("common.brand")}`,
    },
  },
  {
    path: "/login",
    name: "AccountLogin",
    component: AccountLogin,
    meta: {
      title: `${i18n.t("common.login")} - ${i18n.t("common.name")} - ${i18n.t(
        "common.brand"
      )}`,
    },
  },
];
