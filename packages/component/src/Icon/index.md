---
title: 黑湖图标 - BlIcon
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
 * title:黑湖图标
 * desc: 使用时需要在public下创建 '/fonticons.js'文件，,  文件在 iconfont.cn 上生成.
 */

import React from 'react';
import { BlIcon } from '@blacklake-web/component';

export default () => {
  return (
    <div>
      <BlIcon type={'iconmima'} />
      密码
      <BlIcon type={'iconshouji'} />
      手机
      <BlIcon type={'iconduanxin'} />
      短信
      <div>
        <a
          href=""
          onClick={() => {
            window.open('https://www.iconfont.cn/');
          }}
        >
          具体请到iconfont.cn黑湖项目里查看
        </a>
      </div>
    </div>
  );
};
```

<API />
