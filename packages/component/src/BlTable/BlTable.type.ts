import { TableProps, ColumnsType, ColumnGroupType, ColumnType } from 'antd/lib/table';

export interface BlTableProps<RecordType> extends TableProps<RecordType> {
  /**
   * [BL]列宽可拖拽伸缩,可伸缩时，column.width 必填且为数字
   */
  resizableCol?: boolean;
  /**
   * [BL]列表配置表示，全厂唯一，传入时记录到缓存（列配置，上次分页数）
   */
  tableConfigKey?: string;
  /**
   * [BL]是否启用列配置。1.启用时，但不传tableConfigKey，不会存到缓存
   */
  useColConfig?: boolean;
  /**
   * 是否默认展示序号列
   * @default false
   */
  useIndex?: boolean;
  /**
   * [BL]列
   */
  columns: BlColumnsType<RecordType>;
}

export interface BlColumnType<RecordType> extends ColumnType<RecordType> {
  fixed?: any;
  renderStr?: (text: any, record: any, index) => string; // 返回string的render,用作导出或xxx(其他场景)
  defaultColConfig?: {
    fixed?: boolean; // 默认固定左侧列
    display?: boolean; // 默认列显示
  };
}

export type BlColumnsType<RecordType = unknown> = BlColumnType<RecordType>[];

// 列配置
export interface ConfigColumn {
  dataIndex?: string | number | readonly (string | number)[];
  colConfig: {
    fixed?: boolean; // 固定状态
    display?: boolean; // 展示状态
    disabled?: boolean; // 不可编辑列（fixed:right等）
  };
}

export interface LocalStorageTableConfig {
  tableConfigKey: string;
  colConfig: ConfigColumn[];
}
