import React, { ReactNode, useState } from 'react';
import { Row, Col, Space, Form, FormInstance } from 'antd';
import { BlIcon } from '@blacklake-web/component';
import { DataFormLayoutInfoBlock } from '../DataFormLayout.type';
import '../../detail/components/DetailLayoutContent.less';
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
};

const DataFormLayoutBody = (props: DataFormLayoutBodyProps) => {
  const {
    info,
    form,
    formLayout = 'vertical',
    topContext,
    leftContext,
    rightContext,
    bottomContext,
    infoBlockStyleProps,
    bodyStyle,
  } = props;

  const renderInfoBlock = (infoBlock: DataFormLayoutInfoBlock) => {
  const [toggle, setToggle] = useState<boolean>(false); // 是否展开

  const renderTitle = (infoBlock: DataFormLayoutInfoBlock) => {
    const { title } = infoBlock;

    return title ? (
      <div style={{ paddingRight: 20 }}>
        <Row justify={'space-between'} className="bl-descriptionTitle">
          <Col>
            <p>{title}</p>
          </Col>
          <Col>
            <div className={'bl-toggleButon'} onClick={() => setToggle((prevState) => !prevState)}>
              <BlIcon type={toggle ? 'iconshouqi' : 'iconzhankai'} />
            </div>
          </Col>
        </Row>
      </div>
    ) : null;
  };

  const renderItem = (infoBlock: DataFormLayoutInfoBlock) => {
    const { items = [] } = infoBlock;

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <Row>
        {items.map((item, itemIndex) => {
          const { isFullLine, render, style, ...formItemProps } = item;

          return (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={isFullLine ? 24 : 12}
              xl={isFullLine ? 24 : 12}
              xxl={isFullLine ? 24 : 8}
            >
              <Form.Item
                // eslint-disable-next-line react/no-array-index-key
                key={`formItem_${itemIndex}`}
                {...formItemProps}
                style={{
                  padding: '12px 20px',
                  marginBottom: 0,
                  ...style,
                }}
                wrapperCol={{ ...layout.wrapperCol }}
              >
                {render()}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

    return (
      <div style={{ ...infoBlockStyle, ...infoBlockStyleProps }}>
        {renderTitle(infoBlock)}
        {!toggle && renderItem(infoBlock)}
      </div>
    );
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
        marginBottom: 50,
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
          {info?.map((infoBlock: DataFormLayoutInfoBlock) => renderInfoBlock(infoBlock))}
        </Form>
        {renderRightContext()}
      </Row>
      {renderBottomContext()}
    </div>
  );
};

export default DataFormLayoutBody;
