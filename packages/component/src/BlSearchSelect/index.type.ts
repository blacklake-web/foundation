import { SelectProps } from 'antd';
import { OptionsType } from 'rc-select/lib/interface/index.d';

export interface BlSearchSelectProps<VT>
  extends Omit<SelectProps<VT>, 'showSearch' | 'listHeight' | 'onSearch' | 'options'> {
  fetchFn: (params: BlSearchSelectParams) => Promise<any>;
  formatter: (res: any) => BlSearchSelectFormatterData;
  params?: {
    [prop: string]: unknown;
  };
}

export interface BlSearchSelectParams {
  searchParams: string;
  page: number;
  size: number;
  [prop: string]: unknown;
}

export interface BlSearchSelectFormatterData {
  total: number;
  options: OptionsType;
}
