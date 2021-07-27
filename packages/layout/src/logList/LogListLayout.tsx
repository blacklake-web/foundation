import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExportOutlined } from '@ant-design/icons';
import { RecordListLayout } from '../recordList';
import { FilterFieldType } from '../constants';
//
import { LogDetailLayout } from './LogDetailLayout';
import { TerminalEnum, TerminalList } from './constants';
import { TableRowType, LogListProps, FilterItem } from './LogListLayout.type';

const LogListLayout = (props: LogListProps) => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [operateId, setOperateId] = useState<number>(0);
  const { rowKey, fetchData, navigateToDetail } = props;
  const columns = [
    {
      title: '对象实体编号',
      dataIndex: 'code',
      type: FilterFieldType.text,
      isFilter: true,
      width: 150,
      sorter: true,
      render: (code: string, record: any) => {
        if (typeof navigateToDetail === 'function' && code) {
          return <Link to={navigateToDetail(record)}>{code}</Link>;
        }
        return code || '-';
      },
    },
    {
      title: '对象实体名称',
      dataIndex: 'name',
      type: FilterFieldType.text,
      isFilter: true,
      width: 150,
      sorter: true,
      render: (name: string, record: any) => {
        if (typeof navigateToDetail === 'function' && name) {
          return <Link to={navigateToDetail(record)}>{name}</Link>;
        }
        return name || '-';
      },
    },
    {
      title: '操作人',
      dataIndex: 'operatoreUser',
      type: FilterFieldType.text,
      isFilter: true,
      width: 150,
      sorter: true,
    },
    {
      title: '操作类型',
      dataIndex: 'operatorType',
      type: FilterFieldType.text,
      isFilter: true,
      width: 150,
    },
    {
      title: '操作时间',
      dataIndex: 'operatorTime',
      type: FilterFieldType.date,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      isFilter: true,
      width: 150,
      sorter: true,
    },
    {
      title: '操作终端',
      dataIndex: 'operatorTerminal',
      type: FilterFieldType.text,
      isFilter: true,
      width: 150,
      render: (type: TerminalEnum) => TerminalList[type],
    },
    {
      title: '操作原因',
      dataIndex: 'operatorDesc',
      type: FilterFieldType.text,
      isFilter: true,
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 150,
      fixed: 'right',
      render: (text: any, record: TableRowType) => {
        return (
          <a
            onClick={() => {
              setOperateId(record.id);
              setDetailVisible(true);
            }}
          >
            操作详情
          </a>
        );
      },
    },
  ];
  const filterList = columns
    .filter((i) => i.isFilter)
    .map((column: any) => {
      const filter: FilterItem = {
        label: column.title,
        name: column.dataIndex,
        type: column.type,
        rules: column.rules,
      };

      if (column.type === FilterFieldType.select) {
        filter.selectProps = column.selectProps;
      }
      if (column.type === FilterFieldType.date && column.dateFormat) {
        filter.dateFormat = column.dateFormat;
      }

      return filter;
    });
  const mainMenu = [
    {
      title: '导出',
      icon: <ExportOutlined />,
      onClick: () => {},
    },
  ];

  const formatDataToQuery = (data: any) => data;

  const formatDataToDisplay = (data: any) => data;

  const getData = async (params: any) => {
    const res = await fetchData(params);

    console.log('12----', res);
    return res;
  };

  return (
    <>
      <RecordListLayout<TableRowType>
        columns={columns}
        filterList={filterList}
        rowKey={rowKey || 'id'}
        batchMenu={[]}
        mainMenu={mainMenu}
        formatDataToQuery={formatDataToQuery}
        formatDataToDisplay={(data = {}) => formatDataToDisplay(data)}
        requestFn={(parmas: any) => getData(parmas)}
        placeholder={'请输入编号或名称'}
      />
      {detailVisible && (
        <LogDetailLayout
          visible={detailVisible}
          onCloseDetail={() => setDetailVisible(false)}
          operateId={operateId}
        />
      )}
    </>
  );
};

export { LogListLayout };
