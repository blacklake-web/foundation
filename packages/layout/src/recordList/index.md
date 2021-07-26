---
title: 列表查询 - RecordListLayout
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
import React, { useState } from 'react';
import { Button, message } from 'antd';
import { RecordListLayout, FilterFieldType } from '@blacklake-web/layout';

export default () => {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const columns = [
    { title: '姓名', dataIndex: 'name', width: 200 },
    { title: '性别', dataIndex: 'sex', width: 200 },
    { title: '年龄', dataIndex: 'old', width: 200 },
    { title: '职业', dataIndex: 'job', width: 200 },
    { title: '学校', dataIndex: 'school', width: 200 },
    { title: '手机号', dataIndex: 'phone', width: 200 },
    { title: 'qq', dataIndex: 'qq', width: 200 },
  ];

  const requestFn = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = () => {
          const dataSource = [];
          for (let i = 1; i < 50; i++) {
            const item = {
              name: `name_${i}`,
              sex: `sex_${i}`,
              old: `old_${i}`,
              job: `job_${i}`,
              school: `school_${i}`,
              phone: `phone_${i}`,
              qq: `qq_${i}`,
            };
            dataSource.push(item);
          }
          return dataSource;
        };

        const list = data();
        resolve({
          data: {
            list,
            total: list.length,
          },
        });
      }, 2000);
    });
  };

  const mainMenu = [
    {
      title: '新建',
      onClick: () => {
        console.log('新建 click');
      },
    },
    {
      title: '导入',
      onClick: () => {
        console.log('导入 click');
      },
      items: [
        {
          title: '导出',
          onClick: () => {
            console.log('导出 click');
          },
        },
      ],
    },
  ];

  const batchMenu = [
    {
      title: '编辑',
      onClick: (success, fail) => {
        // 同步处理
        console.log('批量编辑 click');
        if (selectedKeys?.length > 3) {
          message.success('编辑成功!');
          success();
        } else {
          message.error('编辑失败!');
          fail();
        }
      },
    },
    {
      title: '删除',
      onClick: (success, fail) => {
        // 异步处理
        console.log('批量删除 click');
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (selectedKeys?.length > 3) {
              message.success('删除成功!');
              resolve(true);
            } else {
              message.error('删除失败!');
              reject();
            }
          }, 2000);
        });
      },
    },
  ];

  const onSelectedRowKeys = (selectedKeys, seletedRows) => {
    console.log('selectedKeys', selectedKeys);
    console.log('seletedRows', seletedRows);
    setSelectedKeys(selectedKeys);
  };

  const filterList = [
    {
      label: '姓名',
      name: 'name',
      type: FilterFieldType.text,
    },
  ];

  return (
    <div style={{ height: 800, border: '1px solid #d8d8d8' }}>
      <RecordListLayout
        columns={columns}
        requestFn={requestFn}
        mainMenu={mainMenu}
        batchMenu={batchMenu}
        filterList={filterList}
        configcacheKey={'recordListLayout'}
        rowKey="name"
        filterContaniner={false}
        selectedRowKeys={selectedKeys}
        onSelectedRowKeys={onSelectedRowKeys}
      />
    </div>
  );
};
```

<API src="/RecordListLayout.tsx"/>

## FilterItem 精确搜索

| 参数            | 说明            | 类型                           | 默认值 |
| --------------- | --------------- | ------------------------------ | ------ |
| label           | label 名称      | `string`                       |        |
| name            | form 的 name    | `string[] / string`            |        |
| type            | FilterFieldType | `FilterFieldType`              |        |
| rules           | form 的 rules   | `any[]`                        |        |
| renderItem      | 自定义 item     | `React.ReactNode`              |        |
| selectProps     |                 | `SelectProps<any>`             |        |
| inputProps      |                 | `InputProps`                   |        |
| datePickerProps |                 | `RecordListHeaderButtonType[]` |        |
| dateFormat      | 日期格式化      | `string `                      |        |
| precision       | 小数精度        | `string / number`              |        |

## RecordListHeaderButtonType 操作按钮

| 参数     | 说明                                                                                            | 类型                                                               | 默认值 |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| title    | 按钮 text                                                                                       | `string`                                                           |        |
| disabled | 是否可以操作                                                                                    | `boolean`                                                          | false  |
| icon     | 按钮图标                                                                                        | `React.ReactNode`                                                  |        |
| onClick  | !!!批量操作时有两种处理方式 1.同步处理，调用 success 或 fail 2.异步操作，返回 promise，自动处理 | `(success?: () => void, fail?: () => void) => void / Promise<any>` |        |

## RecordListHeaderMenuType 菜单按钮

| 参数        | 说明                                  | 类型                           | 默认值 |
| ----------- | ------------------------------------- | ------------------------------ | ------ |
| items       | 菜单隐藏按钮列表                      | `RecordListHeaderButtonType[]` |        |
| ...resProps | 其他继承自 RecordListHeaderButtonType | `RecordListHeaderButtonType`   |        |

## OnSelectedRowKeys 列表勾选回调

| 参数              | 说明                                                        | 类型                                                                |
| ----------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| OnSelectedRowKeys | selectedRowKeys：选择的 rowKey 数组；selectRows：选择行数据 | `(selectedRowKeys: BlSelectedRowKeys, selectRows?: any[]) => void;` |
