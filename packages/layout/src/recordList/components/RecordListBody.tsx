import React, { useContext, useEffect, useRef } from 'react';
import _, { isEmpty, get, remove, uniq, uniqWith, isEqual, isUndefined, isNumber } from 'lodash';
//
import { BlColumnsType, BlTable } from '@blacklake-web/component';
//
import { BL_SELECTED_ALL, ListLayoutContext, LIST_REDUCER_TYPE } from '../constants';
import '../styles.less';
import {
  BlSelectedRowKeys,
  BlRecordListBaseProps,
  ListLayoutQueryParams,
  FormatDataToQueryDataSorter,
} from '../recordListLayout.type';

export interface RecordListBodyProps<RecordType> extends BlRecordListBaseProps {
  /** 开启列表勾选功能时必传，勾选列表的key值 */
  rowKey?: ((record: RecordType) => string | number) | string;
  /** table 的 columns*/
  columns: BlColumnsType<RecordType>;
  /**
   * 是否启用 table  的列配置
   * @default true
   */
  useColConfig?: boolean;
  /**
   * 是否启用table 默认序号
   * @default true
   */
  useIndex?: boolean;
  /** 缓存时相关标识 */
  configcacheKey?: string;
  /**内部状态 */
  dataSource?: RecordType[];
  /**内部状态 */
  onChangeFilter?: (filter: ListLayoutQueryParams, action: 'paginate' | 'sort') => void;
  /**
   * table的可扩展配置
   */
  expandable?: any;
}

const BL_LIST_LAYOUT_BODY = 'bl-list-layout-body';

const getSorterInfo = (dataIndex, sorter?: FormatDataToQueryDataSorter[]) => {
  if (isEmpty(sorter) || isUndefined(sorter)) {
    return null;
  }

  const index = (sorter ?? []).findIndex((item) => isEqual(item.field, dataIndex));

  if (isNumber(index) && index !== -1) {
    return sorter?.[index];
  } else {
    return null;
  }
};

const RecordListBody = <RecordType extends object = any>(
  props: RecordListBodyProps<RecordType>,
) => {
  const {
    dataSource,
    selectedRowKeys = [],
    onSelectedRowKeys,
    columns = [],
    rowKey = 'id',
    onChangeFilter,
    useColConfig,
    useIndex = true,
    configcacheKey,
    expandable,
  } = props;

  const { listLayoutState, dispatch } = useContext(ListLayoutContext);

  const deleteSelectedRowRef = useRef<any[]>([]); // 缓存每次需要取消选中时的那行数据
  const selectedRowsRef = useRef<any[]>([]); // 缓存选择的selectedRows,不受控

  const maxHeight =
    (document.getElementById(BL_LIST_LAYOUT_BODY)?.clientHeight ?? 120) - 120 || 'max-content';

  useEffect(() => {
    // 当取消选择模式时，置空所以状态
    if (!listLayoutState.isSelectMode) {
      typeof onSelectedRowKeys === 'function' && onSelectedRowKeys([], []);
      deleteSelectedRowRef.current = [];
      selectedRowsRef.current = [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listLayoutState.isSelectMode]);

  // eslint-disable-next-line no-shadow
  const handleSelectRowKeys = (selectedKeys: BlSelectedRowKeys, selectedRows: any[]) => {
    if (!listLayoutState.isSelectMode) {
      dispatch?.({ type: LIST_REDUCER_TYPE.ChangeSelectMode, payload: true });
    }

    selectedRowsRef.current = selectedRows;
    typeof onSelectedRowKeys === 'function' && onSelectedRowKeys(selectedKeys, selectedRows);
  };

  const handleTablechange = (pagination: any, _filters: any, sorter: any, extra: any) => {
    const { action } = extra;

    const newTableData: ListLayoutQueryParams = {
      pagination: {
        page: pagination.current,
        size: pagination.pageSize,
      },
      sorter: undefined,
    };

    if (action === 'sort') {
      if (!isEmpty(sorter)) {
        // 数组时为多列同时排序，数组长度为排序字段数量
        if (Array.isArray(sorter)) {
          newTableData.sorter = sorter.map(({ field, order }) => ({
            field,
            order,
          }));
        } else if (sorter.order) {
          // 单列排序，可能没有排序状态
          newTableData.sorter = [
            {
              field: sorter.field,
              order: sorter.order,
            },
          ];
        }
      }
    }

    typeof onChangeFilter === 'function' && onChangeFilter(newTableData, action);
  };

  /**
   * 获取 行选择 配置
   */
  const getRowSelection = () => {
    const isNeedRowSelect = selectedRowKeys && onSelectedRowKeys;
    const { total } = listLayoutState.pagination;
    const isSelectAll = selectedRowKeys[0] === BL_SELECTED_ALL;
    const isCheckboxDisabled = isSelectAll || listLayoutState.filterVisiable;

    if (isNeedRowSelect) {
      return {
        columnWidth: 60,
        selectedRowKeys,
        onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
          // 只有当在删除的时候记录需要被删除的行到 deleteSelectedRowRef 上,选中时 deleteSelectedRowRef 置为空
          if (selected) {
            deleteSelectedRowRef.current = [];
          } else {
            deleteSelectedRowRef.current = changeRows;
          }
        },
        onSelect: (record: any, selected: boolean) => {
          // 只有当在删除的时候记录需要被删除的行到 deleteSelectedRowRef 上,选中时 deleteSelectedRowRef 置为空
          if (selected) {
            deleteSelectedRowRef.current = [];
          } else {
            deleteSelectedRowRef.current = [record];
          }
        },
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
          let newSelectedKeys = [...selectedRowKeys];
          let newSelectedRows = [...selectedRowsRef.current];

          if (isEmpty(deleteSelectedRowRef.current)) {
            // deleteSelectedRowRef.current 为空时代表添加选中，push新选中后去重
            newSelectedKeys.push(...selectedKeys);
            newSelectedRows.push(...selectedRows);

            newSelectedKeys = uniq(newSelectedKeys);
            newSelectedRows = uniqWith(newSelectedRows, isEqual);
          } else {
            // deleteSelectedRowRef.current 不为空时代表删除选中，移出deleteSelectedRowRef.current中的选项

            deleteSelectedRowRef.current.forEach((record) => {
              let needDeleteKey: React.Key;

              if (typeof rowKey === 'function') {
                needDeleteKey = rowKey(record);
              } else {
                needDeleteKey = get(record, rowKey);
              }

              remove(newSelectedKeys, (key) => key === needDeleteKey);
              remove(newSelectedRows, (row) => {
                if (typeof rowKey === 'function') {
                  return rowKey(row) === needDeleteKey;
                }
                return needDeleteKey === get(row, rowKey);
              });
            });
          }

          handleSelectRowKeys(newSelectedKeys, newSelectedRows);
        },
        getCheckboxProps: (record: RecordType) => ({
          name: (record as any).title,
          disabled: isCheckboxDisabled,
        }),
        // 暂不需要支持
        // selections: [
        //   {
        //     key: 'selectAll',
        //     text: isSelectAll ? `取消全部${total}条` : `选择全部${total}条`,
        //     onSelect: () => {
        //       isSelectAll
        //         ? handleSelectRowKeys([], [])
        //         : handleSelectRowKeys([BL_SELECTED_ALL], [BL_SELECTED_ALL]);
        //     },
        //   },
        // ],
      };
    }
    return undefined;
  };

  const getColumns = () => {
    return columns.map((item) => {
      if (item?.sorter) {
        // eslint-disable-next-line no-param-reassign
        item.sortOrder = getSorterInfo(item.dataIndex, listLayoutState?.sorter)?.order ?? null;
      }
      return item;
    });
  };

  return (
    <div className={'bl-listLayout-body'} id={BL_LIST_LAYOUT_BODY}>
      <BlTable<RecordType>
        // resizableCol
        loading={listLayoutState.isLoading}
        dataSource={dataSource}
        columns={getColumns()}
        rowKey={rowKey}
        sticky
        useColConfig={useColConfig}
        tableConfigKey={configcacheKey}
        rowSelection={getRowSelection()}
        onChange={handleTablechange}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current: listLayoutState.pagination.page,
          pageSize: listLayoutState.pagination.size,
          total: listLayoutState.pagination.total,
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 'max-content', y: maxHeight }}
        expandable={expandable || {}}
        useIndex={useIndex}
      />
    </div>
  );
};

export default RecordListBody;
