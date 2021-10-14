import { ReactNode } from 'react';
import { MultiCascaderProps } from 'rsuite';

export interface DataItemType {
  /** The value of the option corresponds to the `valueKey` in the data. **/
  value: string;

  /** The content displayed by the option corresponds to the `labelKey` in the data. **/
  label: ReactNode;

  /**
   * The data of the child option corresponds to the `childrenKey` in the data.
   * Properties owned by tree structure components, such as TreePicker, Casacder.
   */
  children?: DataItemType[];

  /**
   * Properties of grouping functional components, such as CheckPicker, InputPicker
   */
  groupBy?: string;

  /**
   * The children under the current node are loading.
   * Used for components that have cascading relationships and lazy loading of children. E.g. Casacder, MultiCascader
   */
  loading?: boolean;
}
type _MultiCascaderProps = Omit<MultiCascaderProps, 'data'>;
export interface BlMultiCascaderProps extends _MultiCascaderProps {
  /**
   * 	[BL] 级联组件数据源
   * @default ‘[]’
   */
  options: DataItemType[];
  /**
   * [BL] 动态加载选项
   * @default
   */
  loadData?: (item: DataItemType) => Promise<DataItemType[]>;
  /**
   * [BL] 搜索的回调函数
   * @default
   */
  onSearch?: (searchKeyword: string, event) => Promise<DataItemType[]>;
  /**
   * [BL] 搜索框占位符
   * @default	 '请输入...'
   */
  searchPlaceholder?: string;
  /**
   * [BL] 自定义分隔符
   * @default ','
   */
  customDivider?: 'string';
  /**
   * [BL] 为 true 时显示 '加载中...'，为 false 显示'暂无数据'
   * @default false
   */
  loading?: boolean;

  // /**
  //  * [BL] 未查询到结果占位符
  //  * @default	'未查询到结果'
  //  */
  //  noResultsText?: string;
  //  /**
  //   * [BL] 节点全选文本
  //   * @default	'全部'
  //   */
  //  checkAllText?: string;
}
