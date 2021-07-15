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
import React from 'react';
import { Button } from '@blacklake-web/component';

export default () => (
  <Button
    onClick={() => {
      alert('你点了按钮');
    }}
  >
    按钮
  </Button>
);
```

<API />
