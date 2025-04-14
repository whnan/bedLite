"use strict";
const common_vendor = require("../../common/vendor.js");
const request = require("../../request.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sliderValue = common_vendor.ref(50);
    const brightnessLevels = common_vendor.ref([10, 30, 60, 100]);
    const sliderChange = async (e) => {
      sliderValue.value = e.detail.value;
      try {
        const response = await request.request({
          url: "http://192.168.0.104:5000/api",
          // 替换为你的API地址
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            "data": sliderValue.value
          })
        });
        console.log("服务器响应:", response);
      } catch (error) {
        console.error("发送亮度值时出错:", error);
      }
    };
    const handleBrightnessClick = async (index, brightness) => {
      console.log(`亮度按钮 ${brightness} 被点击，索引为 ${index}`);
      sliderValue.value = brightness;
      try {
        const response = await request.request({
          url: "http://192.168.0.104:5000/api",
          // 替换为你的API地址
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            "data": brightness
          })
        });
        console.log("服务器响应:", response);
      } catch (error) {
        console.error("发送亮度值时出错:", error);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(sliderValue.value),
        b: common_vendor.f(brightnessLevels.value, (brightness, index, i0) => {
          return {
            a: common_vendor.t(brightness),
            b: index,
            c: common_vendor.o(($event) => handleBrightnessClick(index, brightness), index)
          };
        }),
        c: sliderValue.value,
        d: common_vendor.o(sliderChange)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
