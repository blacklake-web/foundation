import React, { useState } from 'react';
import { Input, Form, FormInstance, Button, Popover, Space, Tooltip, FormProps } from 'antd';
import { FormListFieldData, FormListProps } from 'antd/lib/form/FormList';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import _ from 'lodash';
import { NamePath } from 'antd/es/form/interface';
//
import { BlIcon, BlTable } from '../index';

const { TextArea } = Input;

export interface BlSortFormListProps {
  /**
   * Form 实例
   */
  form?: FormInstance;
  /**
   * 如果传入Form实例，可自定义props
   */
  formProps?: Omit<FormProps, 'form'>;
  /**
   * list 字段名称
   */
  name: string | (string | number)[];
  /**
   * list column
   */
  renderColumns: (
    remove: (index: number | number[]) => void,
  ) => ColumnProps<any & FormListFieldData>[];
  /**
   * 是否需要拖拽功能按钮
   * @default true
   */
  isNeedDrag?: boolean;
  /**
   * 是否需要删除功能按钮
   * @default ture
   */
  isNeedDelete?: boolean;
  /**
   * 是否需要添加按钮，默认为true
   * @default true
   */
  isNeedAdd?: boolean;
  /**
   * 是否需要批量添加按钮
   * @default false
   */
  isNeedBatchAdd?: boolean;
  /**
   * 额外的底部按钮，支持自定义功能
   */
  extraButton?: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
  batchAddInit?: {
    [x: string]: {
      isFollowInput?: boolean;
      value?: any;
    };
  };
  addInit?: {
    [x: string]: any;
  };
  style?: {
    [x: string]: number | string;
  };
  /**
   * 最多允许添加几个项
   */
  maxCount?: number;
  /**
   * 冻结列判断方法
   * 被冻结后不可删除，不可拖拽
   */
  fixedRowFn?: (field: FormListFieldData, index: number) => boolean;
  /**
   * 自定义table props
   */
  tableProps?: Omit<TableProps<any>, 'columns' | 'dataSource' | 'footer' | 'components' | 'rowKey'>;
  /**
   * 删除回调
   */
  onDelete?: (index: number[]) => void;
  /**
   * 添加按钮 buttonText
   */
  buttonText?: React.ReactNode;
  /**
   * 批量按钮
   */
  batchButtonText?: React.ReactNode;
  /**
   * 添加事件
   */
  handleAdd?: () => void;
  /**
   * 列表校验规则
   */
  listRules?: FormListProps['rules'];
  /**
   * 初始化行数量
   * @default 0
   */
  initLineCount?: number;
}

/**
 * 记录表单删除的对象id
 */
export const setFormDeleteList = ({
  form,
  getValueName,
  setValueName,
  checkAndFormat,
}: {
  form: FormInstance; // 表单的form
  getValueName: NamePath; // 当前行的name
  setValueName: NamePath; // 储存deleteList 的 name
  checkAndFormat: (item: any) => number | undefined; // 判断和格式化当前删除数据是否需要储存，返回undefined则不储存
}) => {
  const deleteValue = form.getFieldValue(getValueName);

  const currentDeleteList = _.cloneDeep(form.getFieldValue(setValueName));
  const afterFormatDeleteValue = checkAndFormat(deleteValue);

  if (afterFormatDeleteValue) {
    form.setFields([{ name: setValueName, value: [...currentDeleteList, afterFormatDeleteValue] }]);
  }
};

/**
 * 格式化form中记录的deleteList给接口
 * @param deleteListFormValue
 * @returns
 */
export const formatDeleteListToApi = (deleteListFormValue?: {
  [deleteKey: string]: number[];
}): { deleteKey: string; ids: number[] }[] => {
  if (_.isEmpty(deleteListFormValue)) return [];

  const objToAry = _.toPairs(deleteListFormValue);

  return _.map(objToAry, (item) => {
    return { deleteKey: item[0], ids: item[1] };
  });
};

const BlSortFormList = (props: BlSortFormListProps) => {
  const {
    form: propsForm,
    formProps = {},
    name,
    renderColumns,
    isNeedDrag = true,
    isNeedDelete = true,
    isNeedAdd = true,
    isNeedBatchAdd = false,
    batchAddInit,
    addInit,
    style,
    maxCount,
    fixedRowFn,
    tableProps = {},
    onDelete,
    buttonText = '添加',
    batchButtonText = '批量添加',
    handleAdd,
    listRules = [],
    initLineCount = 0,
    extraButton,
  } = props;
  const [dataSource, setDataSource] = useState<any>([]);
  const [hovered, setHovered] = useState(false);
  const [batchAddForm] = Form.useForm();

  const scrollToBottom = () => {
    const wrapper = document.getElementById('attrTable');

    if (wrapper) {
      const dom = wrapper.getElementsByClassName('ant-table-body')[0];

      if (dom) {
        dom.scrollTop = dom.scrollHeight;
      }
    }
  };

  /**
   * 检查是否已经到最大限制数量
   * @param data
   * @returns
   */
  const checkIsOveredMaxCount = (data: FormListFieldData[]) => {
    return _.isNumber(maxCount) && maxCount > 0 && data.length >= maxCount;
  };

  const initAddObj = () => {
    let initObj: any = {};

    if (typeof addInit === 'object') {
      Object.keys(addInit).map((i: string) => {
        initObj[i] = addInit[i];
      });
    } else {
      initObj = '';
    }

    return initObj;
  };
  const initBatchAddObj = (item: string) => {
    const initObj: any = {};

    if (typeof batchAddInit === 'object') {
      Object.keys(batchAddInit).map((i: string) => {
        if (batchAddInit[i]?.isFollowInput) {
          initObj[i] = item;
        } else {
          initObj[i] = batchAddInit[i].value;
        }
      });
    }

    return initObj;
  };

  /**
   * 格式化批量添加内容
   * @param values
   * @returns
   */
  const formatBatchAddValues = (values: any) => {
    // 去掉首、尾换行；以换行符分割
    const addArr = values.batchOptions.trim().split(/[\n]/);

    handleCancelBachAdd();
    // 去掉 数组中的空字符串
    return addArr.filter((v: string) => v !== '');
  };

  /**
   * 取消批量添加
   */
  const handleCancelBachAdd = () => {
    batchAddForm.resetFields();
    setHovered(false);
  };

  /**
   * 批量添加
   * @param value
   */
  const handleBatchAdd = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    data: FormListFieldData[],
    values: any,
  ) => {
    const addArr = formatBatchAddValues(values);

    const currentCount = data.length;

    _.forEach(addArr, (item, index) => {
      if (_.isNumber(maxCount) && maxCount > 0) {
        const addCount = Number(index) + 1;
        if (addCount + currentCount <= maxCount) {
          add(initBatchAddObj(item));
        }
      } else {
        add(initBatchAddObj(item));
      }
    });
  };

  /**
   * 包裹按钮提示
   * 1.提示最大数量限制
   * @param content
   * @param isOveredMaxCount
   * @returns
   */
  const withToolTiped = (content: any, isOveredMaxCount: boolean) => {
    return isOveredMaxCount ? (
      <Tooltip title={`最多只能添加${maxCount}项`}>{content}</Tooltip>
    ) : (
      content
    );
  };

  /**
   * 批量添加弹窗内容
   * @param add
   * @param data
   * @returns
   */
  const renderBatchAddhoverContent = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    data: FormListFieldData[],
  ) => {
    return (
      <Form
        style={{ width: '300px' }}
        form={batchAddForm}
        onFinish={(values) => {
          handleBatchAdd(add, data, values);
        }}
      >
        <Form.Item name="batchOptions" noStyle>
          <TextArea
            autoSize={{ minRows: 8 }}
            style={{ whiteSpace: 'nowrap', overflow: 'scroll' }}
            placeholder="用换行分割多个选项"
          />
        </Form.Item>
        <Form.Item noStyle>
          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <Button size="small" onClick={handleCancelBachAdd}>
              取消
            </Button>
            <Button size="small" type="primary" style={{ marginLeft: '8px' }} htmlType="submit">
              确定
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  };

  /**
   * 单个添加按钮
   * @param add
   * @param isOveredMaxCount
   * @returns
   */
  const renderAddBtn = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    isOveredMaxCount: boolean,
  ) => {
    return (
      <div style={{ width: '100%' }}>
        {withToolTiped(
          <Button
            type="dashed"
            block
            style={{ width: '100%' }}
            onClick={() => {
              if (handleAdd) {
                handleAdd();
                return;
              }
              add(initAddObj());
              setTimeout(() => {
                scrollToBottom();
              }, 300);
            }}
            disabled={isOveredMaxCount}
            icon={<BlIcon type="iconxinjiantianjia" />}
          >
            {buttonText}
          </Button>,
          isOveredMaxCount,
        )}
      </div>
    );
  };

  /**
   * 批量添加按钮
   * @param add
   * @param data
   * @returns
   */
  const renderBatchAddBtn = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    data: FormListFieldData[],
    isOveredMaxCount: boolean,
  ) => {
    return (
      <div style={{ width: '100%', marginLeft: 16 }}>
        {withToolTiped(
          <Popover
            placement="topLeft"
            content={renderBatchAddhoverContent(add, data)}
            title="批量添加选项"
            trigger="click"
            visible={hovered}
            onVisibleChange={isOveredMaxCount ? () => {} : setHovered}
          >
            <Button
              type="dashed"
              block
              onClick={() => {
                setHovered(true);
              }}
              disabled={isOveredMaxCount}
              icon={<BlIcon type="iconxinjiantianjia" />}
            >
              {batchButtonText}
            </Button>
          </Popover>,
          isOveredMaxCount,
        )}
      </div>
    );
  };

  const renderExtraButton = (isOveredMaxCount: boolean) => {
    if (_.isNil(extraButton)) return null;

    return _.map(extraButton, ({ title, onClick, disabled }) => {
      return (
        <div style={{ width: '100%', marginLeft: 16 }}>
          {withToolTiped(
            <Button
              type="dashed"
              block
              style={{ width: '100%' }}
              onClick={onClick}
              disabled={isOveredMaxCount || disabled}
              icon={<BlIcon type="iconxinjiantianjia" />}
            >
              {title}
            </Button>,
            isOveredMaxCount,
          )}
        </div>
      );
    });
  };

  const hasFooter = isNeedAdd || isNeedBatchAdd || !_.isNil(extraButton);
  const renderFooter = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    data: FormListFieldData[],
  ) => {
    const isOveredMaxCount = checkIsOveredMaxCount(data);

    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        {isNeedAdd && renderAddBtn(add, isOveredMaxCount)}
        {isNeedBatchAdd && renderBatchAddBtn(add, data, isOveredMaxCount)}
        {renderExtraButton(isOveredMaxCount)}
      </div>
    );
  };

  const renderBase = () => {
    const DragHandle = SortableHandle(() => <BlIcon type="iconrenyituozhuai" />);

    return (
      <>
        <Form.List
          name={name}
          rules={listRules}
          initialValue={initLineCount > 0 ? Array(initLineCount).fill({}) : undefined}
        >
          {(fields: FormListFieldData[], { add, remove, move }, { errors }) => {
            const data: any = fields?.map((f: any) => {
              return { ...f, ...dataSource[f?.name] } ?? {};
            });

            const handleRemove = (index: number | number[]) => {
              if (typeof onDelete === 'function') {
                onDelete(_.isArray(index) ? index : [index]);
              }
              remove(index);
            };

            const getColumns = (): ColumnProps<FormListFieldData>[] => {
              const baseColumns: ColumnProps<FormListFieldData>[] = [
                {
                  width: _.compact([isNeedDrag, isNeedDelete]).length * 16 + 32,
                  fixed: 'left',
                  render: (text, record, index) => {
                    let isFixed = false;

                    if (typeof fixedRowFn === 'function') {
                      isFixed = fixedRowFn(record, index);
                    }

                    return (
                      <div>
                        <Space>
                          {isNeedDrag && !isFixed && (
                            <div title="拖动">
                              <DragHandle />
                            </div>
                          )}
                          {isNeedDelete && !isFixed && (
                            <div>
                              <BlIcon
                                type="iconlieshanchu"
                                style={{ color: 'red' }}
                                onClick={() => {
                                  handleRemove(record.name);
                                }}
                              />
                            </div>
                          )}
                        </Space>
                      </div>
                    );
                  },
                },
                ...renderColumns(handleRemove),
              ];

              return baseColumns;
            };

            // 拖动的元素
            const SortableItem = SortableElement((itemProps: any) => <tr {...itemProps} />);
            const TableContainer = SortableContainer((tableProps: any) => (
              <tbody {...tableProps} />
            ));

            const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
              move(oldIndex, newIndex);
            };

            const DraggableBodyRow = (bodyRowProps: any) => {
              const index = data.findIndex((x: any) => x.key === bodyRowProps['data-row-key']);

              return <SortableItem index={index} {...bodyRowProps} />;
            };

            const DraggableContainer = (containerProps: any) => (
              <TableContainer
                useDragHandle
                helperClass="row-dragging"
                onSortEnd={onSortEnd}
                {...containerProps}
              />
            );

            return (
              <>
                <BlTable
                  scroll={{
                    y: 500,
                  }}
                  pagination={false}
                  columns={getColumns()}
                  dataSource={data}
                  footer={hasFooter ? () => renderFooter(add, fields) : undefined}
                  rowKey={(field) => field?.key}
                  id="attrTable"
                  components={
                    isNeedDrag
                      ? {
                          body: {
                            wrapper: DraggableContainer,
                            row: DraggableBodyRow,
                          },
                        }
                      : {}
                  }
                  style={style}
                  {...tableProps}
                />
                <Form.ErrorList errors={errors} />
              </>
            );
          }}
        </Form.List>
      </>
    );
  };

  const renderWithForm = () => {
    return <Form form={propsForm} {...formProps}>{renderBase()}</Form>;
  };

  return propsForm ? renderWithForm() : renderBase();
};

export default BlSortFormList;
