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
import { Button } from '@blacklake-web/component';

export default () => (
  <Button
    onClick={() => {
      alert('你点了按钮');
    }}
  >
    按钮test
  </Button>
);
```

<API />
