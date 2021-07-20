/**
 * title: 关键属性
 * desc: loadData、onSearch
 *
 */

import React, { useState } from 'react';
import { BlMultiCascader, multiCascaderOptions } from '@blacklake-web/component';
import { Divider } from 'antd';

import './index.less';

export default () => {
  const [value1, setValue1] = useState(['1-1', '2']);
  const [value2, setValue2] = useState(['1-1']);

  function createNode() {
    const hasChildren = Math.random() > 0.2;
    return {
      label: `Node ${(Math.random() * 1e18).toString(36).slice(0, 3).toUpperCase()}`,
      value: Math.random() * 1e18,
      children: hasChildren ? [] : null,
    };
  }

  function createChildren() {
    const children = [];
    for (let i = 0; i < Math.random() * 10; i++) {
      children.push(createNode());
    }
    return children;
  }

  function fetchNodes(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createChildren());
      }, 500);
    });
  }
  const fetchSearch = (value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(multiCascaderOptions);
      }, 1000);
    });
  };
  const defaultData = multiCascaderOptions;

  return (
    <>
      <div className="box">
        <p>全量加载+搜索：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value1}
          onChange={(value) => {
            setValue1(value);
            console.log(`value2：${value}`);
          }}
          onSearch={(value) => {
            console.log(`搜索：${value}`);
            return fetchSearch(value);
          }}
        />
      </div>
      <Divider />
      <div className="box">
        <p>动态加载+搜索：</p>
        <BlMultiCascader
          options={defaultData}
          style={{ width: 300 }}
          value={value2}
          onChange={(value) => {
            setValue2(value);
            console.log(`value2：${value}`);
          }}
          loadData={(node) => {
            return fetchNodes(node.id);
          }}
          onSearch={fetchSearch}
        />
      </div>
    </>
  );
};
