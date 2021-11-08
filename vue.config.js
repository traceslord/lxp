const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    open: true,
  },
  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/plugins/icons/svg"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/plugins/icons/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // set text-loader
    config.module
      .rule("md")
      .test(/\.md$/)
      .use("text-loader")
      .loader("text-loader")
      .end();
  },
};
