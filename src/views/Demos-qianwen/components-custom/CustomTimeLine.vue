<template>
  <div class="progress" @click="handleClick">
    <!-- <div class="percent" :style="{ width: `${displayPercent}%` }"></div> -->

    <BasicContextMenu style="background: red;" :style="{ position: 'absolute', top: 0, left: `${innerPercent}%` }">
      <BasicIndicatorLine />

      <!-- #menu 插槽：自定义菜单项 -->
      <template #menu=>
        <el-dropdown-item @click="markStartPosition">
          标记开始时间
        </el-dropdown-item>
        <el-dropdown-item @click="markEndPosition">
          标记结束时间
        </el-dropdown-item>
      </template>
    </BasicContextMenu>

    <BasicStartMarker v-if="startMarker" :offset-x="startMarker / props.videoDuration * 100" />

    <BasicSegment v-for="seg in props.segments" :key="seg.id" :seg="seg" :duration="props.videoDuration" 
      @click.native="emit('update:selectedSegmentId', seg.id)"
    />
  </div>
</template>

<script setup lang="ts">
import BasicSegment from './BasicSegment.vue';
import BasicIndicatorLine from './BasicIndicatorLine.vue';
import BasicContextMenu from './BasicContextMenu.vue'
import BasicStartMarker from './BasicStartMarker.vue'
import { Segment } from '../types/custom'

import { ref, computed } from 'vue'

interface Props {
    videoDuration: number,
    currentTime: number,
    segments: Segment[],
    selectedSegmentId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:currentTime', value: number): void
  (e: 'update:selectedSegmentId', value: string) : void
}>()
    
// 计算当前应显示的百分比
const innerPercent = computed(() => {
    return Math.max(0, Math.min(100, props.currentTime / props.videoDuration * 100))
})

// 👇 关键：点击时，根据模式决定如何更新
const handleClick = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0) return

  const clickX = e.clientX - rect.left
  const newCurrentTime = (clickX / rect.width) * props.videoDuration
  const clamped = Math.max(0, Math.min(100, newCurrentTime))

  emit('update:currentTime', clamped)
}


const startMarker = ref<number| null>(null)

const markStartPosition  = () => {
  startMarker.value = props.currentTime
}

const markEndPosition = () => {
  if (startMarker.value === null) {
    alert('请先标记开始时间！');
    return;
  }


  if (props.currentTime <= startMarker.value) {
    alert('结束时间必须大于开始时间！');
    return;
  }

  const endMark = props.currentTime
  const newSegment: Segment = {
    id: `seg-${Date.now()}`,
    startTime: startMarker.value,
    endTime: endMark,
  };

  props.segments.push(newSegment)
  startMarker.value = null;
}

defineExpose({markStartPosition, markEndPosition})
</script>

<style lang="scss" scoped>
.progress {
    width: 100%;
    height: 30px; 
    background-color: #3f3e3e5b;
    cursor: pointer;
    position: relative;
}
    .percent {
        height: 100%;
        background-color: #969696;
        border-radius: 3px;
        transition: width 0.1s ease;
    }

</style>