<!-- src/components/SegmentList.vue -->
<template>
  <div class="segment-list">
    <h3>待导出的片段：</h3>
    <ul>
      <li v-for="seg in segments" :key="seg.id">
        <span>{{ seg.id }}: {{ formatTime(seg.startTime) }} - {{ formatTime(seg.endTime) }}</span>
        <span>时长: {{ seg.duration.toFixed(3) }}s</span>
        <span>{{ seg.frames }} frames</span>
        <span>{{ seg.size }}</span>
        <button @click="onRemove(seg.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Segment } from '../types/video';

interface Props {
  segments: Segment[];
  onRemove: (id: string) => void;
}

const props = defineProps<Props>();

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.segment-list {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  max-height: 300px;
  overflow-y: auto;
}

.segment-list ul {
  list-style: none;
  padding: 0;
}

.segment-list li {
  padding: 8px;
  border-bottom: 1px dashed #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>