/**
 * title: 关键属性
 * desc:  uncheckableItemValues
 *
 */

import React, { useState } from 'react';
import { BlMultiCascader, multiCascaderOptions } from '@blacklake-web/component';
import { Button, Form, Input } from 'antd';

import './index.less';

export default () => {
  const [res, setRes] = useState();
  const [form] = Form.useForm();

  const getIsNotLeafArray = () => {
    const arr: string[] = [];
    bianli(multiCascaderOptions);
    function bianli(data) {
      data?.map((item) => {
        if (item?.children?.length > 0) {
          arr.push(item.value);
          bianli(item?.children);
        }
      });
    }
    return arr;
  };
  const onFinish = (value) => {
    setRes(value);
    console.log('onFinish', value);
  };
  return (
    <>
      <div className="box">
        <p>表单受控demo：只能选择叶子节点</p>

        <Form onFinish={onFinish} form={form} initialValues={{ multiCascader: ['1-1-1'] }}>
          <Form.Item name="multiCascader">
            <BlMultiCascader
              cascade={false}
              options={multiCascaderOptions}
              style={{ width: 300 }}
              uncheckableItemValues={getIsNotLeafArray()}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>

        <p>{JSON.stringify(res)}</p>
      </div>
    </>
  );
};
