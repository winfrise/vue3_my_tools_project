<template>
  <div class="timeline-wrapper">
    <BasicProgressBar 
      :percent="percent" 
      @update:percent="percent = $event" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BasicProgressBar from './BasicProgressBar.vue'

interface Props {
  duration?: number
  currentTime?: number // 可选 → 控制是否受控
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:currentTime', val: number): void
}>()

// 内部状态（仅非受控时使用）
const innerPercent = ref(0)

// ✅ 核心：一个 computed 同时处理读写、受控判断、百分比转换
const percent = computed({
  get() {
    if (props.duration === undefined || props.currentTime === undefined) {
        return Math.max(0, Math.min(100, innerPercent.value))
    }

    return Math.max(0, Math.min(100, (props.currentTime / props.duration) * 100))
  },
  set(newPercent: number) {
    if (props.duration === undefined || props.currentTime === undefined) {
        innerPercent.value = newPercent
    }

    if (props.duration) {
        const newTime =  props.duration * newPercent / 100
        emit('update:currentTime', newTime)
    }
  }
})
</script>

<style lang="scss" scoped>
.timeline-wrapper {
  position: relative;
}
</style>