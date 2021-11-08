import svg from "./index.vue";

export default {
  install(Vue: AnyObject): void {
    const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
      requireContext.keys().map(requireContext);
    const req: __WebpackModuleApi.RequireContext = require.context(
      "./svg",
      false,
      /\.svg$/
    );
    requireAll(req);
    Vue.component("IconSvg", svg);
  },
};
