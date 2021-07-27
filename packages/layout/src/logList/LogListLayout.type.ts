import { InputProps, DatePickerProps } from 'antd';

export interface TableRowType {
  id: number;
}

export interface LogListProps {
  fetchData: (parmas: any) => Promise<any>;
  rowKey?: string;
  navigateToDetail?: (value: any) => string /** 跳转至详情页的方法 */;
}

export interface FilterItem {
  label: string;
  name: string;
  type: number;
  rules?: any[];
  renderItem?: React.ReactNode;
  selectProps?: any;
  inputProps?: InputProps;
  datePickerProps?: DatePickerProps;
  dateFormat?: string;
}
