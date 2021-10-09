---
title: 多选级联 - BlMultiCascader
nav:
  title: 组件
  path: /component
  order: 1
group:
  title: BlPro
  path: /BlPro
---

# MultiCascader

多选级联选择框

### 何时使用

对有层级关系结构的数据进行多项选择

### 基本使用

- [请参考 rsuitejs](https://rsuitejs.com/zh/components/multi-cascader/)
- 该组件默认输入、输出都是数组结构
- 树结构与单选级联一致

### 级联选择

- 默认是非级联。
- 级联的效果是，子集全选，则父级自动勾选；
- 非级联的效果是子集的勾选与父级无关，适用于子集和父级并列每个层级都可多选的情况。

<code src="./demo/demo1/index.tsx"></code>

### 叶子节点多选

非级联 与 Form 组件一起使用

<code src="./demo/demo3/index.tsx"></code>

### 自定义显示

默认是`,`分割。可自定义选项的连接符；自定义拼接默认值；自定义选项内容

<code src="./demo/demo2/index.tsx"></code>

### 搜索

默认 searchable 为 true。搜索都是动态搜索，需要添加 onSearch 方法

<code src="./demo/demo4/index.tsx"></code>

### 动态加载

<code src="./demo/demo5/index.tsx"></code>

### 受控组件

级联 与 Form 组件一起使用

<code src="./demo/demo6/index.tsx"></code>

<API />
