<!-- 
  📄 示例列表页（ExamplePage）
  功能：展示表格数据，支持搜索、分页、批量/单条删除、跳转编辑/详情，并通过事件总线实现跨页面刷新。
  技术栈：Vue 3 + TSX + Element Plus + 自定义 Hooks
-->

<script setup lang="tsx">
// 布局容器组件
import { ContentWrap } from '@/components/ContentWrap';
// 搜索表单组件（根据 schema 自动生成）
import { Search } from '@/components/Search';
// Element Plus 标签组件（用于显示重要性）
import { ElTag } from 'element-plus';
// 封装的表格组件
import { Table } from '@/components/Table';
// API 接口：获取列表、删除数据
import { getTableListApi, delTableListApi } from '@/api/table';
// 表格逻辑 Hook（封装分页、加载、删除等）
import { useTable } from '@/hooks/web/useTable';
// 表格数据类型定义
import { TableData } from '@/api/table/types';
// Vue 响应式工具
import { reactive, ref, unref } from 'vue';
// 路由跳转
import { useRouter } from 'vue-router';
// ✅【重点】全局事件总线 Hook：用于监听跨页面事件（如“新增后刷新列表”）
import { useEventBus } from '@/hooks/event/useEventBus';
// CRUD Schema 配置工具：统一管理搜索、表格、表单字段配置
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas';

// 设置组件名称（便于调试和 keep-alive）
defineOptions({
    name: 'ExamplePage',
});

const { push } = useRouter(); // 获取路由跳转方法

// 存储待删除的 ID 列表（用于单删或批量删）
const ids = ref<string[]>([]);

// 搜索参数（传递给 API）
const searchParams = ref<Record<string, any>>({});
// 更新搜索参数并重新加载列表
const setSearchParams = (params: Record<string, any>) => {
    searchParams.value = params;
    getList(); // 触发重新查询
};

// ======================
// 📊 表格逻辑（使用自定义 Hook）
// ======================

const { tableRegister, tableState, tableMethods } = useTable({
    // 定义如何获取列表数据
    fetchDataApi: async () => {
        const { currentPage, pageSize } = tableState;
        const res = await getTableListApi({
            pageIndex: unref(currentPage), // 当前页码
            pageSize: unref(pageSize), // 每页条数
            ...unref(searchParams), // 搜索条件
        });
        return {
            list: res.data.list, // 数据列表
            total: res.data.total, // 总条数
        };
    },
    // 定义如何执行删除操作
    fetchDelApi: async () => {
        const res = await delTableListApi(unref(ids)); // 传入 ID 数组
        return !!res; // 返回布尔值表示是否成功
    },
});

// 解构常用状态
const { loading, dataList, total, currentPage, pageSize } = tableState;
// 解构常用方法
const { getList, getElTableExpose, delList } = tableMethods;

// 页面加载时立即请求第一页数据
getList();

// ======================
// 🔔 全局事件监听（关键！）
// ======================

// ✅ 监听名为 'getList' 的全局事件
//   - 当其他页面（如新增/编辑页）操作完成后，会 emit 此事件
//   - 本页面收到后自动刷新列表，实现“无感更新”
useEventBus({
    name: 'getList',
    callback: (type: string) => {
        // 如果是新增操作完成，则重置到第一页（避免停留在无效页码）
        if (type === 'add') {
            currentPage.value = 1;
        }
        // 无论何种类型，都重新加载数据
        getList();
    },
});

// 定义每个字段在 搜索 / 表格 / 表单 / 详情 中的表现
const crudSchemas = reactive<CrudSchema[]>([
    // 多选列
    {
        field: 'selection',
        search: { hidden: true },
        form: { hidden: true },
        detail: { hidden: true },
        table: { type: 'selection' }, // 表格中显示为多选框
    },
    // 序号列
    {
        field: 'index',
        label: '序号',
        type: 'index',
        search: { hidden: true },
        form: { hidden: true },
        detail: { hidden: true },
    },
    // 标题
    {
        field: 'title',
        label: '标题',
        search: { component: 'Input' }, // 搜索栏显示输入框
        form: {
            component: 'Input',
            colProps: { span: 24 }, // 表单占满一行
        },
        detail: { span: 24 },
    },
    // 作者（仅表格显示）
    {
        field: 'author',
        label: '作者',
        search: { hidden: true },
    },
    // 创建时间（仅表单可编辑）
    {
        field: 'display_time',
        label: '创建时间',
        search: { hidden: true },
        form: {
            component: 'DatePicker',
            componentProps: {
                type: 'datetime',
                valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
        },
    },
    // 重要性（带颜色标签）
    {
        field: 'importance',
        label: '重要性',
        search: { hidden: true },
        form: {
            component: 'Select',
            componentProps: {
                style: { width: '100%' },
                options: [
                    { label: '重要', value: 3 },
                    { label: '良好', value: 2 },
                    { label: '一般', value: 1 },
                ],
            },
        },
        detail: {
            slots: {
                // TSX 渲染自定义内容：根据值显示不同颜色的标签
                default: (data: any) => (
                    <ElTag
                        type={
                            data.importance === 1
                                ? 'success'
                                : data.importance === 2
                                  ? 'warning'
                                  : 'danger'
                        }
                    >
                        {data.importance === 1
                            ? '重要'
                            : data.importance === 2
                              ? '良好'
                              : '一般'}
                    </ElTag>
                ),
            },
        },
    },
    // 阅读数
    {
        field: 'pageviews',
        label: '阅读数',
        search: { hidden: true },
        form: {
            component: 'InputNumber',
            value: 0,
        },
    },
    // 内容（富文本，仅表单和详情显示）
    {
        field: 'content',
        label: '内容',
        search: { hidden: true },
        table: { show: false }, // 表格中不显示
        form: {
            component: 'Editor', // 假设你有富文本编辑器组件
            colProps: { span: 24 },
        },
        detail: {
            span: 24,
            slots: {
                // 渲染 HTML 内容（注意 XSS 风险，生产环境需过滤）
                default: (data: any) => <div innerHTML={data.content}></div>,
            },
        },
    },
    // 操作列
    {
        field: 'action',
        width: '260px',
        label: '操作',
        search: { hidden: true },
        form: { hidden: true },
        detail: { hidden: true },
        table: {
            slots: {
                // TSX 渲染操作按钮
                default: (data: any) => (
                    <>
                        <ElButton
                            type="primary"
                            onClick={() => action(data.row, 'edit')}
                        >
                            编辑
                        </ElButton>
                        <ElButton
                            type="success"
                            onClick={() => action(data.row, 'detail')}
                        >
                            详情
                        </ElButton>
                        <ElButton
                            type="danger"
                            onClick={() => delData(data.row)}
                        >
                            删除
                        </ElButton>
                    </>
                ),
            },
        },
    },
]);

// ======================
// 🛠️ 使用 Schema 生成实际配置
// ======================

// @ts-ignore（因类型推导可能不完善，暂时忽略）
const { allSchemas } = useCrudSchemas(crudSchemas);
// allSchemas 包含：
// - searchSchema: 搜索表单配置
// - tableColumns: 表格列配置
// - formSchema: 表单配置（本页未用）
// - detailSchema: 详情配置（本页未用）

// ======================
// 🚀 页面操作方法
// ======================

// 跳转到新增页面
const AddAction = () => {
    push('/example/example-add');
};

// 删除按钮 loading 状态
const delLoading = ref(false);

// 删除数据（支持单条或批量）
const delData = async (row: TableData | null) => {
    // 获取表格实例（用于获取选中行）
    const elTableExpose = await getElTableExpose();
    // 如果传入了 row，说明是单删；否则是批量删
    ids.value = row
        ? [row.id]
        : elTableExpose?.getSelectionRows().map((v: TableData) => v.id) || [];

    delLoading.value = true;
    // 调用 useTable 提供的 delList 方法（会自动处理 confirm 和 success 提示）
    await delList(unref(ids).length).finally(() => {
        delLoading.value = false;
    });
};

// 跳转到编辑或详情页
const action = (row: TableData, type: string) => {
    push(`/example/example-${type}?id=${row.id}`);
};
</script>

<template>
    <ContentWrap>
        <!-- 搜索区域：根据 allSchemas.searchSchema 自动生成表单 -->
        <Search
            :schema="allSchemas.searchSchema"
            @search="setSearchParams"
            @reset="setSearchParams"
        />

        <!-- 操作按钮区 -->
        <div class="mb-10px">
            <ElButton type="primary" @click="AddAction">添加</ElButton>
            <ElButton
                :loading="delLoading"
                type="danger"
                @click="delData(null)"
            >
                删除
            </ElButton>
        </div>

        <!-- 表格组件 -->
        <Table
            v-model:pageSize="pageSize"
            v-model:currentPage="currentPage"
            :columns="allSchemas.tableColumns"
            :data="dataList"
            :loading="loading"
            :pagination="{ total: total }"
            @register="tableRegister"
        />
    </ContentWrap>
</template>
