import React, { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { isEqual, isNil } from 'lodash';
//
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PushpinFilled,
  PushpinOutlined,
} from '@ant-design/icons';
import { Space, Button, message } from 'antd';
//
import { BlIcon } from '../../BlIcon';
import { BlColumnsType, ConfigColumn } from '../BlTable.type';
import './styles.less';

interface TableColumnConfigProps<RecordType> {
  columns: BlColumnsType<RecordType>;
  colConfigValue: ConfigColumn[];
  onClose?: () => void;
  onChange?: (colConfig: ConfigColumn[]) => void;
}

const MIN_CONFIG_AMOUNT = 5; // 最小列数量，低于时不可操作，只能换位置

const DragHandle = SortableHandle(() => (
  <BlIcon type="iconrenyituozhuai" style={{ marginRight: 2 }} />
));

const SortableItem = SortableElement((props: any) => (
  <div className={'colConfigItem'} {...props} />
));
const SortableBody = SortableContainer((props: any) => (
  <div className={'blTable-column-config-content-body'} {...props} />
));

const TableColumnConfig = <RecordType extends object = any>(
  props: TableColumnConfigProps<RecordType>,
) => {
  const { columns, colConfigValue, onClose, onChange } = props;

  const [newColConfigValue, setNewColConfigValue] = useState<ConfigColumn[]>([]);

  useEffect(() => {
    setNewColConfigValue(colConfigValue);
  }, [colConfigValue]);

  /**
   * 处理排序之后的configColumn
   */
  const handleSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    setNewColConfigValue((oldConfigColumn) => {
      const newConfigColumn = [...oldConfigColumn];
      const lastFixedIndex = newConfigColumn.filter((col) => col.colConfig.fixed).length - 1;
      const currentIsFixed = newConfigColumn[oldIndex].colConfig.fixed;

      if (currentIsFixed) {
        // 当移动是固定列时，最多可移动到最后一个固定列之后
        const realIndex = newIndex >= lastFixedIndex ? lastFixedIndex : newIndex;

        return arrayMove(newConfigColumn, oldIndex, realIndex);
      } else {
        // 当移动是非固定列时，最多可移动到第一个非固定列之前
        const realIndex = newIndex <= lastFixedIndex ? lastFixedIndex + 1 : newIndex;

        return arrayMove(newConfigColumn, oldIndex, realIndex);
      }
    });
  };

  /**
   * 设置列 固定 状态
   * @param index
   * @param newFixed
   */
  const handleFixed = (index: number, newFixed: boolean) => {
    const totalAmount = newColConfigValue.length;

    if (totalAmount <= MIN_CONFIG_AMOUNT) return;

    setNewColConfigValue((oldConfigColumn) => {
      const newConfigColumn = [...oldConfigColumn];

      newConfigColumn[index].colConfig.fixed = newFixed;
      const lastFixedIndex = newConfigColumn.filter((col) => col.colConfig.fixed).length - 1;

      if (newFixed) {
        // 固定时，添加到最后一个固定状态列之后
        return arrayMove(newConfigColumn, index, lastFixedIndex);
      } else {
        // 取消固定时，放到第一个不是固定状态列之前
        return arrayMove(newConfigColumn, index, lastFixedIndex + 1);
      }
    });
  };

  /**
   * 设置列 显示 状态
   * @param index
   * @param newDisplay
   */
  const handleDisplay = (index: number, newDisplay: boolean) => {
    const totalAmount = newColConfigValue.length;
    const displayAmount = newColConfigValue.filter(
      ({ colConfig: { display, disabled } }) => display && !disabled,
    ).length;

    if (totalAmount <= MIN_CONFIG_AMOUNT) return;
    if (displayAmount <= MIN_CONFIG_AMOUNT && !newDisplay) {
      message.warning('最少展示5列数据');
      return;
    }
    setNewColConfigValue((oldConfigColumn) => {
      const newConfigColumn = [...oldConfigColumn];

      newConfigColumn[index].colConfig.display = newDisplay;

      return newConfigColumn;
    });
  };

  const handleClose = () => {
    typeof onClose === 'function' && onClose();
  };

  const handleSave = () => {
    typeof onChange === 'function' && onChange(newColConfigValue);
  };

  const renderColItem = (config: ConfigColumn, index: number, total: number) => {
    if (!config) return null;

    const { display, fixed, disabled } = config.colConfig;
    const isLessTotal = total <= MIN_CONFIG_AMOUNT;

    // const currentCol = columns.find((item) => isEqual(item.dataIndex, config.dataIndex)) ?? {
    //   title: <span className="errorColItem">错误数据</span>,
    // };
    // 错误提示隐藏
    const currentCol = columns.find((item) => isEqual(item.dataIndex, config.dataIndex));

    if (isNil(currentCol)) return null;

    return disabled ? (
      <div className="colConfigItem" key={`configItem_${index}`}>
        <Space>
          <span style={{ marginRight: 16 }} />
          {currentCol.title}
        </Space>
      </div>
    ) : (
      <SortableItem
        index={index}
        key={`configItem_${index}`}
        style={{ opacity: display ? 1 : 0.4 }}
      >
        <Space>
          <DragHandle />
          {currentCol.title}
        </Space>
        {!isLessTotal && (
          <Space>
            {display ? (
              <EyeOutlined onClick={() => handleDisplay(index, !display)} />
            ) : (
              <EyeInvisibleOutlined onClick={() => handleDisplay(index, !display)} />
            )}
            {fixed ? (
              <PushpinFilled onClick={() => handleFixed(index, !fixed)} />
            ) : (
              <PushpinOutlined onClick={() => handleFixed(index, !fixed)} />
            )}
          </Space>
        )}
      </SortableItem>
    );
  };

  const renderBody = () => {
    return newColConfigValue.map((col, index) => {
      return renderColItem(col, index, newColConfigValue.length);
    });
  };

  const renderFooter = () => {
    return (
      <>
        <Button size="small" onClick={handleClose}>
          取消
        </Button>
        <Button size="small" type="primary" onClick={handleSave}>
          应用
        </Button>
      </>
    );
  };

  return (
    <div className={'blTable-column-config-content'}>
      <SortableBody
        helperClass={'row-dragging'}
        distance={10}
        // hideSortableGhost={false}
        axis="y"
        onSortEnd={handleSortEnd}
      >
        {renderBody()}
      </SortableBody>
      <Space className={'blTable-column-config-content-footer'}>{renderFooter()}</Space>
    </div>
  );
};

export default TableColumnConfig;
