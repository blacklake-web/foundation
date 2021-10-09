import React, { ReactNode, useCallback, useState } from 'react';
import { Row, Col, Space, Form, FormInstance } from 'antd';
import useResizeObserver from '@react-hook/resize-observer';
import { BlIcon } from '@blacklake-web/component';
import { useVisible } from '@blacklake-web/hooks';
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

const defaultCenterItemWidth = '500px';

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
  const formItemRef = React.useRef(null);
  const { judgeVisible, addVisible, deleteVisible } = useVisible();
  const dataCount = info
    ?.map((i) => i.items.length)
    .reduce((previousValue, currentValue) => previousValue + currentValue);

  const getColumn = (windowSize, itemCount) => {
    if (itemCount <= 12) {
      return 1;
    }
    if (windowSize >= 1920 || (windowSize <= 1920 && windowSize >= 1440)) {
      return 3;
    }
    if (windowSize >= 1280 && windowSize <= 1440) {
      return 2;
    }
    if (windowSize < 1280) {
      return 1;
    }
    return 1;
  };

  const useSize = (target) => {
    const [rowWidth, setRowWidth] = React.useState(0);

    React.useLayoutEffect(() => {
      setRowWidth(target.current.getBoundingClientRect());
    }, [target]);

    useResizeObserver(target, (entry) => setRowWidth(entry.contentRect.width));
    return rowWidth;
  };

  const baseSpan = (1 / getColumn(useSize(formItemRef), dataCount)) * 100;
  const isSingleColumn = getColumn(useSize(formItemRef), dataCount) === 1;

  const renderInfoBlock = (infoBlock: DataFormLayoutInfoBlock, infoIndex) => {
    const renderTitle = (infoBlock: DataFormLayoutInfoBlock) => {
      const { title } = infoBlock;

      return title ? (
        <div style={{ paddingRight: 20 }}>
          <Row justify={'space-between'} className="bl-descriptionTitle">
            <Col>
              <p>{title}</p>
            </Col>
            <Col>
              <div
                className={'bl-toggleButon'}
                onClick={() => judgeVisible(infoIndex) ? deleteVisible(infoIndex): addVisible(infoIndex)}
              >
                <BlIcon type={judgeVisible(infoIndex) ? 'iconshouqi' : 'iconzhankai'} />
              </div>
            </Col>
          </Row>
        </div>
      ) : null;
    };

    const renderItem = (infoBlock: DataFormLayoutInfoBlock) => {
      const { items = [], column, align = 'left' } = infoBlock;
      return (
        <Row ref={formItemRef}>
          {items.map((item, itemIndex) => {
            const { span, render, style, ...formItemProps } = item;
            const isfullline = item.isFullLine ?? (column && span && column === span);
            const colSpan = isfullline ? 100 : baseSpan;
            let formItemWidth = '100%';
            if (isSingleColumn && !isfullline) {
              formItemWidth = defaultCenterItemWidth;
            }
            return (
              <Col
                key={`col_${itemIndex}`}
                style={{
                  padding: '12px 20px',
                  marginBottom: 0,
                  flex: `0 0 ${colSpan}%`,
                  maxWidth: `${colSpan}%`,
                  display: 'flex',
                  justifyContent: align,
                }}
              >
                <Form.Item
                  key={`formItem_${itemIndex}`}
                  {...formItemProps}
                  style={{
                    width: formItemWidth,
                    ...style,
                  }}
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
      <div
        key={`${infoBlock.title}_${infoBlock.items?.length}`}
        style={{ ...infoBlockStyle, ...infoBlockStyleProps }}
      >
        {renderTitle(infoBlock)}
        {!judgeVisible(infoIndex) && renderItem(infoBlock)}
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
          labelCol={isSingleColumn ? { flex: '120px' } : {}}
          layout={isSingleColumn ? 'horizontal' : formLayout}

        >
          {info?.map((infoBlock: DataFormLayoutInfoBlock, infoIndex) => renderInfoBlock(infoBlock, infoIndex))}
        </Form>
        {renderRightContext()}
      </Row>
      {renderBottomContext()}
    </div>
  );
};

export default DataFormLayoutBody;
