<template>
    <simple-table :columns="columns" :data="tableData" style="width: 100%">
    </simple-table>
</template>

<script lang="tsx" setup>
import { SimpleTable } from '@/components/SimpleTable';
const handleClick = row => {
    console.log('click');
    console.log(row);
};

const columns = [
    {
        field: 'date',
        label: 'Date',
        width: 150,
        fixed: 'left' as const, // 或 true
    },
    {
        field: 'name',
        label: 'Name',
        width: 120,
    },
    {
        field: 'state',
        label: 'State',
        width: 120,
    },
    {
        field: 'city',
        label: 'City',
        width: 120,
    },
    {
        field: 'address',
        label: 'Address',
        width: 600,
    },
    {
        field: 'zip',
        label: 'Zip',
        width: 120,
    },
    {
        label: '操作',
        minWidth: 120,
        fixed: 'right' as const,
        slots: {
            default: (row: any) => (
                <div>
                    <el-button
                        link
                        type="primary"
                        size="small"
                        onClick={() => handleClick(row)}
                    >
                        Detail
                    </el-button>
                    <el-button link type="primary" size="small">
                        Edit
                    </el-button>
                </div>
            ),
        },
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
