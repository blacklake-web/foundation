import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';

import { Button, DatePicker, Form, Input, InputNumber, Select, Space, Drawer } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { EyeInvisibleOutlined, EyeOutlined, RedoOutlined, SettingFilled } from '@ant-design/icons';
import { BlIcon } from '@blacklake-web/component';
import { BlLocalStorage } from '@blacklake-web/utils';
import arrayMove from 'array-move';

//
import { FilterFieldType } from '../../constants';
import '../styles.less';
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
  /**
   * 是否启用筛列配置
   * @default true
   */
  useFilterConfig?: boolean;
}

interface FilterConfig {
  label: string;
  name: string;
  display: boolean;
}

export interface LocalStorageFilterConfig {
  configcacheKey: string;
  filterConfig: FilterConfig[];
}

enum FilterMode {
  /** form筛选模式 */
  FORM,
  /** 配置筛选模式*/
  CONFIG,
}

const BL_FILTER_CONFIG = 'BL_FILTER_CONFIG';
const blLocalStorage = BlLocalStorage.getInstance();
const DragHandle = SortableHandle(() => (
  <BlIcon type="iconrenyituozhuai" style={{ marginRight: 2 }} />
));
const SortableItem = SortableElement((props: any) => <div className={'configItem'} {...props} />);
const SortableBody = SortableContainer((props: any) => (
  <div className={'bl-recordList-Filter-config'} {...props} />
));

/**
 * 初始化筛选配置列表
 */
const getInitFilterConfigList = (filterList) => {
  return _.map(filterList, ({ name, label }) => {
    return { name, label, display: true };
  });
};

/**
 * 判断列配置是否和初始值一致，有配置过
 * @param originFilterConfig
 * @param filterConfig
 * @returns
 */
const isFilterConfigChange = (originFilterConfig: FilterConfig[], filterConfig: FilterConfig[]) => {
  let _isChange = false;

  for (let i = 0; i < originFilterConfig.length; i++) {
    const originCol = originFilterConfig[i];
    const newCol = filterConfig[i];

    if (!_.isEqual(originCol, newCol)) {
      _isChange = true;
      break;
    }
  }

  return _isChange;
};

/**
 * 从LocalStorage获取配置
 */
const getConfigByLocalStorage = (configcacheKey?: string) => {
  if (configcacheKey) {
    const resLocalStorageFilterConfig: LocalStorageFilterConfig[] =
      blLocalStorage.get(BL_FILTER_CONFIG) ?? [];
    return resLocalStorageFilterConfig.find((item) => item.configcacheKey === configcacheKey)
      ?.filterConfig;
  }

  return undefined;
};

/**
 * 设置 配置 到LocalStorage
 * @param params
 */
const setConfigByLocalStorage = (newFilterConfig: FilterConfig[], configcacheKey?: string) => {
  if (configcacheKey) {
    const localStorageTableConfig: LocalStorageFilterConfig[] =
      blLocalStorage.get(BL_FILTER_CONFIG) ?? [];
    const currentTableConfigIndex = localStorageTableConfig.findIndex(
      (item) => item.configcacheKey === configcacheKey,
    );
    if (currentTableConfigIndex !== -1) {
      localStorageTableConfig[currentTableConfigIndex].filterConfig = newFilterConfig;
    } else {
      localStorageTableConfig.push({ configcacheKey, filterConfig: newFilterConfig });
    }
    blLocalStorage.set(BL_FILTER_CONFIG, localStorageTableConfig);
  }
};

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
    configcacheKey,
    useFilterConfig = true,
  } = props;

  const [form] = Form.useForm();

  const [mode, setMode] = useState(FilterMode.FORM);

  // 配置中的筛选配置列表
  const [filterConfigList, setFilterConfigList] = useState<FilterConfig[]>([]);

  // 已保存的筛选配置列表，
  const savedFilterConfigListRef = useRef<FilterConfig[]>([]);

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  useEffect(() => {
    if (defaultFilterValue && form) {
      form.resetFields();
      const afterFilter = formatDataToFormDisplay?.(defaultFilterValue) ?? defaultFilterValue;

      form.setFieldsValue(afterFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFilterValue, form]);

  useEffect(() => {
    if (visible && _.isEmpty(filterConfigList)) {
      const originFilterConfig = getInitFilterConfigList(filterList);

      const cacheFilterConfig = getConfigByLocalStorage(configcacheKey) ?? [];

      if (!_.isEmpty(cacheFilterConfig) && useFilterConfig) {
        /**
         * 从缓存中取出的 cacheColConfig 的值与 originColumnConfig dataIndex 存在不一致时，
         * 按照 originColumnConfig 顺序读取 cacheColConfig 存在的配置(display,fixed)
         */

        const isEveryMetched = originFilterConfig.every(({ name }) => {
          return (
            cacheFilterConfig.findIndex(({ name: cacheName }) => _.isEqual(cacheName, name)) !== -1
          );
        });

        let resConfig: FilterConfig[] = [];

        if (isEveryMetched) {
          // 全部匹配使用缓存
          resConfig = cacheFilterConfig;
        } else {
          // 存在不匹配时，使用 origin 顺序，如果缓存存在当前 dataIndex 配置，读取后显示，重新设置缓存
          resConfig = _.map(
            originFilterConfig,
            (config) => _.find(cacheFilterConfig, { name: config.name }) ?? config,
          );
          setConfigByLocalStorage(resConfig, configcacheKey);
        }

        savedFilterConfigListRef.current = _.cloneDeep(resConfig);
        setFilterConfigList(resConfig);
      } else {
        savedFilterConfigListRef.current = _.cloneDeep(originFilterConfig);
        setFilterConfigList(originFilterConfig);
      }
    }
  }, [visible]);

  const onFinish = (values: any) => {
    try {
      const submitValues: any = {};
      Object.entries(values).forEach(([k, v]: [string, any]) => {
        if (_.isNil(v) || v === '') { return; }
        const type = _.find(filterList, { name: k })?.type;
        if (type === FilterFieldType.multiSelect && _.isEmpty(v)) { return; }
        let value: any = v;
        if (type === FilterFieldType.number || type === FilterFieldType.integer) {
          value = {};
          if (!_.isNil(v.min)) { value.min = v.min; }
          if (!_.isNil(v.max)) { value.max = v.max; }
          if (_.isEmpty(value)) { return; }
        }
        submitValues[k] = value;
      });
      handleFilter?.(submitValues);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  /**
   * 设置列 显示 状态
   * @param index
   * @param newDisplay
   */
  const handleDisplay = (index: number, newDisplay: boolean) => {
    setFilterConfigList((oldConfig) => {
      const newConfig = [...oldConfig];
      newConfig[index].display = newDisplay;
      return newConfig;
    });
  };

  /**
   * 处理排序之后的configColumn
   */
  const handleSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    setFilterConfigList((oldConfig) => {
      const newConfig = [...oldConfig];

      return arrayMove(newConfig, oldIndex, newIndex);
    });
  };

  const getFormItem = (filter: FilterItem): React.ReactNode => {
    const { type, props, selectProps, inputProps, dateFormat, precision, name, label } = filter;
    const customProps = {
      ...inputProps,
      ...selectProps,
      ...props,
    };

    switch (type) {
      case FilterFieldType.text:
        return <Input {...customProps} maxLength={255} placeholder={`请输入${label}`} />;

      case FilterFieldType.textArea:
        return <Input {...customProps} maxLength={1000} placeholder={`请输入${label}`} />;

      case FilterFieldType.integer:
        return (
          <>
            <Form.Item name={[name, 'min']} noStyle>
              <InputNumber
                max={1000000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder={`请输入${label}的最小值`}
              />
            </Form.Item>
            <span style={{ margin: '0 6px' }}> ~ </span>
            <Form.Item name={[name, 'max']} noStyle>
              <InputNumber
                max={1000000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder={`请输入${label}的最大值`}
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
                placeholder={`请输入${label}的最小值`}
              />
            </Form.Item>
            <span style={{ margin: '0 6px' }}> ~ </span>
            <Form.Item name={[name, 'max']} noStyle>
              <InputNumber
                max={1000000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                precision={Number(precision) || 8}
                placeholder={`请输入${label}的最大值`}
              />
            </Form.Item>
          </Input.Group>
        );

      case FilterFieldType.select:
        return <Select {...customProps} allowClear showArrow placeholder={`请选择${label}`} />;

      case FilterFieldType.multiSelect:
        return (
          <Select
            {...selectProps}
            mode="multiple"
            allowClear
            showArrow
            placeholder={`请选择${label}`}
          />
        );

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
            placeholder={`请选择${label}`}
          />
        );

      case FilterFieldType.date: {
        return (
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            format={dateFormat}
            showTime={{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
            placeholder={['开始时间', '结束时间']}
            separator={<BlIcon type="iconzhixiangyou" />}
            suffixIcon={<BlIcon type={'iconshijian'} />}
          />
        );
      }

      default:
        return <Input {...inputProps} placeholder={`请输入${label}`} />;
    }
  };

  /**
   * 渲染 filter 抽屉标题
   */
  const renderTitle = () => {
    if (mode === FilterMode.FORM) {
      return (
        <Space>
          <span>筛选</span>
          {useFilterConfig && (
            <SettingFilled
              className={
                isFilterConfigChange(getInitFilterConfigList(filterList), filterConfigList)
                  ? 'changeConfigIcon'
                  : ''
              }
              style={{
                fontSize: 14,
              }}
              onClick={() => {
                setMode(FilterMode.CONFIG);
              }}
            />
          )}
        </Space>
      );
    }

    if (mode === FilterMode.CONFIG) return '筛选配置';

    return null;
  };

  /**
   * 渲染筛选Form列表
   */
  const renderFilterForm = () => {
    return (
      <Form
        {...layout}
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout={'vertical'}
      >
        {filterList &&
          filterConfigList.map((filterConfig) => {
            const FIndex = _.findIndex(filterList, ({ name }) => name === filterConfig.name);
            const filter = filterList[FIndex];
            return filterConfig.display ? (
              <Form.Item
                key={filter.label}
                label={filter.label}
                name={filter.name}
                rules={filter.rules}
              >
                {filter.renderItem ? filter.renderItem : getFormItem(filter)}
              </Form.Item>
            ) : null;
          })}
      </Form>
    );

    return;
  };

  /**
   * 渲染筛选配置项列表
   */
  const renderFilterConfig = () => {
    return (
      <SortableBody
        helperClass={'row-dragging'}
        distance={10}
        // hideSortableGhost={false}
        axis="y"
        onSortEnd={handleSortEnd}
      >
        {filterConfigList.map(({ display, label }, index) => {
          return (
            <SortableItem
              index={index}
              key={`configItem_${index}`}
              style={{ opacity: display ? 1 : 0.25 }}
            >
              <Space>
                <DragHandle />
                {label}
              </Space>
              <Space>
                {display ? (
                  <EyeOutlined onClick={() => handleDisplay(index, !display)} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => handleDisplay(index, !display)} />
                )}
              </Space>
            </SortableItem>
          );
        })}
      </SortableBody>
    );
  };

  /**
   * 渲染筛选列表的footer
   */
  const renderFilterFormFooter = () => (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Button
          type="text"
          icon={<RedoOutlined />}
          onClick={() => {
            form.resetFields();
            form.submit();
          }}
        >
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

  /**
   * 渲染筛选配置列表的footer
   */
  const renderFilterConfigFooter = () => (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Button
          type="text"
          icon={<RedoOutlined />}
          onClick={() => {
            const initFilterConfigList = getInitFilterConfigList(filterList);

            setFilterConfigList(initFilterConfigList);
            savedFilterConfigListRef.current = _.cloneDeep(initFilterConfigList);
            configcacheKey && setConfigByLocalStorage(initFilterConfigList, configcacheKey);
            setMode(FilterMode.FORM);
          }}
        >
          重置
        </Button>
      </div>
      <Space>
        <Button
          onClick={() => {
            setFilterConfigList(_.cloneDeep(savedFilterConfigListRef.current));
            setMode(FilterMode.FORM);
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            savedFilterConfigListRef.current = _.cloneDeep(filterConfigList);
            configcacheKey && setConfigByLocalStorage(filterConfigList, configcacheKey);
            setMode(FilterMode.FORM);
          }}
        >
          确定
        </Button>
      </Space>
    </div>
  );

  return (
    <Drawer
      visible={visible}
      title={renderTitle()}
      onClose={() => {
        setFilterConfigList(_.cloneDeep(savedFilterConfigListRef.current));
        setMode(FilterMode.FORM);
        _.isFunction(handleClose) && handleClose();
      }}
      footer={mode === FilterMode.FORM ? renderFilterFormFooter() : renderFilterConfigFooter()}
      destroyOnClose
      width={380}
      keyboard={false}
      mask={false}
      getContainer={filterContaniner}
      style={{ position: 'absolute' }}
    >
      {mode === FilterMode.FORM ? renderFilterForm() : renderFilterConfig()}
    </Drawer>
  );
};

export default FilterList;
