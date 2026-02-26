// ./udp.js
let udpSocket = null;

// 初始化 UDP Socket，设计为单例模式
export const initUdpSocket = () => {
    if (!udpSocket) {
        udpSocket = wx.createUDPSocket();
        // 绑定任意可用本地端口进行发送
        udpSocket.bind();

        // 监听错误
        udpSocket.onError((res) => {
            console.error('UDP Error:', res);
        });

        console.log('UDP Socket 初始化成功');
    }
    return udpSocket;
};

/**
 * 发送 UDP 消息
 * @param {Object} dataPayload - 发送的 JSON 数据
 * @param {string} targetIp - 目标单片机 IP (默认 192.168.0.104)
 * @param {number} targetPort - 目标 UDP 端口 (默认 5000)
 */
export const sendUdpMessage = (dataPayload, targetIp = '192.168.0.104', targetPort = 5000) => {
    // 确保 Socket 已经创建
    const socket = initUdpSocket();

    try {
        const messageString = JSON.stringify(dataPayload);
        // 小程序 UDP API 接受 string 或 ArrayBuffer
        socket.send({
            address: targetIp,
            port: targetPort,
            message: messageString
        });
        console.log(`[UDP 发送至 ${targetIp}:${targetPort}] -> ${messageString}`);
    } catch (e) {
        console.error('发送 UDP 数据包时出错:', e);
    }
};
