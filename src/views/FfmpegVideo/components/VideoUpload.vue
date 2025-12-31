<template>
      <el-card>
        <el-upload
          drag
          :auto-upload="true"
          :before-upload="beforeUpload"
        >

          <template v-if="videoUrl">
            <el-icon><Document /></el-icon>
            <div v-if="videoFile">{{ videoFile.name }}</div>
          </template>

          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">拖拽视频到此处，或<em>点击上传</em></div>
          </template>
        </el-upload>
      </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Document } from '@element-plus/icons-vue'

interface Props {
  modelValue: string | ''
}
const props = defineProps<Props>()

const videoUrl = ref<string>('')
const videoFile = ref<File | null>(null)

const emit = defineEmits<{
  'update:modelValue': [value: string | '']
}>()

watch(
  () => props.modelValue,
  (newVal) => {
    videoUrl.value = newVal
  },
  { immediate: true } // 初始化时同步父组件值
)




// 上传处理
const beforeUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/');
  if (!isVideo) {
    ElMessage.error('请上传视频文件！');
  } else {
    videoFile.value = file
    videoUrl.value = URL.createObjectURL(file)
    emit('update:modelValue', videoUrl.value)
  }
  return false
};

</script>