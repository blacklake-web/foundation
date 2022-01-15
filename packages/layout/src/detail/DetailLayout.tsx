import React from 'react';
import { Spin } from 'antd';

import { DetailLayoutContent } from './components/DetailLayoutContent';
import { DetailLayoutTitle } from './components/DetailLayoutTitle';
//
import { DetailLayoutProps } from './DetailLayout.type';
import './components/DetailLayoutContent.less';

const BlDetailLayout = (props: DetailLayoutProps) => {
  const { title, info, extra, baseMenu, dataSource, loading = false, children } = props;

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Spin spinning={loading}>
        <div className="detail-layout">
          <DetailLayoutTitle title={title} extra={extra} baseMenu={baseMenu} />
          <DetailLayoutContent info={info} dataSource={dataSource} />
          {children}
        </div>
      </Spin>
    </div>
  );
};

export default BlDetailLayout;
