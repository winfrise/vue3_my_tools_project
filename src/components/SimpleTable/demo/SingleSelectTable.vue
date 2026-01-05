<template>
    <simple-table
        ref="singleTableRef"
        :columns="columns"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
    >
        <el-table-column type="index" width="50" />
        <el-table-column property="date" label="Date" width="120" />
        <el-table-column property="name" label="Name" width="120" />
        <el-table-column property="address" label="Address" />
    </simple-table>

    <div style="margin-top: 20px">
        <el-button @click="setCurrent(tableData[1])">选中第二行</el-button>
        <el-button @click="setCurrent()">清除选择</el-button>
    </div>
</template>

<script lang="ts" setup>
import { SimpleTable } from '@/components/SimpleTable';
import { ref } from 'vue';

import type { TableInstance } from 'element-plus';

interface User {
    date: string;
    name: string;
    address: string;
}

const currentRow = ref();
const singleTableRef = ref<TableInstance>();

const setCurrent = ({ row }) => {
    // singleTableRef.value!.elTableRef.setCurrentRow(row);
};
const handleCurrentChange = (val: User | undefined) => {
    currentRow.value = val;
};

const columns = [
    { type: 'index' as const },
    { field: 'name', label: '名字' },
    { field: 'date', label: '日期' },
    { field: 'address', label: '地址' },
];
const tableData: User[] = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
];
</script>
