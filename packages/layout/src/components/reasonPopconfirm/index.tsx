/**
 * 可填写原因的确认气泡框
 */

import React, { useState } from 'react';
import { Popover, Button, Input, message, Form } from 'antd';
import { BlIcon } from '@blacklake-web/component';
import { hidePopover } from '../../utils';
import './styles.less';

export type ReasonConformCallback = (reason: string) => Promise<any>;
export interface ReasonPopconfirmProps {
  /** 操作名 */
  opName: string;
  /** 点击确认后的操作 */
  onConfirm: ReasonConformCallback;
  /** 原因的最大输入字数 */
  reasonMaxLength?: number;
  /** 原因是否必填 */
  reasonRequired?: boolean;
}

const PopReasonConfirm: React.FC<ReasonPopconfirmProps> = ({
  opName,
  onConfirm,
  reasonMaxLength = 1000,
  reasonRequired = false,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then(() => {
      setLoading(true);
      onConfirm(form.getFieldValue('reason'))
        .then(() => {
          message.success(`${opName}成功！`);
          form.setFieldsValue({ reason: '' });
          setLoading(false);
          hidePopover();
        })
        .catch(() => setLoading(false));
    });
  };
  const onCancel = () => {
    form.setFieldsValue({ reason: '' });
    hidePopover();
  };
  const content = (
    <div className="bl-pop-reason-confirm">
      <div style={{ marginBottom: 16 }}>
        <BlIcon type="iconmianxingtixing-jingshi" style={{ color: '#FAAD14', marginRight: 8, fontSize: 16 }} />
        你确定要{opName}吗？
      </div>
      <Form form={form}>
        <Form.Item
          name="reason"
          rules={[{ required: reasonRequired, message: `${opName}原因必填` }]}
        >
          <Input.TextArea className="ant-input" placeholder={`请输入${opName}原因`} maxLength={reasonMaxLength} />
        </Form.Item>
      </Form>
      <div className="bl-pop-reason-confirm-footer" >
        <Button type="default" size="small" onClick={onCancel}>取消</Button>
        <Button type="primary" size="small" loading={loading} onClick={onOk}>确定</Button>
      </div>
    </div>
  );

  return (
    <Popover content={content} placement="topRight" trigger="click" destroyTooltipOnHide>{children}</Popover>
  );
};

export default PopReasonConfirm;
