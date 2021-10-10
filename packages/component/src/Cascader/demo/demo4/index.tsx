/**
 * title: 关键属性
 * desc: loadData、onSearch
 *
 */

import React, { useEffect, useState } from 'react';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { Divider } from 'antd';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';

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
  const [value1, setvalue1] = useState<CascaderValueType>();
  const [value11, setvalue11] = useState<CascaderValueType>(['zhejiang1', 'hangzhou1', 'xihu1']);
  const [value2, setvalue2] = useState<CascaderValueType>();
  const [value22, setvalue22] = useState<CascaderValueType>(['zhejiang']);
  const [options1, setOptions1] = useState<CascaderOptionType[]>();
  const [options11, setOptions11] = useState<CascaderOptionType[]>(cascaderOptions);
  const [options2, setOptions2] = useState<CascaderOptionType[]>([]);
  const [options22, setOptions22] = useState<CascaderOptionType[]>([
    {
      value: 'zhejiang',
      label: '浙江',
      isLeaf: false,
    },
  ]);
  const [loading, setLoading] = useState(false)

  const fetchData1 = async () => {
    setLoading(true);
    return new Promise((resove) => {
      setTimeout(() => {
        setOptions1(cascaderOptions);
        setLoading(false);
        resove(true);
      }, 3000);
    });
  };
  const fetchData2 = async () => {
    setLoading(true);
    return new Promise((resove) => {
      setTimeout(() => {
        setOptions2(optionLists);
        setLoading(false);
        resove(true);
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
      setOptions2([...options2]);
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
          options={options1}
          showSearch
          onPopupVisibleChange={(popupVisible) => {
            console.log('onPopupVisibleChange')
            fetchData1();
          }}
          loading={loading}
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
          全量加载:存在默认值
        </span>
        <BlCascader
          value={value11}
          onChange={(value) => {
            setvalue11(value);
            console.log('value11: ', value);
          }}
          style={{ width: 300 }}
          options={options11}
          showSearch
          loading={loading}
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
          options={options2}
          loadData={loadData}
          onSearch={(value) => {
            // 模拟 发送后端请求
            return searchData(value);
          }}
          onPopupVisibleChange={(popupVisible) => {
            console.log('onPopupVisibleChange')
            fetchData2();
          }}
          loading={loading}
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
          动态加载选项:存在默认值
        </span>
        <BlCascader
          value={value22}
          onChange={(value) => {
            setvalue22(value);
            console.log('value22: ', value);
          }}
          style={{ width: 300 }}
          options={options22}
          loadData={loadData}
          onSearch={(value) => {
            // 模拟 发送后端请求
            return searchData(value);
          }}
          loading={loading}
        />
      </div>
    </>
  );
};
export default App;
