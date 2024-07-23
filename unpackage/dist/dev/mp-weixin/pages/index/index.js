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
    const problemData = common_vendor.ref([
      "给我一份关于数字经济的毕业论文大纲",
      "帮我推荐几个送给女朋友的生日礼物",
      "帮我推荐几款好用的国货口红",
      "我要在夏天去云南旅游，有什么美食推荐吗",
      "帮我推荐几款流行的家装风格"
    ]);
    const messageData = common_vendor.ref([
      "11"
    ]);
    let SocketTask = common_vendor.ref(null);
    const connentWSServer = async () => {
      const res = await common_vendor.Ws.callFunction({ name: "ai_index" });
      console.log("Res=>", res);
      SocketTask.value = common_vendor.index.connectSocket({
        url: res.result.url,
        success(res2) {
          console.log(res2, "连接成功");
        }
      });
      SocketTask.value.onOpen = () => {
        console.log("websocket连接成功");
      };
      SocketTask.value.onClose = () => {
        console.log("websocket连接成功");
      };
      SocketTask.value.onError = () => {
        console.log("websocket连接错误");
      };
    };
    connentWSServer();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.s(_ctx.__cssVars()),
        b: common_vendor.s({
          height: common_vendor.unref(utils_navInfo.getNavInfo)().setViewHeight
        }),
        c: common_vendor.s(_ctx.__cssVars()),
        d: messageData.value.length <= 0
      }, messageData.value.length <= 0 ? {
        e: common_vendor.t(greetSb.value),
        f: common_vendor.s(_ctx.__cssVars())
      } : {}, {
        g: messageData.value.length <= 0
      }, messageData.value.length <= 0 ? {
        h: common_vendor.f(problemData.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        i: common_vendor.s(_ctx.__cssVars())
      } : {}, {
        j: common_vendor.s(_ctx.__cssVars()),
        k: common_vendor.s(_ctx.__cssVars()),
        l: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/yangling/Downloads/班级/2307B实训三/GPT_PROJECT/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
