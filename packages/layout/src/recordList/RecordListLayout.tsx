import React, { useEffect, useReducer, useRef, useState } from 'react';
import _ from 'lodash';
//
import FilterList, { FilterProps } from './components/FilterList';
import RecordListBody, { RecordListBodyProps } from './components/RecordListBody';
import RecordListInfo, { RecordListInfoProps } from './components/RecordListInfo';
import RecordListHeader, { RecordListHeaderProps } from './components/RecordListHeader';
import type {
  ListLayoutState,
  ListLayoutQueryParams,
  TableResponseData,
} from './recordListLayout.type';
import {
  LIST_REDUCER_TYPE,
  DEFAULT_PAGE,
  ListLayoutContext,
  listLayoutInitState,
  KNOWN_EMPTY_LIST_PARAM,
} from './constants';
import { getRecordListUrlParams, setRecordListUrlParams } from './utils';
import './styles.less';

export interface BlRecordListLayoutProps<RecordType>
  extends RecordListHeaderProps,
    Omit<RecordListInfoProps, 'onChangeFilter'>,
    Omit<RecordListBodyProps<RecordType>, 'onChangeFilter'>,
    FilterProps {
  /**样式 */
  style?: React.CSSProperties;
  /**
   * 格式化查询数据去后端查询。data是所有查询条件，这里需要统一处理
   * 默认的字段有 quickSearch(快速查询内容), page(当前页), size(分页大小), sorter(排序)
   */
  formatDataToQuery?: (data: any) => {
    [key: string]: any;
  };
  /**
   * 查询API,需要处理后端返回的数据时，可以自行包装此函数
   */
  requestFn: (parmas: any) => Promise<any>;
  /**刷新表示，只要传与上次不一样的值时触发刷新动作，可以传时间戳 */
  refreshMarker?: string | number;
  /**重置刷新，会重置所有查询条件，使用方法和refreshMarker一致 */
  resetRefreshMarker?: string | number;
  /**
   * 是否启用url 记录和获取 查询参数的功能，当recordListLayout用于弹窗内时或不要url参与时，开启
   * @default false
   */
  useFilterWithUrl?: boolean;

  /**
   * talbe 的dataSource, 可以获取后封装内容，控制数据展示
   */
  customDataSource?: any[];
  /**
   * table 展示功能配置
   */
  expandable?: any;
  isLoading?: boolean;
  delayLoadTime?: number;
}

const listLayoutReducer = (
  state: ListLayoutState,
  action: { type: LIST_REDUCER_TYPE; payload: any },
) => {
  switch (action.type) {
    case LIST_REDUCER_TYPE.ChangeLoading:
      return {
        ...state,
        isLoading: action?.payload ?? false,
      };

    case LIST_REDUCER_TYPE.ChangeFilter:
      return {
        ...state,
        filterVisiable: action?.payload ?? false,
      };

    case LIST_REDUCER_TYPE.ChangeSelectMode:
      return {
        ...state,
        isSelectMode: action?.payload ?? false,
      };

    case LIST_REDUCER_TYPE.SetFliterData: {
      const newFilterData = _.omitBy(action?.payload ?? {}, (params) => {
        return _.isUndefined(params) || _.isNull(params);
      });

      return {
        ...state,
        filterData: newFilterData,
      };
    }

    case LIST_REDUCER_TYPE.SetQuickFilterData:
      return {
        ...state,
        quickFilterData: { quickSearch: action?.payload ?? '' },
      };

    case LIST_REDUCER_TYPE.SetPagination: {
      const newPagination = { ...state.pagination, ...(action?.payload ?? {}) };
      const { page: newPage, size: newSize, total: newTotal } = newPagination;

      return {
        ...state,
        pagination: {
          page: typeof newPage === 'string' ? Number(newPage) : newPage,
          size: typeof newSize === 'string' ? Number(newSize) : newSize,
          total: newTotal,
        },
      };
    }

    case LIST_REDUCER_TYPE.SetSorter: {
      return {
        ...state,
        sorter: action?.payload,
      };
    }

    default:
      return state;
  }
};

const ListLayout = <RecordType extends object = any>(
  props: BlRecordListLayoutProps<RecordType>,
) => {
  const {
    // filter
    filterList = [], // 筛选列表
    requestFn, // 请求接口函数，接收format后的params
    refreshMarker, // 刷新标识，需要刷新时，传变化的值（如：当前时间戳）
    resetRefreshMarker, // 重置刷新标识，需要刷新时，传变化的值（如：当前时间戳）
    formatDataToFormDisplay, // 处理从url获取filter后去(FilterList)展示在搜索栏里面的转换函数
    useFilterConfig, // 是否启用筛选列配置
    // header
    mainMenu, // 主页操作菜单（button,menu）
    batchMenu,
    // 批量操作菜单（只有button）,批量操作onClick有两种处理结果的方式
    // 1.返回promise,resolve=success,reject=fail
    // 2.在onClick中接收success和fail回调处理
    // 3.在resolve()或success()后会自动关闭选择状态，置空selectRowKey,结束loading，刷新页面
    placeholder = '输入内容，回车快速查询', // 快速搜索input placeholder
    useQuickFilter = true, // 是否使用快速搜索功能,默认为true
    // info
    formatDataToQuery, // 转换搜索条件进行查询（快速查询字段："quickSearch",当前页："page",分页大小："size",排序："sorter"）
    formatDataToDisplay = (params) => params, // 转换搜索条件进行展示(RecordListHeader)
    // table
    columns, // table columns
    rowKey = 'id', // 行选择key,默认'id'
    useIndex = true, // 列表序号列是否展示，默认启用
    resizableCol = true, // 列表伸缩，默认启用
    useColConfig = true, // 列配置开关，默认启用
    configcacheKey, // 配置缓存Key,用于table和filter配置缓存标识
    pagination,
    // base
    style = {},
    useFilterWithUrl = true, // 是否使用url记录查询条件
    selectedRowKeys, // 选中行key,全选时返回["BlSelectAll"]
    onSelectedRowKeys, // 选中行回调
    filterContaniner, // filter 抽屉挂载的 HTML 节点, false 为挂载在当前 dom，默认挂载在window上
    expandable,
    customDataSource,
    isLoading,
    userAuth,
    getOperationList,
    maxOperationCount,
    delayLoadTime,
  } = props;

  useEffect(() => {
    if (customDataSource) {
      setDataSource(customDataSource);
    }
  }, [customDataSource]);

  useEffect(() => {
    dispatch({ type: LIST_REDUCER_TYPE.ChangeLoading, payload: isLoading });
  }, [isLoading]);

  const [dataSource, setDataSource] = useState<RecordType[]>([]);

  const isFirstRef = useRef(true);

  const [listLayoutState, dispatch] = useReducer(listLayoutReducer, listLayoutInitState);

  /**
   * 把查询数据同步到url上
   */
  const setFilterToUrl = (params: ListLayoutQueryParams) => {
    // 是否使用url记录query
    if (!useFilterWithUrl) return;
    const { quickFilterData, filterData, pagination, sorter } = params;

    const _params: ListLayoutQueryParams = {
      pagination: {
        page: pagination?.page ?? 1,
        size: pagination?.size ?? 20,
      },
    };

    if (!_.isEmpty(quickFilterData?.quickSearch)) {
      _params.quickFilterData = quickFilterData;
    } else {
      _params.filterData = filterData;
    }

    if (sorter) {
      _params.sorter = sorter;
    }

    setRecordListUrlParams(_params);
  };

  const handleAfterFetchData = (response: TableResponseData) => {
    setDataSource(response?.data?.list ?? []);
    isFirstRef.current = false;
  };

  /**
   * 重置各种store
   * @param response
   * @param resetList
   */
  const resetStore = (resetList: LIST_REDUCER_TYPE[], response: any) => {
    // 置空精确搜索
    if (_.includes(resetList, LIST_REDUCER_TYPE.SetFliterData)) {
      dispatch({ type: LIST_REDUCER_TYPE.SetFliterData, payload: {} });
    }

    // 置空快速搜索
    if (_.includes(resetList, LIST_REDUCER_TYPE.SetQuickFilterData)) {
      dispatch({ type: LIST_REDUCER_TYPE.SetQuickFilterData, payload: undefined });
    }

    // 重置排序
    if (_.includes(resetList, LIST_REDUCER_TYPE.SetSorter)) {
      dispatch({ type: LIST_REDUCER_TYPE.SetSorter, payload: undefined });
    }

    // 重置分页
    if (_.includes(resetList, LIST_REDUCER_TYPE.SetPagination)) {
      dispatch({
        type: LIST_REDUCER_TYPE.SetPagination,
        payload: { ...DEFAULT_PAGE, total: response?.data?.total ?? 0 },
      });
    }
  };

  const fetchData = async (
    params: ListLayoutQueryParams,
    successCB?: (responseData: TableResponseData) => void,
    failCB?: () => void,
  ) => {
    if (listLayoutState.isLoading || typeof requestFn !== 'function') return;
    dispatch({ type: LIST_REDUCER_TYPE.ChangeLoading, payload: true });

    const { quickFilterData, filterData, pagination, sorter } = params;
    const queryParams = {
      page: pagination?.page,
      size: pagination?.size,
      ...quickFilterData,
      ...filterData,
      sorter,
    };

    const afterFormatParams =
      typeof formatDataToQuery === 'function' ? formatDataToQuery(queryParams) : queryParams;

    let requestOrNot = requestFn;

    if (!_.isNil(delayLoadTime)) {
      await pauseSomeTime(Number(delayLoadTime));
    }
    for (const key in afterFormatParams) {
      if (afterFormatParams[key] === KNOWN_EMPTY_LIST_PARAM) {
        requestOrNot = () => {
          return Promise.resolve({
            data: {
              list: [],
              total: 0,
            },
          });
        };
        break;
      }
    }
    requestOrNot(afterFormatParams)
      .then((json: TableResponseData) => {
        handleAfterFetchData(json);

        typeof successCB === 'function' && successCB(json);

        return undefined;
      })
      .finally(() => {
        dispatch({ type: LIST_REDUCER_TYPE.ChangeLoading, payload: false });
      })
      .catch(() => {
        typeof failCB === 'function' && failCB();
      });
  };

  /**
   * 刷新页面
   */
  const handleRefresh = (reset?: boolean) => {
    const { quickFilterData, filterData, pagination, sorter, isSelectMode } = listLayoutState;
    let params: ListLayoutQueryParams;

    if (reset) {
      /** 重置刷新 */
      params = {
        quickFilterData: { quickSearch: '' },
        filterData: {},
        pagination: {
          ...pagination,
          ...DEFAULT_PAGE,
        },
        sorter: undefined,
      };
    } else {
      /** 刷新 */
      params = {
        quickFilterData,
        filterData,
        pagination,
        sorter,
      };
    }

    // 刷新数据时必须恢复查询状态 1.选择为空 2.选择状态关闭
    if (isSelectMode) {
      dispatch?.({ type: LIST_REDUCER_TYPE.ChangeSelectMode, payload: false });
    }

    fetchData(params, (response) => {
      dispatch({
        type: LIST_REDUCER_TYPE.SetPagination,
        payload: { total: response?.data?.total ?? 0 },
      });

      if (reset) {
        setFilterToUrl(params);

        // 重置精确搜索,快速搜索,分页,排序
        resetStore(
          [
            LIST_REDUCER_TYPE.SetFliterData,
            LIST_REDUCER_TYPE.SetQuickFilterData,
            LIST_REDUCER_TYPE.SetPagination,
            LIST_REDUCER_TYPE.SetSorter,
          ],
          response,
        );
      }
    });
  };

  /**
   * 精确搜索处理（只查询精确搜索内容，page自动改到第一页，置空快速搜索）
   */
  const handleFilterQuery = (newFilters: any = {}) => {
    if (_.isEmpty(filterList)) return;

    const { pagination, sorter } = listLayoutState;

    const params: ListLayoutQueryParams = {
      filterData: newFilters,
      pagination: {
        ...pagination,
        ...DEFAULT_PAGE,
      },
      sorter,
    };

    fetchData(params, (response) => {
      dispatch({ type: LIST_REDUCER_TYPE.SetFliterData, payload: newFilters });
      dispatch({ type: LIST_REDUCER_TYPE.ChangeFilter, payload: false });

      setFilterToUrl(params);

      // 重置快速搜索,分页
      resetStore([LIST_REDUCER_TYPE.SetQuickFilterData, LIST_REDUCER_TYPE.SetPagination], response);
    });
  };

  /**
   * 快速搜索处理（只查询快速搜索内容，page自动改到第一页，置空精确搜索）
   */
  const handleQuickFilterQuery = (newQuickSearch: string = '') => {
    if (!useQuickFilter) return;

    const { pagination, sorter } = listLayoutState;

    const params: ListLayoutQueryParams = {
      quickFilterData: { quickSearch: newQuickSearch },
      pagination: {
        ...pagination,
        ...DEFAULT_PAGE,
      },
      sorter,
    };

    fetchData(params, (response) => {
      dispatch({ type: LIST_REDUCER_TYPE.SetQuickFilterData, payload: newQuickSearch });

      setFilterToUrl(params);

      // 重置精确搜索,分页
      resetStore([LIST_REDUCER_TYPE.SetFliterData, LIST_REDUCER_TYPE.SetPagination], response);
    });
  };

  /**
   * 列表变化处理（查询参数不变，分页改变）
   */
  const handleTableChangeQuery = (
    newParams: ListLayoutQueryParams,
    action: 'paginate' | 'sort',
  ) => {
    const { filterData, quickFilterData, pagination, sorter } = listLayoutState;
    const params: ListLayoutQueryParams = {
      filterData,
      quickFilterData,
      pagination,
      sorter,
    };

    if (action === 'paginate') {
      params.pagination = newParams.pagination;
    }
    if (action === 'sort') {
      params.sorter = newParams.sorter;
    }

    fetchData(params, () => {
      if (action === 'paginate') {
        dispatch({
          type: LIST_REDUCER_TYPE.SetPagination,
          payload: {
            page: newParams?.pagination?.page,
            size: newParams?.pagination?.size,
          },
        });
      }

      if (action === 'sort') {
        dispatch({
          type: LIST_REDUCER_TYPE.SetSorter,
          payload: params.sorter,
        });
      }
      setFilterToUrl(params);
    });
  };

  const pauseSomeTime = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  // 初始化和外部主动刷新页面
  useEffect(() => {
    if (isFirstRef.current) {
      // 使用url记录filter
      if (useFilterWithUrl) {
        const urlParams = getRecordListUrlParams();

        // eslint-disable-next-line prefer-const
        let { quickFilterData, filterData, pagination = { page: 1, size: 20 }, sorter } = urlParams;

        //  区别处理快速搜索和精确搜索
        if (!_.isEmpty(quickFilterData?.quickSearch)) {
          filterData = {};
        } else if (!_.isEmpty(filterData)) {
          quickFilterData = undefined;
        }

        fetchData({ quickFilterData, filterData, pagination, sorter }, (response) => {
          dispatch({
            type: LIST_REDUCER_TYPE.SetPagination,
            payload: { ...pagination, total: response?.data?.total ?? 0 },
          });
          !_.isEmpty(quickFilterData?.quickSearch) &&
            dispatch({
              type: LIST_REDUCER_TYPE.SetQuickFilterData,
              payload: quickFilterData?.quickSearch,
            });
          !_.isEmpty(filterData) &&
            dispatch({
              type: LIST_REDUCER_TYPE.SetFliterData,
              payload: filterData,
            });
          !_.isEmpty(sorter) &&
            dispatch({
              type: LIST_REDUCER_TYPE.SetSorter,
              payload: sorter,
            });
          setFilterToUrl({
            quickFilterData,
            filterData,
            pagination,
            sorter,
          });
        });
      } else {
        handleRefresh();
      }

      isFirstRef.current = false;
    } else {
      handleRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshMarker]);

  useEffect(() => {
    if (resetRefreshMarker) {
      handleRefresh(true);
    }
  }, [resetRefreshMarker]);

  return (
    <div className={'bl-listLayout'} id={'bl-list-layout'} style={style}>
      <ListLayoutContext.Provider value={{ dispatch, listLayoutState }}>
        <RecordListHeader
          filterList={filterList}
          batchMenu={batchMenu}
          mainMenu={mainMenu}
          userAuth={userAuth}
          placeholder={placeholder}
          useQuickFilter={useQuickFilter}
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeys={onSelectedRowKeys}
          formatDataToDisplay={formatDataToDisplay}
          onChangeFilter={({ type, filter }) => {
            if (type === 'quickSearch') handleQuickFilterQuery(filter);
            if (type === 'refresh') handleRefresh();
          }}
        />
        {/* <RecordListInfo
          filterList={filterList}
          onChangeFilter={handleFilterQuery}
          formatDataToDisplay={formatDataToDisplay}
        /> */}
        <RecordListBody
          rowKey={rowKey}
          columns={columns}
          useIndex={useIndex}
          dataSource={dataSource}
          resizableCol={resizableCol}
          useColConfig={useColConfig}
          configcacheKey={configcacheKey}
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeys={onSelectedRowKeys}
          onChangeFilter={handleTableChangeQuery}
          expandable={expandable || {}}
          userAuth={userAuth}
          getOperationList={getOperationList}
          maxOperationCount={maxOperationCount}
          pagination={pagination}
        />
        <FilterList
          filterList={filterList}
          configcacheKey={configcacheKey}
          useFilterConfig={useFilterConfig}
          handleFilter={handleFilterQuery}
          formatDataToFormDisplay={formatDataToFormDisplay}
          defaultFilterValue={listLayoutState.filterData}
          visible={listLayoutState.filterVisiable}
          filterContaniner={filterContaniner}
          handleClose={() => dispatch({ type: LIST_REDUCER_TYPE.ChangeFilter, payload: false })}
        />
      </ListLayoutContext.Provider>
    </div>
  );
};

export default ListLayout;
