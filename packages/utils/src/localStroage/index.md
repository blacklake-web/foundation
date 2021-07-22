---
title: LocalStroage
nav:
  title: 工具
  path: /utils
  order: 3
group:
  title: utils
  path: /utils
---

```tsx
/**
 * title: 基础
 * desc: 基础使用
 */

import React, { useState, useRef } from 'react';
import { BlLocalStorage, StorageLimitType } from '@blacklake-web/utils';

const blLocalStorage = BlLocalStorage.getInstance();

export default () => {
  const [stroage, setStorage] = useState('');

  const inputVal = useRef('');

  return (
    <div>
      <input
        onChange={(e) => {
          inputVal.current = e.target.value;
        }}
      />
      <button
        onClick={() => {
          blLocalStorage.set('aa', inputVal.current);
          const stroage = localStorage.getItem('aa');
          setStorage(stroage);
        }}
      >
        保存
      </button>
      <p>{`stroage : ${stroage}`}</p>
    </div>
  );
};
```

```tsx
/**
 * title: 按用户隔离的
 * desc: 按指定类型隔离数据
 */

import React, { useState, useRef } from 'react';
import { BlLocalStorage, StorageLimitType } from '@blacklake-web/utils';

const blLocalStorage = BlLocalStorage.getInstance();
blLocalStorage.setBaseInfo('111');

export default () => {
  const [stroage, setStorage] = useState('');

  const inputVal = useRef('');
  const selectVal = useRef('111');

  return (
    <div>
      <input
        onChange={(e) => {
          inputVal.current = e.target.value;
        }}
      />
      <select
        onChange={(e) => {
          blLocalStorage.setBaseInfo(e.target.value);
          selectVal.current = e.target.value;
        }}
      >
        <option value={'111'}>userId = 111</option>
        <option value={'222'}>userId = 222</option>
      </select>
      <button
        onClick={() => {
          blLocalStorage.set('aa', inputVal.current, {
            limitType: StorageLimitType.USER,
          });
          const stroage = localStorage.getItem('aa');
          setStorage(stroage);
        }}
      >
        保存
      </button>
      <p>{`stroage : ${stroage}`}</p>
    </div>
  );
};
```
