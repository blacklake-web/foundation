---
title: 搜索选择 - BlSearchSelect
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
 * title: 搜索选择
 * desc: 查询业务数据进行选择
 */

import React from 'react';
import { BlSearchSelect } from '@blacklake-web/component';

const total = 57;

export default () => {
  const fetchFn = (parms) => {
    return new Promise((reject, reslove) => {
      setTimeout(() => {
        const newData: any[] = [];
        for (let i = 1; i <= parms.size; i++) {
          const index = parms.page * parms.size + i;
          const item = {
            label: `${parms.searchParams}_${index}`,
            value: index,
            key: index,
          };
          if (index > total) break;
          newData.push(item);
        }
        reject({
          data: {
            data: newData,
            total,
          },
        });
      }, 500);
    });
  };

  const formatter = (res) => {
    return {
      options: res.data.data,
      total: res.data.total,
    };
  };
  return (
    <div>
      <BlSearchSelect
        style={{ width: 150 }}
        fetchFn={fetchFn}
        formatter={formatter}
        dropdownRender={(menu) => (
          <div>
            <div
              onClick={() => {
                alert(11111);
              }}
            >
              + 增加物料
            </div>
            {menu}
          </div>
        )}
      />
    </div>
  );
};
```

## API

| 参数           | 说明               | 类型                                 | 默认值 |
| -------------- | ------------------ | ------------------------------------ | ------ |
| fetchFn        | 请求后端接口       | `function({searchParams,page,size})` |        |
| formatter      | 转换后端接口数据   | `function(res)`                      |        |
| params         | 其他查询条件       | `object`                             |        |
| ...SelectProps | 其余 Select 的属性 | `SelectProps`                        |        |
