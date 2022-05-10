import React, { useContext, useEffect, useRef } from 'react';
import _, { isEmpty, get, remove, uniq, uniqWith, isEqual, isUndefined, isNumber } from 'lodash';
import { Button, Dropdown, Menu, Popconfirm, PopconfirmProps, TableProps } from 'antd';
//
import { BlColumnsType, BlTable, BlIcon } from '@blacklake-web/component';
import { SortOrder } from 'antd/lib/table/interface';
//
import ReasonPopconfirm, { ReasonConformCallback } from '../../components/reasonPopconfirm';
import {
  BL_SELECTED_ALL,
  ListLayoutContext,
  LIST_REDUCER_TYPE,
  CELL_PADDING,
  OPERATION_BUTTON_SPACE,
  FONT_SIZE,
  DEFAULT_WIDTH,
} from '../constants';
import '../styles.less';
import {
  BlSelectedRowKeys,
  BlRecordListBaseProps,
  ListLayoutQueryParams,
  FormatDataToQueryDataSorter,
  OperationListItem,
} from '../recordListLayout.type';

type BlSortOrder = 'asc' | 'desc';

const toBlOrderMap = new Map<SortOrder, BlSortOrder>([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);

const toAntdOrderMap = new Map<BlSortOrder, SortOrder>([
  ['asc', 'ascend'],
  ['desc', 'descend'],
]);

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
  /**
   * 是否启用列伸缩
   * @default true
   */
  resizableCol?: boolean;
  /**内部状态 */
  dataSource?: RecordType[];
  /**内部状态 */
  onChangeFilter?: (filter: ListLayoutQueryParams, action: 'paginate' | 'sort') => void;
  /**
   * table的可扩展配置
   */
  expandable?: any;
  /** 添加操作列 */
  getOperationList?: (record: any, index?: number) => OperationListItem[];
  /** 暴露的操作按钮数量, 默认2 */
  maxOperationCount?: number;
  /** 列表的分页设置 */
  pagination?: TableProps<RecordType>['pagination'];
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
    resizableCol = true,
    configcacheKey,
    expandable,
    userAuth = [],
    getOperationList,
    maxOperationCount = 2,
    pagination,
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
    } else if (listLayoutState.isSelectMode && isEmpty(selectedKeys)) {
      dispatch?.({ type: LIST_REDUCER_TYPE.ChangeSelectMode, payload: false });
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
            order: toBlOrderMap.get(order) ?? 'asc',
          }));
        } else if (sorter.order) {
          // 单列排序，可能没有排序状态
          newTableData.sorter = [
            {
              field: sorter.field,
              order: toBlOrderMap.get(sorter.order) ?? 'asc',
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
        selections: [
          {
            key: 'selectAll',
            text: isSelectAll ? `取消全部${total}条` : `选择全部${total}条`,
            onSelect: () => {
              isSelectAll
                ? handleSelectRowKeys([], [])
                : handleSelectRowKeys([BL_SELECTED_ALL], [BL_SELECTED_ALL]);
            },
          },
        ],
      };
    }
    return undefined;
  };

  const getColumns = () => {
    const results = columns.map((item) => {
      const newItem = { ...item };
      if (item?.sorter) {
        const blOrder = getSorterInfo(item.dataIndex, listLayoutState?.sorter)?.order;
        // eslint-disable-next-line no-param-reassign
        newItem.sortOrder = blOrder ? toAntdOrderMap.get(blOrder) : null;
      }
      return newItem;
    });

    // 添加操作列
    if (_.isFunction(getOperationList)) {
      // 计算操作列宽: 调一下 getOperationList, 获得经过权限过滤后的按钮数
      const visibleOps = getOperationList({}).filter((i) => !i.auth || userAuth.includes(i.auth));
      const textNumber =
        _.sumBy(visibleOps.slice(0, maxOperationCount), 'title.length') +
        (visibleOps.length > maxOperationCount ? 1 : 0);
      const contentWidth =
        CELL_PADDING * 2 +
        Math.min(visibleOps.length - 1, maxOperationCount) * OPERATION_BUTTON_SPACE +
        textNumber * FONT_SIZE;

      results.push({
        title: _.isEmpty(visibleOps) ? '' : '操作',
        key: 'operation-column',
        className: 'operation-column',
        fixed: 'right',
        // 在操作列较窄时, 附加一个宽度, 防止列标题与齿轮icon重合
        width: visibleOps.length <= 1 ? contentWidth + DEFAULT_WIDTH : contentWidth,
        render: (__: unknown, record, index) => {
          // 根据权限点过滤操作按钮。不传视为无权限控制
          const ops = getOperationList!(record, index).filter(
            (i) => !i.auth || userAuth.includes(i.auth),
          );
          // 前两个操作展示为按钮
          const buttons = ops.slice(0, maxOperationCount).map(renderButton);
          // 后面的操作收进下拉框
          const dropdown =
            ops.length > maxOperationCount ? (
              <Dropdown overlay={<Menu>{ops.slice(maxOperationCount).map(renderMenuItem)}</Menu>}>
                <Button type="link">
                  <BlIcon type="icongengduo" />
                </Button>
              </Dropdown>
            ) : null;

          return (
            <>
              {buttons}
              {dropdown}
            </>
          );
        },
      });
    }

    return results;
  };

  const getPagination = (): TableProps<RecordType>['pagination'] => {
    const defaultPagination: TableProps<RecordType>['pagination'] = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: listLayoutState.pagination.page,
      pageSize: listLayoutState.pagination.size,
      total: listLayoutState.pagination.total,
      size: 'default',
      showTotal: (total) => `共 ${total} 条`,
    };

    if (pagination === false) return false;

    if (pagination && typeof pagination === 'object') {
      const { current, pageSize, total, size, ...resPagition } = pagination;

      return {
        ...defaultPagination,
        ...resPagition,
      };
    }

    return defaultPagination;
  };

  const renderButton = (item: OperationListItem) => {
    const disabled = item?.disabled ?? false;

    if (!disabled) {
      if (item?.popconfirm) {
        const defaultPopconfirm: PopconfirmProps = {
          placement: 'topRight',
          okText: '确定',
          cancelText: '取消',
          title: `确定要${item.title}吗?`,
        };
        const customPopconfirm = _.isObject(item?.popconfirm) ? item?.popconfirm : {};
  
        return (
          <Popconfirm
            key={item.title}
            {...defaultPopconfirm}
            {...customPopconfirm}
            disabled={disabled}
            onConfirm={item.onClick}
          >
            <Button key={item.title} type="link" disabled={disabled}>
              {item.title}
            </Button>
          </Popconfirm>
        );
      }
      if (item?.reasonconfirm) {
        const reasonconfirmProps = _.isPlainObject(item.reasonconfirm)
          ? item.reasonconfirm
          : {};
        return (
          <ReasonPopconfirm
            opName={item.title}
            onConfirm={item.onClick as unknown as ReasonConformCallback}
            {...reasonconfirmProps}
          >
            <Button key={item.title} type="link" disabled={disabled}>
              {item.title}
            </Button>
          </ReasonPopconfirm>
        );
      }
    }
    return (
      <Button key={item.title} type="link" disabled={disabled} onClick={item?.onClick}>
        {item.title}
      </Button>
    );
  };

  const renderMenuItem = (item: OperationListItem) => {
    const disabled = item?.disabled ?? false;

    if (item?.popconfirm) {
      const defaultPopconfirm: PopconfirmProps = {
        placement: 'topRight',
        okText: '确定',
        cancelText: '取消',
        title: `确定要${item.title}吗?`,
      };
      const customPopconfirm = _.isObject(item?.popconfirm) ? item?.popconfirm : {};

      return (
        <Popconfirm
          key={item.title}
          {...defaultPopconfirm}
          {...customPopconfirm}
          disabled={disabled}
          onConfirm={item.onClick}
        >
          <Menu.Item key={item.title} disabled={disabled}>
            {item.title}
          </Menu.Item>
        </Popconfirm>
      );
    }
    return (
      <Menu.Item key={item.title} disabled={disabled} onClick={item.onClick}>
        {item.title}
      </Menu.Item>
    );
  };

  return (
    <div className={'bl-listLayout-body'} id={BL_LIST_LAYOUT_BODY}>
      <BlTable<RecordType>
        resizableCol={resizableCol}
        loading={listLayoutState.isLoading}
        dataSource={dataSource}
        columns={getColumns()}
        rowKey={rowKey}
        size="middle"
        sticky
        useColConfig={useColConfig}
        tableConfigKey={configcacheKey}
        rowSelection={getRowSelection()}
        onChange={handleTablechange}
        pagination={getPagination()}
        scroll={{ x: 'max-content', y: maxHeight }}
        expandable={expandable || {}}
        useIndex={useIndex}
      />
    </div>
  );
};

export default RecordListBody;
