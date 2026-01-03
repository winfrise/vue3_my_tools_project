<template>
  <cropper-canvas
      ref="cropperCanvasRef"
      :disabled="false"
      :scaleStep="0.1"
      themeColor="#3399ff"
  >
    <!-- 遮罩效果 -->
    <cropper-shade theme-color="rgba(0, 0, 0, 0.5)" />
    <!-- 新建选区 -->
    <cropper-handle action="select" theme-color="rgba(51, 153, 255, 0.5)" :plain="true" />

    <cropper-selection ref="cropperSelectionRef" outlined
        :initial-aspect-ratio="4/3"
        :movable="true"
        :resizable="true"
        :precise="true"
        @change="handleCropperSelectionChange"
    >
      <!-- 网格 -->
      <cropper-grid :rows="3" :columns="3" :bordered="true" :covered="true" themeColor="rgba(0, 0, 0, 0.5)" />

      <!-- 十字准线 -->
      <cropper-crosshair :centered="true" themeColor="rgba(0, 0, 0, 0.5)" />
        <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0)" />
        <cropper-handle action="n-resize" theme-color="#3399ff" />
        <cropper-handle action="e-resize" theme-color="#3399ff" />
        <cropper-handle action="s-resize" theme-color="#3399ff" />
        <cropper-handle action="w-resize" theme-color="#3399ff" />
        <cropper-handle action="ne-resize" theme-color="#3399ff" />
        <cropper-handle action="nw-resize" theme-color="#3399ff" />
        <cropper-handle action="se-resize" theme-color="#3399ff" />
        <cropper-handle action="sw-resize" theme-color="#3399ff" />
      
    </cropper-selection>
  </cropper-canvas>
</template>


<script setup lang="ts">
    import { ref, unref, reactive, computed } from 'vue'
    import { CropperCanvas, CropperSelection, CropperCrosshair, CropperGrid, CropperHandle, CropperShade  } from 'cropperjs';
    import { Selection, SelectionOptions } from '../types/custom'



    interface Props {

    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'update:selection', data: Selection):void
    }>()


    const selection = ref<Selection>()

    const handleCropperSelectionChange = (e: CustomEvent) => {
        console.log(e)
        // const cropperCanvas = cropperCanvasRef.value as CropperCanvas;

        //     if (!cropperCanvas) {
        //         return;
        //     }

        //     const selection = event.detail as Selection;
        //     const { maxSelection } = props
        //     if (maxSelection) {
        //         if (!checkInSelection(selection, maxSelection)) {
        //             event.preventDefault();
        //         }
        //     }
        //     selectionData.value = event.detail;
        //     console.log(event)
        //     emit('selectionChange', unref(selectionData))
        selection.value = e.detail
        emit('update:selection', selection.value!)
    }
</script>