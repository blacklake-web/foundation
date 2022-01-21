import React from 'react';

import { Drawer } from 'antd';

//
import { DataFormLayoutForDrawerProps } from './DataFormLayout.type';

const bodyStyle = {
  padding: 0,
};

const DataFormLayoutForDrawer = (props: DataFormLayoutForDrawerProps) => {
  const { visible, onClose, width, content, closable } = props;

  const handleClose = () => {
    if (typeof onClose === 'function') onClose(false);
  };

  return (
    <Drawer
      visible={visible}
      onClose={handleClose}
      width={width ?? '75%'}
      bodyStyle={{ ...bodyStyle, overflowY: 'auto' }}
      destroyOnClose
      getContainer={'body'}
      keyboard={false}
      maskClosable={false}
      closable={closable}
    >
      {content}
    </Drawer>
  );
};

export default DataFormLayoutForDrawer;
