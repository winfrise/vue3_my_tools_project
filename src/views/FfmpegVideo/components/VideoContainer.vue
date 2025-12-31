<template>
    <div class="video-container" :style="videoContainerStyle">
        <video class="video"
            :src="videoUrl"
            @loadedmetadata="handleMetadataLoaded"
            controls
            autoplay
            muted
        ></video>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  videoUrl: string | ''
}
const props = defineProps<Props>()

const emit = defineEmits(['loaded'])

const videoUrl = computed(() => {
    return props.videoUrl
})

// 1. 定义常量
const containerWidth = 800;
const containerHeight = 600;


// 3. 视频元数据加载完成
const handleMetadataLoaded = (event: Event) => {
    const video = event.target as HTMLVideoElement;
    console.log("视频元数据加载完成：", video.videoWidth, video.videoHeight);
  
    // 记录原始尺寸
    const originalVideoWidth = video.videoWidth;
    const originalVideoHeight = video.videoHeight;

    // 计算缩放比例
    const scaleRatio = (() => {
        const scaleX = containerWidth / originalVideoWidth
        const scaleY = containerHeight / originalVideoHeight
        return Math.min(scaleX, scaleY)
    })()


    // 2. 计算视频缩放后的实际宽高
    const displayWidth = originalVideoWidth * scaleRatio;
    const displayHeight = originalVideoHeight * scaleRatio

    // 3. 计算位置 (居中显示)
    // 在容器中水平垂直居中
    const videoX = (containerWidth - displayWidth) / 2
    const videoY = (containerHeight - displayHeight) / 2


    
    emit('loaded', {
        videoX, 
        videoY, 
        originalVideoWidth, 
        originalVideoHeight, 
        displayWidth, 
        displayHeight,
        scaleRatio,
        containerWidth,
        containerHeight
    })
};


// 应用到视频的样式
const videoContainerStyle = computed(() => ({
  width: `${containerWidth}px`,
  height: `${containerHeight}px`,
}));

</script>

<style lang="scss" scoped>
.video-container {
  .video {
    width: 100%;
    height: 100%;
  }
}
</style>