<template>
    <SimpleTable :columns="columns" :data="tableData" style="width: 100%">
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </SimpleTable>
</template>

<script lang="ts" setup>
import { SimpleTable } from '@/components/SimpleTable';
const indexMethod = (index: number) => {
    return index * 2;
};

const columns = [
    {
        type: 'index' as const,
    },
    {
        label: 'Date',
        field: 'date',
        width: 140,
    },
    {
        label: 'Name',
        field: 'name',
        width: 120,
    },
    {
        label: 'State',
        field: 'state',
        width: 120,
    },
    {
        label: 'City',
        field: 'city',
        width: 130,
    },
    {
        label: 'Address',
        field: 'address',
        minWidth: 200,
    },
    {
        label: 'ZIP Code',
        field: 'zip',
        width: 120,
    },
    {
        label: 'Tag',
        field: 'tag',
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
        tag: 'Home',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
];
</script>
