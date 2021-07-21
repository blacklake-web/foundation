---
title: useVisible
nav:
  title: hooks
  path: /hooks
  order: 4
group:
  title: hooks
  path: /hooks
---

```tsx
/**
 * title: useVisible
 * desc: 多个显示状态的管理，可以用在多个Modal,Drawer,或批量显示的控制.类似Set类型，但是实现用数组
 */

import React from 'react';
import { useVisible } from '@blacklake-web/hooks';

export default () => {
  const { judgeVisible, addVisible, deleteVisible, clearVisible } = useVisible();

  const data = [
    {
      key: 'key1',
      text: '1111',
    },
    {
      key: 'key2',
      text: '2222',
    },
    {
      key: 'key3',
      text: '3333',
    },
    {
      key: 'key4',
      text: '4444',
    },
  ];

  return (
    <div>
      {data.map((item) => {
        return (
          <div key={item.key}>
            {judgeVisible(item.key) ? item.text : ''}
            <button
              onClick={() => {
                judgeVisible(item.key) ? deleteVisible(item.key) : addVisible(item.key);
              }}
            >
              {judgeVisible(item.key) ? '关闭' : '显示'}
            </button>
          </div>
        );
      })}
    </div>
  );
};
```

<!-- <API /> -->
