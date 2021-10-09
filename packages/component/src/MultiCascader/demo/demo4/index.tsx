/**
 * title: 关键属性
 * desc: searchable、onSearch
 *
 */

import React, { useState } from 'react';
import { BlMultiCascader, multiCascaderOptions } from '@blacklake-web/component';
import { Divider } from 'antd';

import './index.less';

export default () => {
  const [value1, setValue1] = useState(['1-1', '2']);
  const [value2, setValue2] = useState(['1-1', '2']);
  const fetchSearch = (value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(multiCascaderOptions);
      }, 1000);
    });
  };
  return (
    <>
      <div className="box">
        <p>默认：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value1}
          onChange={(value) => {
            setValue1(value);
            console.log(`value1：${value}`);
          }}
          onSearch={(value) => {
            console.log(`搜索：${value}`);
            return fetchSearch(value);
          }}
        />
      </div>
      <Divider />
      <div className="box">
        <p>不带搜索：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value2}
          onChange={(value) => {
            setValue2(value);
            console.log(`value2：${value}`);
          }}
          searchable={false}
        />
      </div>
    </>
  );
};
