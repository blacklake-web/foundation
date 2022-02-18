---
title: 图标 - BlIcon
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
      &nbsp;
      <BlIcon type={'iconshouji'} />
      手机
      &nbsp;
      <BlIcon type={'iconduanxin'} />
      短信
      &nbsp;
      <BlIcon type={'iconrenyituozhuai'} ref={ref} />
      拖拽
      &nbsp;
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

## API

| 参数 | 说明      | 类型     | 默认值 | 备注 |
| ---- | --------- | -------- | ------ | ----- |
| type | 图标 type | `string` | -      | 对于拖拽手柄图标 iconrenyituozhuai，会自动设置 cursor: grab 样式 |
