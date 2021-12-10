import React, { ReactNode } from 'react';
import { Button, Space } from 'antd';
//
import '../DataFormLayout.less';

export interface DataFormLayoutFooterProps {
  /**
   * 默认主按钮文字
   * @default 确认
   */
  okText?: string;
  /**
   * 默认副按钮文字
   * @default 取消
   */
  cancelText?: string;
  /**
   * 默认副按钮点击回调
   */
  onCancel?: () => void;
  /**
   * 默认主按钮点击回调
   */
  onFinish?: () => void;
  /**
   * 是否需要显示默认footer,或自定义显示footer
   * @default true
   */
  footer?: boolean | ReactNode;
  /**
   * 默认按钮位置
   * @default center
   */
  footerPosition?: 'right' | 'left' | 'center';
  /**
   * 默认按钮右边扩展内容
   */
  extra?: ReactNode;
  /**
   * 默认确认按钮loading
   * @default false
   */
  confirmLoading?: boolean;
  footerStyle?: {};
}

const footerPositionType = {
  right: 'flex-end',
  center: 'center',
  left: 'flex-start',
};

const DataFormLayoutFooter = (props: DataFormLayoutFooterProps) => {
  const {
    onCancel,
    onFinish,
    footer = true,
    okText = '确认',
    cancelText = '取消',
    extra = null,
    confirmLoading = false,
    footerPosition = 'center',
    footerStyle = {},
  } = props;

  const renderFooter = () => (
    <>
      <Button
        onClick={() => {
          if (typeof onCancel === 'function') onCancel();
        }}
      >
        {cancelText}
      </Button>
      <Button
        loading={confirmLoading}
        type={'primary'}
        onClick={() => {
          if (typeof onFinish === 'function') onFinish();
        }}
      >
        {okText}
      </Button>
    </>
  );

  return footer === false ? null : (
    <Space
      align={'center'}
      size={'large'}
      style={{
        justifyContent: footerPositionType[footerPosition],
        ...footerStyle,
      }}
      className="data-layout-footer"
    >
      {renderFooter()}
      {extra}
    </Space>
  );
};

export default DataFormLayoutFooter;
