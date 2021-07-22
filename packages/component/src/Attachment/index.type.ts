import { UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { ReactNode } from 'react';

export interface AttachmentProps<T = any> {
  /**
   * [BL]默认文件
   */
  defaultFiles?: any;
  /**
   * [BL]是否允许拖拽
   * @default false
   */
  draggable?: boolean;
  /**
   * [BL]文件格式限制
   */
  limit?: 'image' | 'pdf' | 'doc' | 'attach';
  /**
   * [BL]总文件大小限制（主要针对文件多选）
   */
  totalMaxSize?: number;
  /**
   * [BL]单文件大小限制
   */
  maxSize?: number;
  /**
   * [BL]是否需要预览
   * @default false
   */
  canPreview?: boolean;
  /**
   * [BL]是否自动删除失败文件
   * @default false
   */
  autoDelErrorFile?: boolean;
  /** [BL]超过最大数量时，自定义显示 Dom。与maxCount 配合使用 */
  overCountNode?: ReactNode;
  /**[BL]文件内容 */
  onChange?: (files: Array<UploadFile<T>>) => void;
  /**[BL]文件上传完毕的回调 */
  onUploaded?: (files: Array<UploadFile<T>>) => void;
}
