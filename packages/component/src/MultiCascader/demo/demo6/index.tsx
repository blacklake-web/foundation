/**
 * title:
 * desc:
 *
 */

import React, { useState } from 'react';
import { BlMultiCascader, multiCascaderOptions } from '@blacklake-web/component';
import { Button, Form, Input, Divider } from 'antd';

import './index.less';

export default () => {
  const [res, setRes] = useState();
  const [form] = Form.useForm();

  const onFinish = (value) => {
    setRes(value);
    console.log('onFinish', value);
  };
  return (
    <>
      <div className="box">
        <p>表单受控demo：</p>
        <Divider />
        <Form
          onFinish={onFinish}
          form={form}
          initialValues={{ input: 'hhh', multiCascader: ['1-1'] }}
        >
          <Form.Item name="input" label="输入框" style={{ width: 300 }}>
            <Input />
          </Form.Item>
          <Form.Item name="multiCascader" label="多选框">
            <BlMultiCascader options={multiCascaderOptions} style={{ width: 300 }} searchable={false} />
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
