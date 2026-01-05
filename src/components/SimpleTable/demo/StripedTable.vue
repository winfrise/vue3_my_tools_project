<template>
    <simple-table
        :data="tableData"
        :columns="columns"
        stripe
        style="width: 100%"
    >
    </simple-table>
</template>

<script lang="ts" setup>
import { SimpleTable } from '@/components/SimpleTable';
const columns = [
    { field: 'date', label: '日期' },
    { field: 'name', label: '名称' },
    { field: 'address', label: '地址' },
];
const tableData = [
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
