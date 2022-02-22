import React from 'react';
import { Spin } from 'antd';

import { DetailLayoutContent } from './components/DetailLayoutContent';
import { DetailLayoutTitle } from './components/DetailLayoutTitle';
//
import { DetailLayoutProps } from './DetailLayout.type';
import './DetailLayout.less';

const BlDetailLayout = (props: DetailLayoutProps) => {
  const { title, info, extra, baseMenu, dataSource, loading = false, children, userAuth } = props;

  return (
    <div className="bl-detailLayout">
      <Spin spinning={loading}>
        <div className="detail-layout">
          <DetailLayoutTitle title={title} extra={extra} baseMenu={baseMenu} userAuth={userAuth} />
          <DetailLayoutContent info={info} dataSource={dataSource} />
          {children}
        </div>
      </Spin>
    </div>
  );
};

export default BlDetailLayout;
