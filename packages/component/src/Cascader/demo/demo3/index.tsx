/**
 * title: 关键属性
 * desc: changeOnSelect
 *
 */

import React, { useState } from 'react';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';
import { Divider } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';

const App = () => {
  const [value1, setvalue1] = useState(['zhejiang1', 'hangzhou1', 'xihu1']);
  const [value2, setvalue2] = useState(['zhejiang1', 'hangzhou1']);
  const [value3, setvalue3] = useState(['hangzhou1']);

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

  return (
    <>
      {/* <div>
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
          value={value1}
          options={cascaderOptions}
          expandTrigger={'hover'}
          onChange={(value) => {
            setvalue1(value);
            console.log('value1: ', value);
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
          可选择任意节点:{' '}
        </span>
        <BlCascader
          value={value2}
          options={cascaderOptions}
          expandTrigger={'hover'}
          onChange={(value) => {
            setvalue2(value);
            console.log('value2: ', value);
          }}
          style={{ width: 300 }}
          changeOnSelect={true}
        />
      </div>
      <Divider /> */}
      <div>
        <span
          style={{
            display: 'inline-block',
            textAlign: 'right',
            width: '200px',
            paddingRight: '16px',
          }}
        >
          可选择任意节点 + 只显示最后一级label:{' '}
        </span>
        <BlCascader
          value={value3}
          options={cascaderOptions}
          expandTrigger={'hover'}
          onChange={(value) => {
            setvalue3(value);
            console.log('value3: ', value);
          }}
          style={{ width: 300 }}
          changeOnSelect={true}
          inputDisplayIsOnlyLeaf={true}
          getAllPathFn={(value: CascaderValueType) => {
            /** 
          发送请求获取该叶子节点的全路径
          ...
          返回数据如下  return ['zhejiang', 'hangzhou'];
          */
            if (value) {
              return findIndexArray(cascaderOptions, value[0], []);
            }
          }}
        />
      </div>
    </>
  );
};
export default App;
