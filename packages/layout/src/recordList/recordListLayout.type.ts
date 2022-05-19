import { Dispatch } from 'react';
import { SelectProps, InputProps, DatePickerProps, PopconfirmProps } from 'antd';
import { LIST_REDUCER_TYPE } from './constants';
import type { ReasonConformCallback, ReasonPopconfirmProps } from '../components/reasonPopconfirm';

export type FilterData = {
  [index: string]: any;
};

export type QuickFilterData = {
  quickSearch: string;
};

export interface FormatDataToQueryDataSorter {
  order: 'desc' | 'asc';
  field: string | string[];
}

export interface FormatDataToQueryData {
  page?: number;
  size?: number;
  quickSearch?: string;
  sorter?: FormatDataToQueryDataSorter[];
  [key: string]: any;
}

export interface FilterItem {
  label: string;
  name: string;
  type: number;
  rules?: any[];
  renderItem?: React.ReactNode;
  selectProps?: SelectProps<any>;
  inputProps?: InputProps;
  datePickerProps?: DatePickerProps;
  props?: any;
  dateFormat?: string | undefined;
  precision?: string | number;
}

export interface ListLayoutQueryParams {
  filterData?: FilterData;
  quickFilterData?: QuickFilterData;
  pagination?: { page?: number; size?: number };
  sorter?: FormatDataToQueryDataSorter[];
}

// 公有props
export interface BlRecordListBaseProps {
  /** 精确查询列表，不传时没有精确查询功能 */
  filterList?: FilterItem[];
  /** 批量操作时，已勾选key数组。！！！不传该字段不会开启列表勾选功能！！！ */
  selectedRowKeys?: BlSelectedRowKeys;
  /** 勾选回调函数 */
  onSelectedRowKeys?: OnSelectedRowKeys;
  /**
   * filter 抽屉挂载的 HTML 节点, false 为挂载在当前 dom，默认挂载在window上
   * @default false
   */
  filterContaniner?: string | false | HTMLElement | undefined;
  /** 用户拥有的权限 */
  userAuth?: string[];
  /** 缓存时相关标识 */
  configcacheKey?: string;
}
//
export interface ListLayoutState {
  filterVisiable?: boolean;
  isSelectMode?: boolean;
  isLoading?: boolean;
  filterData: FilterData;
  quickFilterData: QuickFilterData;
  pagination: { page: number; size: number; total: number };
  sorter?: FormatDataToQueryDataSorter[];
}

export interface ListLayoutContextType {
  dispatch?: Dispatch<{ type: LIST_REDUCER_TYPE; payload: any }>;
  listLayoutState: ListLayoutState;
}

export interface TableResponseData {
  data?: {
    list?: any[];
    total?: number;
  };
}

export type BlSelectedRowKeys = React.Key[];
// 勾选回调
export type OnSelectedRowKeys = (selectedRowKeys: BlSelectedRowKeys, selectRows?: any[]) => void;

/** 操作列的配置项格式 */
export type OperationListItem = {
  /** 标题 */
  title: string;
  /** 权限 */
  auth?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击回调。如果使用了二次确认弹窗，需返回一个Promise */
  onClick: ((...args: any) => void) | ReasonConformCallback;
  /** 二次确认弹窗 */
  popconfirm?: boolean | Partial<PopconfirmProps>;
  /** 填写原因的二次确认弹窗 */
  reasonconfirm?: boolean | Omit<ReasonPopconfirmProps, 'opName' | 'onConfirm'>;
};
