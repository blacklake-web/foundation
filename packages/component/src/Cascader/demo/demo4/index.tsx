/**
 * title: 关键属性
 * desc: loadData、onSearch
 *
 */

import React, { useState } from 'react';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { Divider } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';

const optionLists = [
  {
    value: 'zhejiang',
    label: '浙江',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: '江苏',
    isLeaf: false,
  },
  {
    value: 'hubei',
    label: '湖北',
    isLeaf: true,
  },
];

const App = () => {
  const [value1, setvalue1] = useState();
  const [value2, setvalue2] = useState();
  const [options, setOptions] = useState(optionLists);

  const fetchData = () => {
    return new Promise((resove) => {
      setTimeout(() => {
        resove({
          data: cascaderOptions,
        });
      }, 3000);
    });
  };

  const onChange = (value, selectedOptions) => {
    console.log('value2', value);
    setvalue2(value);
  };
  const loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
        },
      ];
      setOptions([...options]);
    }, 1000);
  };
  const searchData = (value) => {
    console.log(`use:搜索`, value);
    return new Promise((resove) => {
      setTimeout(() => {
        resove([
          {
            value: 'hubei',
            label: '湖北',
            isLeaf: false,
          },
          {
            value: 'hunan',
            label: '湖南',
            isLeaf: false,
          },
        ]);
      }, 3000);
    });
  };
  return (
    <>
      <div>
        <span
          style={{
            display: 'inline-block',
            textAlign: 'right',
            width: '200px',
            paddingRight: '16px',
          }}
        >
          全量加载:
        </span>
        <BlCascader
          value={value1}
          onChange={(value) => {
            setvalue1(value);
            console.log('value1: ', value);
          }}
          style={{ width: 300 }}
          options={cascaderOptions}
          showSearch
        />
      </div>
      <Divider />
      <div>
        <span
          style={{
            display: 'inline-block',
            textAlign: 'right',
            width: '200px',
            paddingRight: '16px',
          }}
        >
          动态加载选项:
        </span>
        <BlCascader
          value={value2}
          onChange={onChange}
          style={{ width: 300 }}
          options={options}
          loadData={loadData}
          onSearch={(value) => {
            // 模拟 发送后端请求
            return searchData(value);
          }}
        />
      </div>
    </>
  );
};
export default App;
