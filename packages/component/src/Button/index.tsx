import React from 'react';
import { Button as AntdButton } from 'antd';
//
import { BlButtonProps } from './index.type';
import './index.less';

export const BlButton: React.FC<BlButtonProps> = (props) => {
  return <AntdButton className={'bl-button'} {...props} />;
};
