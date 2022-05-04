import { CSSProperties, ReactElement, ReactNode } from 'react';
import { FormItemProps } from 'antd';

export interface IFieldPermission {
  encoding?: string;
  noAccess?: string[];
  readonly?: string[];
}

export interface DataFormLayoutInfoBlock {
  title?: ReactNode;
  extra?: ReactNode;
  column?: number;
  align?: string;
  items: DataFormLayoutInfoItem[];
}

/**
 * DataFormLayoutInfoItem 在只做布局，DataFormLayoutInfoItem.render返回自定义组件时，DataFormLayoutInfoItem.name不传。
 */
export interface DataFormLayoutInfoItem extends FormItemProps {
  render?: (
    formItemStyles: { [index: string]: any },
    fieldPermission?: IFieldPermission,
  ) => (() => ReactNode) | ReactNode;
  /** 表单项是否独占并占满一行 */
  isFullLine?: boolean;
  style?: CSSProperties;
}

// drawer
export interface DataFormLayoutForDrawerProps {
  visible?: boolean;
  onClose?: (visible: boolean) => void;
  width?: string | number;
  content: ReactElement;
  closable?: boolean;
}

// modal
export interface DataFormLayoutForModalProps {
  visible?: boolean;
  onClose?: (e?: any) => void;
  width?: string | number;
  content: ReactElement;
  closable?: boolean;
}
