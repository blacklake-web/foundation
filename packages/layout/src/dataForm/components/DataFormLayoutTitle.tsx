import React, { ReactNode } from 'react';
import { Row, Col } from 'antd';
//
import '../DataFormLayout.less';
export interface DataFormLayoutTitleProps {
  /**标题 */
  title?: ReactNode;
}

const DataFormLayoutTitle = (props: DataFormLayoutTitleProps) => {
  const { title } = props;

  const renderTitle = () => {
    const isNodeTitle = typeof title === 'object';

    return isNodeTitle ? title : <h2 style={{ margin: '10px 0', fontSize: 18 }}>{title}</h2>;
  };

  return title ? (
    <div className="data-layout-title">
      <Row justify={'space-between'}>
        <Col span={14}>{renderTitle()}</Col>
      </Row>
    </div>
  ) : null;
};

export default DataFormLayoutTitle;
