import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, Menu, Input, Space, Dropdown } from 'antd';
import {
  FilterOutlined,
  RollbackOutlined,
  SearchOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
//
import { BL_SELECTED_ALL, ListLayoutContext, LIST_REDUCER_TYPE } from '../constants';
import { BlRecordListBaseProps } from '../recordListLayout.type';
import { AfterFormatData, objToKeyValueAry } from './RecordListInfo';
// 列表头button
interface RecordListHeaderButtonType {
  title: string;
  disabled?: boolean;
  // 批量操作时，1. onClick return Promise自动做后续处理  2.onClick 用success,fail回调函数手动做后续处理
  onClick: (success?: () => void, fail?: () => void) => void | Promise<any>;
  icon?: React.ReactNode;
}

// 列表头menu
interface RecordListHeaderMenuType extends RecordListHeaderButtonType {
  items?: RecordListHeaderButtonType[];
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
  batchMenu?: (RecordListHeaderMenuType | RecordListHeaderButtonType)[];
  /** 主操作按钮列表 */
  mainMenu?: (RecordListHeaderMenuType | RecordListHeaderButtonType)[];
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
    const result = buttonItem.onClick(onSuccess, onFail);

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
    typeof onChangeFilter === 'function' &&
      onChangeFilter({ type: 'quickSearch', filter: quickSearch });
  };

  /**
   * mainMenu的 button式操作，当index在第一个时,type='primary'
   * @param index
   * @returns
   */
  const renerButton = (item: RecordListHeaderButtonType, index: number) => {
    return (
      <Button
        key={item.title}
        loading={isLoading === item.title}
        type={index === 0 ? 'primary' : 'default'}
        disabled={(item?.disabled ?? false) || !!isLoading}
        onClick={() => {
          item.onClick();
        }}
      >
        {item?.icon}
        {item.title}
      </Button>
    );
  };

  /**
   * batchMenu 的 Button操作
   * @returns
   */
  const renderBatchButton = (item: RecordListHeaderButtonType) => {
    const disabled = (item?.disabled ?? false) || !!isLoading || selectedRowKeys.length === 0;

    return (
      <Button
        key={item.title}
        loading={isLoading === item.title}
        disabled={disabled}
        onClick={() => {
          handleBatchButtonClick(item);
        }}
      >
        {item?.icon}
        {item.title}
      </Button>
    );
  };

  /**
   * menu式操作
   * @returns
   */
  const renderMenu = (menu: RecordListHeaderMenuType) => {
    const isMoreMenu = !_.isEmpty(menu?.items);
    const menuComponents = isMoreMenu ? (
      <Menu style={{ width: 113 }}>
        {(menu.items ?? []).map((subItem) => (
          <Menu.Item
            key={subItem.title}
            disabled={(subItem?.disabled ?? false) || !!isLoading}
            onClick={() => {
              subItem.onClick();
            }}
          >
            {subItem?.icon}
            {subItem.title}
          </Menu.Item>
        ))}
      </Menu>
    ) : (
      <span />
    );

    return (
      <Dropdown.Button
        key={menu.title}
        onClick={() => {
          menu?.onClick();
        }}
        overlay={menuComponents}
        icon={isMoreMenu ? <EllipsisOutlined /> : ''}
      >
        {menu.icon}
        {menu.title}
      </Dropdown.Button>
    );
  };

  /**
   * 渲染 批量操作菜单
   * @returns
   */
  const renderBatchMenu = () => {
    const isSelectAll = selectedRowKeys[0] === BL_SELECTED_ALL;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Space size={16} wrap>
          <span>
            已选{isSelectAll ? listLayoutState.pagination.total : selectedRowKeys.length}条
          </span>
          {batchMenu?.map((item) => renderBatchButton(item))}
        </Space>
        <Button
          disabled={!!isLoading}
          icon={<RollbackOutlined />}
          onClick={() => {
            endSelectMode();
          }}
        >
          返回
        </Button>
      </div>
    );
  };

  /**
   * 渲染 主操作菜单
   * @returns
   */
  const renderMainMenu = () => {
    let filterDataCount = 0;

    if (typeof formatDataToDisplay === 'function') {
      const afterFormatData = formatDataToDisplay(listLayoutState.filterData);

      filterDataCount = objToKeyValueAry(afterFormatData).length;
    } else {
      filterDataCount = _.size(listLayoutState.filterData);
    }

    const isNeedFilterButton = !_.isEmpty(filterList);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Space size={16}>
          {useQuickFilter && (
            <Input
              style={{ width: 240 }}
              placeholder={placeholder}
              value={quickSearch}
              onChange={(e) => {
                setQuickSearch(e.target.value);
              }}
              onPressEnter={handleQuickPress}
              suffix={<SearchOutlined />}
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
              {filterDataCount ? `(${filterDataCount})` : ''}
            </Button>
          )}
        </Space>
        <Space size={16}>
          {mainMenu?.map((item, index) => {
            if (_.has(item, 'items')) {
              return renderMenu(item);
            }
            return renerButton(item, index);
          })}
        </Space>
      </div>
    );
  };

  return listLayoutState.isSelectMode ? renderBatchMenu() : renderMainMenu();
};

export default RecordListHeader;
