<template>
    <div class="timeline-wrapper">
        <BasicProgressBar v-model:percent="percent" />
    </div>

</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import BasicProgressBar from './BasicProgressBar.vue'

    const percent = ref(50)
</script>

<style lang="scss" scoped>
.timeline-wrapper {
    position: relative;
}

</style>