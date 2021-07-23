import React, { ReactNode } from 'react';
import { Row, Col, Space, Form, FormInstance } from 'antd';
//
import { DataFormLayoutInfoBlock } from '../DataFormLayout.type';

export interface DataFormLayoutBodyProps {
  /**顶部拓展内容 */
  topContext?: ReactNode;
  /**左侧拓展内容 */
  leftContext?: ReactNode;
  /**右侧拓展内容 */
  rightContext?: ReactNode;
  /**下部拓展内容 */
  bottomContext?: ReactNode;
  /**中间formItem部分 */
  info?: DataFormLayoutInfoBlock[];
  /**antd form实例 */
  form: FormInstance;
  bodyStyle?: {};
  infoBlockStyleProps?: {};
  /**
   * FormItem 布局类型水平或上下
   * @default horizontal
   */
  formLayout?: 'horizontal' | 'vertical';
}

const infoBlockStyle = {
  marginTop: 24,
  paddingBottom: 32,
  borderBottom: '1px solid #b1b1b12e',
};

const DataFormLayoutBody = (props: DataFormLayoutBodyProps) => {
  const {
    info,
    form,
    formLayout = 'horizontal',
    topContext,
    leftContext,
    rightContext,
    bottomContext,
    infoBlockStyleProps,
    bodyStyle,
  } = props;

  const renderTitle = (infoBlock: DataFormLayoutInfoBlock) => {
    const { title, extra } = infoBlock;

    return title || extra ? (
      <div style={{ paddingRight: 20 }}>
        <Row justify={'space-between'}>
          <Col>
            <h3>{title}</h3>
          </Col>
          {extra ? (
            <Col>
              <Space size={'small'}>{extra}</Space>
            </Col>
          ) : null}
        </Row>
      </div>
    ) : null;
  };

  const renderItem = (infoBlock: DataFormLayoutInfoBlock) => {
    const { items = [], column = 1 } = infoBlock;
    const baseSpan = (1 / column) * 100;

    return (
      <Row>
        {items.map((item, itemIndex) => {
          const { span = 1, render, style, ...formItemProps } = item;
          const colSpan = span * baseSpan;

          return (
            <Form.Item
              // eslint-disable-next-line react/no-array-index-key
              key={`formItem_${itemIndex}`}
              {...formItemProps}
              style={{
                padding: '12px 20px',
                marginBottom: 0,
                flex: `0 0 ${colSpan}%`,
                maxWidth: `${colSpan}%`,
                ...style,
              }}
            >
              {render()}
            </Form.Item>
          );
        })}
      </Row>
    );
  };

  const renderInfoBlock = () => {
    return info?.map((infoBlock: DataFormLayoutInfoBlock, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`block_${index}`} style={{ ...infoBlockStyle, ...infoBlockStyleProps }}>
        {renderTitle(infoBlock)}
        {renderItem(infoBlock)}
      </div>
    ));
  };

  const renderTopContext = () => {
    if (!topContext) return null;

    return <div>{topContext}</div>;
  };

  const renderBottomContext = () => {
    if (!bottomContext) return null;

    return <div>{bottomContext}</div>;
  };

  const renderLeftContext = () => {
    if (!leftContext) return null;

    return <div>{leftContext}</div>;
  };

  const renderRightContext = () => {
    if (!rightContext) return null;

    return <div>{rightContext}</div>;
  };

  return (
    <div
      style={{
        height: '100%',
        padding: '0px 20px',
        overflowY: 'auto',
        ...bodyStyle,
      }}
    >
      {renderTopContext()}
      <Row wrap={false}>
        {renderLeftContext()}
        <Form
          form={form}
          name="dataFormInfo"
          preserve={false}
          style={{ width: '100%' }}
          labelCol={formLayout === 'vertical' ? undefined : { flex: '100px' }}
          layout={formLayout}
        >
          {renderInfoBlock()}
        </Form>
        {renderRightContext()}
      </Row>
      {renderBottomContext()}
    </div>
  );
};

export default DataFormLayoutBody;
