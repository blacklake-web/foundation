import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
//
import { Tag, Button, Space } from 'antd';
//
import { ListLayoutContext } from '../constants';
import { DeleteOutlined } from '@ant-design/icons';
//
import { BlRecordListBaseProps } from '../recordListLayout.type';

export type AfterFormatData = {
  [key: string]: string | number | undefined | null;
};

type DisplayDatas = { name: string; value: string }[];
export interface RecordListInfoProps extends BlRecordListBaseProps {
  formatDataToDisplay?: (formData: any) => AfterFormatData; // 格式化数据做展示
  /**内部状态 */
  onChangeFilter?: (filterData: any) => void;
}

export const objToKeyValueAry = (obj: AfterFormatData): DisplayDatas => {
  const names = Object.keys(obj);

  if (_.isEmpty(names)) return [];

  return names
    .filter((name) => !_.isUndefined(obj[name]) && !_.isNull(obj[name]))
    .map((name) => {
      return { name, value: `${obj[name]}` };
    });
};

const RecordListInfo = (props: RecordListInfoProps) => {
  const [disPlayDataList, setdisPlayDataList] = useState<DisplayDatas>([]);

  const { formatDataToDisplay, filterList = [], onChangeFilter } = props;

  const { listLayoutState } = useContext(ListLayoutContext);

  useEffect(() => {
    if (typeof formatDataToDisplay === 'function') {
      const afterFormatData = formatDataToDisplay(listLayoutState.filterData);

      setdisPlayDataList(objToKeyValueAry(afterFormatData));
    }
  }, [listLayoutState.filterData, formatDataToDisplay]);

  /**
   * 清空所有筛选条件
   */
  const handleCloseAll = () => {
    typeof onChangeFilter === 'function' && onChangeFilter({});
  };

  /**
   * 删除单个筛选条件
   */
  const handleCloseOne = (closeName: string) => {
    const newFilterData = { ...listLayoutState.filterData };

    newFilterData[closeName] = undefined;
    typeof onChangeFilter === 'function' && onChangeFilter(newFilterData);
  };

  const renderTag = () => {
    return (
      <Space wrap>
        {disPlayDataList
          .map((item) => {
            const filterIndex = _.findIndex(filterList, ['name', item.name]);

            return filterIndex !== -1 ? (
              <Tag
                closable={!listLayoutState.filterVisiable}
                key={item.name}
                visible
                onClose={() => {
                  handleCloseOne(item.name);
                }}
              >
                {filterList[filterIndex].label}:{item.value}
              </Tag>
            ) : (
              <Tag key={item.name}>未知查询条件</Tag>
            );
          })
          .filter((n) => n)}
      </Space>
    );
  };

  const renderClean = () => {
    return (
      <Button
        type="text"
        style={{ padding: 0 }}
        disabled={listLayoutState.filterVisiable}
        icon={<DeleteOutlined />}
        onClick={handleCloseAll}
      >
        清空
      </Button>
    );
  };

  return listLayoutState.isSelectMode || _.isEmpty(disPlayDataList) ? null : (
    <div
      style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {renderTag()}
      {renderClean()}
    </div>
  );
};

export default RecordListInfo;
