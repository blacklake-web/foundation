---
title: 文本提示 - TextToolTip
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
 * title: 文本提示
 * desc: 超出文本缩略展示
 */

import React from 'react';
import { TextToolTip } from '@blacklake-web/component';

export default () => (
  <div>
    <div>
      <div>自定义width:</div>
      <TextToolTip text={'这是一段超长的文本，但是被缩略展示了'} width={200} />
    </div>
    <br />
    <div style={{ width: 200 }}>
      <span>父级width:</span>
      <TextToolTip text={'这是一段超长的文本，但是被缩略展示了'} />
    </div>
  </div>
);
```

<API />
