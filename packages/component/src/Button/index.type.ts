import { ReactNode } from 'react';

export interface ButtonProps {
  /**
   * 将按钮宽度调整为其父宽度的选项
   * @default false
   */
  block?: boolean;

  /**
   * 设置危险按钮
   * @default false
   * @default
   */
  danger?: boolean;

  /**
   * 按钮失效状态
   * @default	false
   */
  disabled?: boolean;

  /**
   * 幽灵属性，使按钮背景透明
   * @default	false
   */
  ghost?: boolean;

  /**
   * 点击跳转的地址，指定此属性 button 的行为和 a 链接一致
   * @default	null
   */
  href?: string;

  /**
   * 设置 button 原生的 type 值，可选值请参考 HTML 标准
   * @default button
   */
  htmlType?: 'button' | 'submit' | 'reset';

  /**
   * 设置按钮的图标组件
   * @default	null
   */
  icon?: ReactNode;

  /**
   * 设置按钮载入状
   * @default	false
   */
  loading?: boolean | { delay: number };

  /**
   * 设置按钮形状
   * @default round
   */
  shape?: 'circle' | 'round';

  /**
   * 设置按钮大小
   * @default middle
   */
  size?: 'large' | 'middle' | 'small' | 'middle';

  /**
   * 相当于 a 链接的 target 属性，href 存在时生效	string
   * @default null
   */
  target?: string;

  /**
   * 设置按钮类型
   * @default primary
   */
  type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';

  /**
   * 点击按钮时的回调
   * @default noop
   */
  onClick?: (event) => void;
}
