<template>
	<view class="container">
		<!-- Header -->
		<view class="header">
			<text class="title">Bed Lite</text>
			<text class="subtitle">Smart Home Control</text>
		</view>

		<!-- Color Control Card -->
		<view class="card">
			<view class="card-header">
				<text class="card-title">颜色控制</text>
				<text class="card-value">{{ currentColorName }}</text>
			</view>
			<view class="color-palette">
				<view 
					v-for="(item, index) in colors" 
					:key="index"
					class="color-btn"
					:class="{ 'active': activeColorIndex === index }"
					:style="{ backgroundColor: item.hex }"
					@click="handleColorClick(index, item)"
				>
					<!-- Inner indicator for selection -->
					<view class="color-indicator" v-if="activeColorIndex === index"></view>
				</view>
			</view>
		</view>

		<!-- Brightness Control Card -->
		<view class="card">
			<view class="card-header">
				<text class="card-title">亮度控制</text>
				<text class="card-value">{{ sliderValue }}%</text>
			</view>
			
			<view class="brightness-presets">
				<view 
					v-for="(brightness, index) in brightnessLevels" 
					:key="index" 
					class="preset-btn"
					:class="{ 'active': sliderValue === brightness }"
					@click="handleBrightnessClick(brightness)"
				>
					{{ brightness }}%
				</view>
			</view>

			<view class="slider-wrapper">
				<text class="icon">🔅</text>
				<slider 
					class="custom-slider"
					:value="sliderValue" 
					@change="sliderChange" 
					activeColor="#4facfe"
					backgroundColor="#333333"
					block-color="#ffffff"
					block-size="24"
				/>
				<text class="icon">🔆</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { sendUdpMessage } from '@/udp.js';

	// 目标设备的 IP 和 端口配置 (可在需要时统一修改)
	const targetIp = '192.168.0.104';
	const targetPort = 5000;

	// Brightness State
	const sliderValue = ref(50);
	const brightnessLevels = ref([10, 30, 60, 100]);

	// Color State
	const activeColorIndex = ref(0);
	const currentColorName = ref('暖白');
	const colors = ref([
		{ name: '暖白', hex: '#FFDFB0', r: 255, g: 223, b: 176 },
		{ name: '正白', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
		{ name: '冷白', hex: '#E0F0FF', r: 224, g: 240, b: 255 },
		{ name: '红色', hex: '#FF4D4D', r: 255, g: 77, b: 77 },
		{ name: '绿色', hex: '#4DFF4D', r: 77, g: 255, b: 77 },
		{ name: '蓝色', hex: '#4D4DFF', r: 77, g: 77, b: 255 },
		{ name: '紫色', hex: '#B84DFF', r: 184, g: 77, b: 255 },
		{ name: '关闭', hex: '#222222', r: 0, g: 0, b: 0 }
	]);

	const sendRequest = (dataPayload) => {
		// 使用 UDP 极速发送，fire-and-forget，无需 await 甚至 try/catch 网络等待
		sendUdpMessage(dataPayload, targetIp, targetPort);
	};

	// Handle Color Change
	const handleColorClick = (index, colorItem) => {
		activeColorIndex.value = index;
		currentColorName.value = colorItem.name;
		console.log(`切换颜色到: ${colorItem.name}`);
		
		const payload = {
			r: colorItem.r,
			g: colorItem.g,
			b: colorItem.b
		};
		sendRequest(payload);
	};

	// Handle Brightness Slider Change
	const sliderChange = (e) => {
		sliderValue.value = e.detail.value;
		console.log(`滑动条调整亮度: ${sliderValue.value}`);
		sendRequest({ data: sliderValue.value });
	};

	// Handle Brightness Preset Click
	const handleBrightnessClick = (brightness) => {
		sliderValue.value = brightness;
		console.log(`按钮点击亮度: ${brightness}`);
		sendRequest({ data: brightness });
	};
</script>

<style scoped>
	/* 全局容器：深色模式背景 */
	.container {
		min-height: 100vh;
		background-color: #121212;
		color: #ffffff;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
	}

	/* 头部样式 */
	.header {
		margin-bottom: 60rpx;
		margin-top: 40rpx;
		display: flex;
		flex-direction: column;
	}

	.title {
		font-size: 64rpx;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: 2rpx;
		margin-bottom: 10rpx;
	}

	.subtitle {
		font-size: 28rpx;
		color: #888888;
		font-weight: 400;
	}

	/* 卡片样式 */
	.card {
		background-color: #1E1E1E;
		border-radius: 32rpx;
		padding: 40rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.card-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #E0E0E0;
	}

	.card-value {
		font-size: 28rpx;
		color: #4facfe;
		font-weight: 500;
	}

	/* 颜色面板 */
	.color-palette {
		display: flex;
		flex-wrap: wrap;
		gap: 30rpx;
		justify-content: space-between;
	}

	.color-btn {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		border: 4rpx solid transparent;
		margin-bottom: 10rpx;
	}

	.color-btn:active {
		transform: scale(0.9);
	}

	.color-btn.active {
		transform: scale(1.05);
		border-color: #ffffff;
		box-shadow: 0 8rpx 20rpx rgba(255, 255, 255, 0.2);
	}

	.color-indicator {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		background-color: transparent;
		border: 4rpx solid #1e1e1e;
	}

	/* 亮度预设池 */
	.brightness-presets {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}

	.preset-btn {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		margin: 0 10rpx;
		background-color: #2A2A2A;
		border-radius: 20rpx;
		font-size: 28rpx;
		color: #A0A0A0;
		font-weight: 500;
		transition: all 0.2s ease;
	}
	
	.preset-btn:first-child {
		margin-left: 0;
	}

	.preset-btn:last-child {
		margin-right: 0;
	}

	.preset-btn.active {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		color: #ffffff;
		box-shadow: 0 6rpx 16rpx rgba(79, 172, 254, 0.4);
	}

	.preset-btn:active {
		transform: scale(0.95);
	}

	/* 滑块容器 */
	.slider-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.icon {
		font-size: 40rpx;
		color: #888888;
	}

	.custom-slider {
		flex: 1;
		margin: 0 20rpx;
	}
</style>