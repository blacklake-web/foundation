---
title: 表单布局 - DataFormLayout
nav:
  title: 布局
  path: /layout
  order: 2
group:
  title: layout
  path: /layout
---

## 基础表现

```tsx
/**
 * title: 表单布局组件
 * desc: 基础使用
 */
import React from 'react';
import { Form, Checkbox, Input, DatePicker, Select } from 'antd';
import { DataFormLayout, DataFormLayoutInfoBlock } from '@blacklake-web/layout';

export default () => {
  const [modalForm] = Form.useForm();

  const baseInfo: DataFormLayoutInfoBlock = {
    title: '基本信息',
    column: 1,
    items: [
      {
        label: '名称',
        name: 'name',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        label: '开始日期',
        name: 'startTime',
        rules: [{ required: true, message: '开始日期必选' }],
        render: () => <DatePicker allowClear style={{ width: '100%' }} />,
      },
      {
        label: '结束日期',
        name: 'endTime',
        rules: [{ required: true, message: '结束日期必选' }],
        render: () => <DatePicker allowClear style={{ width: '100%' }} />,
      },
    ],
  };

  const otherInfo: DataFormLayoutInfoBlock = {
    title: '其他信息',
    column: 1,
    items: [
      {
        label: '名称',
        name: 'name',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        label: '操作人',
        name: 'operator',
        isFullLine: true,
        render: () => <Select allowClear style={{ width: '100%' }} />,
      },
      {
        label: '备注',
        name: 'desc',
        isFullLine: true,
        render: () => <Input />,
        tooltip: '备注的注视',
      },
    ],
  };

  return (
    <div style={{ border: '1px solid #d8d8d8' }}>
      <DataFormLayout form={modalForm} title="新建字段" info={[baseInfo, otherInfo]} />
    </div>
  );
};
```

## modal,drawer 配套

```tsx
/**
 * title: modal，drawer
 * desc: 配合 DataFormLayoutForModal或 DataFormLayoutForDrawer定制使用
 */
import React, { useState } from 'react';
import { Form, Checkbox, Input, DatePicker, Select, Button } from 'antd';
import {
  DataFormLayout,
  DataFormLayoutInfoBlock,
  DataFormLayoutForModal,
  DataFormLayoutForDrawer,
} from '@blacklake-web/layout';

export default () => {
  const [modalForm] = Form.useForm();

  const [visibleType, setVisibleType] = useState('');

  const baseInfo: DataFormLayoutInfoBlock = {
    title: '基本信息',
    column: 1,
    items: [
      {
        label: '名称',
        name: 'name',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        label: '开始日期',
        name: 'startTime',
        rules: [{ required: true, message: '开始日期必选' }],
        render: () => <DatePicker allowClear style={{ width: '100%' }} />,
      },
      {
        label: '结束日期',
        name: 'endTime',
        rules: [{ required: true, message: '结束日期必选' }],
        render: () => <DatePicker allowClear style={{ width: '100%' }} />,
      },
    ],
  };

  const onCancel = () => {
    setVisibleType('');
  };

  return (
    <div>
      <Button
        onClick={() => {
          setVisibleType('modal');
        }}
      >
        open modal
      </Button>
      <Button
        onClick={() => {
          setVisibleType('drawer');
        }}
      >
        open drawer
      </Button>
      <DataFormLayoutForModal
        visible={visibleType === 'modal'}
        onClose={onCancel}
        width={800}
        content={<DataFormLayout form={modalForm} title="新建字段" info={[baseInfo]} />}
      />
      <DataFormLayoutForDrawer
        visible={visibleType === 'drawer'}
        onClose={onCancel}
        width={800}
        content={<DataFormLayout form={modalForm} title="新建字段" info={[baseInfo]} />}
      />
    </div>
  );
};
```

<API src="/dataFormLayout.tsx"/>

## DataFormLayoutInfoBlock

| 参数   | 说明               | 类型                       | 默认值 |
| ------ | ------------------ | -------------------------- | ------ |
| title  | 标题，不填不显示   | `ReactNode`                | -      |
| extra  | 标题右边拓展内容， | `ReactNode`                | -      |
| column | 每行的列数量       | `number`                   | 1      |
| items  | 当前标题下内容     | `DataFormLayoutInfoItem[]` |        |

## DataFormLayoutInfoItem

- DataFormLayoutInfoItem.render 返回自定义组件时，DataFormLayoutInfoItem.name 不需传。

| 参数            | 说明                          | 类型              | 默认值 |
| --------------- | ----------------------------- | ----------------- | ------ |
| name            | 名称 label                    | `string`          | -      |
| span            | 当前占几列                    | `number`          | 1      |
| render          | FormItem 内的输入组件         | `() => ReactNode` | -      |
| (...otherProps) | 其余参数与 antd.FormItem 一致 |
