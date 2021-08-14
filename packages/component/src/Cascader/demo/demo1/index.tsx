
/**
 * title: 关键属性
 * desc: inputDisplayIsOnlyLeaf 、 getAllPathFn
 *
 */
import React from 'react';
import { Divider } from 'antd';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { CascaderValueType } from 'antd/lib/cascader';

const App = () => (
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

export default () => <App />;
