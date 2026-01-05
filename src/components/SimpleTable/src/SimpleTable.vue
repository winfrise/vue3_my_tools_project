<!-- SimpleTable.vue -->
<script lang="ts" setup>
import { ref, computed, watch, CSSProperties } from 'vue';
import { ElTable, ElPagination, ElButton, ElTooltip } from 'element-plus';
import type { TableProps, PaginationProps } from 'element-plus';

// ============ 类型定义 ============
type Recordable = Record<string, any>;

interface TableColumn {
    field?: string;
    label?: string;
    width?: number | string;
    minWidth?: number | string;
    fixed?: 'left' | 'right' | boolean;
    formatter?: (row: Recordable, column: TableColumn) => any;
    slots?: { default?: (row: Recordable) => any };
    type?: 'selection' | 'index';
    // ✅ 新增：对齐方式
    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';
}

interface Pagination {
    total: number;
    pageSize?: number;
    currentPage?: number;
    pageSizes?: number[];
    layout?: string;
}

// ============ Props ============
interface Props {
    data: Recordable[];
    columns: TableColumn[];
    loading?: boolean;
    pagination?: Pagination;
    pageSize?: number;
    currentPage?: number;
    rowKey?: string;
    height?: number | string;
    maxHeight?: number | string;
    border?: boolean;
    size?: 'small' | 'default' | 'large';
    // ✅ 新增 props
    stripe?: boolean;
    reserveSelection?: boolean;
    reserveIndex?: boolean;
    rowClassName?: (data: {
        row: Recordable;
        rowIndex: number;
    }) => string | string;
    rowStyle?: (
        row: Recordable,
        rowIndex: number
    ) => CSSProperties | CSSProperties;
    cellClassName?: (
        row: Recordable,
        column: TableColumn,
        rowIndex: number,
        columnIndex: number
    ) => string | string;
    cellStyle?: (
        row: Recordable,
        column: TableColumn,
        rowIndex: number,
        columnIndex: number
    ) => CSSProperties | CSSProperties;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    pageSize: 10,
    currentPage: 1,
    rowKey: 'id',
    border: true,
    size: 'default' as const,
    stripe: false,
    reserveSelection: false,
    reserveIndex: false,
    rowClassName: undefined,
    rowStyle: undefined,
    cellClassName: undefined,
    cellStyle: undefined,
});

// ============ Emit ============
const emit = defineEmits<{
    (e: 'update:pageSize', val: number): void;
    (e: 'update:currentPage', val: number): void;
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

// ✅ 计算起始序号（用于 reserveIndex）
const startIndex = computed(() => {
    return props.reserveIndex && props.pagination
        ? (props.currentPage - 1) * props.pageSize
        : 0;
});

// ============ Methods ============

// ✅ 行类名处理函数
const getRowClassName = ({
    row,
    rowIndex,
}: {
    row: Recordable;
    rowIndex: number;
}) => {
    if (typeof props.rowClassName === 'function') {
        return props.rowClassName({ row, rowIndex });
    }
    return props.rowClassName || '';
};

// ✅ 行样式处理函数
const getRowStyle = ({
    row,
    rowIndex,
}: {
    row: Recordable;
    rowIndex: number;
}) => {
    if (typeof props.rowStyle === 'function') {
        return props.rowStyle(row, rowIndex);
    }
    return props.rowStyle || {};
};

// ✅ 单元格类名处理函数
const getCellClassName = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: {
    row: Recordable;
    column: any;
    rowIndex: number;
    columnIndex: number;
}) => {
    const colDef = props.columns.find(c => c.field === column.property);
    if (!colDef) return '';

    if (typeof props.cellClassName === 'function') {
        return props.cellClassName(row, colDef, rowIndex, columnIndex);
    }
    return props.cellClassName || '';
};

// ✅ 单元格样式处理函数
const getCellStyle = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: {
    row: Recordable;
    column: any;
    rowIndex: number;
    columnIndex: number;
}) => {
    const colDef = props.columns.find(c => c.field === column.property);
    if (!colDef) return {};

    if (typeof props.cellStyle === 'function') {
        return props.cellStyle(row, colDef, rowIndex, columnIndex);
    }
    return props.cellStyle || {};
};

defineExpose({
    elTableRef, // 原生 ElTable 实例
});
</script>

<template>
    <div class="simple-table">
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
            :stripe="stripe"
            :reserve-selection="reserveSelection"
            :row-class-name="getRowClassName"
            :row-style="getRowStyle"
            :cell-class-name="getCellClassName"
            :cell-style="getCellStyle"
            style="width: 100%"
        >
            <!-- 列渲染 -->
            <template v-for="col in columns" :key="col.field || col.type">
                <ElTableColumn
                    v-if="col.type === 'selection'"
                    type="selection"
                    :width="col.width || 50"
                    :align="col.align || 'center'"
                    :header-align="col.headerAlign || col.align || 'center'"
                />
                <ElTableColumn
                    v-else-if="col.type === 'index'"
                    type="index"
                    :label="col.label"
                    :width="col.width || 60"
                    :align="col.align || 'center'"
                    :header-align="col.headerAlign || col.align || 'center'"
                >
                    <template #default="{ $index }">
                        {{ startIndex + $index + 1 }}
                    </template>
                </ElTableColumn>
                <ElTableColumn
                    v-else
                    :prop="col.field"
                    :label="col.label"
                    :width="col.width"
                    :min-width="col.minWidth"
                    :fixed="col.fixed"
                    :align="col.align || 'left'"
                    :header-align="col.headerAlign || col.align || 'left'"
                    :show-overflow-tooltip="true"
                >
                    <template #default="scope">
                        <!-- 自定义插槽优先 -->
                        <template v-if="col.slots?.default">
                            <component :is="col.slots.default(scope)" />
                        </template>
                        <!-- formatter 优先于默认文本 -->
                        <template v-else-if="col.formatter">
                            {{ col.formatter(scope.row, col) }}
                        </template>
                        <!-- 默认显示字段值 -->
                        <template v-else-if="col.field">
                            {{ scope.row[col.field] }}
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
.table-pagination {
    margin-top: 12px;
    justify-content: flex-end;
}
</style>
