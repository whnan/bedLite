# 项目名称: Bed Lite Backend (树莓派端)
# 需要创建以下目录和文件:
# mkdir -p ~/bedlite-server && cd ~/bedlite-server

# ==========================================
# 1. server.py (后端业务主程序)
# ==========================================
import socket
import json

# 配置监听的 IP 和端口，0.0.0.0 表示监听所有网络接口（包括局域网 IP 如 192.168.x.x）
UDP_IP = "0.0.0.0"
UDP_PORT = 5000

# 创建 UDP Socket 监听服务
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

print(f"🌲 树莓派 Bed Lite 服务已启动！正在监听 UDP 端口 {UDP_PORT}...")

while True:
    try:
        # 接收数据，缓冲区大小为 1024 字节
        data, addr = sock.recvfrom(1024)
        
        # 将接收到的字节流解码并解析为 JSON
        payload = json.loads(data.decode('utf-8'))
        
        # 打印日志到终端（Docker 日志中可见）
        print(f"[{addr[0]}:{addr[1]}] 收到控制指令: {payload}")
        
        # 业务逻辑：根据收到的 JSON 执行灯控操作
        if 'r' in payload and 'g' in payload and 'b' in payload:
            print(f"--> [颜色控制] 修改颜色为 RGB({payload['r']}, {payload['g']}, {payload['b']})")
            # TODO: 在这里导入并调用树莓派 GPIO 库（例如 RPi.GPIO 或 rpi_ws281x）
            
        elif 'data' in payload:
            print(f"--> [亮度控制] 修改亮度为 {payload['data']}%")
            # TODO: 调整灯带的 PWM 占空比来改变亮度

    except Exception as e:
        # 忽略非法的 JSON 或其他异常包，防止服务崩溃
        print(f"解析指令时发生错误: {e}")

# ==========================================
# 2. requirements.txt (Python 依赖包清单)
# ==========================================
# (目前无需外部库即可跑通 UDP 接收，后续加上 RPi.GPIO 等控制硬件时再写到这里)
# RPi.GPIO==0.7.1
# rpi-ws281x==4.3.1

# ==========================================
# 3. Dockerfile (构建容器镜像的文件)
# ==========================================
# 使用官方轻量级 Python 镜像（兼容树莓派常见的 Debian/Ubuntu/Raspberry Pi OS 的 ARM 架构）
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 将当前目录的代码全部复制到容器的 /app 目录中
COPY . /app/

# 安装可能需要的依赖包 (这里先注释掉，需要控制 GPIO 时打开)
# RUN pip install --no-cache-dir -r requirements.txt

# 暴露 5000 端口（注明是 UDP 协议）
EXPOSE 5000/udp

# 启动容器时默认运行的命令
CMD ["python", "-u", "server.py"]

# ==========================================
# 4. 一键运行命令 (在终端执行)
# ==========================================
# docker build -t bedlite-backend .
# docker run -d --name bedlite-server -p 5000:5000/udp --restart unless-stopped bedlite-backend
