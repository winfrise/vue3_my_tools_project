<template>
  <div class="timeline-container">
    <!-- 时间轴 -->
    <div ref="timelineRef" class="timeline"
      @click="jumpToTime"
    >
      <div class="track">
        <!-- 播放进度 -->
        <div class="progress"
          :style="{ width: `${(currentTime / totalDuration) * 100}%` }"
        ></div>

        <!-- 点击跳转指示线 -->
        <div
          v-if="currentTime !== null"
          class="click-indicator"
          :style="{ left: getPercent(currentTime) }"
        >
          <div class="triangle-up"></div>
          <div class="triangle-down"></div>
        </div>

        <!-- 入点标记 -->
        <div
          v-if="tempStart !== null"
          class="in-point-marker"
          :style="{ left: getPercent(tempStart) }"
        ></div>

        <!-- 已保存片段 -->
        <div
          v-for="seg in segments"
          :key="seg.id"
          class="segment"
          :class="{ 'selected': seg.id === selectedSegmentId }"
          :style="{ left: getPercent(seg.startTime), width: `${(seg.duration / totalDuration) * 100}%` }"
          @click.stop="selectedSegmentId = seg.id"
        >
          <span class="label">{{ formatTime(seg.startTime) }} - {{ formatTime(seg.endTime) }}</span>
          <button class="remove-btn" @click.stop="removeSegment(seg.id)">×</button>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 选中片段信息 -->
      <div class="selected-info">
        <span v-if="selectedSegment">
          选中: {{ selectedSegment.id }} | {{ formatTime(selectedSegment.startTime) }} → {{ formatTime(selectedSegment.endTime) }}
          <button class="btn btn-clear" @click="selectedSegmentId = null">清除选中</button>
        </span>
        <span v-else>未选中任何片段</span>
      </div>

      <!-- 时间轴控制按钮 -->
      <div class="controls">
        <button class="btn btn-small" @click="goToStart" title="回到最开始">⏮️</button>
        <button class="btn btn-small" @click="goBackFrame">⏪前一帧</button>
        <button class="btn btn-play" @click="togglePlayPause" :title="isPlaying ? '暂停' : '播放'">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button class="btn btn-small" @click="goForwardFrame">后一帧⏩</button>
        <button class="btn btn-small" @click="goToEnd" title="回到最末尾">⏭️</button>

        <div class="divider"></div>

        <button
          class="btn btn-small"
          :disabled="!selectedSegment"
          @click="goToSegmentStart"
          title="跳转到选中片段开始"
        >
          📍开始
        </button>
        <button
          class="btn btn-small"
          :disabled="!selectedSegment"
          @click="goToSegmentEnd"
          title="跳转到选中片段结束"
        >
          📍结束
        </button>
      </div>

      <!-- 标记工具 -->
      <div class="marking-tools">
        <div class="temp-info">
          <span v-if="tempStart !== null">
            🟢 开始时间: {{ formatTime(tempStart) }}
          </span>
          <span v-else>⏳ 请点击“标记开始时间”</span>
        </div>
        <div class="buttons">
          <button
            class="btn btn-start"
            :disabled="currentTime < 0 || currentTime > totalDuration"
            @click="setStartTime"
          >
            标记开始时间
          </button>
          <button
            class="btn btn-end"
            :disabled="tempStart === null || currentTime <= (tempStart || 0)"
            @click="setEndTime"
          >
            标记结束时间
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Segment, VideoInfo } from '../types/video';

interface Props {
  videoInfo: VideoInfo | null;
  segments: Segment[];
  currentTime: number;
  onSegmentChange: (segments: Segment[]) => void;
  onCurrentTimeChange: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

const props = defineProps<Props>();

const timelineRef = ref<HTMLDivElement | null>(null);
const tempStart = ref<number | null>(null); // 入点
const clickPosition = ref<number | null>(null); // 点击跳转位置
const selectedSegmentId = ref<string | null>(null); // 当前选中片段 ID

const totalDuration = computed(() => props.videoInfo?.duration || 0);

const selectedSegment = computed(() => {
  if (!selectedSegmentId.value) return null;
  return props.segments.find(s => s.id === selectedSegmentId.value);
});

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 点击时间轴：跳转 + 显示指示线
const jumpToTime = (e: MouseEvent) => {
  const rect = timelineRef.value?.getBoundingClientRect();
  if (!rect || totalDuration.value <= 0) return;

  // 暂停播放
  if (props.isPlaying) {
    props.onPause();
  }

  const x = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, x / rect.width));
  const targetTime = percent * totalDuration.value;

  props.onCurrentTimeChange(targetTime);
  clickPosition.value = targetTime;
};

const setStartTime = () => {
  if (props.currentTime >= 0 && props.currentTime <= totalDuration.value) {
    tempStart.value = props.currentTime;
  }
};

const setEndTime = () => {
  if (tempStart.value === null) {
    alert('请先标记开始时间！');
    return;
  }

  const end = props.currentTime;
  if (end <= tempStart.value) {
    alert('结束时间必须大于开始时间！');
    return;
  }

  const newSegment: Segment = {
    id: `seg-${Date.now()}`,
    startTime: tempStart.value,
    endTime: end,
    duration: end - tempStart.value,
    frames: Math.round((end - tempStart.value) * 30),
    size: '~' + ((end - tempStart.value) * 100).toFixed(0) + 'KB'
  };

  const updatedSegments = [...props.segments, newSegment];
  props.onSegmentChange(updatedSegments);
  tempStart.value = null;
};

const removeSegment = (id: string) => {
  const filtered = props.segments.filter(seg => seg.id !== id);
  props.onSegmentChange(filtered);
  if (selectedSegmentId.value === id) selectedSegmentId.value = null;
};

const getPercent = (time: number): string => {
  if (totalDuration.value <= 0) return '0%';
  return `${Math.max(0, Math.min(100, (time / totalDuration.value) * 100))}%`;
};

// 新增：控制函数
const goToStart = () => props.onCurrentTimeChange(0);
const goToEnd = () => props.onCurrentTimeChange(totalDuration.value);
const goToSegmentStart = () => {
  if (selectedSegment.value) {
    props.onCurrentTimeChange(selectedSegment.value.startTime);
  }
};
const goToSegmentEnd = () => {
  if (selectedSegment.value) {
    props.onCurrentTimeChange(selectedSegment.value.endTime);
  }
};
const togglePlayPause = () => {
  if (props.isPlaying) {
    props.onPause();
  } else {
    props.onPlay();
  }
};
const goBackFrame = () => {
  // 假设 30fps
  const frameDuration = 1 / 30;
  const newTime = Math.max(0, props.currentTime - frameDuration);
  props.onCurrentTimeChange(newTime);
};
const goForwardFrame = () => {
  // 假设 30fps
  const frameDuration = 1 / 30;
  const newTime = Math.min(totalDuration.value, props.currentTime + frameDuration);
  props.onCurrentTimeChange(newTime);
};
</script>

<style lang="scss" scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: visible;
}

.timeline {
  height: 60px;
  background-color: #1f2937;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  overflow: visible;
}

.track {
  position: relative;
  height: 100%;
  width: 100%;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background-color: #3b82f6;
  z-index: 1;
}

.click-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #9ca3af;
  z-index: 5;

  .triangle-up,
  .triangle-down {
    position: absolute;
    left: 50%;
    width: 0;
    height: 0;
    transform: translate(-50%, 0);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }

  .triangle-up {
    top: -0;
    border-top: 8px solid #9ca3af;
  }

  .triangle-down {
    bottom: -0;
    border-bottom: 8px solid #9ca3af;
  }

}



.in-point-marker {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #4ade80;
  z-index: 6;
}

.in-point-marker::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 10px;
  height: 2px;
  background-color: #4ade80;
}

.segment {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: rgba(59, 130, 246, 0.2);
  border: 1px solid #3b82f6;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  padding: 0 4px;
  box-sizing: border-box;
  z-index: 2;
  cursor: pointer;
}

.segment:hover,
.segment.selected {
  background-color: rgba(59, 130, 246, 0.4);
  border-color: #1d4ed8;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 工具栏样式 */
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.selected-info {
  font-size: 12px;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-clear {
  margin-left: 8px;
  padding: 2px 6px;
  font-size: 10px;
  background: #d1d5db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.divider {
  height: 24px;
  width: 1px;
  background-color: #d1d5db;
}

.btn {
  padding: 4px 8px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.btn-play {
  width: 40px;
  height: 32px;
  font-size: 16px;
  background-color: #10b981;
  color: white;
}

.marking-tools {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.temp-info {
  font-size: 12px;
  color: #4b5563;
}

.marking-tools .buttons {
  display: flex;
  gap: 8px;
}

.btn-start {
  background-color: #10b981;
  color: white;
}

.btn-end {
  background-color: #8b5cf6;
  color: white;
}
</style>