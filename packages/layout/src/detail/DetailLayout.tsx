import React from 'react';

import { DetailLayoutContent } from './components/DetailLayoutContent';
import { DetailLayoutTitle } from './components/DetailLayoutTitle';
//
import { DetailLayoutProps } from './DetailLayout.type';
import './components/DetailLayoutContent.less';

const BlDetailLayout = (props: DetailLayoutProps) => {
  const { title, info, extra, baseMenu, dataSource, children } = props;

  return (
    <div className="detail-layout">
      <DetailLayoutTitle title={title} extra={extra} baseMenu={baseMenu} />
      <DetailLayoutContent info={info} dataSource={dataSource} />
      {children}
    </div>
  );
};

export default BlDetailLayout;
