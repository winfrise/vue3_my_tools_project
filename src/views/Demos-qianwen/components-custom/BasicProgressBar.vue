<template>
  <div class="progress" @click="handleClick">
    <!-- <div class="percent" :style="{ width: `${displayPercent}%` }"></div> -->

    xxx{{ startMarker }}

    <BasicContextMenu style="background: red;" :style="{ position: 'absolute', top: 0, left: `${displayPercent}%` }">
      <BasicIndicatorLine />

      <!-- #menu 插槽：自定义菜单项 -->
      <template #menu=>
        <el-dropdown-item @click="markStart">
          标记开始时间
        </el-dropdown-item>
        <el-dropdown-item @click="markEnd">
          标记结束时间
        </el-dropdown-item>
      </template>
    </BasicContextMenu>

    <BasicStartMarker v-if="startMarker" :offset-x="startMarker" />

    <BasicSegment v-for="seg in segments" :key="seg.id" :seg="seg" />
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
  percent?: number // 可选，undefined 表示非受控
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:percent', value: number): void
}>()

// 内部状态：仅在非受控模式下使用
const internalPercent = ref<number>(0)

// 计算当前应显示的百分比
const displayPercent = computed(() => {
  if (props.percent !== undefined) {
    // 受控模式：使用父组件传入的值
    return Math.max(0, Math.min(100, props.percent))
  } else {
    // 非受控模式：使用内部状态
    return Math.max(0, Math.min(100, internalPercent.value))
  }
})

// 👇 关键：点击时，根据模式决定如何更新
const handleClick = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0) return

  const clickX = e.clientX - rect.left
  const newPercent = (clickX / rect.width) * 100
  const clamped = Math.max(0, Math.min(100, newPercent))

  if (props.percent !== undefined) {
    // 受控模式：只通知父组件，不改内部状态
    emit('update:percent', clamped)
  } else {
    // 非受控模式：更新内部状态
    internalPercent.value = clamped
    // 同时也 emit，方便父组件监听（可选）
    emit('update:percent', clamped)
  }
}


const startMarker = ref<number| null>(null)
const segments = ref<Segment[]>([])

const markStart  = () => {
  startMarker.value = displayPercent.value
}

const markEnd = () => {
  if (startMarker.value === null) {
    alert('请先标记开始时间！');
    return;
  }


  if (displayPercent.value <= startMarker.value) {
    alert('结束时间必须大于开始时间！');
    return;
  }

  const endMark = displayPercent.value
  const newSegment: Segment = {
    id: `seg-${Date.now()}`,
    offsetX: startMarker.value,
    offsetY: endMark,
  };

  segments.value.push(newSegment)
  startMarker.value = null;
}
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