---
title: 表格 - BlTable
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
 * title: 普通按钮
 * desc: 我是按钮
 */

import React from 'react';
import { BlTable } from '@blacklake-web/component';

export default () => {
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

  const columns = [
    { title: '姓名', dataIndex: 'name', width: 200 },
    { title: '性别', dataIndex: 'sex', width: 200 },
    { title: '年龄', dataIndex: 'old', width: 200 },
    { title: '职业', dataIndex: 'job', width: 200 },
    { title: '学校', dataIndex: 'school', width: 200 },
    { title: '手机号', dataIndex: 'phone', width: 200 },
    { title: 'qq', dataIndex: 'qq', width: 200 },
  ];

  return (
    <BlTable
      columns={columns}
      dataSource={data()}
      resizableCol
      useColConfig
      tableConfigKey="dumi-blTable"
    />
  );
};
```

<API />
