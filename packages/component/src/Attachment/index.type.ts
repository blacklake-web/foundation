import { UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { ReactNode } from 'react';

export interface AttachmentProps<T = any> {
  /**
   * 默认文件
   */
  defaultFiles?: any;
  /**
   * 是否允许拖拽
   * @default false
   */
  draggable?: boolean;
  /**
   * 文件格式限制
   */
  limit?: 'image' | 'pdf' | 'doc' | 'attach';
  /**
   * 总文件大小限制（主要针对文件多选）
   */
  totalMaxSize?: number;
  /**
   * 单文件大小限制
   */
  maxSize?: number;
  /**
   * 是否需要预览
   * @default false
   */
  canPreview?: boolean;
  /**
   * 是否自动删除失败文件
   * @default false
   */
  autoDelErrorFile?: boolean;
  /** 超过最大数量时，自定义显示 Dom。与maxCount 配合使用 */
  overCountNode?: ReactNode;
  /**文件内容 */
  onChange?: (files: Array<UploadFile<T>>) => void;
  /**文件上传完毕的回调 */
  onUploaded?: (files: Array<UploadFile<T>>) => void;
}
