import React from 'react';
// import { Radio as AntdRadio } from 'antd';

export interface RadioProps {
  /**
   * 自动获取焦点
   * @default false
   */
  autoFocus?: boolean;

  /**
   * 指定当前是否选中
   * @default false
   */
  checked?: boolean;

  /**
   * 初始是否选中
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * 禁用 Radio
   * @default false
   */
  disabled?: boolean;

  /**
   * 根据 value 进行比较，判断是否选中
   * @default -
   */
  value?: any;

  /**
   * 值发生变化时的回调
   * @default noop
   */
  onChange?: (event) => void;
}

export const Radio: React.FC<RadioProps> = (props) => {
  return <Radio {...props} />;
};

export default Radio;
