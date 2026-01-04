<!-- SimpleTable.vue -->
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { ElTable, ElPagination, ElButton, ElTooltip } from 'element-plus';
import type { TableProps, PaginationProps } from 'element-plus';

// ============ 类型定义 ============
type Recordable = Record<string, any>;

interface TableColumn {
    field: string;
    label: string;
    width?: number | string;
    minWidth?: number | string;
    fixed?: 'left' | 'right' | boolean;
    formatter?: (row: Recordable, column: TableColumn) => any;
    slots?: { default?: (row: Recordable) => any };
    type?: 'selection' | 'index';
}

interface Pagination {
    total: number;
    pageSize?: number;
    currentPage?: number;
    pageSizes?: number[];
    layout?: string;
}

// ============ Props ============
const props = withDefaults(
    defineProps<{
        data: Recordable[];
        columns: TableColumn[];
        loading?: boolean;
        pagination?: Pagination;
        pageSize?: number;
        currentPage?: number;
        showAction?: boolean;
        rowKey?: string;
        height?: number | string;
        maxHeight?: number | string;
        border?: boolean;
        size?: 'small' | 'default' | 'large';
    }>(),
    {
        loading: false,
        pageSize: 10,
        currentPage: 1,
        showAction: false,
        rowKey: 'id',
        border: true,
        size: 'default',
    }
);

// ============ Emit ============
const emit = defineEmits<{
    (e: 'update:pageSize', val: number): void;
    (e: 'update:currentPage', val: number): void;
    (e: 'refresh'): void;
}>();

// ============ Refs ============
const elTableRef = ref<InstanceType<typeof ElTable> | null>(null);

// ============ Computed ============
const innerPageSize = computed({
    get: () => props.pageSize,
    set: val => emit('update:pageSize', val),
});

const innerCurrentPage = computed({
    get: () => props.currentPage,
    set: val => emit('update:currentPage', val),
});

const showPagination = computed(() => !!props.pagination);

// ============ Methods ============
const handleRefresh = () => {
    emit('refresh');
};

// ============ Render ============
</script>

<template>
    <div class="simple-table">
        <!-- 工具栏 -->
        <div v-if="showAction" class="table-toolbar">
            <ElButton size="small" @click="handleRefresh">刷新</ElButton>
        </div>

        <!-- 表格主体 -->
        <ElTable
            ref="elTableRef"
            :data="data"
            :border="border"
            :size="size"
            :height="height"
            :max-height="maxHeight"
            :row-key="rowKey"
            :loading="loading"
            style="width: 100%"
        >
            <!-- 列渲染 -->
            <template v-for="col in columns" :key="col.field">
                <ElTableColumn
                    v-if="col.type === 'selection'"
                    type="selection"
                    :width="col.width || 50"
                />
                <ElTableColumn
                    v-else-if="col.type === 'index'"
                    type="index"
                    :label="col.label"
                    :width="col.width || 60"
                />
                <ElTableColumn
                    v-else
                    :prop="col.field"
                    :label="col.label"
                    :width="col.width"
                    :min-width="col.minWidth"
                    :fixed="col.fixed"
                    :show-overflow-tooltip="true"
                >
                    <template #default="{ row }">
                        <!-- 自定义插槽优先 -->
                        <template v-if="col.slots?.default">
                            <component :is="col.slots.default(row)" />
                        </template>
                        <!-- formatter 优先于默认文本 -->
                        <template v-else-if="col.formatter">
                            {{ col.formatter(row, col) }}
                        </template>
                        <!-- 默认显示字段值 -->
                        <template v-else>
                            {{ row[col.field] }}
                        </template>
                    </template>
                </ElTableColumn>
            </template>
        </ElTable>

        <!-- 分页器 -->
        <ElPagination
            v-if="showPagination"
            v-model:page-size="innerPageSize"
            v-model:current-page="innerCurrentPage"
            :total="pagination?.total ?? 0"
            :page-sizes="pagination?.pageSizes ?? [10, 20, 50, 100]"
            :layout="
                pagination?.layout ?? 'total, sizes, prev, pager, next, jumper'
            "
            class="table-pagination"
            @size-change="val => emit('update:pageSize', val)"
            @current-change="val => emit('update:currentPage', val)"
        />
    </div>
</template>

<style scoped>
.simple-table {
    display: flex;
    flex-direction: column;
}
.table-toolbar {
    margin-bottom: 12px;
}
.table-pagination {
    margin-top: 12px;
    justify-content: flex-end;
}
</style>
