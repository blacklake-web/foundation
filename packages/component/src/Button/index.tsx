import React from 'react';
import { Button as AntdButton } from 'antd';
//
import { ButtonProps } from './index.type';
import './index.less';
import 'rsuite/dist/styles/rsuite-default.css';

export const Button: React.FC<ButtonProps> = (props) => {
  return <AntdButton className={'bl-button'} {...props} />;
};
