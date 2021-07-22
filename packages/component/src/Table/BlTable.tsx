import React, { useCallback, useEffect, useRef, useState } from 'react';
import _, { isEqual, cloneDeep, isEmpty } from 'lodash';
import { Table, Popover } from 'antd';
import { TableComponents } from 'rc-table/lib/interface';
import { SettingFilled } from '@ant-design/icons';
import { ColumnGroupType } from 'antd/lib/table';
import { BlLocalStorage } from '@blacklake-web/utils';
import TextTooltip from '../Tooltip/textToolTip';
//
// import color from 'src/styles/color';
//
import ResizableTitle from './ResizableTitle';
import TableColumnConfig from './ColumnConfig';
import {
  BlTableProps,
  BlColumnsType,
  BlColumnType,
  ConfigColumn,
  LocalStorageTableConfig,
} from './BlTable.type';
import './styles.less';

const BL_TABLE_CONFIG = 'BL_TABLE_CONFIG';
const DEFAULT_TAG = '-';
const blLocalStorage = BlLocalStorage.getInstance();

/**
 * 获取列表每一列 列配置初始值
 * @param defaultColConfig
 * @param fixed
 * @returns
 */
const getColConfig = (
  defaultColConfig: { fixed?: boolean; display?: boolean },
  fixed?: boolean | 'left' | 'right',
) => {
  const retConfig = {
    fixed: defaultColConfig?.fixed ?? false,
    display: defaultColConfig?.display ?? true,
    disabled: false,
  };

  if (fixed === true || fixed === 'left') {
    retConfig.fixed = true;
  }

  if (fixed === 'right') {
    retConfig.fixed = false;
    retConfig.disabled = true;
  }

  return retConfig;
};

/**
 * 判断列配置是否和初始值一致，有配置过
 * @param originColumnConfig
 * @param columnConfig
 * @returns
 */
const isColumnConfigChange = (originColumnConfig: ConfigColumn[], columnConfig: ConfigColumn[]) => {
  let _isChange = false;

  for (let i = 0; i < originColumnConfig.length; i++) {
    const originCol = originColumnConfig[i];
    const newCol = columnConfig[i];

    if (!isEqual(originCol, newCol)) {
      _isChange = true;
      break;
    }
  }

  return _isChange;
};

const BlTable = <RecordType extends object = any>(props: BlTableProps<RecordType>) => {
  const {
    dataSource,
    components,
    columns,
    resizableCol,
    tableConfigKey,
    useColConfig,
    ...resProps
  } = props;

  const [blTableColumns, setBlTableColumns] = useState<BlColumnsType<RecordType>>([]);
  const [colConfigVisible, setColConfigVisible] = useState<boolean>(false); // 列配置设置显示标识
  const [colConfigValue, setColConfigValue] = useState<ConfigColumn[]>([]); // 列配置

  const originColumnConfigRef = useRef<ConfigColumn[]>([]); // 初始列配置

  const getBlTableComponents = () => {
    const blTableComponents: TableComponents<RecordType> = components || {};

    if (resizableCol) {
      blTableComponents.header = {};
      blTableComponents.header.cell = ResizableTitle;
    }

    return blTableComponents;
  };

  const getColRender = (col: ColumnGroupType<RecordType>) => {
    // 不存在自定义render时，返回指定render
    if (!col?.render) {
      return (text: any) => {
        return <TextTooltip text={text || DEFAULT_TAG} width={col?.width ?? 100} />;
      };
    }

    // 存在自定义render时，判断render返回的类型
    return (text: any, record: any, index: number) => {
      const resultText = col?.render?.(text, record, index);

      if (typeof resultText === 'string') {
        return <TextTooltip text={resultText || DEFAULT_TAG} width={col?.width ?? 100} />;
      } else {
        return resultText ?? DEFAULT_TAG;
      }
    };
  };

  /**
   * 从LocalStorage获取配置
   */
  const getColConfigByLocalStorage = useCallback(() => {
    if (tableConfigKey) {
      const resLocalStorageTableConfig: LocalStorageTableConfig[] =
        blLocalStorage.get(BL_TABLE_CONFIG) ?? [];
      return resLocalStorageTableConfig.find((item) => item.tableConfigKey === tableConfigKey);
    }

    return undefined;
  }, [tableConfigKey]);

  /**
   * 设置 配置 到LocalStorage
   * @param params
   */
  const setColConfigByLocalStorage = (newColConfig: ConfigColumn[]) => {
    if (tableConfigKey) {
      const localStorageTableConfig: LocalStorageTableConfig[] =
        blLocalStorage.get(BL_TABLE_CONFIG) ?? [];
      const currentTableConfigIndex = localStorageTableConfig.findIndex(
        (item) => item.tableConfigKey === tableConfigKey,
      );
      if (currentTableConfigIndex !== -1) {
        localStorageTableConfig[currentTableConfigIndex].colConfig = newColConfig;
      } else {
        localStorageTableConfig.push({ tableConfigKey, colConfig: newColConfig });
      }
      blLocalStorage.set(BL_TABLE_CONFIG, localStorageTableConfig);
    }
  };

  /**
   * 根据列配置，获取相应的列
   * @param originCol
   * @param colConfig
   */
  const getColumnByColConfig = (
    originCol: BlColumnsType<RecordType>,
    colConfig: ConfigColumn[],
  ) => {
    if (isEmpty(colConfig)) return originCol;

    const colsWithConfig: BlColumnsType<RecordType> = [];

    // 根据列配置 1.顺序2.展示状态3.固定状态4.可编辑状态 找到对应列并组装
    colConfig.forEach(({ dataIndex, colConfig: { display, fixed, disabled } }) => {
      if (display) {
        const currentCol = originCol.find((item) => isEqual(item.dataIndex, dataIndex));

        if (!isEmpty(currentCol)) {
          if (disabled) {
            colsWithConfig.push({ ...currentCol });
          } else {
            colsWithConfig.push({ ...currentCol, fixed });
          }
        }
      }
    });

    return colsWithConfig;
  };

  /**
   * 处理最新设置的列配置
   * @param newColConfig
   */
  const handleColConfig = (newColConfig: ConfigColumn[]) => {
    setColConfigValue(newColConfig);
    setColConfigByLocalStorage(newColConfig);
    setColConfigVisible(false);
  };

  /**
   * 处理收缩列
   * @param index
   * @returns
   */
  const handleResize = (index: number) => {
    return (e: any, { size }: { size: { width: number } }) => {
      setBlTableColumns((preColumns) => {
        const nextColumns = [...preColumns];

        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return nextColumns;
      });
    };
  };

  /**
   * 转化处理columns
   * 1.根据列配置获取相应列
   * 2.自定义render默认处理
   * 3.伸缩列处理
   * @returns
   */
  const formatColumns = () => {
    const columnsWithConfig = getColumnByColConfig([...blTableColumns], colConfigValue);
    let retColumns: any[] = [];

    retColumns = columnsWithConfig.map((col: any, index) => {
      const itemCol = {
        ...col,
        render: getColRender(col),
      };

      // 伸缩列处理
      if (resizableCol) {
        itemCol.onHeaderCell = (column: BlColumnType<RecordType>): any => ({
          width: typeof column?.width === 'number' ? column?.width : 100,
          fixed: column?.fixed ?? false,
          onResize: handleResize(index),
        });
      }

      return itemCol;
    });

    return retColumns;
  };

  useEffect(() => {
    const _columns = [...(columns || [])];

    if (useColConfig) {
      const originColumnConfig = _columns.map(({ dataIndex, defaultColConfig = {}, fixed }) => {
        return {
          dataIndex,
          colConfig: getColConfig(defaultColConfig, fixed),
        };
      });

      originColumnConfigRef.current = cloneDeep(originColumnConfig);

      const cacheColConfig = getColConfigByLocalStorage()?.colConfig;

      /**
       * 从缓存中取出的cacheColConfig的值可能与配置有个不一致的情况
       * 只从 cacheColConfig 中取出现存在 originColumnConfig 的值
       */

      const newColConfig = _.map(
        originColumnConfig,
        (config) => _.find(cacheColConfig, { dataIndex: config.dataIndex }) ?? config,
      );

      setColConfigValue(newColConfig);
      setBlTableColumns(_columns);
    } else {
      setBlTableColumns(_columns);
    }
  }, [columns, getColConfigByLocalStorage, useColConfig]);

  return (
    <div className="blTable">
      {useColConfig && (
        <Popover
          trigger="click"
          title="列配置"
          placement="bottomRight"
          destroyTooltipOnHide
          overlayClassName="blTable-configPopover"
          overlayStyle={{ padding: 0 }}
          content={
            <TableColumnConfig
              columns={blTableColumns}
              colConfigValue={cloneDeep(colConfigValue)}
              onClose={() => {
                setColConfigVisible(false);
              }}
              onChange={handleColConfig}
            />
          }
          visible={colConfigVisible}
          onVisibleChange={setColConfigVisible}
        >
          <SettingFilled
            className={
              isColumnConfigChange(originColumnConfigRef.current, colConfigValue)
                ? 'changeConfigIcon'
                : 'configIcon'
            }
          />
        </Popover>
      )}

      <Table<RecordType>
        dataSource={dataSource}
        components={getBlTableComponents()}
        columns={formatColumns()}
        {...resProps}
      />
    </div>
  );
};

export default BlTable;