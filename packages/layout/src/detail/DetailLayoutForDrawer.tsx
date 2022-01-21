import React from 'react';
//
import { Drawer } from 'antd';
//
import { DetailLayoutForDrawerProps } from './DetailLayout.type';

const bodyStyle = {
  padding: 0,
};

const DetailLayoutForDrawer = (props: DetailLayoutForDrawerProps) => {
  const { visible, onClose, content, width } = props;

  const handleClose = () => {
    if (typeof onClose === 'function') onClose(false);
  };

  return (
    <Drawer
      visible={visible}
      onClose={handleClose}
      destroyOnClose
      width={width ?? '75%'}
      bodyStyle={{ ...bodyStyle, overflowY: 'auto' }}
      getContainer={'body'}
      keyboard={false}
      closable={false}
    >
      {content}
    </Drawer>
  );
};

export default DetailLayoutForDrawer;
