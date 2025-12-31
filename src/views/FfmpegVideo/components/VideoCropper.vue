<template>
    <div class="video-cropper-wrapper">
        <VideoContainer :video-url="props.videoUrl" />
        <CropperWrapper class="video-cropper"  :background="false" :maxSelection="maxSelection" />
    </div>

</template>

<script setup lang="ts">
import VideoContainer from './VideoContainer.vue';
import CropperWrapper from './CropperWrapper.vue';

interface Props {
    videoUrl: string,
    maxSelection: Object,
    background: boolean
}

const props = defineProps<Props>()

</script>

<style lang="scss" scoped>
    .video-cropper-wrapper {
        position: relative;
    }
    .video-cropper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

</style>