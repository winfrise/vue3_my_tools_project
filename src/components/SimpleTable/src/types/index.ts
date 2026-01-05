import { CSSProperties } from 'vue';

// ============ 类型定义 ============
export type Recordable = Record<string, any>;

export interface TableColumn {
    field?: string;
    label?: string;
    width?: number | string;
    minWidth?: number | string;
    fixed?: 'left' | 'right' | boolean;
    formatter?: (row: Recordable, column: TableColumn) => any;
    slots?: { default?: (row: Recordable) => any };
    type?: 'selection' | 'index';
    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';
}

export interface Pagination {
    total: number;
    pageSize?: number;
    currentPage?: number;
    pageSizes?: number[];
    layout?: string;
}

// ============ Props ============
export interface Props {
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
