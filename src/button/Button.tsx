import React from 'react';
import { Button as AntBtn, ButtonProps } from 'antd';

interface BLButtonProps extends ButtonProps {
  label: string;
}

const Button = (props: BLButtonProps) => {
  const { label, ...rest } = props;
  console.log('rest: ', rest);
  return (
    <AntBtn {...rest} type={'primary'}>
      {props?.label}
    </AntBtn>
  );
};

export default Button;
