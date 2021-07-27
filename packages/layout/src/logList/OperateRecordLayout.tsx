import React, { useEffect, useState } from 'react';
import { Drawer, Input, Timeline } from 'antd';
import './styles.less';

interface OperateDetailProps {
  visible: boolean;
  onClose: () => void;
  operateId: number;
  fetchRecordData: (id: number) => Promise<any>;
  width?: number | string;
}

interface RecordItem {
  date: string;
  desc: string;
  user: {
    name: string;
  };
}

const OperateRecordLayout = (props: OperateDetailProps) => {
  const [dataSource, setDataSource] = useState([] as any[]);
  const { visible, onClose, operateId, width, fetchRecordData } = props;

  const fetchData = async () => {
    try {
      const { data } = await fetchRecordData(operateId);

      setDataSource(data.list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Record = () => {
    return (
      <div>
        <div className={'blLog-searchContent'}>
          <span className={'blLog-tipsInfo'}>此页面仅显示18个月内的操作记录</span>
          <Input.Search placeholder="请输入" onSearch={() => {}} />
        </div>
        <Timeline>
          {dataSource.map((item: RecordItem) => (
            <Timeline.Item>
              <div className={'blLog-timeLineContent'}>
                <div className={'blLog-dateContent'}>
                  <span>{item.date}</span>
                </div>
                <div>
                  <a style={{ marginRight: 6 }}>{item.user?.name}</a>
                  <span>{item.desc}</span>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    );
  };

  return (
    <Drawer visible={visible} onClose={onClose} width={width ?? 500} title="操作记录">
      {<Record />}
    </Drawer>
  );
};

export { OperateRecordLayout };
