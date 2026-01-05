<!-- src/views/TableDemoPage.vue -->
<template>
    <div class="page">
        <MarkdownRenderer :content="readmeRaw" />

        <h1>表格组件示例</h1>
        <div>
            <h3>基础表格​</h3>
            <DemoBlock :source="basicTableCode">
                <template #demo>
                    <BasicTable />
                </template>
            </DemoBlock>
        </div>

        <div>
            <h3>带斑马纹表格</h3>
            <DemoBlock :source="stripedTableCode">
                <template #demo>
                    <StripedTable />
                </template>
            </DemoBlock>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { DemoBlock } from '@/components/DemoBlock';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

import readmeRaw from '../readme.md?raw';

import BasicTable from './BasicTable.vue';
import basicTableCode from './BasicTable.vue?raw';

import StripedTable from './StripedTable.vue';
import stripedTableCode from './StripedTable.vue?raw';
</script>

<style scoped>
.custom-markdown {
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
        sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.custom-markdown :deep(h1) {
    font-size: 2em;
    margin: 0.67em 0;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
}

.custom-markdown :deep(h2) {
    font-size: 1.5em;
    margin: 1em 0 0.5em;
}

.custom-markdown :deep(p) {
    margin: 0.5em 0;
}

.custom-markdown :deep(a) {
    color: #0969da;
    text-decoration: none;
}
.custom-markdown :deep(a:hover) {
    text-decoration: underline;
}

.custom-markdown :deep(ul),
.custom-markdown :deep(ol) {
    padding-left: 2em;
}

.custom-markdown :deep(blockquote) {
    margin: 0;
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
}

.custom-markdown :deep(code) {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 6px;
    font-size: 85%;
}

.custom-markdown :deep(pre) {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
}
.custom-markdown :deep(pre code) {
    background: none;
    padding: 0;
    font-size: 85%;
    line-height: 1.45;
}
</style>
