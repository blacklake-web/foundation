import React, { useEffect } from 'react';

import { Button, DatePicker, Form, Input, InputNumber, Select, Space, Drawer } from 'antd';
import { FilterFieldType } from '../../constants';
//
import { RedoOutlined } from '@ant-design/icons';
//
import { BlRecordListBaseProps, FilterItem } from '../recordListLayout.type';

export interface FilterProps extends BlRecordListBaseProps {
  defaultFilterValue?: any;
  /**内部状态 */
  handleFilter?: (data: any) => void;
  /**内部状态 */
  visible?: boolean;
  /**内部状态 */
  handleClose?: () => void;
  /** 格式化查询数据到Filter 的form 中，
   * 从url中获取到的数据会存在数据类型错误导致查询数据无法复写入form中需要转换（如form需要number类型的key,但是从url上取下来的数据key会是string）
   */
  formatDataToFormDisplay?: (filter: any) => any;
}
/**
 * FilterList table 组件的筛选框，table点击删选按钮显示
 * @param props.filterList    筛选项list
 * @param props.handleFilter  筛选数据的方法
 * @param props.visible       筛选弹窗是否可见
 * @param props.handleClose   关闭筛选弹窗
 * @param props.defaultFilterValue 筛选列表中的所有字段的默认值
 * @returns ReactNode
 */
const FilterList = (props: FilterProps) => {
  const {
    filterList = [],
    handleFilter,
    visible,
    handleClose,
    defaultFilterValue,
    formatDataToFormDisplay,
    filterContaniner,
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (defaultFilterValue && form) {
      form.resetFields();
      const afterFilter = formatDataToFormDisplay?.(defaultFilterValue) ?? defaultFilterValue;

      form.setFieldsValue(afterFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFilterValue, form]);

  const onFinish = (values: any) => {
    try {
      handleFilter?.(values);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const getFormItem = (filter: FilterItem): React.ReactNode => {
    const { type, selectProps, inputProps, dateFormat, precision, name } = filter;

    switch (type) {
      case FilterFieldType.text:
        return <Input {...inputProps} maxLength={255} />;

      case FilterFieldType.textArea:
        return <Input {...inputProps} maxLength={1000} />;

      case FilterFieldType.integer:
        return (
          <>
            <Form.Item name={[name, 'min']} noStyle>
              <InputNumber
                max={1000000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <span style={{ margin: '0 6px' }}> ~ </span>
            <Form.Item name={[name, 'max']} noStyle>
              <InputNumber
                max={1000000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </>
        );

      case FilterFieldType.number:
        return (
          <Input.Group compact>
            <Form.Item name={[name, 'min']} noStyle>
              <InputNumber
                max={1000000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                precision={Number(precision) || 8}
              />
            </Form.Item>
            <span style={{ margin: '0 6px' }}> ~ </span>
            <Form.Item name={[name, 'max']} noStyle>
              <InputNumber
                max={1000000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                precision={Number(precision) || 8}
              />
            </Form.Item>
          </Input.Group>
        );

      case FilterFieldType.select:
        return <Select {...selectProps} allowClear showArrow />;

      case FilterFieldType.multiSelect:
        return <Select {...selectProps} mode="multiple" allowClear showArrow />;

      case FilterFieldType.boolean:
        return (
          <Select
            {...selectProps}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
            mode="multiple"
            showArrow
          />
        );

      case FilterFieldType.date: {
        const isShowTime = Boolean(
          dateFormat && (dateFormat.includes('hh') || dateFormat.includes('HH')),
        );

        return <DatePicker.RangePicker format={dateFormat} showTime={isShowTime} />;
      }

      default:
        return <Input {...inputProps} />;
    }
  };

  const renderFilterList = () => {
    return filterList.map((filter) => {
      return (
        <Form.Item key={filter.label} label={filter.label} name={filter.name} rules={filter.rules}>
          {filter.renderItem ? filter.renderItem : getFormItem(filter)}
        </Form.Item>
      );
    });
  };

  const footerContent = (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Button type="text" icon={<RedoOutlined />} onClick={() => form.resetFields()}>
          重置
        </Button>
      </div>
      <Space>
        <Button onClick={() => handleClose?.()}>取消</Button>
        <Button type="primary" onClick={() => form.submit()}>
          确定
        </Button>
      </Space>
    </div>
  );

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  return (
    <Drawer
      visible={visible}
      title={'筛选'}
      onClose={handleClose}
      footer={footerContent}
      destroyOnClose
      width={380}
      keyboard={false}
      mask={false}
      getContainer={filterContaniner}
      style={{ position: 'absolute' }}
    >
      <Form
        {...layout}
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout={'vertical'}
      >
        {filterList && renderFilterList()}
      </Form>
    </Drawer>
  );
};

export default FilterList;
