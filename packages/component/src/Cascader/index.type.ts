import {  CascaderProps } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';

export interface BlCascaderProps extends CascaderProps {
    /**
     * [BL] 输入框回显，是否只显示最后的叶子节点的label（最后一个）
     * @default false
     */
    inputDisplayIsOnlyLeaf?: boolean;
    /**
     * [BL] 使用了inputDisplayIsOnlyLeaf属性,则必填
     * @default defaultValue
     */
    getAllPathFn?: (leaf:CascaderValueType)=>CascaderValueType;
    /**
     * [BL] 自定义分隔符
     * @default / 
     */
    customDivider?:string
  }