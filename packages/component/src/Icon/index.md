---
title: 图标 - BlIcon
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
 * title: 图标
 * desc: 黑湖定制图标 www.iconfont.cn 加入黑湖项目
 */

import React from 'react';
import { BlIcon } from '@blacklake-web/component';

export default () => (
  <>
    <span>
      <BlIcon type="iconguanbi" style={{ fontSize: 28 }} />
      <span>关闭</span>
    </span>
    <span>
      <BlIcon type="icona-mimajiesuo" style={{ fontSize: 28 }} />
      <span>密码 解锁</span>
    </span>
    <span>
      <BlIcon type="iconmima" style={{ fontSize: 28 }} />
      <span>密码</span>
    </span>
    <span>
      <BlIcon type="icongongchang" style={{ fontSize: 28 }} />
      <span>工厂</span>
    </span>
    <span>
      <BlIcon type="iconshouji" style={{ fontSize: 28 }} />
      <span>手机</span>
    </span>
    <span>
      <BlIcon type="iconduanxin" style={{ fontSize: 28 }} />
      <span>短信</span>
    </span>
    <span>
      <BlIcon type="iconyanjing" style={{ fontSize: 28 }} />
      <span>眼睛</span>
    </span>
    <span>
      <BlIcon type="iconmianxingfuzhi" style={{ fontSize: 28 }} />
      <span>面性 复制</span>
    </span>
    <span>
      <BlIcon type="icondanhangwenben" style={{ fontSize: 28 }} />
      <span>单行文本</span>
    </span>
  </>
);
```
