/**
 * title: 关键属性
 * desc: inputDisplayIsOnlyLeaf 、 getAllPathFn （ 注意 ：使用了inputDisplayIsOnlyLeaf属性，getAllPathFn必传
 *
 */
import React, { useState } from 'react';
import { Divider } from 'antd';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { CascaderValueType } from 'antd/lib/cascader';

const findIndexArray = (data, id: number | string, indexArray) => {
  let arr = Array.from(indexArray);
  for (let i = 0, len = data.length; i < len; i++) {
    arr.push(data[i].value);
    if (data[i].value === id) {
      return arr;
    }
    let children = data[i].children;
    if (children && children.length) {
      let result = findIndexArray(children, id, arr);
      if (result) return result;
    }
    arr.pop();
  }
  return false;
};

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
            // ['zhejiang1', 'hangzhou1', 'xihu1'];
            if (value) {
              return findIndexArray(cascaderOptions, value[0], []);
            }
          }}
          options={cascaderOptions}
          defaultValue={['zhonghuamen1']}
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
