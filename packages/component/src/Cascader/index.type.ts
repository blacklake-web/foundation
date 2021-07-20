import { CascaderProps } from 'antd';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';

export interface BlCascaderProps extends CascaderProps {
  /**
   * [BL] 输入框回显，是否只显示叶子节点的label（最后一个）
   * @default false
   */
  inputDisplayIsOnlyLeaf?: boolean;
  /**
   * [BL] 使用了inputDisplayIsOnlyLeaf属性,则必填
   * @default
   */
  getAllPathFn?: (leaf: CascaderValueType) => CascaderValueType;
  /**
   * [BL] 自定义分隔符
   * @default /
   */
  customDivider?: string;
  /**
   * [BL] 动态加载选项时，使用该搜索方式
   * @default
   */
  onSearch?: (value) => CascaderOptionType[];
  /**
   * [BL] 搜索输入框占位文本
   * @default "请输入..."
   */
  searchPlaceholder?: string;
}
