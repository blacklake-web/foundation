---
title: 日志布局 - LogListLayout
nav:
  title: 布局
  path: /layout
  order: 2
group:
  title: layout
  path: /layout
---

## 日志列表

```tsx
import React, { useState } from 'react';
import { LogListLayout, FilterFieldType } from '@blacklake-web/layout';

export default () => {
  const requestFn = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = () => {
          const dataSource = [];
          for (let i = 1; i < 50; i++) {
            const item = {
              code: `code_${i}`,
              name: `name_${i}`,
              operatoreUser: `operatoreUser_${i}`,
              operatorType: `operatorType_${i}`,
              operatorTime: `operatorTime_${i}`,
              operatorTerminal: `operatorTerminal_${i}`,
              operatorDesc: `operatorDesc_${i}`,
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

  return (
    <div style={{ height: 800, border: '1px solid #d8d8d8' }}>
      <LogListLayout fetchData={requestFn} rowKey={'code'} />
    </div>
  );
};
```

<API src="/LogListLayout.tsx"/>
