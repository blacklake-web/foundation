import React, { ReactNode, useEffect, useState } from 'react';
// import { MultiCascader } from 'rsuite';
import MultiCascader from 'gc-rsuite/lib/MultiCascader';
import { BlMultiCascaderProps, DataItemType } from './index.type';
import Icon from '@ant-design/icons';
// import 'rsuite/dist/styles/rsuite-default.css';
import './index.less';

export const BlMultiCascader: React.FC<BlMultiCascaderProps> = (props) => {
  const {
    options = [],
    value,
    defaultValue,
    customDivider,
    onChange,
    onSearch,
    placeholder = '请选择...',
    searchPlaceholder = '请输入...',
    // noResultsText = '没查询到结果',
    // checkAllText = '全部',
    loadData,
    loading = false,
  } = props;
  const [blvalue, setBlvalue] = useState(value);
  const [blloading, setBlloading] = useState(loading);
  const [blData, setBlData] = useState<DataItemType[]>(options);

  const handleChange = (value, event) => {
    setBlvalue(value);
    onChange && onChange(value, event);
  };
  // 工具函数 搜索
  const getSearchRes = (inputValue, options, res) => {
    options.map((item) => {
      if (item.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
        res.push(item);
      }
    });
    return res;
  };
  // 搜索
  const handleOnSearch = async (inputValue, e) => {
    // TODO 如果value有值，则应在options列表置顶
    // TODO 可以加个防抖
    if (typeof onSearch === 'function') {
      setBlloading(true);
      const data = await onSearch(inputValue, e);
      setBlData(data);
      setBlloading(false);
    }
  };
  // 渲染菜单栏
  const renderMenu = (children, menu) => {
    if (blloading) {
      return (
        <p style={{ padding: 4, textAlign: 'center' }}>
          <Icon style={{ marginRight: 4 }} type="loading" /> 加载中...
        </p>
      );
    }
    if (children?.length === 0) {
      return <p style={{ padding: 4, textAlign: 'center' }}>暂无数据</p>;
    }
    return menu;
  };
  // 渲染自定义选项
  const renderValue = (value, selectedItems, selectedElement) => {
    if (customDivider) {
      return <span>{selectedItems.map((item) => item.label).join(customDivider)}</span>;
    }
    return <span>{selectedItems.map((item) => item.label).join(' , ')}</span>;
  };
  // loadData工具函数,将请求到的选项替换之前节点
  const getNextSelectOption = (options, selectOption) => {
    return options.map((item) => {
      if (item.value == selectOption.value) {
        return (item = selectOption);
      }
      return item;
    });
  };
  // select
  const onSelect = async (item: DataItemType, selectedPaths: DataItemType[], event) => {
    const targetOption = selectedPaths[selectedPaths?.length - 1];
    if (targetOption?.children) {
      if (typeof loadData === 'function') {
        const data = await loadData(item);
        targetOption.children = data;
        setBlData(getNextSelectOption(blData, targetOption));
      }
    }
  };

  useEffect(() => {
    setBlData(options);
  }, [options]);
  useEffect(() => {
    setBlloading(loading);
  }, [loading]);

  return (
    <div id="bl-multiCascader-wrapper">
      <MultiCascader
        cascade={false}
        countable={false}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        renderValue={renderValue}
        // this is rsuite 库拥有的属性
        // locale={{
        //   searchPlaceholder: 'aasdsad',
        //   noResultsText,
        //   placeholder,
        //   checkAll: checkAllText,
        // }}
        {...props}
        value={defaultValue || blvalue}
        onChange={(value, event) => handleChange(value, event)}
        renderMenu={renderMenu}
        onSelect={onSelect}
        data={blData}
        onSearch={handleOnSearch}
      />
    </div>
  );
};
