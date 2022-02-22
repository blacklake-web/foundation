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

// 筛选项做交集时用，如果出现了这样的传参，那么列表肯定为空
export const KNOWN_EMPTY_LIST_PARAM = Symbol('known_empty');

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

export const CELL_PADDING = 24;
export const OPERATION_BUTTON_SPACE = 16;
export const FONT_SIZE = 14;
