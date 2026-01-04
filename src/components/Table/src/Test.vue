<!-- src/components/Table/index.vue -->
<template>
    <div v-loading="mergedProps.loading">
        <!-- 自定义卡片模式 -->
        <div v-if="mergedProps.customContent" class="flex flex-wrap">
            <template v-if="mergedProps.data?.length">
                <ElCard
                    v-for="(item, index) in mergedProps.data"
                    :key="`${get(item, mergedProps.rowKey) ?? index}`"
                    shadow="hover"
                    :class="mergedProps.cardWrapClass"
                    :style="mergedProps.cardWrapStyle"
                    :body-class="mergedProps.cardBodyClass"
                    :body-style="mergedProps.cardBodyStyle"
                >
                    <template #header v-if="$slots['content-header']">
                        <slot name="content-header" :item="item" />
                    </template>
                    <slot name="content" :item="item" />
                    <template #footer v-if="$slots['content-footer']">
                        <slot name="content-footer" :item="item" />
                    </template>
                </ElCard>
            </template>
            <div v-else class="flex flex-1 justify-center">
                <ElEmpty description="暂无数据" />
            </div>
        </div>

        <!-- 标准表格模式 -->
        <template v-else>
            <!-- 顶部工具栏 -->
            <TableActions
                v-if="mergedProps.showAction"
                :columns="mergedProps.columns"
                @chang-size="handleChangeSize"
                @refresh="handleRefresh"
                @confirm="handleConfirmSetColumn"
            />

            <!-- 表格主体 -->
            <ElTable
                ref="elTableRef"
                :data="mergedProps.data"
                v-bind="tableBindProps"
            >
                <!-- 动态生成列 -->
                <template
                    v-for="col in mergedProps.columns"
                    :key="col.field || col.type"
                >
                    <ElTableColumn
                        v-if="!col.hidden"
                        v-bind="getColumnProps(col)"
                        :show-overflow-tooltip="
                            col.showOverflowTooltip ??
                            mergedProps.showOverflowTooltip
                        "
                        :align="col.align || mergedProps.align"
                        :header-align="
                            col.headerAlign || mergedProps.headerAlign
                        "
                        :prop="col.field"
                    >
                        <!-- 默认插槽：内容渲染 -->
                        <template #default="scope">
                            <component
                                :is="renderCellContent(col, scope)"
                                v-if="renderCellContent(col, scope) !== null"
                            />
                        </template>

                        <!-- 表头插槽（如有） -->
                        <template v-if="col.slots?.header" #header="scope">
                            <component :is="col.slots.header(scope)" />
                        </template>
                    </ElTableColumn>
                </template>

                <!-- 用户插槽透传 -->
                <template #empty>
                    <slot name="empty" />
                </template>
                <template #append>
                    <slot name="append" />
                </template>
            </ElTable>

            <!-- 分页器 -->
            <ElPagination
                v-if="mergedProps.pagination !== undefined"
                v-model:page-size="pageSizeRef"
                v-model:current-page="currentPageRef"
                class="mt-10px"
                v-bind="paginationConfig"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
// ======================
// 引入依赖
// ======================
import {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElImage,
    ElEmpty,
    ElCard,
} from 'element-plus';
import { computed, ref, watch, onMounted, unref } from 'vue';
import { get, set } from 'lodash-es';

// ======================
// 类型与工具
// ======================
import type {
    TableProps,
    TableColumn,
    Pagination,
    TableSetProps,
} from './types';
import { propTypes } from '@/utils/propTypes';
import { setIndex } from './helper';
import { createVideoViewer } from '@/components/VideoPlayer';
import { Icon } from '@/components/Icon';
import { BaseButton } from '@/components/Button';
import TableActions from './components/TableActions.vue';
import type { PropType } from 'vue';
import type { ComponentSize, ElTooltipProps } from 'element-plus';
import { CSSProperties } from 'vue';

// ======================
// Props & Emits
// ======================
const props = defineProps({
    // --- 分页 ---
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),

    // --- 显示控制 ---
    showAction: propTypes.bool.def(false),
    showOverflowTooltip: propTypes.bool.def(true),
    loading: propTypes.bool.def(false),
    stripe: propTypes.bool.def(false),
    border: propTypes.bool.def(true),
    showHeader: propTypes.bool.def(true),
    highlightCurrentRow: propTypes.bool.def(false),
    emptyText: propTypes.string.def('No Data'),
    showSummary: propTypes.bool.def(false),
    sumText: propTypes.string.def('Sum'),
    scrollbarAlwaysOn: propTypes.bool.def(false),
    flexible: propTypes.bool.def(false),
    customContent: propTypes.bool.def(false),

    // --- 列与数据 ---
    columns: {
        type: Array as PropType<TableColumn[]>,
        default: () => [],
    },
    data: {
        type: Array as PropType<Recordable[]>,
        default: () => [],
    },
    imagePreview: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
    videoPreview: {
        type: Array as PropType<string[]>,
        default: () => [],
    },

    // --- 行/单元格样式 ---
    align: propTypes.string
        .validate((v: string) => ['left', 'center', 'right'].includes(v))
        .def('left'),
    headerAlign: propTypes.string
        .validate((v: string) => ['left', 'center', 'right'].includes(v))
        .def('left'),
    rowClassName: {
        type: [Function, String] as PropType<
            ((row: Recordable, rowIndex: number) => string) | string
        >,
        default: '',
    },
    rowStyle: {
        type: [Function, Object],
        default: undefined,
    },
    cellClassName: {
        type: [Function, String],
        default: '',
    },
    cellStyle: {
        type: [Function, Object],
        default: undefined,
    },
    headerRowClassName: {
        type: [Function, String],
        default: '',
    },
    headerRowStyle: {
        type: [Function, Object],
        default: undefined,
    },
    headerCellClassName: {
        type: [Function, String],
        default: '',
    },
    headerCellStyle: {
        type: [Function, Object],
        default: undefined,
    },

    // --- 选择与索引 ---
    reserveSelection: propTypes.bool.def(false),
    reserveIndex: propTypes.bool.def(false),
    rowKey: propTypes.string.def('id'),
    currentRowKey: propTypes.oneOfType([Number, String]),

    // --- 分页配置 ---
    pagination: {
        type: Object as PropType<Pagination>,
        default: undefined,
    },

    // --- 尺寸与布局 ---
    height: propTypes.oneOfType([Number, String]),
    maxHeight: propTypes.oneOfType([Number, String]),
    size: {
        type: String as PropType<ComponentSize>,
        validator: (v: ComponentSize) =>
            ['default', 'small', 'large'].includes(v),
    },
    fit: propTypes.bool.def(true),
    tableLayout: {
        type: String as PropType<'auto' | 'fixed'>,
        default: 'fixed',
    },

    // --- 树形表 ---
    defaultExpandAll: propTypes.bool.def(false),
    expandRowKeys: {
        type: Array as PropType<string[]>,
        default: undefined,
    },
    defaultSort: {
        type: Object as PropType<{ prop: string; order: string }>,
        default: () => ({}),
    },
    indent: propTypes.number.def(16),
    lazy: propTypes.bool.def(false),
    load: {
        type: Function as PropType<
            (row: Recordable, treeNode: any, resolve: Function) => void
        >,
        default: undefined,
    },
    treeProps: {
        type: Object as PropType<{
            hasChildren?: string;
            children?: string;
            label?: string;
        }>,
        default: () => ({
            hasChildren: 'hasChildren',
            children: 'children',
            label: 'label',
        }),
    },

    // --- Tooltip ---
    tooltipEffect: {
        type: String as PropType<'dark' | 'light'>,
        default: 'dark',
    },
    tooltipOptions: {
        type: Object as PropType<
            Pick<
                ElTooltipProps,
                | 'effect'
                | 'enterable'
                | 'hideAfter'
                | 'offset'
                | 'placement'
                | 'popperClass'
                | 'popperOptions'
                | 'showAfter'
                | 'showArrow'
            >
        >,
        default: () => ({
            enterable: true,
            placement: 'top',
            showArrow: true,
            hideAfter: 200,
            popperOptions: { strategy: 'fixed' },
        }),
    },

    // --- 合计与合并 ---
    summaryMethod: {
        type: Function as PropType<
            (param: { columns: any[]; data: any[] }) => any[]
        >,
        default: undefined,
    },
    spanMethod: {
        type: Function as PropType<
            (param: {
                row: any;
                column: any;
                rowIndex: number;
                columnIndex: number;
            }) => any[]
        >,
        default: undefined,
    },
    selectOnIndeterminate: propTypes.bool.def(true),

    // --- 卡片模式样式 ---
    cardBodyStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({}),
    },
    cardBodyClass: {
        type: String,
        default: '',
    },
    cardWrapStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({}),
    },
    cardWrapClass: {
        type: String,
        default: '',
    },
});

const emit = defineEmits<{
    (e: 'update:pageSize', value: number): void;
    (e: 'update:currentPage', value: number): void;
    (e: 'register', wrapper: any, tableRef: typeof elTableRef): void;
    (e: 'refresh'): void;
}>();

// ======================
// Refs & State
// ======================
const elTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const outsideProps = ref<Partial<TableProps>>({});
const pageSizeRef = ref(props.pageSize);
const currentPageRef = ref(props.currentPage);

// 合并 props（原始 + 动态）
const mergedProps = computed(() => {
    return { ...props, ...outsideProps.value };
});

// 分页配置
const paginationConfig = computed(() => {
    return {
        small: false,
        background: false,
        pagerCount: 7,
        layout: 'sizes, prev, pager, next, jumper, ->, total',
        pageSizes: [10, 20, 30, 40, 50, 100],
        disabled: false,
        hideOnSinglePage: false,
        total: 10, // ⚠️ 实际应由用户通过 pagination.total 传入
        ...mergedProps.value.pagination,
    };
});

// 传递给 ElTable 的属性（排除特殊字段）
const tableBindProps = computed(() => {
    const {
        columns,
        data,
        align,
        imagePreview,
        videoPreview,
        cardBodyStyle,
        cardBodyClass,
        cardWrapStyle,
        cardWrapClass,
        customContent,
        ...rest
    } = mergedProps.value;
    return rest;
});

// ======================
// Methods
// ======================

// 渲染单元格内容
const renderCellContent = (
    col: TableColumn,
    scope: any
): VNode | string | null => {
    const { row, $index } = scope;
    const fieldValue = get(row, col.field);

    // 序号列已在 getColumnProps 中处理，此处不重复
    if (col.type === 'index' || col.type === 'selection') return null;

    // 检查是否为预览字段
    const isImage = props.imagePreview.includes(col.field);
    const isVideo = props.videoPreview.includes(col.field);

    if (isImage || isVideo) {
        return h('div', { class: 'flex items-center' }, [
            isImage
                ? h(ElImage, {
                      src: fieldValue,
                      fit: 'cover',
                      class: 'w-[100%]',
                      lazy: true,
                      previewSrcList: [fieldValue],
                      previewTeleported: true,
                  })
                : h(
                      BaseButton,
                      {
                          type: 'primary',
                          onClick: () => createVideoViewer({ url: fieldValue }),
                      },
                      {
                          default: () => '预览',
                          icon: () => h(Icon, { icon: 'vi-ep:video-play' }),
                      }
                  ),
        ]);
    }

    // 用户自定义 formatter
    if (col.formatter) {
        return col.formatter(row, scope.column, fieldValue, $index);
    }

    // 用户自定义插槽
    if (col.slots?.default) {
        return col.slots.default(scope);
    }

    // 默认值
    return fieldValue ?? '';
};

// 获取列属性（用于 ElTableColumn）
const getColumnProps = (col: TableColumn) => {
    const base: Record<string, any> = { ...col };

    // 处理特殊类型
    if (col.type === 'index') {
        base.index = col.index
            ? col.index
            : (index: number) =>
                  setIndex(
                      mergedProps.value.reserveIndex,
                      index,
                      pageSizeRef.value,
                      currentPageRef.value
                  );
        base.width = '65px';
    } else if (col.type === 'selection') {
        base.reserveSelection = mergedProps.value.reserveSelection;
        base.width = '50';
    }

    // 移除 slots 避免透传
    delete base.slots;
    delete base.children; // 树形表头在 template 中递归处理（本实现简化为扁平，如需嵌套可扩展）

    return base;
};

// ======================
// Exposed Methods
// ======================

// 动态设置 props
const setProps = (newProps: Partial<TableProps>) => {
    Object.assign(outsideProps.value, newProps);
};

// 设置列属性（支持嵌套路径）
const setColumn = (
    columnProps: TableSetProps[],
    columnsChildren?: TableColumn[]
) => {
    const cols = columnsChildren || mergedProps.value.columns;
    for (const v of cols) {
        for (const item of columnProps) {
            if (v.field === item.field) {
                set(v, item.path, item.value);
            } else if (v.children?.length) {
                setColumn(columnProps, v.children);
            }
        }
    }
};

// 添加列
const addColumn = (column: TableColumn, index?: number) => {
    const cols = mergedProps.value.columns;
    if (index !== undefined) {
        cols.splice(index, 0, column);
    } else {
        cols.push(column);
    }
};

// 删除列
const delColumn = (field: string) => {
    const cols = mergedProps.value.columns;
    const index = cols.findIndex(item => item.field === field);
    if (index > -1) cols.splice(index, 1);
};

// ======================
// Event Handlers
// ======================

const handleRefresh = () => emit('refresh');
const handleChangeSize = (size: ComponentSize) => setProps({ size });
const handleConfirmSetColumn = (columns: TableColumn[]) =>
    setProps({ columns });

// ======================
// Watchers
// ======================

watch(
    () => mergedProps.value.pageSize,
    val => (pageSizeRef.value = val)
);
watch(
    () => mergedProps.value.currentPage,
    val => (currentPageRef.value = val)
);
watch(pageSizeRef, val => emit('update:pageSize', val));
watch(currentPageRef, val => emit('update:currentPage', val));

// ======================
// Lifecycle
// ======================

onMounted(() => {
    emit('register', null, elTableRef); // 第一个参数原为 $parent，实际常用 elTableRef
});

// ======================
// Expose
// ======================

defineExpose({
    setProps,
    setColumn,
    addColumn,
    delColumn,
    elTableRef,
});
</script>
