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
import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Input, InputNumber, DatePicker, Select, Table, Radio } from 'antd';
import { DataFormLayout, DataFormLayoutInfoBlock } from '@blacklake-web/layout';
import { BlTable } from '@blacklake-web/component';

export default () => {
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const baseInfo: DataFormLayoutInfoBlock = {
    title: '基本信息',
    align: 'left',
    // column: 1,
    items: [
      {
        label: '名称',
        name: 'name-1',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => (
          <Select
            placeholder="请输入"
            allowClear
            options={[
              { label: 'name1', value: '1' },
              { label: 'name2', value: '2' },
            ]}
          />
        ),
      },
      {
        label: '年龄',
        name: 'age',
        render: () => <InputNumber placeholder="请输入" />,
        extra: '实际年龄',
      },
      {
        label: 'warehouse超长的仓库名称释义的就是这样的长度',
        name: 'warehouseName',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        label: '隐藏的字段',
        name: 'codeHidden',
        hidden: true,
      },
      {
        label: '纯文本字段',
        render: () => <span>'纯文本'</span>,
      },
      {
        noStyle: true,
        dependencies: [['name']],
        render: (formItemConfig) => () => {
          if (modalForm.getFieldValue('name') === '1') {
            return (
              <Form.Item
                {...formItemConfig}
                label="关联对象11111"
                name="name1"
                rules={[
                  { required: true, message: '特殊日名称必填' },
                  { max: 256, message: '不可超过255个字符' },
                ]}
              >
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            );
          }

          return (
            <Form.Item
              {...formItemConfig}
              label="关联对象关联对象关联对象关联对象关联对象"
              name="name1"
              rules={[
                { max: 256, message: '不可超过255个字符' },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          );
        },
      },
      {
        label: '关联对象2',
        name: 'name2',
        tooltip: '关联对象2关联对象2关联对象2关联对象2关联对象2关联对象2',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        label: '从对象',
        name: 'name3',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        isFullLine: true,
        render: () => (
          <BlTable
            columns={[
              {
                title: '对象编号',
                dataIndex: 'objectCode',
                width: 150,
                sorter: true,
              },
              {
                title: '对象名称',
                dataIndex: 'objectName',
                width: 150,
                sorter: true,
              },
              {
                title: '对象描述',
                dataIndex: 'objectDesc',
                width: 150,
              },
            ]}
            scroll={{ y: 400 }}
          />
        ),
      },
      {
        label: '关联对象4',
        name: 'name4',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        label: '开始日期',
        name: 'startTime',
        render: () => <DatePicker placeholder="请选择开始日期" allowClear />,
      },
      {
        label: '是否使用',
        name: 'user',
        render: () => (
          <Radio.Group>
            <Radio value={0}>是</Radio>
            <Radio value={1}>否</Radio>
          </Radio.Group>
        ),
      },
    ],
  };

  const otherInfo: DataFormLayoutInfoBlock = {
    title: '其他信息',
    column: 2,
    align: 'center',
    items: [
      {
        label: '名称',
        name: 'name222',
        rules: [
          { required: true, message: '特殊日名称必填' },
          { max: 256, message: '不可超过255个字符' },
        ],
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        label: '操作人',
        name: 'operator',
        render: () => <Select allowClear />,
      },
      {
        label: '操作时间',
        name: 'operatTime',
        render: () => <DatePicker />,
      },
      {
        label: '状态',
        name: 'status',
        render: () => <Select allowClear />,
      },
      {
        label: '备注',
        name: 'desc',
        span: 2,
        render: () => <Input.TextArea />,
        tooltip: '备注的注视',
      },
    ],
  };
  const specialInfo: DataFormLayoutInfoBlock = {
    title: '特殊格式信息',
    items: [
      {
        isFullLine: true,
        render: () => (
          <div style={{ border: '1px solid #333', padding: 10 }}>
            <h1>自定义区域</h1>
            <Table
              columns={[
                {
                  title: '对象编号',
                  dataIndex: 'objectCode',
                  width: 150,
                  sorter: true,
                },
                {
                  title: '对象名称',
                  dataIndex: 'objectName',
                  width: 150,
                  sorter: true,
                },
                {
                  title: '对象描述',
                  dataIndex: 'objectDesc',
                  width: 150,
                },
              ]}
            />
          </div>
        )
      },
    ],
  };

  const nestingInfo: DataFormLayoutInfoBlock = {
    title: '嵌套格式',
    items: [
      {
        label: '',
        isFullLine: true,
        render: () => {
          return (
            <div style={{ padding: '0px 24px' }}>
              <DataFormLayout
                form={modalForm}
                title=""
                footer={false}
                info={[
                  {
                    title: '基本信息',
                    column: 1,
                    items: [
                      {
                        label: '名称',
                        name: 'nesting-name',
                        render: () => (
                          <Select
                            placeholder="请输入"
                            allowClear
                            options={[
                              { label: 'name1', value: '1' },
                              { label: 'name2', value: '2' },
                            ]}
                          />
                        ),
                      },
                      {
                        label: '年龄',
                        name: 'nesting-age',
                        render: () => <InputNumber placeholder="请输入" />,
                      },
                    ]
                  }
                ]}
                getAdaptiveContainer={() => document.querySelector('.parent-data-form')}
              />
            </div>
          );
        },
      },
    ],
  };
  return (
    <div style={{ border: '1px solid #d8d8d8', position: 'relative' }}>
      <DataFormLayout
        form={modalForm}
        title="新建字段"
        info={[baseInfo, otherInfo, specialInfo, nestingInfo]}
        loading={loading}
        fieldPermission={{
          encoding: 'xxxxx',
          noAccess: ['name'],
          readonly: ['code'],
        }}
        onFinish={async () => {
          const value = await modalForm?.validateFields();
          console.log('%c [ value ]-220', 'font-size:px; color:#bf2c9f;', value);
        }}
        bodyClassName="parent-data-form"
      />
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
  MODAL_MIN_WIDTH,
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

  const otherInfo: DataFormLayoutInfoBlock = {
    title: '其他信息',
    align: 'left',
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
        render: () => <Select allowClear style={{ width: '100%' }} />,
      },
      {
        label: '操作时间',
        name: 'operatTime',
        render: () => <Select allowClear style={{ width: '100%' }} />,
      },
      {
        label: '状态',
        name: 'status',
        render: () => <Select allowClear style={{ width: '100%' }} />,
      },
      {
        label: '备注',
        name: 'desc',
        render: () => <Input />,
        tooltip: '备注的注视',
      },
    ],
  };

  const extarInfo: DataFormLayoutInfoBlock = {
    title: '额外信息',
    align: 'left',
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
        render: () => <Select allowClear style={{ width: '100%' }} />,
      },
      {
        label: '操作时间',
        name: 'operatTime',
        render: () => <Select allowClear style={{ width: '100%' }} />,
      },
      {
        label: '状态',
        name: 'status',
        render: () => <Select allowClear style={{ width: '100%' }} />,
      },
      {
        label: '备注',
        name: 'desc',
        render: () => <Input />,
        tooltip: '备注的注视',
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
        width={MODAL_MIN_WIDTH}
        content={
          <DataFormLayout
            form={modalForm}
            title="新建字段"
            info={[baseInfo, otherInfo, extarInfo]}
          />
        }
      />
      <DataFormLayoutForDrawer
        visible={visibleType === 'drawer'}
        onClose={onCancel}
        width={MODAL_MIN_WIDTH}
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
| align  | 表单的对齐方式     | `left` `center` `right`    |        |

## DataFormLayoutInfoItem

- DataFormLayoutInfoItem.render 返回自定义组件时，DataFormLayoutInfoItem.name 不需传。

| 参数            | 说明                                                                                                                                                     | 类型                            | 默认值 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------ |
| name            | 名称 label                                                                                                                                               | `string`                        | -      |
| span            | 当前占几列                                                                                                                                               | `number`                        | 1      |
| render          | 返回输入组件的函数,会自动包装一个 Form.Item 组件。如果需要 dependencies 或 shouldUpdate,外层 Form.Item 传入 noStyle,FormItemStyles 给内层 Form.Item 使用 | `(FormItemStyles) => ReactNode` | -      |
| (...otherProps) | 其余参数与 antd.FormItem 一致                                                                                                                            |                                 |        |
