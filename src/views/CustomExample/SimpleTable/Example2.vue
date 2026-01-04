<!-- PaginatedTableDemo.vue -->
<template>
    <h3>示例 2：带分页 + 操作列</h3>
    <SimpleTable
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        :loading="loading"
        show-action
        @refresh="fetchData"
    />
</template>

<script setup lang="tsx">
import { ref, onMounted, computed, watch } from 'vue';

const loading = ref(false);
const pageSize = ref(5);
const currentPage = ref(1);
const total = ref(0);
const tableData = ref<any[]>([]);

const pagination = computed(() => ({
    total: total.value,
    pageSizes: [5, 10, 20],
}));

const columns = [
    { field: 'id', label: 'ID', width: 80, align: 'center' },
    { field: 'username', label: '用户名' },
    { field: 'status', label: '状态', align: 'center' },
    {
        field: 'action',
        label: '操作',
        width: 120,
        align: 'center',
        slots: {
            default: (row: any) => (
                <el-button type="text" onClick={() => handleEdit(row)}>
                    编辑
                </el-button>
            ),
        },
    },
];

function handleEdit(row: any) {
    console.log('编辑:', row);
}

async function fetchData() {
    loading.value = true;
    // 模拟 API
    await new Promise(r => setTimeout(r, 500));
    const mockData = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        status: i % 2 === 0 ? '启用' : '禁用',
    }));
    tableData.value = mockData.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
    );
    total.value = mockData.length;
    loading.value = false;
}

onMounted(() => {
    fetchData();
});

// 监听分页变化
watch([pageSize, currentPage], fetchData);
</script>
