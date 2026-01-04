<!-- src/views/ArticleList.vue -->
<template>
    <div class="article-list-page">
        <SimpleTable
            :data="tableData"
            :columns="columns"
            :pagination="pagination"
            v-model:page-size="pageSize"
            v-model:current-page="currentPage"
            :loading="loading"
            show-action
            @refresh="fetchData"
            :row-key="'id'"
            border
            size="default"
            :stripe="true"
            :reserve-selection="true"
            :reserve-index="true"
            :align="false"
        />
    </div>
</template>

<script setup lang="tsx">
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { SimpleTable } from '@/components/SimpleTable';

// 状态
const loading = ref(false);
const pageSize = ref(10);
const currentPage = ref(1);
const tableData = ref<any[]>([]);
const total = ref(0);

// 分页配置
const pagination = computed(() => ({
    total: total.value,
    pageSizes: [10, 20, 50],
    layout: 'total, sizes, prev, pager, next, jumper',
}));

// 列配置
const columns = [
    {
        type: 'selection',
        width: 50,
        align: 'center',
    },
    {
        type: 'index',
        label: '序号',
        width: 60,
        align: 'center',
    },
    {
        field: 'title',
        label: '标题',
        minWidth: 150,
        align: 'left',
        formatter: (row: any) => {
            return row.title.length > 10
                ? `${row.title.slice(0, 10)}...`
                : row.title;
        },
    },
    {
        field: 'author',
        label: '作者',
        width: 100,
        align: 'center',
    },
    {
        field: 'createdAt',
        label: '创建时间',
        width: 120,
        align: 'center',
    },
    {
        field: 'importance',
        label: '重要性',
        width: 100,
        align: 'center',
    },
    {
        field: 'views',
        label: '阅读数',
        width: 100,
        align: 'center',
    },
    {
        field: 'content',
        label: '内容',
        width: 150,
        align: 'left',
        formatter: (row: any) => {
            return row.content.substring(0, 10) + '...';
        },
    },
    {
        field: 'action',
        label: '操作',
        width: 200,
        align: 'center',
        fixed: 'right',
        slots: {
            default: (row: any) => (
                <div class="action-buttons">
                    <el-button
                        type="primary"
                        size="small"
                        onClick={() => handleEdit(row)}
                    >
                        编辑
                    </el-button>
                    <el-button
                        type="success"
                        size="small"
                        onClick={() => handleDetail(row)}
                    >
                        详情
                    </el-button>
                    <el-button
                        type="danger"
                        size="small"
                        onClick={() => handleDelete(row.id)}
                    >
                        删除
                    </el-button>
                </div>
            ),
        },
    },
];

// 请求函数
async function fetchData() {
    loading.value = true;
    try {
        const res = await axios.get('/mock/articles', {
            params: {
                page: currentPage.value,
                limit: pageSize.value,
            },
        });
        if (res.data.code === 0) {
            tableData.value = res.data.data.list;
            total.value = res.data.data.total;
        }
    } catch (error) {
        console.error('请求失败:', error);
    } finally {
        loading.value = false;
    }
}

// 操作事件
function handleEdit(row: any) {
    alert(`编辑文章: ${row.title}`);
}

function handleDetail(row: any) {
    alert(`查看详情: ${row.title}\n${row.content}`);
}

function handleDelete(id: number) {
    if (confirm('确定删除吗？')) {
        // 这里可以发 DELETE 请求
        alert(`已删除文章 ID: ${id}`);
        fetchData(); // 刷新列表
    }
}

// 初始化
onMounted(() => {
    fetchData();
});

// 监听分页变化
watch([pageSize, currentPage], fetchData);
</script>

<style scoped>
.article-list-page {
    padding: 20px;
}
.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
}
</style>
