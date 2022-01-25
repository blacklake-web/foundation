/**
 * 创建和编辑数据统一使用此 dataFormLayout
 */
import DataFormLayout from './DataFormLayout';
import { checkFieldHasPermission } from './components/DataFormLayoutBody';
import DataFormLayoutForDrawer from './DataFormLayoutForDrawer';
import DataFormLayoutForModal from './DataFormLayoutForModal';
import {
  DataFormLayoutInfoBlock,
  DataFormLayoutForDrawerProps,
  DataFormLayoutForModalProps,
} from './DataFormLayout.type';

export { DataFormLayout, DataFormLayoutForDrawer, DataFormLayoutForModal, checkFieldHasPermission };
export type { DataFormLayoutInfoBlock, DataFormLayoutForDrawerProps, DataFormLayoutForModalProps };
