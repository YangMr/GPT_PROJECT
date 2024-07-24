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
    const messageData = common_vendor.ref([]);
    const text = common_vendor.ref("");
    const sendIngState = common_vendor.ref(false);
    let appid = common_vendor.ref("");
    let SocketTask = common_vendor.ref(null);
    const historyTextList = common_vendor.ref([]);
    const sparkResult = common_vendor.ref("");
    const sendMessage = async () => {
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
      messageData.value.push(
        // 用户给ai发送的消息
        {
          role: "user",
          content: text.value
        }
      );
      messageData.value.push(
        // ai给用户回复的消息
        {
          role: "assistant",
          content: "",
          loadShow: true,
          // 展示
          copyIcon: false
          // 不展示
        }
      );
      sparkResult.value = "";
      sendIngState.value = true;
      const res = await common_vendor.Ws.callFunction({
        name: "ai_index"
      });
      appid.value = res.result.APPID;
      const url = res.result.url;
      SocketTask.value = common_vendor.index.connectSocket({
        url,
        success: (res2) => {
          console.log("连接成功", res2);
        },
        fail: (error) => {
          console.log(error, "ws连接失败");
          common_vendor.index.showToast({
            title: "出现异常错误",
            icon: "none"
          });
          sendIngState.value = false;
        }
      });
      SocketTask.value.onOpen(() => {
        console.log("连接成功,接下来可以发送消息了");
        historyTextList.value.push({
          role: "user",
          content: text.value
        });
        text.value = "";
        const params = {
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
              text: historyTextList.value
            }
          }
        };
        SocketTask.value.send({
          data: JSON.stringify(params),
          success: (res2) => {
            console.log("发送数据成功", res2);
          },
          fail: (error) => {
            console.log("发送消息失败");
            common_vendor.index.showToast({ title: "出现异常错误", icon: "none" });
            messageData.value = [];
            sendIngState.value = false;
          }
        });
        getServerMessage();
      });
      SocketTask.value.onClose(() => {
        console.log("websocket断开连接");
      });
      SocketTask.value.onError(() => {
        console.log("websocket连接错误");
        messageData.value = [];
        sendIngState.value = false;
      });
    };
    const getServerMessage = () => {
      SocketTask.value.onMessage((res) => {
        messageData.value[messageData.value.length - 1].loadShow = false;
        const obj = JSON.parse(res.data);
        if (obj.header.code != 0) {
          sparkResult.value += obj.header.message.replace(/↵/g, "\n");
          messageData.value[messageData.value.length - 1].content = sparkResult.value;
          sendIngState.value = false;
          messageData.value[messageData.value.length - 1].copyIcon = true;
          return false;
        }
        console.log("message", obj);
        const dataArray = obj.payload.choices.text;
        dataArray.forEach((item) => {
          sparkResult.value += item.content.replace(/↵/g, "\n");
          messageData.value[messageData.value.length - 1].content = sparkResult.value;
        });
        common_vendor.index.pageScrollTo({
          scrollTop: 3e3
        });
        if (obj.header.code === 0 && obj.header.status === 2) {
          historyTextList.value.push({
            role: "assistant",
            content: sparkResult.value
          });
          sendIngState.value = false;
        }
      });
    };
    const selectQuestion = (item) => {
      text.value = item;
      sendMessage();
    };
    const clearMessage = () => {
      if (sendIngState.value) {
        common_vendor.index.showToast({
          title: "等待AI回复完毕",
          icon: "none"
        });
        return false;
      }
      sparkResult.value = "";
      messageData.value = [];
      historyTextList.value = [];
      text.value = [];
    };
    const handleCopy = (value) => {
      common_vendor.index.setClipboardData({
        data: value
      });
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
            b: common_vendor.o(($event) => selectQuestion(item), index),
            c: index
          };
        }),
        i: common_vendor.s(_ctx.__cssVars())
      } : {}, {
        j: common_vendor.f(messageData.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.role === "user"
          }, item.role === "user" ? {
            b: common_vendor.t(item.content)
          } : common_vendor.e({
            c: item.loadShow
          }, item.loadShow ? {} : {}, {
            d: common_vendor.t(item.content),
            e: item.copyIcon
          }, item.copyIcon ? {
            f: common_vendor.o(($event) => handleCopy(item.content), index)
          } : {}), {
            g: index
          });
        }),
        k: common_vendor.s(_ctx.__cssVars()),
        l: common_vendor.o(clearMessage),
        m: common_vendor.o(sendMessage),
        n: text.value,
        o: common_vendor.o(($event) => text.value = $event.detail.value),
        p: common_vendor.o(sendMessage),
        q: common_vendor.s(_ctx.__cssVars()),
        r: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/yangling/Downloads/班级/2307B实训三/GPT_PROJECT/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
