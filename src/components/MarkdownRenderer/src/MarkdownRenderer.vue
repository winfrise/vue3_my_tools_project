<!-- src/components/MarkdownRenderer.vue -->
<template>
    <div class="markdown-renderer" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';

interface Props {
    content?: string;
}
const props = defineProps<Props>();

const renderedHtml = computed(() => {
    if (!props.content) return '';
    try {
        return marked(props.content);
    } catch (error) {
        return '<p style="color: red;">Failed to render Markdown.</p>';
    }
});
</script>

<style scoped>
/* ===== 全局 Markdown 样式（对齐 Element Plus） ===== */
.markdown-renderer {
    font-family:
        'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5715;
    color: #606266;
    word-wrap: break-word;
    background: #fff;
    border-radius: 10px;
    padding: 15px;
}

/* ===== 标题间距优化 ===== */
.markdown-renderer :deep(h1) {
    font-size: 2em;
    margin: 1.8em 0 1em; /* 上边距加大 */
    font-weight: 600;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 0.3em;
}

.markdown-renderer :deep(h2) {
    font-size: 1.5em;
    margin: 1.6em 0 0.8em; /* 上边距加大 */
    font-weight: 600;
    color: #303133;
}

.markdown-renderer :deep(h3) {
    font-size: 1.25em;
    margin: 1.2em 0 0.6em;
    font-weight: 600;
}

/* ===== 代码块美化 ===== */
.markdown-renderer :deep(pre) {
    margin: 1.2em 0 !important;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fafafa;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}

.markdown-renderer :deep(pre code[class^='language-']) {
    display: block;
    padding: 1.2em 1.4em;
    font-family:
        ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas,
        'Liberation Mono', monospace;
    font-size: 0.92em;
    line-height: 1.45;
    background: none !important;
    color: #24292e;
    overflow-x: auto;
    tab-size: 2;
}

/* ===== 语言顶部色带 ===== */
.markdown-renderer :deep(pre code[class^='language-'])::before {
    content: '';
    display: block;
    height: 6px;
    margin: -1.2em -1.4em 1em -1.4em;
    border-radius: 8px 8px 0 0;
    background: linear-gradient(
        to right,
        var(--lang-color),
        var(--lang-color-light)
    );
}

/* 语言配色 */
.markdown-renderer :deep(pre code[class^='language-'])::before {
    --lang-color: #909399;
    --lang-color-light: #b4b8bf;
}

/* ===== 表格样式（表头与表体同背景） ===== */
.markdown-renderer :deep(table) {
    width: 100%;
    margin: 1.2em 0;
    border-collapse: collapse;
    font-size: 14px;
    color: #606266;
    background-color: #fff;
}

.markdown-renderer :deep(th),
.markdown-renderer :deep(td) {
    padding: 12px 0;
    text-align: left;
    border-bottom: 1px solid #ebeef5;
    vertical-align: middle;
}

/* 表头：不再使用浅灰背景，与表体一致 */
.markdown-renderer :deep(th) {
    font-weight: 600;
    color: #909399;
    white-space: nowrap;
    background-color: #fff; /* 关键：与表体相同 */
}

/* 首尾列内边距 */
.markdown-renderer :deep(th:first-child),
.markdown-renderer :deep(td:first-child) {
    padding-left: 16px;
}
.markdown-renderer :deep(th:last-child),
.markdown-renderer :deep(td:last-child) {
    padding-right: 16px;
}

/* 悬停行高亮（仅表体）*/
.markdown-renderer :deep(tbody tr:hover > td) {
    background-color: #f5f7fa;
}
</style>
