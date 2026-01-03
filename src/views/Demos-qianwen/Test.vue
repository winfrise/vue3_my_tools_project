<template>
    <el-card>
        <CustomVideoUpload v-model:videoInfo="videoInfo" />
    </el-card>
{{ selectedSegment }}
{{ selectedSegmentId }}
    <el-container>
        <el-main>
            <el-card>
                <div class="video-wrapper">
                    <CustomVideoPlayer ref="videoPlayerRef" 
                        :videoUrl="videoInfo?.url" 
                        @loaded-meta-data="data => videoDisplayInfo = data" 
                    />
                    <CustomVideoCropper class="video-cropper" @update:selection="data =>  Object.assign(selectedSegment!, {...data})" />
                </div>
            </el-card>
            <el-card>
                <CustomTimeLine ref="timeLineRef" 
                    :video-duration="videoInfo?.duration || 0" 
                    v-model:current-time="currentTime"   
                    :segments="segments"
                    v-model:selectedSegmentId="selectedSegmentId"
                />
            </el-card>
            <el-card>
                <CustomVideoTools v-on="toolHandlers" />
            </el-card>
        </el-main>

        <el-aside width="250px">
            <CustomSegementList :segments="segments" :selectedSegmentId="selectedSegmentId" />
        </el-aside>
    </el-container>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { VideoInfo, VideoDisplayInfo, Selection, Segment } from './types/custom'

import CustomVideoUpload from './components-custom/CustomVideoUpload.vue';
import CustomVideoPlayer from './components-custom/CustomVideoPlayer.vue'
import CustomVideoCropper from './components-custom/CustomVideoCropper.vue';
import CustomVideoTools from './components-custom/CustomVideoTools.vue'
import CustomTimeLine from './components-custom/CustomTimeLine.vue';
import CustomSegementList from './components-custom/CustomSegementList.vue';

import { watch } from 'vue'

const videoPlayerRef = ref()
const timeLineRef = ref()
const videoInfo = ref<VideoInfo | null>(null)
const videoDisplayInfo = ref<VideoDisplayInfo>()

const segments = ref<Segment[]>([]) // 视频片断列表
const selectedSegmentId = ref()
const selectedSegment = computed({
    get () {
        return segments.value.find(item=> item.id === selectedSegmentId.value)
    },
    set(data : Selection) {

    }
})

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
        timeLineRef.value.markStartPosition()
        
    },
    setSegmentEndTime: () => {
        timeLineRef.value.markEndPosition()
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