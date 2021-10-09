/**
 * title: 关键属性
 * desc: inputDisplayIsOnlyLeaf 、 getAllPathFn （ 注意 ：使用了inputDisplayIsOnlyLeaf属性，getAllPathFn必传
 *
 */
import React, { useState } from 'react';
import { Divider } from 'antd';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { CascaderValueType } from 'antd/lib/cascader';

const App = () => {
  const [value1, setvalue1] = useState();
  const [value2, setvalue2] = useState();
  return (
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
          defaultValue={['zhejiang1', 'hangzhou1', 'xihu1']}
          value={value1}
          options={cascaderOptions}
          onChange={(value) => {
            console.log('value1: ', value);
            setvalue1(value);
          }}
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
            return ['zhejiang1', 'hangzhou1', 'xihu1'];
          }}
          options={cascaderOptions}
          defaultValue={['xihu1']}
          value={value2}
          onChange={(value) => {
            console.log('value2: ', value);
            setvalue2(value);
          }}
          style={{ width: 300 }}
        />
      </div>
    </>
  );
};

export default () => <App />;
