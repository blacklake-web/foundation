---
title: 查询列表布局 - RecordListLayout
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
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { RecordListLayout, FilterFieldType } from '@blacklake-web/layout';

export default () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        children: [],
      };
      dataSource.push(item);
    }
    return dataSource;
  };

  const [customData, setCustomData] = useState(data());

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
              childredn: [
                {
                  name: `name_${i}${i}`,
                  sex: `sex_${i}${i}`,
                  old: `old_${i}${i}`,
                  job: `job_${i}${i}`,
                  school: `school_${i}${i}`,
                  phone: `phone_${i}${i}`,
                  qq: `qq_${i}${i}`,
                },
              ],
            };
            dataSource.push(item);
          }
          return dataSource;
        };

        const list = data();

        const data2 = {
          data: {
            list,
            total: list.length,
          },
        };
        setDataSource(data2);
        resolve({
          data: {
            list,
            total: list.length,
          },
        });
      }, 2000);
    });
  };

  useEffect(() => {
    requestFn();
  }, []);

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
      auth: 'BATCH_EDIT',
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
      onClick: () => {
        // 异步处理 返回promise
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
      type: FilterFieldType.select,
      props: { options: [{ label: 'test', value: 123 }] },
    },
    {
      label: '姓名2',
      name: 'name2',
      type: FilterFieldType.date,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      props: { width: 200 },
    },
  ];

  const getOperationList = (record, idx) => {
    return [
      { title: '查看', onClick: () => message.info(`查看 ${record.name}`) },
      {
        title: '编辑',
        disabled: idx % 2 === 0,
        onClick: () => message.info(`编辑 ${record.name}`),
      },
      { title: '删除', disabled: true, onClick: () => message.warn(`删除 ${record.name}`) },
      {
        title: '操作记录',
        auth: 'OP_RECORD_VIEW',
        onClick: () => message.info(`操作记录 ${record.name}`),
      },
    ];
  };

  return (
    <div style={{ border: '1px solid #d8d8d8' }}>
      <div style={{ height: 800 }}>
        <RecordListLayout
          columns={columns}
          requestFn={requestFn}
          // mainMenu={mainMenu}
          batchMenu={batchMenu}
          filterList={filterList}
          configcacheKey={'recordListLayout'}
          rowKey="name"
          filterContaniner={false}
          selectedRowKeys={selectedKeys}
          onSelectedRowKeys={onSelectedRowKeys}
          dataSource={dataSource}
          userAuth={['OP_RECORD_VIEW', 'BATCH_EDIT']}
          getOperationList={getOperationList}
          maxOperationCount={3}
        />
      </div>
    </div>
  );
};
```

## 可展开树形列表

```tsx
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { RecordListLayout, FilterFieldType } from '@blacklake-web/layout';

export default () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        children: [],
      };
      dataSource.push(item);
    }
    return dataSource;
  };

  const [customData, setCustomData] = useState(data());

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
          for (let i = 1; i < 5; i++) {
            const item = {
              name: `name_${i}`,
              sex: `sex_${i}`,
              old: `old_${i}`,
              job: `job_${i}`,
              school: `school_${i}`,
              phone: `phone_${i}`,
              qq: `qq_${i}`,
              childredn: [
                {
                  name: `name_${i}${i}`,
                  sex: `sex_${i}${i}`,
                  old: `old_${i}${i}`,
                  job: `job_${i}${i}`,
                  school: `school_${i}${i}`,
                  phone: `phone_${i}${i}`,
                  qq: `qq_${i}${i}`,
                },
              ],
            };
            dataSource.push(item);
          }
          return dataSource;
        };

        const list = data();

        const data2 = {
          data: {
            list,
            total: list.length,
          },
        };
        setDataSource(data2);
        resolve({
          data: {
            list,
            total: list.length,
          },
        });
      }, 2000);
    });
  };

  useEffect(() => {
    requestFn();
  }, []);

  const mainMenu = [
    {
      title: '新建',
      auth: 'CREATE',
      onClick: () => {
        console.log('新建 click');
      },
    },
    {
      title: '导入',
      auth: 'IMPORT',
      onClick: () => {
        console.log('导入 click');
      },
      items: [
        {
          title: '导出',
          auth: 'EXPORT',
          onClick: () => {
            console.log('导出 click');
          },
        },
      ],
      isPureDropdown: true,
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
      onClick: () => {
        // 异步处理 返回promise
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
      props: { width: 200 },
    },
  ];

  return (
    <div style={{ border: '1px solid #d8d8d8' }}>
      <div style={{ height: 800 }}>
        <RecordListLayout
          columns={columns}
          mainMenu={mainMenu}
          batchMenu={batchMenu}
          filterList={filterList}
          useIndex={false}
          configcacheKey={'recordListLayout'}
          rowKey="name"
          filterContaniner={false}
          selectedRowKeys={selectedKeys}
          onSelectedRowKeys={onSelectedRowKeys}
          dataSource={dataSource}
          isLoading={isLoading}
          customDataSource={customData}
          userAuth={['CREATE', 'IMPORT', 'EXPORT']}
          expandable={{
            onExpand: (expanded, record) => {
              if (expanded) {
                setIsLoading(true);
                setTimeout(() => {
                  const newcustomData = customData.map((item) => {
                    if (item.id === record.id) {
                      item.children = data();
                    }
                    return item;
                  });
                  setCustomData(newcustomData);
                  setIsLoading(false);
                }, 1000);
              }
            },
          }}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};
```

<API src="/RecordListLayout.tsx"/>

## FilterItem 精确搜索

| 参数            | 说明                                        | 类型                           | 默认值 |
| --------------- | ------------------------------------------- | ------------------------------ | ------ |
| label           | label 名称                                  | `string`                       |        |
| name            | form 的 name                                | `string[] / string`            |        |
| type            | FilterFieldType                             | `FilterFieldType`              |        |
| rules           | form 的 rules                               | `any[]`                        |        |
| renderItem      | 自定义 item                                 | `React.ReactNode`              |        |
| selectProps     |                                             | `SelectProps<any>`             |        |
| inputProps      |                                             | `InputProps`                   |        |
| datePickerProps |                                             | `RecordListHeaderButtonType[]` |        |
| dateFormat      | 日期格式化                                  | `string `                      |        |
| precision       | 小数精度                                    | `string / number`              |        |
| props           | 输入空间的属性，替代 selectProps inputProps | `any`                          |        |

## RecordListHeaderButtonType 操作按钮

| 参数     | 说明                                                                                            | 类型                                                               | 默认值    |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| title    | 按钮 text                                                                                       | `string`                                                           |           |
| auth     | 当前操作的权限点                                                                                | `string`                                                           | undefined |
| disabled | 是否可以操作                                                                                    | `boolean`                                                          | false     |
| icon     | 按钮图标                                                                                        | `React.ReactNode`                                                  |           |
| onClick  | !!!批量操作时有两种处理方式 1.同步处理，调用 success 或 fail 2.异步操作，返回 promise，自动处理 | `(success?: () => void, fail?: () => void) => void / Promise<any>` |           |

## RecordListHeaderMenuType 菜单按钮

| 参数           | 说明                                                | 类型                           | 默认值 |
| -------------- | --------------------------------------------------- | ------------------------------ | ------ |
| items          | 菜单隐藏按钮列表,如果存在该属性时,认为是主操作按钮  | `RecordListHeaderButtonType[]` |        |
| isPureDropdown | 如果是主按钮,开启此配置项会除去主按钮操作，只做展示 | boolean                        | false  |
| ...resProps    | 其他继承自 RecordListHeaderButtonType               | `RecordListHeaderButtonType`   |        |

## OnSelectedRowKeys 列表勾选回调

| 参数              | 说明                                                        | 类型                                                                |
| ----------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| OnSelectedRowKeys | selectedRowKeys：选择的 rowKey 数组；selectRows：选择行数据 | `(selectedRowKeys: BlSelectedRowKeys, selectRows?: any[]) => void;` |

## expandable 列表展开功能配置，可以搭配 customDataSource 修改 dataSource （参考 antd 中表格的展开配置）

| 参数     | 说明               | 类型                         |
| -------- | ------------------ | ---------------------------- |
| onExpand | 点击展开图标时触发 | `function(expanded, record)` |
