

<template>
  <!-- <view class="container"> -->
    <!-- 显示滑块的当前值 -->
    <view class="uni-title">当前值: {{ sliderValue }}</view>

  <!-- 按钮组 -->  
  <view class="button-group">  
    <button   
      v-for="(brightness, index) in brightnessLevels"   
      :key="index"   
      class="btn"   
      @click="handleBrightnessClick(index, brightness)"  
    >  
      亮度 {{ brightness }}  
    </button>  
  </view>  

    <!-- 滑块组件 -->
    <view class="slider-container">
      <slider :value="sliderValue" @change="sliderChange" show-value />
    <!-- </view> -->
  </view>
</template>

<script setup>
import { ref } from 'vue';
// import axios from 'axios';

// 初始化滑块的值
const sliderValue = ref(50);

// 初始化亮度级别数组
const brightnessLevels = ref([10, 30, 60, 100]);

// 滑块值改变时更新数据
const sliderChange = (e) => {
  sliderValue.value = e.detail.value;
};

// 处理亮度按钮点击的方法
const handleBrightnessClick = (index, brightness) => {
  console.log(`亮度按钮 ${brightness} 被点击，索引为 ${index}`);
  // 在这里可以添加更多逻辑，比如根据亮度值调整页面亮度等
  sliderValue.value = brightness;
  
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5%; /* 使用百分比以适应不同屏幕 */
  width: 100%;
}


.uni-title {
  font-size: 18px;
  font-weight: bold;
  margin: 20% 0% 0% 40%; /* 使用百分比以适应不同屏幕 */
}

.button-group {
  display: flex;
  justify-content: space-around;
  width: 80%; /* 确保按钮组占满宽度 */
  margin: 10% auto; /* 使用百分比以适应不同屏幕 */
  
}

.btn {
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: pointer;
  border-radius: 5px;
  flex: 1; /* 让按钮平分空间 */
  margin: 20% 10px 0 10px; /* 添加左右间距 */
  } 

.slider-container {
  width: 100%; /* 设置容器宽度为100% */
  max-width: 80%; /* 可设置最大宽度 */
  margin: 15% auto; /* 垂直居中，自动水平居中 */
}

.slider {
  width: 100%; /* 设置滑条宽度为100% */
}
</style>






