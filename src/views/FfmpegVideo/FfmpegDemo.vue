<template>
  <div class="app-container">
    <h2>视频尺寸计算演示</h2>
    <VideoUpload v-model="videoUrl" />

    <el-card>
      <VideoCropper :videoUrl="videoUrl" :maxSelection="maxSelection"  />
    </el-card>

    <el-card>
      <!-- 视频容器 (800x600) -->
      <VideoContainer v-if="videoUrl" :videoUrl="videoUrl" @loaded="handleVideoLoaded" />

      <CropperWrapper :maxSelection="maxSelection" />
        <!-- 调试信息显示 -->
        <div class="debug-panel">
          {{ videoInfo }}
        <h3>📊 计算结果</h3>
        <p><strong>容器尺寸：</strong> {{ videoInfo.containerWidth }} x {{ videoInfo.containerHeight }}</p>
        <p><strong>视频原始尺寸：</strong> {{ videoInfo.originalVideoWidth }} x {{ videoInfo.originalVideoHeight }}</p>
        <p><strong>视频显示尺寸：</strong> {{ videoInfo.displayWidth }} x {{ videoInfo.displayHeight }}</p>
        <p><strong>视频位置 (X, Y)：</strong> {{ videoInfo.videoX }}px, {{ videoInfo.videoY }}px</p>
        <p><strong>缩放比例：</strong> {{ videoInfo.scaleRatio }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
interface VideoInfo {
  videoX: number | null,
  videoY: number | null,
  originalVideoWidth: number | null,
  originalVideoHeight: number | null,
  displayWidth: number | null,
  displayHeight: number | null,
  scaleRatio: number | null,
  containerWidth: number | null,
  containerHeight: number | null,
}
import { ref, computed, onMounted, reactive } from 'vue';
import VideoUpload from './components/VideoUpload.vue';
import VideoContainer from './components/VideoContainer.vue'
import CropperWrapper from './components/CropperWrapper.vue';
import VideoCropper from './components/VideoCropper.vue'

const videoUrl = ref<string>('')
const videoInfo = reactive<VideoInfo>({
        videoX: null,
        videoY: null,
        originalVideoWidth: null,
        originalVideoHeight: null,
        displayWidth: null,
        displayHeight: null,
        scaleRatio: null,
        containerWidth: null,
        containerHeight: null,
})

const maxSelection = computed(() => {
  return {
    y: videoInfo.videoY, 
    x: videoInfo.videoX, 
    width: videoInfo.displayWidth,
    height: videoInfo.displayHeight
  }
})

// const maxSelection = {
//   y: 75,
//   x: 0,
//   width: 800,
//   height: 450,
// }

const handleVideoLoaded = (newVideoInfo) => {
  Object.assign(videoInfo, newVideoInfo)
}



</script>

<style lang="scss" scoped>
.video-container {
  .video {
    width: 100%;
    height: 100%;
  }
}
</style>