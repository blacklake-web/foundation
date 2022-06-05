---
title: 表单表格 - BlSortFormList
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
import { Form, Input, InputNumber, Select, Button } from 'antd';
import { BlSortFormList } from '@blacklake-web/component';

export default () => {
  const [form] = Form.useForm();

  return (
    <>
      <BlSortFormList
        name="filedName"
        form={form}
        maxCount={5}
        extraButton={[
          {
            title: '批量添加',
            onClick: () => {
              form.setFieldsValue({
                filedName: [
                  { name: 'name_0' },
                  { name: 'name_1' },
                  { name: 'name_2' },
                  { name: 'name_3' },
                  { name: 'name_4' },
                ],
              });
            },
          },
        ]}
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
      <Button
        onClick={() => {
          console.log(form.getFieldsValue());
        }}
      >
        提交
      </Button>
    </>
  );
};
```

```tsx
/**
 * title: 纯排序列表
 * desc: 在只需排序无需编辑的场景使用
 */

import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import { BlSortFormList } from '@blacklake-web/component';

export default () => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      list: [
        { id: 0, name: 'name_0' },
        { id: 1, name: 'name_1' },
        { id: 2, name: 'name_2' },
        { id: 3, name: 'name_3' },
        { id: 4, name: 'name_4' },
      ],
    });
  }, []);

  return (
    <div>
      <BlSortFormList
        name="list"
        form={form}
        isNeedAdd={false}
        isNeedDelete={false}
        tableProps={{ showHeader: false }}
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
                  <Input disabled />
                </Form.Item>
              ),
            },
          ];
        }}
      />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={() => {
            console.log(form.getFieldsValue().list.map(it => it.name));
          }}
        >
          提交
        </Button>
      </div>
    </div>
  );
};
```
<API />
