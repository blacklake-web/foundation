import { ReactElement, ReactNode } from 'react';
import { FormInstance, FormItemProps } from 'antd';

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
  render: (formItemProps: { [index: string]: any }) => ReactNode;
  span?: number;
  isFullLine?: boolean;
  style?: any;
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
