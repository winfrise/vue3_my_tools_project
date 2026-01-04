<template>

            <div v-loading={unref(getProps).loading}>
            {/* 自定义卡片模式 */}
            {unref(getProps).customContent ? (
                <div class="flex flex-wrap">
                    {unref(getProps)?.data?.length ? (
                        unref(getProps)?.data.map(item => {
                            const cardSlots = {
                                default: () => getSlot(slots, 'content', item),
                            };
                            if (getSlot(slots, 'content-header')) {
                                cardSlots['header'] = () =>
                                    getSlot(slots, 'content-header', item);
                            }
                            if (getSlot(slots, 'content-footer')) {
                                cardSlots['footer'] = () =>
                                    getSlot(slots, 'content-footer', item);
                            }
                            return (
                                <ElCard
                                    shadow="hover"
                                    class={unref(getProps).cardWrapClass}
                                    style={unref(getProps).cardWrapStyle}
                                    bodyClass={unref(getProps).cardBodyClass}
                                    bodyStyle={unref(getProps).cardBodyStyle}
                                >
                                    {cardSlots}
                                </ElCard>
                            );
                        })
                    ) : (
                        <div class="flex flex-1 justify-center">
                            <ElEmpty description="暂无数据" />
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* 顶部工具栏 */}
                    {unref(getProps).showAction &&
                    !unref(getProps).customContent ? (
                        <TableActions
                            columns={unref(getProps).columns}
                            onChangSize={changSize}
                            onRefresh={refresh}
                            onConfirm={confirmSetColumn}
                        />
                    ) : null}

                    {/* 标准表格 */}
                    <ElTable
                        ref={elTableRef}
                        data={unref(getProps).data}
                        {...unref(getBindValue)}
                    >
                        {{
                            default: () => renderTableColumn(),
                            ...tableSlots,
                        }}
                    </ElTable>
                </>
            )}

            {/* 分页器 */}
            {unref(getProps).pagination ? (
                <ElPagination
                    v-model:pageSize={pageSizeRef.value}
                    v-model:currentPage={currentPageRef.value}
                    class="mt-10px"
                    {...unref(pagination)}
                ></ElPagination>
            ) : undefined}
        </div>
   
</template>

<script lang="tsx">
// 引入 Element Plus 的基础表格相关组件
import {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElImage,
    ElEmpty,
    ElCard,
} from 'element-plus';

// 引入 Element Plus 的尺寸类型（用于 size prop）
import type { ComponentSize, ElTooltipProps } from 'element-plus';

// Vue 核心组合式 API
import {
    defineComponent, // 定义组件
    PropType, // 用于更严格的 props 类型声明
    ref, // 创建响应式引用
    computed, // 创建计算属性
    unref, // 解包 ref（兼容普通值和 ref）
    watch, // 响应式监听
    onMounted, // 生命周期钩子
} from 'vue';

// 自定义 prop 类型校验工具（增强类型安全与默认值支持）
import { propTypes } from '@/utils/propTypes';

// 辅助函数：用于分页时生成连续序号（跨页累加）
import { setIndex } from './helper';

// 本地类型定义（表格配置的核心接口）
import type {
    TableProps, // 表格整体配置
    TableColumn, // 单列配置
    Pagination, // 分页配置
    TableSetProps, // 动态设置列属性的参数
} from './types';

// Lodash 工具函数：安全地读写嵌套对象属性（如 a.b.c）
import { set, get } from 'lodash-es';

// Vue 内置 CSS 样式类型
import { CSSProperties } from 'vue';

// TSX 插槽辅助函数（兼容 JSX/TSX 中的 slot 使用方式）
import { getSlot } from '@/utils/tsxHelper';

// 表格顶部操作栏组件（列设置、刷新、尺寸切换等）
import TableActions from './components/TableActions.vue';

// 视频预览弹窗（自定义视频播放器）
import { createVideoViewer } from '@/components/VideoPlayer';

// 图标组件（支持 iconfont 或 SVG）
import { Icon } from '@/components/Icon';

// 封装的基础按钮组件
import { BaseButton } from '@/components/Button';

defineOptions({
    name: 'Table',
});

interface Props {
    // 分页相关
    pageSize: number; // 每页条数
    currentPage: number; // 当前页码

    showAction: boolean; // 是否显示顶部工具栏（刷新、列设置、尺寸切换）

    // 全局是否启用单元格文本溢出省略（tooltip 提示），优先级低于列配置
    showOverflowTooltip: boolean;

    // 列定义数组（核心配置）
    columns: TableColumn[];

    // 分页配置对象，传 undefined 则不显示分页
    pagination: Pagination | undefined;

    // 多选时是否保留已选项（需配合 rowKey）
    reserveSelection: boolean;

    // 加载状态
    loading: boolean;

    // 是否启用“连续序号”（跨页累加，而非每页从 1 开始）
    reserveIndex: boolean;

    // 单元格内容对齐方式
    align: 'left' | 'center' | 'right';

    // 表头对齐方式
    headerAlign: 'left' | 'center' | 'right';

    // 表格数据源
    data: Recordable[];

    // 自动将指定字段渲染为可点击预览的图片（如 ['avatar']）
    imagePreview: string[];

    // 自动将指定字段渲染为“视频预览”按钮（如 ['videoUrl']）
    videoPreview: string[];

    // 表格高度（固定高度或字符串如 '100vh'）
    height?: number | string;

    // 最大高度（滚动容器）
    maxHeight?: number | string;

    // 是否开启斑马纹
    stripe: boolean;

    // 是否显示边框
    border: boolean;

    // 表格尺寸（small / default / large）
    size?: 'default' | 'small' | 'large';

    // 列宽是否自适应（默认 true）
    fit: boolean;

    // 是否显示表头
    showHeader: boolean;

    // 是否高亮当前行
    highlightCurrentRow: boolean;

    // 高亮行的 key（配合 rowKey 使用）
    currentRowKey?: Number | String;

    // 行类名（可函数或字符串）
    rowClassName:
        | ((row: Record<string, any>, rowIndex: number) => string)
        | string;

    rowStyle:
        | ((
              row: Record<string, any>,
              rowIndex: number
          ) => Recordable | CSSProperties)
        | CSSProperties;
}

const DEFAULT_PROPS = {
    pageSize: 10,
    currentPage: 1,
    showAction: false,
    showOverflowTooltip: true,
    columns: () => [],
    pagination: undefined,
    reserveSelection: false,
    loading: false,
    reserveIndex: false,
    align: 'left' as const,
    headerAlign: 'left' as const,
    data: () => [],
    imagePreview: () => [],
    videoPreview: () => [],
    stripe: false,
    border: true,
    fit: true,
    showHeader: true,
    highlightCurrentRow: false,
    rowClassName: '',
    rowStyle: undefined,
};

const props = withDefaults(defineProps<Props>(), DEFAULT_PROPS);

const elTableRef = ref<ComponentRef<typeof ElTable>>();

const emit = defineEmits<{
  (e: 'register', parent: unknown, tableInstance: InstanceType<typeof ElTable> | null): void;
}>();

// 组件挂载后，向外暴露表格实例（常用于 useTable 场景）
onMounted(() => {
    if (elTableRef.value) {
        const tableRef = unref(elTableRef);
        emit('register', tableRef?.$parent, elTableRef); // 注意：$parent 可能是 wrapper，实际常用 elTableRef
    }

});

// 响应式分页状态（用于双向绑定）
const pageSizeRef = ref(props.pageSize);
const currentPageRef = ref(props.currentPage);

// 外部通过 setProps 动态传入的属性（覆盖原始 props）
const outsideProps = ref<TableProps>({});
const mergeProps = ref<TableProps>({});

// 合并原始 props 与动态 props
const getProps = computed(() => {
    const propsObj = { ...props };
    Object.assign(propsObj, unref(mergeProps));
    return propsObj;
});

// ✅ 对外暴露：动态更新表格属性（如 loading、size、columns 等）
const setProps = (props: TableProps = {}) => {
    mergeProps.value = Object.assign(unref(mergeProps), props);
    outsideProps.value = { ...props } as any;
};

// ✅ 对外暴露：根据 field 和 path 动态修改列配置（支持嵌套 children）
const setColumn = (
    columnProps: TableSetProps[],
    columnsChildren?: TableColumn[]
) => {
    const { columns } = unref(getProps);
    for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
            if (v.field === item.field) {
                set(v, item.path, item.value); // 使用 lodash.set 安全赋值
            } else if (v.children?.length) {
                setColumn(columnProps, v.children); // 递归处理子列
            }
        }
    }
};

// ✅ 对外暴露：动态添加一列
const addColumn = (column: TableColumn, index?: number) => {
    const { columns } = unref(getProps);
    if (index !== void 0) {
        columns.splice(index, 0, column);
    } else {
        columns.push(column);
    }
};

// ✅ 对外暴露：根据 field 删除一列
const delColumn = (field: string) => {
    const { columns } = unref(getProps);
    const index = columns.findIndex(item => item.field === field);
    if (index > -1) {
        columns.splice(index, 1);
    }
};

// 触发刷新事件（通常由 TableActions 调用）
const refresh = () => {
    emit('refresh');
};

// 切换表格尺寸（由 TableActions 调用）
const changSize = (size: ComponentSize) => {
    setProps({ size });
};

// 确认列设置（由 TableActions 调用，重置 columns）
const confirmSetColumn = (columns: TableColumn[]) => {
    setProps({ columns });
};

// 暴露方法给父组件（通过 ref 调用）
expose({
    setProps,
    setColumn,
    delColumn,
    addColumn,
    elTableRef, // 原生 ElTable 实例
});

// 计算分页配置（合并默认值与用户传入）
const pagination = computed(() => {
    return Object.assign(
        {
            small: false,
            background: false,
            pagerCount: 7,
            layout: 'sizes, prev, pager, next, jumper, ->, total',
            pageSizes: [10, 20, 30, 40, 50, 100],
            disabled: false,
            hideOnSinglePage: false,
            total: 10, // 注意：这里应由用户传入，否则永远显示 10 条
        },
        unref(getProps).pagination
    );
});

// 监听 pageSize 变化（同步到内部 ref）
watch(
    () => unref(getProps).pageSize,
    (val: number) => {
        pageSizeRef.value = val;
    }
);

// 监听 currentPage 变化
watch(
    () => unref(getProps).currentPage,
    (val: number) => {
        currentPageRef.value = val;
    }
);

// 双向绑定：pageSize 变化时 emit
watch(
    () => pageSizeRef.value,
    (val: number) => {
        emit('update:pageSize', val);
    }
);

// 双向绑定：currentPage 变化时 emit
watch(
    () => currentPageRef.value,
    (val: number) => {
        emit('update:currentPage', val);
    }
);

// 构建传递给 ElTable 的属性（排除 columns/data/align 等特殊字段）
const getBindValue = computed(() => {
    const bindValue: Recordable = { ...attrs, ...unref(getProps) };
    delete bindValue.columns;
    delete bindValue.data;
    delete bindValue.align;
    return bindValue;
});

// 渲染树形表头（递归）
const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
    const {
        align,
        headerAlign,
        showOverflowTooltip,
        imagePreview,
        videoPreview,
    } = unref(getProps);
    return columnsChildren.map(v => {
        if (v.hidden) return null; // 隐藏列
        const props = { ...v } as any;
        if (props.children) delete props.children; // 避免重复传递

        const children = v.children;

        // 默认插槽逻辑
        const slots = {
            default: (...args: any[]) => {
                const data = args[0];
                let isPreview = false;
                isPreview =
                    imagePreview.some(item => (item as string) === v.field) ||
                    videoPreview.some(item => (item as string) === v.field);

                return children && children.length
                    ? renderTreeTableColumn(children) // 递归子列
                    : props?.slots?.default
                      ? props.slots.default(...args) // 用户自定义插槽
                      : v?.formatter
                        ? v?.formatter?.(
                              data.row,
                              data.column,
                              get(data.row, v.field),
                              data.$index
                          ) // 格式化
                        : isPreview
                          ? renderPreview(get(data.row, v.field), v.field) // 预览渲染
                          : get(data.row, v.field); // 默认取值（支持 a.b.c 路径）
            },
        };
        // 表头插槽
        if (props?.slots?.header) {
            slots['header'] = (...args: any[]) => props.slots.header(...args);
        }

        return (
            <ElTableColumn
                showOverflowTooltip={showOverflowTooltip}
                align={align}
                headerAlign={headerAlign}
                {...props}
                prop={v.field}
            >
                {slots}
            </ElTableColumn>
        );
    });
};

// 渲染预览内容（图片 or 视频按钮）
const renderPreview = (url: string, field: string) => {
    const { imagePreview, videoPreview } = unref(getProps);
    return (
        <div class="flex items-center">
            {imagePreview.includes(field) ? (
                <ElImage
                    src={url}
                    fit="cover"
                    class="w-[100%]"
                    lazy
                    preview-src-list={[url]}
                    preview-teleported
                />
            ) : videoPreview.includes(field) ? (
                <BaseButton
                    type="primary"
                    icon={<Icon icon="vi-ep:video-play" />}
                    onClick={() => {
                        createVideoViewer({ url }); // 弹出视频播放器
                    }}
                >
                    预览
                </BaseButton>
            ) : null}
        </div>
    );
};

// 主渲染函数：生成所有 ElTableColumn
const renderTableColumn = (columnsChildren?: TableColumn[]) => {
    const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip,
        reserveSelection,
        imagePreview,
        videoPreview,
    } = unref(getProps);

    return (columnsChildren || columns).map(v => {
        if (v.hidden) return null;

        // 序号列
        if (v.type === 'index') {
            return (
                <ElTableColumn
                    type="index"
                    index={
                        v.index
                            ? v.index
                            : index =>
                                  setIndex(
                                      reserveIndex,
                                      index,
                                      pageSize,
                                      currentPage
                                  )
                    }
                    align={v.align || align}
                    headerAlign={v.headerAlign || headerAlign}
                    label={v.label}
                    fixed={v.fixed}
                    width="65px"
                ></ElTableColumn>
            );
        }
        // 多选列
        else if (v.type === 'selection') {
            return (
                <ElTableColumn
                    type="selection"
                    reserveSelection={reserveSelection}
                    align={align}
                    headerAlign={headerAlign}
                    selectable={v.selectable}
                    width="50"
                ></ElTableColumn>
            );
        }
        // 普通列 or 树形列
        else {
            const props = { ...v } as any;
            if (props.children) delete props.children;
            const children = v.children;

            const slots = {
                default: (...args: any[]) => {
                    const data = args[0];
                    let isPreview = false;
                    isPreview =
                        imagePreview.some(
                            item => (item as string) === v.field
                        ) ||
                        videoPreview.some(item => (item as string) === v.field);

                    return children && children.length
                        ? renderTreeTableColumn(children)
                        : props?.slots?.default
                          ? props.slots.default(...args)
                          : v?.formatter
                            ? v?.formatter?.(
                                  data.row,
                                  data.column,
                                  get(data.row, v.field),
                                  data.$index
                              )
                            : isPreview
                              ? renderPreview(get(data.row, v.field), v.field)
                              : get(data.row, v.field);
                },
            };
            if (props?.slots?.header) {
                slots['header'] = (...args: any[]) =>
                    props.slots.header(...args);
            }
            return (
                <ElTableColumn
                    showOverflowTooltip={showOverflowTooltip}
                    align={align}
                    headerAlign={headerAlign}
                    {...props}
                    prop={v.field}
                >
                    {slots}
                </ElTableColumn>
            );
        }
    });
};

// -----------------------------
// Render 函数（返回 VNode）
// -----------------------------
return () => {
    // 收集插槽（empty / append）
    const tableSlots = {};
    if (getSlot(slots, 'empty')) {
        tableSlots['empty'] = (...args: any[]) => getSlot(slots, 'empty', args);
    }
    if (getSlot(slots, 'append')) {
        tableSlots['append'] = (...args: any[]) =>
            getSlot(slots, 'append', args);
    }

    return (
        <div v-loading={unref(getProps).loading}>
            {/* 自定义卡片模式 */}
            {unref(getProps).customContent ? (
                <div class="flex flex-wrap">
                    {unref(getProps)?.data?.length ? (
                        unref(getProps)?.data.map(item => {
                            const cardSlots = {
                                default: () => getSlot(slots, 'content', item),
                            };
                            if (getSlot(slots, 'content-header')) {
                                cardSlots['header'] = () =>
                                    getSlot(slots, 'content-header', item);
                            }
                            if (getSlot(slots, 'content-footer')) {
                                cardSlots['footer'] = () =>
                                    getSlot(slots, 'content-footer', item);
                            }
                            return (
                                <ElCard
                                    shadow="hover"
                                    class={unref(getProps).cardWrapClass}
                                    style={unref(getProps).cardWrapStyle}
                                    bodyClass={unref(getProps).cardBodyClass}
                                    bodyStyle={unref(getProps).cardBodyStyle}
                                >
                                    {cardSlots}
                                </ElCard>
                            );
                        })
                    ) : (
                        <div class="flex flex-1 justify-center">
                            <ElEmpty description="暂无数据" />
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* 顶部工具栏 */}
                    {unref(getProps).showAction &&
                    !unref(getProps).customContent ? (
                        <TableActions
                            columns={unref(getProps).columns}
                            onChangSize={changSize}
                            onRefresh={refresh}
                            onConfirm={confirmSetColumn}
                        />
                    ) : null}

                    {/* 标准表格 */}
                    <ElTable
                        ref={elTableRef}
                        data={unref(getProps).data}
                        {...unref(getBindValue)}
                    >
                        {{
                            default: () => renderTableColumn(),
                            ...tableSlots,
                        }}
                    </ElTable>
                </>
            )}

            {/* 分页器 */}
            {unref(getProps).pagination ? (
                <ElPagination
                    v-model:pageSize={pageSizeRef.value}
                    v-model:currentPage={currentPageRef.value}
                    class="mt-10px"
                    {...unref(pagination)}
                ></ElPagination>
            ) : undefined}
        </div>
    );
};
</script>
