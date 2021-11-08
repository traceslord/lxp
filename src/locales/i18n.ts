import Vue from "vue";
import VueI18n from "vue-i18n";
import enUS from "./element/en-US";
import zhCN from "./element/zh-CN";
import frFR from "./element/fr-FR";

Vue.use(VueI18n);

const LOCALE = "jk_lxp_locale";
export const SUPPORTED_LANGS: string[] = ["en-US", "zh-CN", "fr-FR"];
const DEFAULT_LANG: string = SUPPORTED_LANGS[1];

export const setLocale: (lang: string) => void = (lang: string) =>
  localStorage.setItem(LOCALE, lang);
export const getLocale: () => string = () => {
  const lang: string | null = localStorage.getItem(LOCALE);
  return lang && SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
};

const ELEMENT_LANG: AnyObject = {
  "en-US": enUS,
  "zh-CN": zhCN,
  "fr-FR": frFR,
};

function loadLocaleMessages(): AnyObject {
  const locales: __WebpackModuleApi.RequireContext = require.context(
    "./lxp",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: AnyObject = {};
  locales.keys().forEach((key) => {
    const matched: RegExpMatchArray | null = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale: string = matched[1];
      messages[locale] = {
        ...locales(key),
        ...ELEMENT_LANG[locale],
      };
    }
  });
  return messages;
}

export default new VueI18n({
  locale: getLocale(),
  fallbackLocale: DEFAULT_LANG,
  messages: loadLocaleMessages(),
});
