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
  setExpandedRow, // 设置树形结构的展开行
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
