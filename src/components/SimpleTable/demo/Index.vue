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

        <DemoBlock
            title="显示溢出工具提示的表格（开发中）"
            :source="tooltipTableCode"
        >
            <template #demo>
                <TooltipTable />
            </template>
        </DemoBlock>

        <DemoBlock title="固定表头" :source="fixedHeaderTableCode">
            <template #demo>
                <FixedHeaderTable />
            </template>
        </DemoBlock>

        <DemoBlock title="固定列" :source="fixedColumnTableCode">
            <template #demo>
                <FixedColumnTable />
            </template>
        </DemoBlock>

        <DemoBlock title="固定列和表头" :source="fixedHeaderAndColumnTableCode">
            <template #demo>
                <FixedHeaderAndColumnTable />
            </template>
        </DemoBlock>

        <DemoBlock title="单选(开发中)" :source="singleSelectTableCode">
            <template #demo>
                <SingleSelectTable />
            </template>
        </DemoBlock>

        <DemoBlock title="多选(开发中)" :source="multiSelectTableCode">
            <template #demo>
                <MultiSelectTable />
            </template>
        </DemoBlock>

        <DemoBlock title="自定义列模板" :source="customColumnTableCode">
            <template #demo>
                <CustomColumnTable />
            </template>
        </DemoBlock>

        <DemoBlock title="自定义索引(开发中)" :source="customIndexTableCode">
            <template #demo>
                <CustomIndexTable />
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

import FixedHeaderTable from './FixedHeaderTable.vue';
import fixedHeaderTableCode from './FixedHeaderTable.vue?raw';

import FixedColumnTable from './FixedColumnTable.vue';
import fixedColumnTableCode from './FixedColumnTable.vue?raw';

import FixedHeaderAndColumnTable from './FixedHeaderAndColumnTable.vue';
import fixedHeaderAndColumnTableCode from './FixedHeaderAndColumnTable.vue?raw';

import SingleSelectTable from './SingleSelectTable.vue';
import singleSelectTableCode from './SingleSelectTable.vue?raw';

import MultiSelectTable from './MultiSelectTable.vue';
import multiSelectTableCode from './MultiSelectTable.vue?raw';

import CustomColumnTable from './CustomColumnTable.vue';
import customColumnTableCode from './CustomColumnTable.vue?raw';

import CustomIndexTable from './CustomIndexTable.vue';
import customIndexTableCode from './CustomIndexTable.vue?raw';
</script>

<style scoped></style>
