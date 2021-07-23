import { ReactElement, ReactNode } from 'react';

export interface DetailLayoutProps {
  title?: ReactNode;
  info?: DetailLayoutInfoBlock[];
  baseMenu?: DetailLayoutMenuItem[];
  extra?: ReactNode;
  dataSource: any;
  children?: ReactNode;
}

export interface DetailLayoutInfoBlock {
  title?: ReactNode;
  extra?: ReactNode;
  column?: number;
  items: DetailLayoutInfoItem[];
}

export interface DetailLayoutInfoItem {
  label?: ReactNode;
  dataIndex: string[] | string;
  render?: (text: any, record: any) => ReactNode;
  span?: number;
  toggle?: boolean; // 支持展开、收起
}

export interface DetailLayoutMenuItem {
  disabled?: boolean;
  icon?: ReactElement;
  key: string;
  title: string;
  onClick?: () => void;
}

// drawer
export interface DetailLayoutForDrawerProps {
  visible?: boolean;
  onClose?: (visible: boolean) => void;
  content: ReactElement;
  width?: number;
}

// modal
export interface DetailLayoutForModalProps {
  visible?: boolean;
  onClose?: (e?: any) => void;
  content: ReactElement;
}
