import React from 'react';

import DetailLayoutContent from './components/DetailLayoutContent';
import DetailLayoutTitle from './components/DetailLayoutTitle';
//
import { DetailLayoutProps } from './DetailLayout.type';

const detailContextStyle = {
  display: 'flex',
};

const BlDetailLayout = (props: DetailLayoutProps) => {
  const { title, info, extra, baseMenu, dataSource, children } = props;

  return (
    <div style={{ ...detailContextStyle, flexDirection: 'column' }}>
      <DetailLayoutTitle title={title} extra={extra} baseMenu={baseMenu} />
      <DetailLayoutContent info={info} dataSource={dataSource} />
      {children}
    </div>
  );
};

export default BlDetailLayout;
