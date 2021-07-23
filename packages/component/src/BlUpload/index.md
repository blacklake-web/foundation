---
title: 上传文件 - BlUpload
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
 * title: 上传附件
 * desc: 上传附件
 */

import React from 'react';
import { BlUpload } from '@blacklake-web/component';

export default () => (
  <BlUpload totalMaxSize={200} limit="attach" autoDelErrorFile draggable multiple canPreview>
    <div
      style={{
        cursor: 'pointer',
        padding: '40px 50px',
        textAlign: 'center',
        borderRadius: 2,
      }}
    >
      <h4>点击或将文件拖拽到这里上传</h4>
      <p>
        仅支持上传 JPG/PNG/JPEG/PDF/XLSX/RAR
        格式的文件；仅JPG/PNG/JPEG格式的文件支持预览；总文件大小限制不能超过200M.
      </p>
    </div>
  </BlUpload>
);
```

<API />
