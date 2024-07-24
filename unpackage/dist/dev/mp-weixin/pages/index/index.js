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
    const text = common_vendor.ref("");
    const messageData = common_vendor.ref([]);
    const sendIngState = common_vendor.ref(false);
    let SocketTask = common_vendor.ref(null);
    const socketStatus = common_vendor.ref(false);
    const historyTextList = common_vendor.ref([]);
    let appid = common_vendor.ref("");
    const sparkResult = common_vendor.ref("");
    const connentWSServer = async () => {
      const res = await common_vendor.Ws.callFunction({
        name: "ai_index"
      });
      appid.value = res.result.APPID;
      SocketTask.value = common_vendor.index.connectSocket({
        url: res.result.url,
        success(res2) {
          console.log(res2, "连接成功");
          socketStatus.value = true;
        },
        fail(error) {
          console.log(error, "连接失败");
          common_vendor.index.showToast({
            title: "出现异常错误",
            icon: "none"
          });
          messageData.value = [];
          sendIngState.value = false;
          socketStatus.value = false;
        }
      });
      SocketTask.value.onOpen(() => {
        console.log("websocket连接成功");
        socketStatus.value = true;
      });
      SocketTask.value.onClose(() => {
        console.log("websocket断开连接");
        socketStatus.value = false;
      });
      SocketTask.value.onError(() => {
        console.log("websocket连接错误");
        socketStatus.value = false;
      });
    };
    connentWSServer();
    const sendMessage = async () => {
      if (!socketStatus.value) {
        await connentWSServer();
      }
      if (text.value.trim().length > 0) {
        text.value = text.value.trim();
      } else {
        common_vendor.index.showToast({
          title: "请输入询问内容",
          icon: "none"
        });
        return false;
      }
      if (sendIngState.value) {
        common_vendor.index.showToast({
          title: "等待AI回复完毕",
          icon: "none"
        });
        return false;
      }
      messageData.value.push({
        role: "user",
        content: text.value
      });
      messageData.value.push({
        role: "assistant",
        content: "",
        // 控制ai回复思考的状态
        loadShow: true
        // 复制ai回复的文本
        // copyIcon : false
      });
      sendServerMessage();
    };
    const sendServerMessage = () => {
      historyTextList.value.push({
        role: "user",
        content: text.value
      });
      text.value = "";
      console.log("socketStatus", socketStatus.value);
      if (socketStatus.value) {
        const data = {
          "header": {
            "app_id": appid.value
          },
          "parameter": {
            "chat": {
              "domain": "generalv3",
              "temperature": 1
            }
          },
          "payload": {
            "message": {
              "text": historyTextList.value
            }
          }
        };
        console.log("333");
        SocketTask.value.send({
          data: JSON.stringify(data),
          success() {
            console.log("发送消息成功");
          },
          fail(error) {
            console.log("发送消息失败");
            common_vendor.index.showToast({
              title: "出现异常错误",
              icon: "none"
            });
            messageData.value = [];
            sendIngState.value = false;
          }
        });
      }
      getServerMessage();
    };
    const getServerMessage = () => {
      if (socketStatus.value) {
        SocketTask.value.onMessage((res) => {
          messageData.value[messageData.value.length - 1].loadShow = false;
          const obj = JSON.parse(res.data);
          const dataArray = obj.payload.choices.text;
          console.log("dataArray", dataArray);
          dataArray.forEach((item) => {
            sparkResult.value += item.content.replace(/↵/g, "/n");
            messageData.value[messageData.value.length - 1].content = sparkResult.value;
          });
          console.log("sparkResult", sparkResult.value);
        });
      }
    };
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
        k: common_vendor.f(messageData.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.loadShow
          }, item.loadShow ? {} : {}, {
            b: common_vendor.t(item.content),
            c: index
          });
        }),
        l: common_vendor.s(_ctx.__cssVars()),
        m: common_vendor.o(sendMessage),
        n: text.value,
        o: common_vendor.o(($event) => text.value = $event.detail.value),
        p: common_vendor.o(sendMessage),
        q: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/yangling/Downloads/班级/2307B实训三/GPT_PROJECT/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
