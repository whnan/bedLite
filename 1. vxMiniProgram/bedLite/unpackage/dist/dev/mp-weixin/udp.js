"use strict";
const common_vendor = require("./common/vendor.js");
let udpSocket = null;
const initUdpSocket = () => {
  if (!udpSocket) {
    udpSocket = common_vendor.wx$1.createUDPSocket();
    udpSocket.bind();
    udpSocket.onError((res) => {
      common_vendor.index.__f__("error", "at udp.js:13", "UDP Error:", res);
    });
    common_vendor.index.__f__("log", "at udp.js:16", "UDP Socket 初始化成功");
  }
  return udpSocket;
};
const sendUdpMessage = (dataPayload, targetIp = "192.168.0.104", targetPort = 5e3) => {
  const socket = initUdpSocket();
  try {
    const messageString = JSON.stringify(dataPayload);
    socket.send({
      address: targetIp,
      port: targetPort,
      message: messageString
    });
    common_vendor.index.__f__("log", "at udp.js:39", `[UDP 发送至 ${targetIp}:${targetPort}] -> ${messageString}`);
  } catch (e) {
    common_vendor.index.__f__("error", "at udp.js:41", "发送 UDP 数据包时出错:", e);
  }
};
exports.sendUdpMessage = sendUdpMessage;
//# sourceMappingURL=../.sourcemap/mp-weixin/udp.js.map
