import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, Menu, Input, Space, Dropdown, Divider, PopconfirmProps, Popconfirm } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';
import { filterListAuth } from '../../utils';
//
import { BL_SELECTED_ALL, ListLayoutContext, LIST_REDUCER_TYPE } from '../constants';
import { BlRecordListBaseProps } from '../recordListLayout.type';
import { AfterFormatData, objToKeyValueAry } from './RecordListInfo';
import '../styles.less';
import getOperationIcon from '../../components/operationIcon';

// 当前是否时生产环境  过滤导入导出按钮的临时方案，后面要删掉的！！！！！
const isProdEnv = !['feature', 'test', 'localhost'].filter((envKeyword) => {
  return location.host.includes(envKeyword);
}).length;

// 列表头button
interface RecordListHeaderButtonType {
  title: string;
  disabled?: boolean;
  // 批量操作时，1. onClick return Promise自动做后续处理  2.onClick 用success,fail回调函数手动做后续处理
  onClick?: (success?: () => void, fail?: () => void) => void | Promise<any>;
  icon?: React.ReactNode;
  /** 每个操作带有的权限点 */
  auth?: string;
  /** 二次确认弹窗 */
  popconfirm?: PopconfirmProps;
  showExport?: boolean;
}

// 列表头menu
interface RecordListHeaderMenuType extends RecordListHeaderButtonType {
  /**
   * 存在时作为主操作按钮显示
   */
  items?: RecordListHeaderButtonType[];
  /**
   * 只有在items存在时，才会用到此属性，开启时主按钮不再具有单独功能，只有展示功能
   */
  isPureDropdown?: boolean;
}

export interface RecordListHeaderProps extends BlRecordListBaseProps {
  /**
   * 快速查询占位提示语
   * @default '输入内容，回车快速查询'
   */
  placeholder?: string;
  /**
   * 是否启用快速搜索功能
   * @default false
   */
  useQuickFilter?: boolean;
  /** 批量操作按钮列表 */
  batchMenu?: RecordListHeaderButtonType[];
  /** 主操作按钮列表 */
  mainMenu?: RecordListHeaderMenuType[];
  /** 格式化查询数据做 tag展示*/
  formatDataToDisplay?: (formData: any) => AfterFormatData;
  /**内部状态 */
  onChangeFilter?: (filterData: { type: 'refresh' | 'quickSearch'; filter: any }) => void;
}

const RecordListHeader = (props: RecordListHeaderProps) => {
  const {
    placeholder = '输入内容，回车快速查询',
    useQuickFilter = true,
    filterList = [],
    batchMenu,
    mainMenu,
    selectedRowKeys = [],
    formatDataToDisplay,
    onChangeFilter,
    userAuth = [],
  } = props;

  const [isLoading, setIsLoading] = useState('');
  const [quickSearch, setQuickSearch] = useState<string | undefined>('');

  const { dispatch, listLayoutState } = useContext(ListLayoutContext);

  useEffect(() => {
    setQuickSearch(listLayoutState.quickFilterData.quickSearch);
  }, [listLayoutState.quickFilterData]);

  const endSelectMode = () => {
    if (listLayoutState.isSelectMode) {
      dispatch?.({ type: LIST_REDUCER_TYPE.ChangeSelectMode, payload: false });
    }
  };

  /**
   * 格式化mainMenu的列表，1.过滤权限点
   */
  const formatMainMenu = (
    mainMenu: RecordListHeaderProps['mainMenu'],
  ): RecordListHeaderProps['mainMenu'] => {
    const newMainMenu: RecordListHeaderProps['mainMenu'] = [];

    _.forEach(mainMenu, ({ auth, ...res }) => {
      // 如果不需要权限点控制 或 当前用户有权限时
      if (!auth || userAuth.includes(auth)) {
        // 如果存在items子集，需要过滤子集权限点
        if (_.has(res, 'items')) {
          const newItems = filterListAuth(res?.items ?? [], userAuth);
          newMainMenu.push({ auth, ...res, items: newItems });
        } else {
          newMainMenu.push({ auth, ...res });
        }
      } else {
        // 没有权限的，且存在items子集的，且不是用于展示下拉的操作，需要把有权限的子集进行替换
        if (_.has(res, 'items') && !res?.isPureDropdown) {
          const newItems = filterListAuth(res?.items ?? [], userAuth);
          const firstItem = _.head(newItems);

          if (firstItem) {
            newMainMenu.push({ ...firstItem, items: _.drop(newItems) });
          }
        }
      }
    });

    // --------- 过滤导入导出按钮的临时方案，后面要删掉的！！！！！----------------------
    if (isProdEnv) {
      const _list: RecordListHeaderProps['mainMenu'] = [];

      _.forEach(newMainMenu, (item) => {
        // 增加showExport属性，以便可以根据具体进度部分展示导入导出按钮
        if (item.showExport || (!item.title?.includes('导入') && !item.title?.includes('导出'))) {
          let newItem = item;

          if (!_.isEmpty(item.items)) {
            newItem.items = _.filter(item.items, ({ title, showExport }) => {
              return showExport || (!title?.includes('导入') && !title?.includes('导出'));
            });
          }

          _list.push(newItem);
        }
      });

      return _list;
    }
    // --------- 过滤导入导出按钮的临时方案，后面要删掉的！！！！！----------------------

    return newMainMenu;
  };

  /**
   * 1.关闭end行选择模式 2.清空selectRowKey 3.结束loading状态 4.刷新页面
   */
  const onSuccess = () => {
    endSelectMode();

    setIsLoading('');

    typeof onChangeFilter === 'function' && onChangeFilter({ type: 'refresh', filter: '' });
  };

  /**
   * 1.结束loading状态
   */
  const onFail = () => {
    setIsLoading('');
  };

  /**
   * 对batchMenu的 button onClick 事件包装处理
   * @param buttonItem
   */
  const handleBatchButtonClick = (buttonItem: RecordListHeaderButtonType) => {
    setIsLoading(buttonItem.title);
    const result = buttonItem?.onClick?.(onSuccess, onFail);

    if (result instanceof Promise) {
      result
        .then(() => {
          onSuccess();
          return null;
        })
        .catch(() => {
          onFail();
        });
    }
  };

  /**
   * 快速查询回车处理
   */
  const handleQuickPress: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    handleQuickSearch(quickSearch);
  };

  const handleQuickSearch = (value) => {
    typeof onChangeFilter === 'function' && onChangeFilter({ type: 'quickSearch', filter: value });
  };

  /**
   * batchMenu 的 Button操作
   * @returns
   */
  const renderBatchMenuButton = (item: RecordListHeaderButtonType) => {
    const disabled = (item?.disabled ?? false) || !!isLoading || selectedRowKeys.length === 0;

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
          onConfirm={() => {
            handleBatchButtonClick(item);
          }}
        >
          <Button
            type={'text'}
            style={{ paddingLeft: 0, paddingRight: 0 }}
            loading={isLoading === item.title}
            disabled={disabled}
            icon={getOperationIcon({ title: item.title, customIcon: item?.icon })}
          >
            {item.title?.split('').join('  ')}
          </Button>
        </Popconfirm>
      );
    }

    return (
      <Button
        type={'text'}
        style={{ paddingLeft: 0, paddingRight: 0 }}
        key={item.title}
        loading={isLoading === item.title}
        disabled={disabled}
        onClick={() => {
          handleBatchButtonClick(item);
        }}
        icon={getOperationIcon({ title: item.title, customIcon: item?.icon })}
      >
        {item.title?.split('').join('  ')}
      </Button>
    );
  };

  /**
   * mainMenu的 button式操作
   */
  const renerMainMenuButton = (item: RecordListHeaderButtonType) => {
    return (
      <Button
        key={item.title}
        loading={isLoading === item.title}
        type={'text'}
        style={{ paddingLeft: 0, paddingRight: 0 }}
        disabled={(item?.disabled ?? false) || !!isLoading}
        onClick={() => {
          item?.onClick?.();
        }}
        icon={getOperationIcon({ title: item.title, customIcon: item?.icon })}
      >
        {item.title}
      </Button>
    );
  };

  /**
   *  mainMenu的 menu式操作
   * @returns
   */
  const renderMainMenuMenu = (menu: RecordListHeaderMenuType) => {
    const hasMenuItem = !_.isEmpty(menu?.items);
    const isPureDropdown = _.get(menu, 'isPureDropdown', false);
    const menuComponents = hasMenuItem ? (
      <Menu style={{ width: 113 }}>
        {(menu.items ?? []).map((subItem) => (
          <Menu.Item
            key={subItem.title}
            disabled={(subItem?.disabled ?? false) || !!isLoading}
            onClick={() => {
              subItem.onClick?.();
            }}
            // 收起的不需要icon
            // icon={subItem?.icon}
          >
            {subItem.title}
          </Menu.Item>
        ))}
      </Menu>
    ) : (
      <span />
    );

    if (hasMenuItem) {
      if (isPureDropdown) {
        return (
          <Dropdown key={menu.title} overlay={menuComponents}>
            <Button
              type={'primary'}
              icon={getOperationIcon({ title: menu.title, customIcon: menu?.icon })}
            >
              {menu.title}
            </Button>
          </Dropdown>
        );
      }

      return (
        <Dropdown.Button
          type={'primary'}
          key={menu.title}
          onClick={() => {
            menu?.onClick?.();
          }}
          overlay={menuComponents}
          icon={<DownOutlined />}
        >
          {getOperationIcon({ title: menu.title, customIcon: menu?.icon })}
          {menu.title}
        </Dropdown.Button>
      );
    }

    return (
      <Button
        type={'primary'}
        key={menu.title}
        onClick={() => {
          menu?.onClick?.();
        }}
        icon={getOperationIcon({ title: menu.title, customIcon: menu?.icon })}
      >
        {menu.title}
      </Button>
    );
  };

  /**
   * 渲染 批量操作菜单
   * @returns
   */
  const renderBatchMenu = () => {
    const isSelectAll = selectedRowKeys[0] === BL_SELECTED_ALL;

    return (
      <div className={'bl-listLayout-head'}>
        <Space wrap split={<Divider type="vertical" />}>
          <span>
            已选择{isSelectAll ? listLayoutState.pagination.total : selectedRowKeys.length}项
          </span>
          {_.map(filterListAuth(batchMenu ?? [], userAuth), renderBatchMenuButton)}
        </Space>
        <Button
          type={'link'}
          style={{ paddingLeft: 0, paddingRight: 0 }}
          disabled={!!isLoading}
          onClick={() => {
            endSelectMode();
          }}
        >
          清 空
        </Button>
      </div>
    );
  };

  /**
   * 渲染 主操作菜单
   * @returns
   */
  const renderMainMenu = () => {
    let afterFormatData = {};

    if (typeof formatDataToDisplay === 'function') {
      afterFormatData = formatDataToDisplay(listLayoutState.filterData);
    } else {
      afterFormatData = listLayoutState.filterData;
    }

    const filterDataCount = objToKeyValueAry(afterFormatData).length;
    const isNeedFilterButton = !_.isEmpty(filterList);
    const isNeedMainMenu = !_.isEmpty(mainMenu);

    return useQuickFilter || isNeedFilterButton || isNeedMainMenu ? (
      <div className={'bl-listLayout-head'}>
        <Space size={16}>
          {useQuickFilter && (
            <Input.Search
              style={{ width: 240 }}
              placeholder={placeholder}
              value={quickSearch}
              onChange={(e) => {
                setQuickSearch(e.target.value);
              }}
              onPressEnter={handleQuickPress}
              onSearch={handleQuickSearch}
              allowClear
            />
          )}
          {isNeedFilterButton && (
            <Button
              style={{ padding: '5px 8px' }}
              icon={<FilterOutlined width={32} height={32} />}
              type={filterDataCount ? 'primary' : 'default'}
              ghost={Boolean(filterDataCount)}
              onClick={() => {
                dispatch?.({ type: LIST_REDUCER_TYPE.ChangeFilter, payload: true });
              }}
            >
              <span>筛选</span>
              {filterDataCount ? <span>({filterDataCount})</span> : null}
            </Button>
          )}
        </Space>
        <Space split={<Divider type="vertical" />}>
          {isNeedMainMenu &&
            _.map(formatMainMenu(mainMenu), (item) => {
              if (_.has(item, 'items')) {
                return renderMainMenuMenu(item);
              }
              return renerMainMenuButton(item);
            })}
        </Space>
      </div>
    ) : null;
  };

  return listLayoutState.isSelectMode ? renderBatchMenu() : renderMainMenu();
};

export default RecordListHeader;
