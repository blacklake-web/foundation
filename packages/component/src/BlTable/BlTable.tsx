import React, { useCallback, useEffect, useRef, useState } from 'react';
import _, { isEqual, cloneDeep, isEmpty, get } from 'lodash';
import { Table, Popover } from 'antd';
import { TableComponents } from 'rc-table/lib/interface';
import { SettingFilled } from '@ant-design/icons';
import { ColumnGroupType } from 'antd/lib/table';
import { BlLocalStorage } from '@blacklake-web/utils';
import TextTooltip from '../Tooltip/textToolTip';
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
const PADDING = 16;

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
    useIndex = false,
    size = 'large',
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

  const getColRender = (col: BlColumnType<RecordType>) => {
    const colWidth = col.width ?? 100 + PADDING * 2;
    const contentWidth = _.isNumber(colWidth) ? (colWidth as number) - PADDING * 2 : colWidth;
    // 不存在自定义render时，返回指定render
    if (!col?.render) {
      return (text: any) => {
        return <TextTooltip text={text || DEFAULT_TAG} width={contentWidth} />;
      };
    }

    // 存在自定义render时，判断render返回的类型
    return (text: any, record: any, index: number) => {
      const resultText = col?.render?.(text, record, index, { contentWidth, width: colWidth });

      if (typeof resultText === 'string') {
        return <TextTooltip text={resultText || DEFAULT_TAG} width={contentWidth} />;
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
      return resLocalStorageTableConfig.find((item) => item.tableConfigKey === tableConfigKey)
        ?.colConfig;
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
        const minWidth = get(nextColumns[index], 'minWidth', 120);

        nextColumns[index] = {
          ...nextColumns[index],
          minWidth,
          width: size.width < minWidth ? minWidth : size.width,
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

    if (useIndex) {
      retColumns.unshift({
        title: '序号',
        dataIndex: ['BlTableIndex'],
        fixed: 'left',
        width: 80,
        render: (_params, _reocrd, index) => index + 1,
      });
    }

    return retColumns;
  };

  useEffect(() => {
    const _columns = [...(columns || [])];

    if (useColConfig) {
      const originColumnConfig: ConfigColumn[] = _columns.map(
        ({ dataIndex, defaultColConfig = {}, fixed }) => {
          return {
            dataIndex,
            colConfig: getColConfig(defaultColConfig, fixed),
          };
        },
      );
      const cacheColConfig = getColConfigByLocalStorage() ?? [];

      originColumnConfigRef.current = cloneDeep(originColumnConfig);

      if (!isEmpty(cacheColConfig)) {
        /**
         * 从缓存中取出的 cacheColConfig 的值与 originColumnConfig dataIndex 存在不一致时，
         * 按照 originColumnConfig 顺序读取 cacheColConfig 存在的配置(display,fixed)
         */

        const isEveryMetched = originColumnConfig.every(({ dataIndex }) => {
          return (
            cacheColConfig.findIndex(({ dataIndex: cacheDataIndex }) =>
              isEqual(cacheDataIndex, dataIndex),
            ) !== -1
          );
        });

        let resColConfig: ConfigColumn[] = [];

        if (isEveryMetched) {
          // 全部匹配使用缓存
          resColConfig = cacheColConfig;
        } else {
          // 存在不匹配时，使用 origin 顺序，如果缓存存在当前 dataIndex 配置，读取后显示，重新设置缓存
          resColConfig = _.map(
            originColumnConfig,
            (config) => _.find(cacheColConfig, { dataIndex: config.dataIndex }) ?? config,
          );
          setColConfigByLocalStorage(resColConfig);
        }

        setColConfigValue(resColConfig);
      } else {
        setColConfigValue(originColumnConfig);
      }
    }

    setBlTableColumns(_columns);
  }, []);

  return (
    <div className="blTable">
      {useColConfig && colConfigValue.length >= 5 && (
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
            className={`${
              isColumnConfigChange(originColumnConfigRef.current, colConfigValue)
                ? 'changeConfigIcon'
                : 'configIcon'
            } configIcon_${size}`}
          />
        </Popover>
      )}

      <Table<RecordType>
        dataSource={dataSource}
        components={getBlTableComponents()}
        columns={formatColumns()}
        size={size}
        {...resProps}
      />
    </div>
  );
};

export default BlTable;
