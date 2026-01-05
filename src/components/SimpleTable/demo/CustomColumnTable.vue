<template>
    <simple-table :columns="columns" :data="tableData" style="width: 100%">
    </simple-table>
</template>

<script lang="tsx" setup>
import { Timer } from '@element-plus/icons-vue';
import { SimpleTable } from '@/components/SimpleTable';

interface User {
    date: string;
    name: string;
    address: string;
}

const handleEdit = (index: number, row: User) => {
    console.log(index, row);
};
const handleDelete = (index: number, row: User) => {
    console.log(index, row);
};

const columns = [
    {
        label: 'Date',
        width: 180,
        field: 'date',
        slots: {
            default: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ElIcon>
                        <Timer />
                    </ElIcon>
                    <span style="margin-left: 10px">{row.date}</span>
                </div>
            ),
        },
    },
    {
        label: 'Name',
        width: 180,
        field: 'name',
        slots: {
            default: ({ row }) => (
                <ElPopover
                    effect="light"
                    trigger="hover"
                    placement="top"
                    width="auto"
                >
                    {{
                        default: () => (
                            <div>
                                <div>name: {row.name}</div>
                                <div>address: {row.address}</div>
                            </div>
                        ),
                        reference: () => <ElTag>{row.name}</ElTag>,
                    }}
                </ElPopover>
            ),
        },
    },
    {
        label: 'Operations',
        slots: {
            default: ({ row, index }) => (
                <div>
                    <ElButton
                        size="small"
                        type="primary"
                        onClick={() => handleEdit(index, row)}
                    >
                        编辑
                    </ElButton>
                    <ElButton
                        size="small"
                        type="danger"
                        onClick={() => handleDelete(index, row)}
                    >
                        删除
                    </ElButton>
                </div>
            ),
        },
    },
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
