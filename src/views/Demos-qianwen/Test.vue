<template>
    <el-card>
        <CustomVideoUpload v-model:videoInfo="videoInfo" />
    </el-card>

    <el-card>
        <div class="video-wrapper">
            <CustomVideoPlayer ref="videoPlayerRef" 
                :videoUrl="videoInfo?.url" 
                @loaded-meta-data="data => videoDisplayInfo = data" 
            />
            <CustomVideoCropper class="video-cropper" @update:selection="data => selection = data" />
        </div>
    </el-card>
    <el-card>
        <CustomTimeLine ref="timeLineRef" :duration="videoInfo?.duration" v-model:current-time="currentTime" />
    </el-card>
    <el-card>
        <CustomVideoTools v-on="toolHandlers" />
    </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VideoInfo, VideoDisplayInfo, Selection } from './types/custom'

import CustomVideoUpload from './components-custom/CustomVideoUpload.vue';
import CustomVideoPlayer from './components-custom/CustomVideoPlayer.vue'
import CustomVideoCropper from './components-custom/CustomVideoCropper.vue';
import CustomVideoTools from './components-custom/CustomVideoTools.vue'
import CustomTimeLine from './components-custom/CustomTimeLine.vue';

import { watch } from 'vue'

const videoPlayerRef = ref()
const timeLineRef = ref()
const videoInfo = ref<VideoInfo | null>(null)
const videoDisplayInfo = ref<VideoDisplayInfo>()
const selection = ref<Selection | undefined>()

const currentTime = ref<number>(0)
watch(currentTime, () => {
    videoPlayerRef.value.setCurrentTime(currentTime.value)
})


const toolHandlers = {
    play: () => {
        videoPlayerRef.value.play()
    },
    pause: () => {
        videoPlayerRef.value.pause()
    },
    backward: () => {
        videoPlayerRef.value.backward()
    },
    forward: () => {
        videoPlayerRef.value.forward()
    },
    jumpStart: () => {
        videoPlayerRef.value.jumpStart()
    },
    jumpEnd: () => {
        videoPlayerRef.value.jumpEnd()
    },
    prevFrame: () => {
        videoPlayerRef.value.prevFrame()
    },
    nextFrame: () => {
        videoPlayerRef.value.nextFrame()
    },
    setSegmentStartTime: () => {

        
    },
    setSegmentEndTime: () => {

    }
}
</script>

<style lang="scss" scoped>
.video-wrapper {
    position: relative;
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