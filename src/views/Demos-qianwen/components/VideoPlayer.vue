<template>
  <div class="video-player" ref="videoContainer">
    <video controls
      ref="videoRef"
      :src="props.videoInfo?.url || ''"
      @timeupdate="handleTimeUpdate"
      @play="props.onPlay"
      @pause="props.onPause"
      @loadedmetadata="handleMetadataLoaded"
      style="width: 100%; height: 100%; background: #000"
    />
    <CropperWrapper v-if="isLoaded" class="video-cropper" :background="false" :initSelection="initSelection" :selectionOptions="selectionOptions" :maxSelection="maxSelection" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { VideoInfo } from '../types/video';
import CropperWrapper from './CropperWrapper.vue';

interface Props {
  videoInfo: VideoInfo | null;
  // currentTime: number;
  onTimeUpdate: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

const props = defineProps<Props>();

const emit = defineEmits(['loaded'])

const videoRef = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  if (videoRef.value && props.videoInfo?.url) {
    videoRef.value.src = props.videoInfo.url;
  }
});

const handleTimeUpdate = () => {
  if (videoRef.value) props.onTimeUpdate(videoRef.value.currentTime);
};

// 暴露 play / pause 方法给父组件
const play = () => {
  if (videoRef.value) {
    videoRef.value.play();
    props.onPlay();
  }
};

const pause = () => {
  if (videoRef.value) {
    videoRef.value.pause();
    props.onPause();
  }
};

const setCurrentTime = (currentTime:number) => {
  if (videoRef.value) {
    videoRef.value.currentTime = currentTime
  }
}

const initSelection = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})


const maxSelection = computed(() => {
  return {
    y: videoDisplayInfo.videoY, 
    x: videoDisplayInfo.videoX, 
    width: videoDisplayInfo.displayWidth,
    height: videoDisplayInfo.displayHeight
  }
})

const selectionOptions = reactive({
  aspectRatio: undefined,
})

const videoContainer= ref()
const videoDisplayInfo = reactive({
  videoY: 0,
  videoX: 0,
  displayWidth: 0,
  displayHeight: 0,
})
const isLoaded = ref(false)
const handleMetadataLoaded = (event: Event) => {
  isLoaded.value = true
  const containerWidth = videoContainer.value.offsetWidth
  const containerHeight = videoContainer.value.offsetHeight
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

    Object.assign(videoDisplayInfo, {
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



defineExpose({
  play,
  pause,
  setCurrentTime
});
</script>



<style lang="scss" scoped>
.video-player {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .video-cropper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}

</style>