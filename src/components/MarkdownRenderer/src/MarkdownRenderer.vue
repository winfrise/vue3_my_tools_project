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
/* 基础 Markdown 样式（无代码高亮专用） */
.markdown-renderer {
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
        sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    word-wrap: break-word;
}

.markdown-renderer :deep(h1) {
    font-size: 2em;
    margin: 0.67em 0;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
}
.markdown-renderer :deep(h2) {
    font-size: 1.5em;
    margin: 1em 0 0.5em;
}
.markdown-renderer :deep(h3) {
    font-size: 1.25em;
    margin: 1em 0 0.5em;
}

.markdown-renderer :deep(p) {
    margin: 0.8em 0;
}

.markdown-renderer :deep(a) {
    color: #0969da;
    text-decoration: none;
}
.markdown-renderer :deep(a:hover) {
    text-decoration: underline;
}

.markdown-renderer :deep(ul),
.markdown-renderer :deep(ol) {
    padding-left: 2em;
    margin: 0.8em 0;
}

.markdown-renderer :deep(blockquote) {
    margin: 1em 0;
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
}

/* 简化代码样式（无高亮） */
.markdown-renderer :deep(code) {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 85%;
    font-family: monospace;
}

.markdown-renderer :deep(pre) {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 12px;
    overflow: auto;
    margin: 1em 0;
}
.markdown-renderer :deep(pre code) {
    background: none !important;
    padding: 0 !important;
    font-size: 85%;
    line-height: 1.4;
    color: inherit;
    display: block;
}

/* 表格 */
.markdown-renderer :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
}
.markdown-renderer :deep(th),
.markdown-renderer :deep(td) {
    padding: 6px 13px;
    border: 1px solid #d0d7de;
}
.markdown-renderer :deep(th) {
    background-color: #f6f8fa;
}
</style>
