<!-- src/components/VideoPlayer.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { VideoInfo } from '../types/video';

interface Props {
  videoInfo: VideoInfo | null;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

const props = defineProps<Props>();
const videoRef = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  if (videoRef.value && props.videoInfo?.url) {
    videoRef.value.src = props.videoInfo.url;
  }
});

// 监听 currentTime 变化（父组件控制）
watch(
  () => props.currentTime,
  (newTime) => {
    if (videoRef.value && !isNaN(newTime)) {
      videoRef.value.currentTime = newTime;
    }
  }
);

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

defineExpose({
  play,
  pause
});
</script>

<template>
  <div class="video-player">
    <video
      ref="videoRef"
      :src="props.videoInfo?.url || ''"
      @timeupdate="handleTimeUpdate"
      @play="props.onPlay"
      @pause="props.onPause"
      style="width: 100%; height: 100%; background: #000"
    />
  </div>
</template>

<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
}
video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>