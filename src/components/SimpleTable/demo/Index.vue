<!-- src/views/TableDemoPage.vue -->
<template>
    <div class="page">
        <MarkdownRenderer :content="readmeRaw" />

        <h1>表格组件示例</h1>

        <DemoBlock title="基础表格​" :source="basicTableCode">
            <template #demo>
                <BasicTable />
            </template>
        </DemoBlock>

        <DemoBlock title="带斑马纹表格" :source="stripedTableCode">
            <template #demo>
                <StripedTable />
            </template>
        </DemoBlock>

        <DemoBlock title="无边框表格" :source="borderedTableCode">
            <template #demo>
                <BorderedTable />
            </template>
        </DemoBlock>

        <DemoBlock title="带状态表格" :source="statusTableCode">
            <template #demo>
                <StatusTable />
            </template>
        </DemoBlock>

        <DemoBlock title="显示溢出工具提示的表格" :source="tooltipTableCode">
            <template #demo>
                <TooltipTable />
            </template>
        </DemoBlock>
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

import BorderedTable from './BorderedTable.vue';
import borderedTableCode from './BorderedTable.vue?raw';

import StatusTable from './StatusTable.vue';
import statusTableCode from './StatusTable.vue?raw';

import TooltipTable from './TooltipTable.vue';
import tooltipTableCode from './TooltipTable.vue?raw';
</script>

<style scoped></style>
