import React, { ReactNode, useCallback, useState } from 'react';
import { Row, Col, FormProps, Form, FormInstance } from 'antd';
import useResizeObserver from '@react-hook/resize-observer';
import { BlIcon } from '@blacklake-web/component';
import { useVisible } from '@blacklake-web/hooks';
import { DataFormLayoutInfoBlock } from '../DataFormLayout.type';
import '../../detail/components/DetailLayoutContent.less';
import '../DataFormLayout.less';
import { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';
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
  formProps?: FormProps;
}

const infoBlockStyle = {
  marginTop: 24,
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
    formProps = {},
  } = props;
  const contentRef = React.useRef(null);
  const { judgeVisible, addVisible, deleteVisible } = useVisible();
  // const dataCount = info
  //   ?.map((i) => i.items?.length || 0)
  //   .reduce((previousValue, currentValue) => previousValue + currentValue);

  const getColumn = (windowSize) => {
    if (windowSize < 1280) {
      return 1;
    }
    if (windowSize >= 1280 && windowSize <= 1440) {
      return 2;
    }
    if (windowSize >= 1440) {
      return 3;
    }
    return 1;
  };

  const useSize = (target) => {
    const [rowWidth, setRowWidth] = React.useState(0);

    React.useLayoutEffect(() => {
      setRowWidth(target.current.getBoundingClientRect().width);
    }, [target]);

    useResizeObserver(target, (entry) => setRowWidth(entry.contentRect.width));
    return rowWidth;
  };

  const baseSpan = (1 / getColumn(useSize(contentRef))) * 100;
  const isSingleColumn = getColumn(useSize(contentRef)) === 1;

  const renderInfoBlock = (infoBlock: DataFormLayoutInfoBlock, infoIndex) => {
    const renderTitle = (infoBlock: DataFormLayoutInfoBlock) => {
      const { title } = infoBlock;

      if (!title) return null;

      return (
        <div key={`info_${infoIndex}`}>
          <Row justify={'space-between'} className="bl-descriptionTitle">
            <Col>
              <span className="title-left">{title}</span>
            </Col>
            <Col>
              <div
                className={'bl-toggleButon'}
                onClick={() =>
                  judgeVisible(infoIndex) ? deleteVisible(infoIndex) : addVisible(infoIndex)
                }
              >
                <BlIcon type={judgeVisible(infoIndex) ? 'iconshouqi' : 'iconzhankai'} />
              </div>
            </Col>
          </Row>
        </div>
      );
    };

    const renderItem = (infoBlock: DataFormLayoutInfoBlock) => {
      const { items = [], column, align = 'left' } = infoBlock;

      if (items.length === 0) return null;

      return (
        <Row style={{ paddingTop: 24 }}>
          {items.map((item, itemIndex) => {
            const { span, render, style, isFullLine, label, ...formItemProps } = item;
            const isSingle = isFullLine || column === 1;
            const colSpan = isSingle ? 100 : baseSpan;

            const baseFormItemProps = {
              key: `formItem_${itemIndex}`,
              className: isFullLine ? 'bl-form-item' : 'bl-form-item-single',
              style: {
                flex: `0 0 ${colSpan}%`,
                maxWidth: `${colSpan}%`,
                justifyContent: align,
                paddingRight: 10,
                ...style,
              },
            };

            return (
              <Form.Item {...formItemProps} {...baseFormItemProps} label={label ?? undefined}>
                {/* 把基础的 fotmItemProps 传下去，适配dependencies 或 shouldUpdate的两层formItem情况 */}
                {render(baseFormItemProps)}
              </Form.Item>
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
        ...bodyStyle,
      }}
      ref={contentRef}
    >
      {renderTopContext()}
      <Row wrap={false}>
        {renderLeftContext()}
        <Form
          form={form}
          name="dataFormInfo"
          style={{ width: '100%', marginBottom: 24 }}
          labelCol={isSingleColumn ? { flex: '120px' } : {}}
          layout={isSingleColumn ? 'horizontal' : formLayout}
          {...formProps}
        >
          {info?.map((infoBlock: DataFormLayoutInfoBlock, infoIndex) =>
            renderInfoBlock(infoBlock, infoIndex),
          )}
        </Form>
        {renderRightContext()}
      </Row>
      {renderBottomContext()}
    </div>
  );
};

export default DataFormLayoutBody;
