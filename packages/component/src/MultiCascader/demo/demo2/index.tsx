/**
 * title: 关键属性
 * desc:  customDivider、renderValue、renderMenuItem
 *
 */

import React, { useState } from 'react';
import { BlMultiCascader, multiCascaderOptions } from '@blacklake-web/component';
import { Divider } from 'antd';

import './index.less';

export default () => {
  const [value1, setValue1] = useState(['1-1', '1-2']);
  const [value2, setValue2] = useState(['1-1', '1-2']);
  const [value3, setValue3] = useState(['1-1', '1-2']);
  const [value4, setValue4] = useState(['1-1', '1-2']);
  const [value5, setValue5] = useState(['1-1', '1-2']);
  return (
    <>
      <p>自定义分隔符：</p>
      <div className="box">
        <p>`-`连接：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value1}
          onChange={(value) => {
            console.log(`value1`, value);
            setValue1(value);
          }}
          customDivider={' - '}
        />
      </div>
      <div className="box">
        <p>`/`连接：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value2}
          onChange={(value) => {
            console.log(`value2`, value);
            setValue2(value);
          }}
          customDivider={' / '}
        />
      </div>
      <div className="box">
        <p>`、`连接：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value3}
          onChange={(value) => {
            console.log(`value3`, value);
            setValue3(value);
          }}
          customDivider={' 、'}
        />
      </div>
      <Divider />
      <div className="box">
        <p>自定义拼接默认值：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value4}
          onChange={(value) => {
            console.log(`value4`, value);
            setValue4(value);
          }}
          placeholder={
            <span>
              <i className="rs-icon rs-icon-map-marker" /> 地区
            </span>
          }
          renderValue={(value, selectedItems, selectedElement) => (
            <span>
              <span style={{ color: '#575757' }}>
                <i className="rs-icon rs-icon-map-marker" /> 地区 :
              </span>{' '}
              {selectedItems.map((item) => item.label).join(' , ')}
            </span>
          )}
        />
      </div>
      <Divider />
      <div className="box">
        <p>自定义选项：</p>
        <BlMultiCascader
          options={multiCascaderOptions}
          style={{ width: 300 }}
          value={value5}
          onChange={(value) => {
            console.log(`value5`, value);
            setValue5(value);
          }}
          renderMenuItem={(label, item) => {
            return (
              <div>
                <i className="rs-icon rs-icon-map-marker" /> {label}
              </div>
            );
          }}
        />
      </div>
    </>
  );
};
