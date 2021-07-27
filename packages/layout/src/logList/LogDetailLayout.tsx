import React, { useEffect, useState } from 'react';
import { DetailLayoutForDrawer, DetailLayoutInfoBlock, DetailLayout } from '../detail';
import { Table } from 'antd';
import { TerminalList, TerminalEnum } from './constants';

interface OperateDetailProps {
  visible: boolean;
  onCloseDetail: () => void;
  operateId: number;
}

const LogDetailLayout = (props: OperateDetailProps) => {
  const [dataSource, setDataSource] = useState({} as any);
  const { visible, onCloseDetail, operateId } = props;

  const fetchData = async () => {
    try {
      // const { data: detailData } = await getFieldDetail({
      //   id: operateId,
      // });

      setDataSource({});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const baseInfo: DetailLayoutInfoBlock = {
    title: '基本信息',
    column: 2,
    items: [
      { label: '对象实体编号', dataIndex: 'code' },
      { label: '对象实体名称', dataIndex: 'name' },
      { label: '操作类型', dataIndex: 'operateType', render: (text: string) => text ?? '-' },
      {
        label: '操作终端',
        dataIndex: 'terminal',
        render: (type: TerminalEnum) => TerminalList[type],
      },
      { label: '操作人', dataIndex: 'operateUser', render: (text: string) => text ?? '-' },
      { label: '操作时间', dataIndex: 'operateTime', render: (text: string) => text ?? '-' },
      { label: '操作原因', dataIndex: 'desc', render: (text: string) => text ?? '-', span: 2 },
      {
        label: '操作详情',
        dataIndex: 'operateDetail',
        span: 2,
        render: (operateDetail: any[]) => {
          return (
            <Table
              style={{ width: '100%' }}
              pagination={false}
              columns={[
                {
                  title: '操作字段',
                  dataIndex: 'optionTitle',
                },
                {
                  title: '修改前数据',
                  dataIndex: 'optionStatus',
                },
                {
                  title: '修改后数据',
                  dataIndex: 'optionStatus',
                },
              ]}
              dataSource={operateDetail}
            />
          );
        },
      },
    ],
  };

  return (
    <DetailLayoutForDrawer
      visible={visible}
      onClose={onCloseDetail}
      width={680}
      content={<DetailLayout title={'操作详情'} info={[baseInfo]} dataSource={dataSource} />}
    />
  );
};

export { LogDetailLayout };
