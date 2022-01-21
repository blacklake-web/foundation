---
title: 搜索选择 - BlSortFormList
nav:
  title: 组件
  path: /component
  order: 1
group:
  title: BlPro
  path: /BlPro
---

```tsx
/**
 * title: 可自增的formList
 * desc: 表单收集大量列表数据使用
 */

import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { BlSortFormList } from '@blacklake-web/component';

export default () => {
  const [form] = Form.useForm();

  return (
    <BlSortFormList
      name="filedName"
      form={form}
      renderColumns={() => {
        return [
          {
            title: '名称',
            dataIndex: 'name',
            render: (text, field) => (
              <Form.Item
                name={[field.name, 'name']}
                fieldKey={[field.fieldKey, 'name']}
                style={{ marginBottom: '0' }}
                rules={[{ required: true, message: '名称不能为空' }]}
              >
                <Input />
              </Form.Item>
            ),
          },
          {
            title: '编号',
            dataIndex: 'code',
            render: (text, field) => (
              <Form.Item
                name={[field.name, 'code']}
                fieldKey={[field.fieldKey, 'code']}
                style={{ marginBottom: '0' }}
              >
                <Input />
              </Form.Item>
            ),
          },
          {
            title: '数量',
            dataIndex: 'amount',
            render: (text, field) => (
              <Form.Item
                name={[field.name, 'amount']}
                fieldKey={[field.fieldKey, 'amount']}
                style={{ marginBottom: '0' }}
              >
                <InputNumber />
              </Form.Item>
            ),
          },
          {
            title: '单位',
            dataIndex: 'unit',
            render: (text, field) => (
              <Form.Item
                name={[field.name, 'unit']}
                fieldKey={[field.fieldKey, 'unit']}
                style={{ marginBottom: '0' }}
              >
                <Select />
              </Form.Item>
            ),
          },
        ];
      }}
    />
  );
};
```

<API />
