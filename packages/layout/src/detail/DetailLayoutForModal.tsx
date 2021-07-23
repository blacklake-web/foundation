import React from 'react';

import { Modal } from 'antd';
//
import { DetailLayoutForModalProps } from './DetailLayout.type';

const bodyStyle = {
  padding: 0,
  maxHeight: document.body.clientHeight - 100,
  display: 'flex',
};

const DetailLayoutForModal = (props: DetailLayoutForModalProps) => {
  const { visible, onClose, content } = props;

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      width={'90%'}
      bodyStyle={bodyStyle}
      centered
      destroyOnClose
      footer={null}
      getContainer={'body'}
      keyboard={false}
    >
      {content}
    </Modal>
  );
};

export default DetailLayoutForModal;
