import React from 'react';
import { Radio as AntdRadio } from 'antd';
import { RadioProps } from './index.type';

export const Radio: React.FC<RadioProps> = (props) => {
  return <AntdRadio {...props} />;
};

export default Radio;
