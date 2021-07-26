/* eslint-disable no-shadow */

import { createContext } from 'react';
import type { ListLayoutContextType, ListLayoutState } from './recordListLayout.type';

export enum LIST_REDUCER_TYPE {
  ChangeSelectMode, // 改变行选择状态
  ChangeLoading, // 改变loading状态
  ChangeFilter, // 改变搜索框
  SetFliterData, // 改变搜索内容
  SetQuickFilterData, // 改变快速搜索内容
  SetPagination, // 改变分页信息
  SetSorter, // 改变排序信息
}

export const DEFAULT_PAGE = {
  page: 1,
};

export const listLayoutInitState: ListLayoutState = {
  filterVisiable: false,
  isSelectMode: false,
  isLoading: false,
  filterData: {},
  quickFilterData: {
    quickSearch: '',
  },
  pagination: { ...DEFAULT_PAGE, size: 10, total: 0 },
  sorter: undefined,
};

export const ListLayoutContext = createContext<ListLayoutContextType>({
  listLayoutState: listLayoutInitState,
});

export const BL_SELECTED_ALL = 'BlSelectAll';

export const FilterFieldType = {
  text: 1, // 单行文本
  number: 2, // 数值
  textArea: 3, // 多行文本
  select: 4, // 单选
  multiSelect: 5, // 多选
  boolean: 6, // 布尔值
  integer: 7, // 整数
  date: 8, // 日期时间
  url: 9, // 链接
  reference: 10, // 引用字段
};
