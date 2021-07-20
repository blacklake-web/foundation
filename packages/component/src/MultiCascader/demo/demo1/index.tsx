/**
 * title: 关键属性
 * desc: cascade
 *
 */

import React, { useState } from 'react';
import { BlMultiCascader, multiCascaderOptions } from '@blacklake-web/component';
import { Divider } from 'antd';

import './index.less';

export default () => {
  const [value1, setValue1] = useState(['1-1', '2']);
  const [value2, setValue2] = useState(['1-1', '2']);
  return (
    <>
      <div className="box">
        <p>级联：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value1}
          onChange={(value) => {
            setValue1(value);
            console.log(`结果1：${value}`);
          }}
          cascade
        />
      </div>
      <Divider />
      <div className="box">
        <p>非级联：</p>
        <BlMultiCascader
          cascade={false}
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value2}
          onChange={(value) => {
            setValue2(value);
            console.log(`结果2：${value}`);
          }}
        />
      </div>
    </>
  );
};
