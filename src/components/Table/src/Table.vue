<script lang="tsx">
// 引入 Element Plus 的基础组件
import {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElTooltipProps,
    ElImage,
    ElEmpty,
    ElCard,
} from 'element-plus';

import type { ComponentSize } from 'element-plus';

// Vue 核心 API
import {
    defineComponent,
    PropType,
    ref,
    computed,
    unref,
    watch,
    onMounted,
} from 'vue';

// 自定义 prop 类型校验工具（通常封装了更严格的类型检查）
import { propTypes } from '@/utils/propTypes';

// 辅助函数：计算序号（用于分页连续索引）
import { setIndex } from './helper';

// 类型定义
import type {
    TableProps,
    TableColumn,
    Pagination,
    TableSetProps,
} from './types';

// Lodash 工具：用于安全地设置/获取嵌套对象属性
import { set, get } from 'lodash-es';

// Vue 类型
import { CSSProperties } from 'vue';

// TSX 插槽辅助函数（兼容 JSX/TSX 中的 slot 使用）
import { getSlot } from '@/utils/tsxHelper';

// 表格顶部操作栏组件（列设置、刷新、尺寸切换等）
import TableActions from './components/TableActions.vue';

// 视频预览弹窗（自定义组件）
import { createVideoViewer } from '@/components/VideoPlayer';

// 图标组件（支持 iconfont 或 SVG）
import { Icon } from '@/components/Icon';

// 基础按钮（封装了样式和交互）
import { BaseButton } from '@/components/Button';

// 定义组件
export default defineComponent({
    name: 'Table', // 组件名

    // -----------------------------
    // Props 定义（表格所有可配置项）
    // -----------------------------
    props: {
        // 分页相关
        pageSize: propTypes.number.def(10), // 每页条数，默认 10
        currentPage: propTypes.number.def(1), // 当前页码，默认第 1 页

        // 是否显示顶部工具栏（刷新、列设置、尺寸切换）
        showAction: propTypes.bool.def(false),

        // 全局是否启用单元格文本溢出省略（tooltip 提示），优先级低于列配置
        showOverflowTooltip: propTypes.bool.def(true),

        // 列定义数组（核心配置）
        columns: {
            type: Array as PropType<TableColumn[]>,
            default: () => [],
        },

        // 分页配置对象，传 undefined 则不显示分页
        pagination: {
            type: Object as PropType<Pagination>,
            default: (): Pagination | undefined => undefined,
        },

        // 多选时是否保留已选项（需配合 rowKey）
        reserveSelection: propTypes.bool.def(false),

        // 加载状态
        loading: propTypes.bool.def(false),

        // 是否启用“连续序号”（跨页累加，而非每页从 1 开始）
        reserveIndex: propTypes.bool.def(false),

        // 单元格内容对齐方式
        align: propTypes.string
            .validate((v: string) => ['left', 'center', 'right'].includes(v))
            .def('left'),

        // 表头对齐方式
        headerAlign: propTypes.string
            .validate((v: string) => ['left', 'center', 'right'].includes(v))
            .def('left'),

        // 表格数据源
        data: {
            type: Array as PropType<Recordable[]>, // Recordable = Record<string, any>
            default: () => [],
        },

        // 自动将指定字段渲染为可点击预览的图片（如 ['avatar']）
        imagePreview: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        // 自动将指定字段渲染为“视频预览”按钮（如 ['videoUrl']）
        videoPreview: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        // 表格高度（固定高度或字符串如 '100vh'）
        height: propTypes.oneOfType([Number, String]),

        // 最大高度（滚动容器）
        maxHeight: propTypes.oneOfType([Number, String]),

        // 是否开启斑马纹
        stripe: propTypes.bool.def(false),

        // 是否显示边框
        border: propTypes.bool.def(true),

        // 表格尺寸（small / default / large）
        size: {
            type: String as PropType<ComponentSize>,
            validator: (v: ComponentSize) =>
                ['default', 'small', 'large'].includes(v),
        },

        // 列宽是否自适应（默认 true）
        fit: propTypes.bool.def(true),

        // 是否显示表头
        showHeader: propTypes.bool.def(true),

        // 是否高亮当前行
        highlightCurrentRow: propTypes.bool.def(false),

        // 高亮行的 key（配合 rowKey 使用）
        currentRowKey: propTypes.oneOfType([Number, String]),

        // 行类名（可函数或字符串）
        rowClassName: {
            type: [Function, String] as PropType<
                (row: Recordable, rowIndex: number) => string | string
            >,
            default: '',
        },

        // 行样式（可函数或对象）
        rowStyle: {
            type: [Function, Object] as PropType<
                (
                    row: Recordable,
                    rowIndex: number
                ) => Recordable | CSSProperties
            >,
            default: undefined,
        },

        // 单元格类名
        cellClassName: {
            type: [Function, String] as PropType<
                (
                    row: Recordable,
                    column: any,
                    rowIndex: number
                ) => string | string
            >,
            default: '',
        },

        // 单元格样式
        cellStyle: {
            type: [Function, Object] as PropType<
                (
                    row: Recordable,
                    column: any,
                    rowIndex: number
                ) => Recordable | CSSProperties
            >,
            default: undefined,
        },

        // 表头行类名
        headerRowClassName: {
            type: [Function, String] as PropType<
                (row: Recordable, rowIndex: number) => string | string
            >,
            default: '',
        },

        // 表头行样式
        headerRowStyle: {
            type: [Function, Object] as PropType<
                (
                    row: Recordable,
                    rowIndex: number
                ) => Recordable | CSSProperties
            >,
            default: undefined,
        },

        // 表头单元格类名
        headerCellClassName: {
            type: [Function, String] as PropType<
                (
                    row: Recordable,
                    column: any,
                    rowIndex: number
                ) => string | string
            >,
            default: '',
        },

        // 表头单元格样式
        headerCellStyle: {
            type: [Function, Object] as PropType<
                (
                    row: Recordable,
                    column: any,
                    rowIndex: number
                ) => Recordable | CSSProperties
            >,
            default: undefined,
        },

        // 行唯一标识字段（用于 selection 保留、树形展开等）
        rowKey: propTypes.string.def('id'),

        // 空数据提示文本
        emptyText: propTypes.string.def('No Data'),

        // 树形表是否默认展开所有节点
        defaultExpandAll: propTypes.bool.def(false),

        // 控制哪些行展开（数组 of rowKey）
        expandRowKeys: {
            type: Array as PropType<string[]>,
            default: undefined,
        },

        // 默认排序字段
        defaultSort: {
            type: Object as PropType<{ prop: string; order: string }>,
            default: () => ({}),
        },

        // Tooltip 主题（dark/light）
        tooltipEffect: {
            type: String as PropType<'dark' | 'light'>,
            default: 'dark',
        },

        // Tooltip 配置（透传给 ElTooltip）
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

        // 是否显示合计行
        showSummary: propTypes.bool.def(false),
        sumText: propTypes.string.def('Sum'),
        summaryMethod: {
            type: Function as PropType<
                (param: { columns: any[]; data: any[] }) => any[]
            >,
            default: undefined,
        },

        // 合并单元格方法
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

        // 多选半选状态是否可点击
        selectOnIndeterminate: propTypes.bool.def(true),

        // 树形缩进像素
        indent: propTypes.number.def(16),

        // 是否懒加载子节点
        lazy: propTypes.bool.def(false),

        // 懒加载回调函数
        load: {
            type: Function as PropType<
                (row: Recordable, treeNode: any, resolve: Function) => void
            >,
            default: undefined,
        },

        // 树形数据字段映射（children / hasChildren / label）
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

        // 表格布局策略（auto / fixed）
        tableLayout: {
            type: String as PropType<'auto' | 'fixed'>,
            default: 'fixed',
        },

        // 滚动条是否始终显示
        scrollbarAlwaysOn: propTypes.bool.def(false),

        // 是否启用灵活布局（ElTable 特性）
        flexible: propTypes.bool.def(false),

        // 是否启用自定义卡片内容模式（非表格）
        customContent: propTypes.bool.def(false),

        // 卡片 body 样式
        cardBodyStyle: {
            type: Object as PropType<CSSProperties>,
            default: () => ({}),
        },
        cardBodyClass: {
            type: String as PropType<string>,
            default: '',
        },
        cardWrapStyle: {
            type: Object as PropType<CSSProperties>,
            default: () => ({}),
        },
        cardWrapClass: {
            type: String as PropType<string>,
            default: '',
        },
    },

    // -----------------------------
    // Emits 定义
    // -----------------------------
    emits: [
        'update:pageSize', // v-model:pageSize
        'update:currentPage', // v-model:currentPage
        'register', // 注册表格实例（用于外部调用）
        'refresh', // 刷新事件（由工具栏触发）
    ],

    // -----------------------------
    // Setup 函数（组合式 API）
    // -----------------------------
    setup(props, { attrs, emit, slots, expose }) {
        // 获取 ElTable 实例引用
        const elTableRef = ref<ComponentRef<typeof ElTable>>();

        // 组件挂载后，向外暴露表格实例（常用于 useTable 场景）
        onMounted(() => {
            const tableRef = unref(elTableRef);
            emit('register', tableRef?.$parent, elTableRef); // 注意：$parent 可能是 wrapper，实际常用 elTableRef
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
                            imagePreview.some(
                                item => (item as string) === v.field
                            ) ||
                            videoPreview.some(
                                item => (item as string) === v.field
                            );

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
                                  ? renderPreview(
                                        get(data.row, v.field),
                                        v.field
                                    ) // 预览渲染
                                  : get(data.row, v.field); // 默认取值（支持 a.b.c 路径）
                    },
                };
                // 表头插槽
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
                                videoPreview.some(
                                    item => (item as string) === v.field
                                );

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
                                      ? renderPreview(
                                            get(data.row, v.field),
                                            v.field
                                        )
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
                tableSlots['empty'] = (...args: any[]) =>
                    getSlot(slots, 'empty', args);
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
                                        default: () =>
                                            getSlot(slots, 'content', item),
                                    };
                                    if (getSlot(slots, 'content-header')) {
                                        cardSlots['header'] = () =>
                                            getSlot(
                                                slots,
                                                'content-header',
                                                item
                                            );
                                    }
                                    if (getSlot(slots, 'content-footer')) {
                                        cardSlots['footer'] = () =>
                                            getSlot(
                                                slots,
                                                'content-footer',
                                                item
                                            );
                                    }
                                    return (
                                        <ElCard
                                            shadow="hover"
                                            class={
                                                unref(getProps).cardWrapClass
                                            }
                                            style={
                                                unref(getProps).cardWrapStyle
                                            }
                                            bodyClass={
                                                unref(getProps).cardBodyClass
                                            }
                                            bodyStyle={
                                                unref(getProps).cardBodyStyle
                                            }
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
    },
});
</script>
