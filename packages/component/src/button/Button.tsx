import React, { ReactNode } from 'react';
//
import { Button as AntdButton } from 'antd';

export interface ButtonProps {
  block?: boolean; //	将按钮宽度调整为其父宽度的选项		false
  danger?: boolean; //	设置危险按钮		false
  disabled?: boolean; //	按钮失效状态		false
  ghost?: boolean; //	幽灵属性，使按钮背景透明		false
  href?: string; //	点击跳转的地址，指定此属性 button 的行为和 a 链接一致		-
  htmlType?: 'button' | 'submit' | 'reset'; //	设置 button 原生的 type 值，可选值请参考 HTML 标准		button
  icon?: ReactNode; //	设置按钮的图标组件		-
  loading?: boolean | { delay: number }; //	设置按钮载入状态	false
  shape?: 'circle' | 'round'; //	设置按钮形状
  size?: 'large' | 'middle' | 'small' | 'middle'; //	设置按钮大小 默认：middle
  target?: string; //	相当于 a 链接的 target 属性，href 存在时生效	string	-
  type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default'; //	设置按钮类型
  onClick?: (event) => void; //	点击按钮时的回调
}

const Button = (props: ButtonProps) => {
  return <AntdButton {...props} />;
};

export default Button;
