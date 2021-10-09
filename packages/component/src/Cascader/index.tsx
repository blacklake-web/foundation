import React, { useEffect, useState } from 'react';
import { Cascader as AntdCascader, Input, Spin } from 'antd';
import { BlCascaderProps } from './index.type';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      // color: '#1890ff',
    }}
  />
);
export const BlCascader = (props: BlCascaderProps) => {
  const {
    inputDisplayIsOnlyLeaf,
    getAllPathFn,
    customDivider,
    defaultValue,
    value,
    onChange,
    options,
    onSearch,
    placeholder = '请选择...',
    searchPlaceholder = '请输入...',
  } = props;
  // 处理默认值
  const getDefaultValue = (value: CascaderValueType | undefined) => {
    if (value === undefined || value?.length === 0) {
      return;
    }
    if (inputDisplayIsOnlyLeaf && typeof getAllPathFn === 'function') {
      // 获取该叶子节点的全路径
      return getAllPathFn(value as CascaderValueType);
    }
    return value;
  };
  const [blvalue, setBlvalue] = useState<CascaderValueType | undefined>(
    getDefaultValue(defaultValue) || getDefaultValue(value),
  );
  const [bloptions, setBloptions] = useState<CascaderOptionType[]>(options);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CascaderOptionType>();

  const handleOnChange = (
    value: CascaderValueType,
    selectedOptions?: CascaderOptionType[] | undefined,
  ) => {
    setBlvalue(value);
    setSelectedOption(selectedOptions && selectedOptions[0]);
    onChange && onChange(value);
    return;
  };

  const handleOnSearch = async (v) => {
    const value = v.target.value;
    setLoading(true);
    if (value && selectedOption) {
      // 搜索时，把输入框的选中项塞到options中
      setBloptions([selectedOption]);
    }

    if (typeof onSearch === 'function') {
      const data = await onSearch(value);

      // selectedOption 塞到data上去,以保证输入框的值能正确的显示
      // 如果data上有selectedOption，从其中去重
      let options
      // selectedOption 可能为understand
      if (selectedOption) {
        options = [selectedOption, ...data];
      }
      options = data;
      setBloptions(deDuplication(options));
      setLoading(false);
      return;
    }
    throw new Error('onSearch function required!');
  };
  function dropdownRender(menus) {
    if (typeof onSearch === 'function') {
      return (
        <div>
          <div style={{ padding: 8 }}>
            <Input suffix={suffix} placeholder={searchPlaceholder} onPressEnter={handleOnSearch} />
          </div>
          <Spin spinning={loading}>{menus}</Spin>
        </div>
      );
    }
    return menus;
  }
  function notFoundContent() {
    return (
      <div>
        加载中...
        <span style={{ marginLeft: '8px' }}>
          <Spin />
        </span>
      </div>
    );
  }
  // 去重函数
  function deDuplication(arr) {
    let obj = {};
    const arrlist = arr.reduce((cur, next) => {
      obj[next?.value] ? '' : (obj[next?.value] = true && cur.push(next));
      return cur;
    }, []);
    return arrlist;
  }

  return (
    <AntdCascader
      displayRender={(label, selectedOptions) => {
        if (inputDisplayIsOnlyLeaf) {
          const length = label.length;
          return label[length - 1];
        }
        if (customDivider) {
          return label.join(customDivider);
        }
        return label.join(' / ');
      }}
      {...props}
      options={bloptions}
      value={blvalue}
      onChange={(value, selectedOptions) => handleOnChange(value, selectedOptions)}
      notFoundContent={loading ? notFoundContent() : '暂无数据'}
      dropdownRender={dropdownRender}
      placeholder={placeholder}
    />
  );
};
