"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      initSystemNavInfo();
    });
    const initSystemNavInfo = () => {
      let navInfo = common_vendor.index.getStorageSync("navInfo");
      if (!navInfo) {
        navInfo = common_vendor.index.getMenuButtonBoundingClientRect();
        common_vendor.index.setStorageSync("navInfo", navInfo);
      }
    };
    return () => {
    };
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/yangling/Downloads/班级/2307B实训三/GPT_PROJECT/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
