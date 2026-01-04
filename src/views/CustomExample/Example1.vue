<!-- BasicTableDemo.vue -->
<template>
    <h3>示例 1：基础用法（最简）</h3>
    <SimpleTable :data="tableData" :columns="columns" :loading="loading" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SimpleTable } from '@/components/SimpleTable';

const loading = ref(false);

const tableData = ref([
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑' },
]);

const columns = [
    { field: 'name', label: '姓名' },
    { field: 'email', label: '邮箱' },
    { field: 'role', label: '角色' },
];
</script>
