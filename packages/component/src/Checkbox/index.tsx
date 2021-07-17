import React from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import { CheckboxProps } from './index.type';

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  return <AntdCheckbox {...props} />;
};

export default Checkbox;
