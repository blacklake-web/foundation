import React, { ReactNode } from 'react';
import { Button as AntdButton } from 'antd';
//
import { ButtonProps } from './index.type';
import './index.less';

export const Button: React.FC<ButtonProps> = (props) => {
  const antdProps: any = props;
  return <AntdButton className={'bl-button'} {...antdProps} />;
};

export default Button;
