/**
 * title: 关键属性
 * desc: loadData、onSearch
 *
 */

import React, { useState } from 'react';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { Form, Button } from 'antd';

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
  const [options, setOptions] = useState(optionLists);

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
        resove({
          data: [
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
          ],
        });
      }, 3000);
    });
  };
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <>
      <Form onFinish={onFinish}>
        <Form.Item label="全量加载" name="value1">
          <BlCascader style={{ width: 300 }} options={cascaderOptions} showSearch />
        </Form.Item>

        <Form.Item label="动态加载" name="value2">
          <BlCascader
            style={{ width: 300 }}
            options={options}
            loadData={loadData}
            onSearch={(value) => {
              // 模拟 发送后端请求
              return searchData(value);
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default App;
