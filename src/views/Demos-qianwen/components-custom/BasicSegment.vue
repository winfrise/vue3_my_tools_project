<template>
    <div class="segment"
        :style="{
            left: `${offsetX}%`,
            width: `${offsetWidth}%`
        }"
    ></div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { Segment } from '../types/custom';
    interface Props {
        duration: number,
        seg: Segment,
    }

    const props = defineProps<Props>()

    const offsetX = computed(() => {
        return props.seg.startTime / props.duration * 100
    })

    const offsetWidth = computed(() => {
        return (props.seg.endTime - props.seg.startTime) / props.duration * 100
    })

</script>

<style lang="scss" scoped>
.segment {
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 4px;
  box-sizing: border-box;
  background-color: rgba(59, 130, 246, 0.2);
  border: 1px solid #3b82f6;
  border-radius: 2px;
  font-size: 10px;
  color: white;
  z-index: 2;
  cursor: pointer;

  &:hover,
  &.selected {
    background-color: rgba(59, 130, 246, 0.4);
    border-color: #1d4ed8;
  }
}

</style>