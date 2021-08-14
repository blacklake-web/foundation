import React from 'react';
import { Cascader as AntdCascader } from 'antd';
import { BlCascaderProps } from './index.type';
import { CascaderValueType } from 'antd/lib/cascader';

export const BlCascader = (props: BlCascaderProps) => {
  const { inputDisplayIsOnlyLeaf, getAllPathFn, customDivider, defaultValue, value } = props;

  const handleOnChange = () => { };

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

  return (
    <AntdCascader
      displayRender={(label, selectedOptions) => {
        console.log(label, selectedOptions);
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
      defaultValue={getDefaultValue(defaultValue)}
    // value={value}
    // onChange={handleOnChange}
    />
  );
};
