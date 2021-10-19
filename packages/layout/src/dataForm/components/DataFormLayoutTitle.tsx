import React, { ReactNode } from 'react';
import { Row, Col } from 'antd';
//

export interface DataFormLayoutTitleProps {
  /**标题 */
  title?: ReactNode;
}

const titleStyle = {
  padding: '10px 20px',
  borderBottom: '1px solid #b1b1b12e',
};

const DataFormLayoutTitle = (props: DataFormLayoutTitleProps) => {
  const { title } = props;

  const renderTitle = () => {
    const isNodeTitle = typeof title === 'object';

    return isNodeTitle ? title : <h2 style={{ margin: '10px 0', fontSize: 18 }}>{title}</h2>;
  };

  return title ? (
    <div style={{ ...titleStyle }}>
      <Row justify={'space-between'}>
        <Col span={14}>{renderTitle()}</Col>
      </Row>
    </div>
  ) : null;
};

export default DataFormLayoutTitle;
