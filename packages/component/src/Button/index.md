---
title: 按钮 - button
nav:
  title: 组件
  path: /component
  order: 1
group:
  title: component
  path: /component
---

```tsx
/**
 * title: 普通按钮
 * desc: 我是按钮
 */

import React from 'react';
import { BlButton } from '@blacklake-web/component';

export default () => (
  <BlButton
    onClick={() => {
      alert('你点了按钮');
    }}
  >
    按钮test
  </BlButton>
);
```

<API />
