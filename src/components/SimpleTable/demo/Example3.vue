<!-- FullFeatureTableDemo.vue -->
<template>
    <h3>示例 3：全功能演示（包含所有你要求的功能）</h3>
    <SimpleTable
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        :loading="loading"
        :stripe="true"
        :reserve-selection="true"
        :reserve-index="true"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :cell-class-name="cellClassName"
        :cell-style="cellStyle"
        row-key="id"
        border
        size="default"
        show-action
        @refresh="fetchData"
    />
</template>

<script setup lang="tsx">
import { ref, computed, watch, onMounted } from 'vue';
import type { CSSProperties } from 'vue';

const loading = ref(false);
const pageSize = ref(5);
const currentPage = ref(1);
const total = ref(0);
const tableData = ref<any[]>([]);

const pagination = computed(() => ({
    total: total.value,
    pageSizes: [5, 10, 20],
}));

// ✅ 列配置：包含 align / headerAlign / 自定义渲染
const columns = [
    {
        type: 'selection',
        width: 55,
        align: 'center',
        headerAlign: 'center',
    },
    {
        type: 'index',
        label: '序号',
        width: 70,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'title',
        label: '文章标题',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
        formatter: row => `[${row.category}] ${row.title}`,
    },
    {
        field: 'author',
        label: '作者',
        width: 100,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'views',
        label: '阅读量',
        width: 100,
        align: 'right',
        headerAlign: 'right',
    },
    {
        field: 'status',
        label: '状态',
        width: 100,
        align: 'center',
        headerAlign: 'center',
        slots: {
            default: (row: any) => (
                <el-tag type={row.status === 'published' ? 'success' : 'info'}>
                    {row.status === 'published' ? '已发布' : '草稿'}
                </el-tag>
            ),
        },
    },
    {
        field: 'createdAt',
        label: '创建时间',
        width: 180,
        align: 'center',
        headerAlign: 'center',
    },
];

// ✅ 行类名：禁用状态标灰
const rowClassName = (row: any) => {
    return row.status === 'draft' ? 'row-draft' : '';
};

// ✅ 行样式：高阅读量高亮
const rowStyle = (row: any): CSSProperties => {
    if (row.views > 5000) {
        return { backgroundColor: '#f0f9eb' };
    }
    return {};
};

// ✅ 单元格类名
const cellClassName = (row: any, column: any) => {
    if (column.field === 'views' && row.views > 10000) {
        return 'cell-hot';
    }
    return '';
};

// ✅ 单元格样式
const cellStyle = (row: any, column: any): CSSProperties => {
    if (column.field === 'title') {
        return { fontWeight: '600' };
    }
    if (column.field === 'views' && row.views > 5000) {
        return { color: '#e6a23c', fontWeight: 'bold' };
    }
    return {};
};

// 模拟数据获取
async function fetchData() {
    loading.value = true;
    await new Promise(r => setTimeout(r, 600));
    const allData = Array.from({ length: 47 }, (_, i) => ({
        id: i + 1,
        title: `如何高效使用 Vue 3 和 TSX 第 ${i + 1} 篇`,
        category: i % 3 === 0 ? '前端' : i % 3 === 1 ? '架构' : '工具',
        author: `作者${String.fromCharCode(65 + (i % 26))}`,
        views: Math.floor(Math.random() * 15000),
        status: i % 4 === 0 ? 'draft' : 'published',
        createdAt: new Date(Date.now() - i * 86400000).toLocaleString(),
    }));

    tableData.value = allData.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
    );
    total.value = allData.length;
    loading.value = false;
}

onMounted(() => {
    fetchData();
});

watch([pageSize, currentPage], fetchData);
</script>

<style scoped>
/* 自定义行/单元格样式 */
.row-draft {
    color: #999 !important;
}
.cell-hot {
    animation: pulse 1.5s infinite;
}
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(230, 162, 60, 0.4);
    }
    70% {
        box-shadow: 0 0 0 8px rgba(230, 162, 60, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(230, 162, 60, 0);
    }
}
</style>
