# SimpleTable API

## 一、概述

`SimpleTable` 是一个基于 Element Plus 的 `ElTable` 封装的高级表格组件，提供开箱即用的分页、刷新、斑马纹、行/单元格样式定制、保留选中状态等功能，适用于中后台系统的通用数据列表场景。

## 二、Props

### 基础属性

| 属性名       | 说明                                        | 类型            | 默认值  |
| ------------ | ------------------------------------------- | --------------- | ------- |
| `data`       | 表格数据源                                  | `Recordable[]`  | —       |
| `columns`    | 列配置项数组（详见下方 `TableColumn` 类型） | `TableColumn[]` | —       |
| `loading`    | 是否显示加载动画                            | `boolean`       | `false` |
| `pagination` | 分页配置对象（若传入则显示分页器）          | `Pagination`    | —       |
| `showAction` | 是否显示顶部操作栏（含“刷新”按钮）          | `boolean`       | `false` |

### 外观与布局

| 属性名      | 说明                                   | 类型                              | 默认值      |
| ----------- | -------------------------------------- | --------------------------------- | ----------- |
| `height`    | 表格高度（支持数字或带单位字符串）     | `number \| string`                | —           |
| `maxHeight` | 表格最大高度（支持数字或带单位字符串） | `number \| string`                | —           |
| `border`    | 是否显示纵向边框                       | `boolean`                         | `true`      |
| `size`      | 表格尺寸                               | `'small' \| 'default' \| 'large'` | `'default'` |
| `stripe`    | 是否为斑马纹表格                       | `boolean`                         | `false`     |

### 行与选择

| 属性名             | 说明                                         | 类型      | 默认值  |
| ------------------ | -------------------------------------------- | --------- | ------- |
| `rowKey`           | 行数据的唯一标识字段名                       | `string`  | `'id'`  |
| `reserveSelection` | 是否在分页切换时保留已选项                   | `boolean` | `false` |
| `reserveIndex`     | 是否在分页时保持连续序号（从第一页开始累加） | `boolean` | `false` |

### 自定义样式

| 属性名          | 说明                               | 类型                                                                     | 默认值 |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------ | ------ |
| `rowClassName`  | 行的类名（可为函数或字符串）       | `(row, rowIndex) => string \| string`                                    | —      |
| `rowStyle`      | 行的内联样式（可为函数或对象）     | `(row, rowIndex) => CSSProperties \| CSSProperties`                      | —      |
| `cellClassName` | 单元格的类名（可为函数或字符串）   | `(row, column, rowIndex, columnIndex) => string \| string`               | —      |
| `cellStyle`     | 单元格的内联样式（可为函数或对象） | `(row, column, rowIndex, columnIndex) => CSSProperties \| CSSProperties` | —      |

### 分页控制（支持 `.sync`）

| 属性名        | 说明           | 类型     | 默认值 |
| ------------- | -------------- | -------- | ------ |
| `pageSize`    | 每页显示条目数 | `number` | `10`   |
| `currentPage` | 当前页码       | `number` | `1`    |

### TableColumn 类型定义

```ts
interface TableColumn {
    field: string; // 字段名（非 selection/index 列必需）
    label: string; // 列标题
    width?: number | string; // 列宽
    minWidth?: number | string; // 最小列宽
    fixed?: 'left' | 'right' | boolean; // 是否固定列
    align?: 'left' | 'center' | 'right'; // 内容对齐方式
    headerAlign?: 'left' | 'center' | 'right'; // 表头对齐方式
    type?: 'selection' | 'index'; // 特殊列类型
    formatter?: (row: Recordable, column: TableColumn) => any; // 格式化函数
    slots?: { default?: (row: Recordable) => VNodeChild }; // 自定义渲染插槽
}

interface Pagination {
    total: number; // 总条目数（必填）
    pageSize?: number; // 每页条数
    currentPage?: number; // 当前页
    pageSizes?: number[]; // 可选每页条数列表
    layout?: string; // 分页布局（如 'total, sizes, prev, pager, next, jumper'）
}
```

## 三、Events

| 事件名               | 说明                 | 回调参数                |
| -------------------- | -------------------- | ----------------------- |
| `update:pageSize`    | 每页条数改变时触发   | `(pageSize: number)`    |
| `update:currentPage` | 当前页码改变时触发   | `(currentPage: number)` |
| `refresh`            | 点击“刷新”按钮时触发 | —                       |

> 💡 建议使用 `v-model:pageSize` 和 `v-model:currentPage` 进行双向绑定。

## 四、Slots

`SimpleTable` 不提供顶层作用域插槽，但支持在 `columns` 配置中通过 `slots.default` 实现列内容自定义渲染：

```ts
const columns = [
    {
        field: 'action',
        label: '操作',
        slots: {
            default: row => h(ElButton, { size: 'small' }, () => '编辑'),
        },
    },
];
```

- 插槽函数接收当前行数据 row，返回 VNode、JSX 或字符串。
- 若同时配置了 formatter 和 slots.default，插槽优先级更高。
- 对于 type: 'index' 列，可通过 startIndex + $index + 1 实现跨页连续序号（需开启 reserveIndex）。

## 五、Methods

组件通过 `ref` 暴露内部 `ElTable` 实例，可通过 `elTableRef` 调用其所有方法：

```vue
<template>
    <SimpleTable ref="tableRef" :data="data" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type SimpleTable from './SimpleTable.vue';

const tableRef = ref<InstanceType<typeof SimpleTable> | null>(null);

// 示例：清除所有选中项
const clearSelection = () => {
    tableRef.value?.elTableRef?.clearSelection();
};
</script>
```

## 六、暴露属性：

elTableRef: 指向内部 ElTable 组件的引用，支持调用 toggleRowSelection, clearSort, doLayout 等所有 Element Plus Table 方法。
