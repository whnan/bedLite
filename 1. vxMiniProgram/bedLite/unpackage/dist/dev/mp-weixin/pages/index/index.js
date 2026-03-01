"use strict";
const common_vendor = require("../../common/vendor.js");
const udp = require("../../udp.js");
const targetIp = "192.168.50.6";
const targetPort = 5e3;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sliderValue = common_vendor.ref(50);
    const brightnessLevels = common_vendor.ref([10, 30, 60, 100]);
    const activeColorIndex = common_vendor.ref(0);
    const currentColorName = common_vendor.ref("暖白");
    const colors = common_vendor.ref([
      { name: "暖白", hex: "#FFDFB0", r: 255, g: 223, b: 176 },
      { name: "正白", hex: "#FFFFFF", r: 255, g: 255, b: 255 },
      { name: "冷白", hex: "#E0F0FF", r: 224, g: 240, b: 255 },
      { name: "红色", hex: "#FF4D4D", r: 255, g: 77, b: 77 },
      { name: "绿色", hex: "#4DFF4D", r: 77, g: 255, b: 77 },
      { name: "蓝色", hex: "#4D4DFF", r: 77, g: 77, b: 255 },
      { name: "紫色", hex: "#B84DFF", r: 184, g: 77, b: 255 },
      { name: "关闭", hex: "#222222", r: 0, g: 0, b: 0 }
    ]);
    const sendRequest = (dataPayload) => {
      udp.sendUdpMessage(dataPayload, targetIp, targetPort);
    };
    const handleColorClick = (index, colorItem) => {
      activeColorIndex.value = index;
      currentColorName.value = colorItem.name;
      common_vendor.index.__f__("log", "at pages/index/index.vue:101", `切换颜色到: ${colorItem.name}`);
      const payload = {
        r: colorItem.r,
        g: colorItem.g,
        b: colorItem.b
      };
      sendRequest(payload);
    };
    const sliderChange = (e) => {
      sliderValue.value = e.detail.value;
      common_vendor.index.__f__("log", "at pages/index/index.vue:114", `滑动条调整亮度: ${sliderValue.value}`);
      sendRequest({ data: sliderValue.value });
    };
    const handleBrightnessClick = (brightness) => {
      sliderValue.value = brightness;
      common_vendor.index.__f__("log", "at pages/index/index.vue:121", `按钮点击亮度: ${brightness}`);
      sendRequest({ data: brightness });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(currentColorName.value),
        b: common_vendor.f(colors.value, (item, index, i0) => {
          return common_vendor.e({
            a: activeColorIndex.value === index
          }, activeColorIndex.value === index ? {} : {}, {
            b: index,
            c: activeColorIndex.value === index ? 1 : "",
            d: item.hex,
            e: common_vendor.o(($event) => handleColorClick(index, item), index)
          });
        }),
        c: common_vendor.t(sliderValue.value),
        d: common_vendor.f(brightnessLevels.value, (brightness, index, i0) => {
          return {
            a: common_vendor.t(brightness),
            b: index,
            c: sliderValue.value === brightness ? 1 : "",
            d: common_vendor.o(($event) => handleBrightnessClick(brightness), index)
          };
        }),
        e: sliderValue.value,
        f: common_vendor.o(sliderChange)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
