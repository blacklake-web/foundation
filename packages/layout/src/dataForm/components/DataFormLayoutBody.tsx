import React, { ReactNode, useCallback, useState } from 'react';
import _ from 'lodash';
import { Row, Col, FormProps, Form, FormInstance, Input } from 'antd';
import useResizeObserver from '@react-hook/resize-observer';
import { NamePath } from 'antd/lib/form/interface';
import { BlIcon } from '@blacklake-web/component';
import { useVisible } from '@blacklake-web/hooks';
import {
  DataFormLayoutInfoBlock,
  DataFormLayoutInfoItem,
  IFieldPermission,
} from '../DataFormLayout.type';
import '../../detail/components/DetailLayoutContent.less';
import '../DataFormLayout.less';

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
  loading?: boolean;
  /** 字段权限 */
  fieldPermission?: IFieldPermission;
}

const infoBlockStyle = {
  marginTop: 24,
};

/**
 * 检验是否有字段权限,如果不传参数默认为有权限
 */
export const checkFieldHasPermission = (
  fieldName?: NamePath,
  fieldPermission?: IFieldPermission,
) => {
  let result = true;
  const disabledFileds = _.concat(fieldPermission?.noAccess ?? [], fieldPermission?.readonly ?? []);

  if (fieldName) {
    if (!_.isEmpty(disabledFileds)) {
      result = !_.includes(disabledFileds, fieldName);
    }
  }

  return result;
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
    fieldPermission,
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

  const renderItem = (
    infoBlock: DataFormLayoutInfoBlock,
    item: DataFormLayoutInfoItem,
    itemIndex: number,
  ) => {
    const { column, align = 'left' } = infoBlock;

    const { span, render, style, isFullLine, ...formItemProps } = item;
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

    /* 把基础的 fotmItemProps 传下去，适配dependencies 或 shouldUpdate的两层formItem情况 */
    const itemComponents = render(baseFormItemProps, fieldPermission);

    if (fieldPermission) {
      const hasPermission = checkFieldHasPermission(item?.name, fieldPermission);

      // 没有权限且返回的render返回的是正常方式的受控form组件
      if (
        !hasPermission &&
        React.isValidElement(itemComponents) &&
        typeof itemComponents !== 'function' &&
        typeof itemComponents !== 'string' &&
        typeof itemComponents !== 'number' &&
        typeof itemComponents !== 'undefined'
      ) {
        return (
          <Form.Item {...formItemProps} {...baseFormItemProps}>
            {React.cloneElement(itemComponents, { disabled: true })}
          </Form.Item>
        );
      }
    }

    return (
      <Form.Item {...formItemProps} {...baseFormItemProps}>
        {itemComponents}
      </Form.Item>
    );
  };

  const renderItems = (infoBlock: DataFormLayoutInfoBlock) => {
    const { items = [] } = infoBlock;

    if (items.length === 0) return null;

    return (
      <Row style={{ paddingTop: 24 }}>
        {items.map((item, itemIndex) => renderItem(infoBlock, item, itemIndex))}
      </Row>
    );
  };

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

    return (
      <div
        key={`${infoBlock.title}_${infoBlock.items?.length}`}
        style={{ ...infoBlockStyle, ...infoBlockStyleProps }}
      >
        {renderTitle(infoBlock)}
        {!judgeVisible(infoIndex) && renderItems(infoBlock)}
      </div>
    );
  };

  /**
   * 处理encoding的数据到form中去
   */
  const renderFieldEncoding = () => {
    if (fieldPermission?.encoding) {
      form.setFieldsValue({ encoding: fieldPermission?.encoding });

      return (
        <Form.Item name={'encoding'} hidden>
          <Input disabled />
        </Form.Item>
      );
    }

    return null;
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
          {renderFieldEncoding()}
        </Form>
        {renderRightContext()}
      </Row>
      {renderBottomContext()}
    </div>
  );
};

export default DataFormLayoutBody;
