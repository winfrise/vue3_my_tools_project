<template>
  <div
    class="content"
    @click="handleClick"
    @contextmenu="handleContextmenu"
    v-bind="$attrs"
  >
    <slot></slot>
  </div>
  <el-dropdown
    ref="dropdownRef"
    :virtual-ref="triggerRef"
    :show-arrow="false"
    :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
    }"
    virtual-triggering
    trigger="contextmenu"
    placement="bottom-start"
  >
    <template #dropdown>
         <slot name="menu" />
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { DropdownInstance } from 'element-plus'

const dropdownRef = ref<DropdownInstance>()
const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect)

const triggerRef = ref({
  getBoundingClientRect: () => position.value,
})

const handleClick = () => {
  dropdownRef.value?.handleClose()
}

const handleContextmenu = (event: MouseEvent) => {
  const { clientX, clientY } = event
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  })
  event.preventDefault()
  dropdownRef.value?.handleOpen()
}
</script>

<style scoped>
.content {

}
</style>
