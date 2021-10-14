import React from 'react';
import { Modal } from 'antd';
//
import { DataFormLayoutForModalProps } from './DataFormLayout.type';


const DataFormLayoutForModal = (props: DataFormLayoutForModalProps) => {
  const { visible, onClose, width, content, closable } = props;

  return (
    <Modal
      centered
      footer={null}
      visible={visible}
      onCancel={onClose}
      width={width ?? '85%'}
      bodyStyle={{
        padding: 0,
        maxHeight: document.body.clientHeight - 100,
        display: 'flex',
        overflowY: 'auto',
      }}
      destroyOnClose
      getContainer={'body'}
      keyboard={false}
      maskClosable={false}
      closable={closable}
    >
      {content}
    </Modal>
  );
};

export default DataFormLayoutForModal;
