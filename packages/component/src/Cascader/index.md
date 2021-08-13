---
title: 单选级联 - Cascader
nav:
  title: 组件
  path: /component
  order: 1
group:
  title: Bl
  path: /Bl
---

# Cascader

单选级联选择框

### 何时使用

- 需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。

- 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。

- 比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验。

### 基本使用

- [请参考 Antd](https://ant.design/components/cascader-cn/#API)

### 是否只显示叶子节点的 label

输入框的回显，默认显示全路径

#### 代码演示

```tsx
/**
 * title: 关键属性
 * desc: inputDisplayIsOnlyLeaf 、 getAllPathFn
 */
import React from 'react';
import { Divider } from 'antd';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { CascaderValueType } from 'antd/lib/cascader';
export default () => (
  <>
    <div>
      <span
        style={{
          display: 'inline-block',
          textAlign: 'right',
          width: '200px',
          paddingRight: '16px',
        }}
      >
        默认:{' '}
      </span>
      <BlCascader
        defaultValue={['zhejiang', 'hangzhou', 'xihu']}
        options={cascaderOptions}
        style={{ width: 300 }}
      />
    </div>
    <Divider />
    <div>
      <span
        style={{
          display: 'inline-block',
          textAlign: 'right',
          width: '200px',
          paddingRight: '16px',
        }}
      >
        只显示叶子节点的label:{' '}
      </span>
      <BlCascader
        inputDisplayIsOnlyLeaf={true}
        getAllPathFn={(value: CascaderValueType) => {
          /** 
          发送请求获取该叶子节点的全路径
          ...
          返回数据如下
          */
          return ['zhejiang', 'hangzhou', 'xihu'];
        }}
        defaultValue={['xihu']}
        options={cascaderOptions}
        style={{ width: 300 }}
      />
    </div>
  </>
);
```

### 自定义显示

自定义分隔符，默认用 `/` 分割

#### 代码演示

```tsx
/**
 * title: 关键属性
 * desc: customDivider
 */
import React from 'react';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
export default () => (
  <BlCascader
    customDivider={'、'}
    defaultValue={['zhejiang', 'hangzhou', 'xihu']}
    options={[]}
    style={{ width: 300 }}
  />
);
```

<API />
