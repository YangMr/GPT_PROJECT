"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_navInfo = require("../../utils/navInfo.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "462bf4ca": common_vendor.unref(utils_navInfo.getNavInfo)().setViewHeight,
      "18419af1": common_vendor.unref(utils_navInfo.getNavInfo)().top
    }));
    const greetSb = common_vendor.ref("你好，我是你的人工智能大模型，现在的我能够学习和理解人类的语言，进行多轮对话，回答问题，高效帮助人们获取信息，知识和灵感~快和我聊聊吧！如果你不确定从哪里开始，可以试试这样问我:");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.s(_ctx.__cssVars()),
        b: common_vendor.s({
          height: common_vendor.unref(utils_navInfo.getNavInfo)().setViewHeight
        }),
        c: common_vendor.s(_ctx.__cssVars()),
        d: common_vendor.t(greetSb.value),
        e: common_vendor.s(_ctx.__cssVars())
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/yangling/Downloads/班级/2307B实训三/GPT_PROJECT/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
