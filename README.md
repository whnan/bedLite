# Bed Lite (智能床头灯) 项目学习文档

本文档总结了 Bed Lite 智能床头灯项目的完整架构思路，包含了前端（微信小程序）与后端（树莓派 + Docker + Python）的实现细节。这是一份非常适合物联网(IoT)入门开发者的全栈学习资料。

---

## 1. 项目架构概述

本项目的核心目标是通过移动端（微信小程序）实时控制硬件设备（树莓派的 LED 灯带）。
整个系统分为 **控制端 (前端)** 和 **接收端 (后端)**，它们必须处于 **同一个局域网 (Wi-Fi)** 下。

- **控制端 (前端)**: 基于 `Vue 3` 语法的 UniApp/微信小程序。
- **通信协议**: 原本采用 HTTP (POST) 请求，为了提升滑动亮度条时的响应速度（降低延迟），改用了无须建立连接的 **UDP 通信**。
- **接收端 (后端)**: 运行在树莓派 Linux 上的 `Python` 脚本，使用 `Docker` 进行容器化部署，负责监听 5000 端口解析控制指令，并预留了控制真实 GPIO（通用输入输出）的逻辑接口。

---

## 2. 前端实现：重构后的优雅 UI 与极速通信

前端部分位于小程序的 [pages/index/index.vue](file:///e:/study/bedLite/1.%20vxMiniProgram/bedLite/pages/index/index.vue)。

### 📌 2.1 现代智能家居 UI 设计思路
- **深色模式 (Dark Mode)**：床头灯主要在夜间使用，因此背景采用 `#121212` 的深灰色，卡片使用 `#1E1E1E`，避免了强光刺眼。
- **卡片式布局 (Card Layout)**：将“颜色控制”和“亮度控制”划分到两个具有柔和阴影圆角的盒子中，边界清晰。
- **动态交互反馈 (Micro-interactions)**：预设了一个 10/30/60/100 的快捷按钮组，以及精美的圆形调色盘。点击按钮时利用 CSS 的 `transform: scale(0.9)` 缩小，松开时反弹，带来了极好的“阻尼/按压感”。

### 📌 2.2 极速的 UDP 通信改造 ([udp.js](file:///e:/study/bedLite/1.%20vxMiniProgram/bedLite/udp.js))
在智能灯控项目中，**延迟是体验的杀手**。

**为什么从 HTTP 改成 UDP？**
- **HTTP**: 基于 TCP，每次通信都要经历“三次握手建立连接 -> 发送数据 -> 服务器处理确认 -> 断开连接”。当你快速拖拽滑动条时，短时间发出几十个 HTTP 请求，会造成严重的网络拥塞和灯光变动的卡顿（由于需要等待上一个 HTTP 完成）。
- **UDP (Fire-and-forget 模式)**: 无连接。前端只管“发送、不理会结果”，就像射箭一样。这使得滑动条每次数值变化，都会瞬间到达树莓派，灯带的亮度变化将丝般顺滑。

**核心逻辑实现**:
小程序专门封装了单例的 `wx.createUDPSocket()`：

```javascript
// udp.js 中的核心发送逻辑
const socket = wx.createUDPSocket();
socket.bind(); // 绑定任意可用本地端口发出
socket.send({
    address: '192.168.50.6', // 树莓派的居域网 IP
    port: 5000,              // 树莓派监听的端口
    message: JSON.stringify(payload)
});
```

**发送的 JSON 格式约定**:
- 调整颜色：`{"r": 255, "g": 0, "b": 0}` (利用调色盘的数据)
- 调整亮度：`{"data": 50}` (利用滑动条 e.detail.value 获取)

---

## 3. 后端实现：树莓派 + Docker (Python)

后端的目标是常驻内存，接收来自局域网所有的灯控报文并驱动硬件。

### 📌 3.1 UDP 监听服务设计
使用 Python 原生的 `socket` 库创建一个永远在运行 (`while True`) 的服务器 `server.py`。
由于收到的 UDP 报文是字节流(Byte Stream)，我们要将其 `.decode('utf-8')` 解码，并利用 `json.loads()` 转换为 Python 字典，再去判断里面有没有 `r,g,b` 或 `data` 字段。

```python
import socket
import json

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # SOCK_DGRAM 代表 UDP 协议
sock.bind(("0.0.0.0", 5000)) # 监听所有来源 IP 的 5000 端口

while True:
    data, addr = sock.recvfrom(1024)
    payload = json.loads(data.decode('utf-8'))
    # TODO: 解析出 payload 后，调用 RPi.GPIO (普通LED) 
    # 或 rpi_ws281x (全彩灯带) 的库来修改真实的引脚高低电平值。
```

### 📌 3.2 容器化部署为什么用 Docker？
树莓派这种 Linux 设备如果直接把服务跑在宿主机上，容易和各种 Python 依赖起冲突（例如不同库想要不同版本的 Python），且开机自启的设置比较繁琐（需要写 systemd 文件或 rc.local）。

借助 **Docker**：
1. **环境隔离**：一个独立、干净的环境。
2. **永远在线**：运行容器时加入 `--restart unless-stopped`，只要树莓派有电，系统哪怕崩溃重启，Docker 都会自动把后端拉起，保证“灯随叫随亮”。

`Dockerfile` 非常简洁：
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY server.py /app/
EXPOSE 5000/udp
# 坑点注意：加上 -u 表示无缓冲，否则通过 docker logs -f 看不到实时的 print() 打印！
CMD ["python", "-u", "server.py"]
```

---

## 4. 后续进阶与学习

当以上基础通讯打通后，可以继续横向扩展：

1. **硬件挂载篇**: 下一步需要在 `server.py` 里导入树莓派的底层控制库。由于 Docker 是隔离环境，如想在 Docker 里修改树莓派物理 GPIO 针脚的高低电平，需要在 `docker run` 时加上 `--privileged` 特权模式，并将 `/dev/gpiomem` 或 `/dev/mem` 设备映射倒容器内部。
   *(例如：`docker run -d --privileged -v /dev/gpiomem:/dev/gpiomem ...`)*

2. **通信进阶篇**: 若将来人不在局域网里，想用手机外网遥控家里的灯，单靠 UDP 是不行的。那时需要引入 **MQTT 协议**，借助一个公网的 MQTT 服务器（Broker）在手机和树莓派之间做中转转发。

这份文档帮你理清了前后的主线。从界面交互、网络协议，再到后端容器化，这是构建一个优秀物联网系统非常扎实的开始！继续加油！
