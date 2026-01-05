<template>
    <simple-table
        :columns="columns"
        :data="tableData"
        style="width: 100%"
        height="250"
    >
    </simple-table>
</template>

<script lang="ts" setup>
import { SimpleTable } from '@/components/SimpleTable';
const columns = [
    {
        field: 'date',
        label: '日期',
        width: 150,
        fixed: true, // 或 'left'
    },
    {
        field: 'name',
        label: '名字',
        width: 120,
    },
    {
        field: 'state',
        label: '状态',
        width: 120,
    },
    {
        field: 'city',
        label: '城市',
        width: 320,
    },
    {
        field: 'address',
        label: '地址',
        width: 600,
    },
    {
        field: 'zip',
        label: '邮政编码',
    },
];
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-08',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-06',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
];
</script>
