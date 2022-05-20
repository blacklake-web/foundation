import React, { ReactNode, CSSProperties, useEffect, useState, useCallback } from 'react';
import _ from 'lodash';
import { Row, Col, Button, FormProps, Form, FormInstance, Input } from 'antd';
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
  /** 指定 DataFormLayoutBody 根结点的类名 */
  bodyClassName?: string;
  /**
   * 另行指定被监听宽度变化的容器。
   * 在嵌套<DataFormLayout>的情形下，获取外层的body容器<div>传给内层，使内外层的FormItem布局（水平/垂直）始终保持一致。
   * 注意：使用此属性时，column 必须置为1，否则页面排版可能错乱。
   */
  getAdaptiveContainer?: () => HTMLDivElement;
}

const infoBlockStyle = {
  marginTop: 24,
};
// label宽度仅在水平布局下生效
const LABEL_WIDTH = 120;
const INPUT_AREA_WIDTH = 440;
const BLOCK_PADDING = 24;
// 最小宽度: label + 输入区 + infoBlock 左右边距
const FORM_LAYOUT_MIN_WIDTH = LABEL_WIDTH + INPUT_AREA_WIDTH + BLOCK_PADDING * 2;
const FORM_LAYOUT_OUTER_PADDING = 24;
// 为表单弹窗设置的最小宽度，考虑滚动条额外给15px
export const MODAL_MIN_WIDTH = FORM_LAYOUT_MIN_WIDTH + FORM_LAYOUT_OUTER_PADDING * 2 + 15;

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

const renderOptionalContent = (content?: ReactNode) => () => {
  return content ? <div>{content}</div> : null;
};

const useSize = (target) => {
  const [rowWidth, setRowWidth] = useState(0);

  React.useLayoutEffect(() => {
    setRowWidth(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => setRowWidth(entry.contentRect.width));
  return rowWidth;
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
    bodyClassName = '',
    getAdaptiveContainer,
  } = props;
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [breakpointOffset, setBreakpointOffset] = useState(0);
  const { judgeVisible, addVisible, deleteVisible } = useVisible();

  useEffect(() => {
    if (getAdaptiveContainer && contentRef.current) {
      const adaptiveContainer = getAdaptiveContainer();
      if (adaptiveContainer) {
        const offset = contentRef.current.clientWidth - adaptiveContainer.clientWidth;
        setBreakpointOffset(offset);
      } else {
        console.error(
          '<DataFormLayout>: getAdaptiveContainer未获取到DOM节点，请检查bodyClassName设置是否正确',
        );
      }
    }
  }, []);

  const getAdaptiveColumn = useCallback(
    (windowSize) => {
      if (windowSize < 1280 + breakpointOffset) {
        return 1;
      }
      if (windowSize >= 1440 + breakpointOffset) {
        return 3;
      }
      return 2;
    },
    [breakpointOffset],
  );

  const overallColumnNum = getAdaptiveColumn(useSize(contentRef));
  // 表单标题与输入项的相对位置
  const overallFormLayout = overallColumnNum === 1 ? 'horizontal' : formLayout;

  const renderItem = (
    infoBlock: DataFormLayoutInfoBlock,
    item: DataFormLayoutInfoItem,
    itemIndex: number,
  ) => {
    //  向后兼容：infoBlock 上的 column 仅当为1时才有效
    const { column: blockCloumn, align = 'left' } = infoBlock;
    const { render, style, isFullLine, ...formItemProps } = item;
    let colspan: number;

    if (formItemProps.hidden) {
      colspan = 0;
    } else {
      const blockRealColumn = blockCloumn === 1 ? blockCloumn : overallColumnNum;
      const itemColumn = isFullLine ? 1 : blockRealColumn;
      colspan = 24 / itemColumn;
    }

    let baseWrapperCol: any = {};
    let baseStyle: CSSProperties = { justifyContent: align };

    // 当输入控件非占满整行时，指定一个宽度
    // 横向布局时, 约束输入区宽度；纵向布局时，约束表单项总宽度
    if (!isFullLine) {
      if (overallFormLayout === 'horizontal') {
        baseWrapperCol.flex = `${INPUT_AREA_WIDTH}px`;
      } else {
        baseStyle.width = INPUT_AREA_WIDTH;
      }
    }
    const baseFormItemProps = {
      className: `bl-form-item ${isFullLine ? 'bl-form-item-full-line' : ''}`,
      style: _.assign(baseStyle, style),
      wrapperCol: _.assign(baseWrapperCol, formItemProps.wrapperCol),
    };
    /* 把基础的 formItemProps 传下去，适配dependencies 或 shouldUpdate的两层formItem情况 */
    // 当 hidden 为 true 时无需传 render
    let itemComponents = render ? render(baseFormItemProps, fieldPermission) : null;

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
        itemComponents = React.cloneElement(itemComponents, { disabled: true });
      }
    }

    return (
      <Col span={colspan} key={`formItem_${itemIndex}`}>
        <Form.Item {...formItemProps} {...baseFormItemProps}>
          {itemComponents}
        </Form.Item>
      </Col>
    );
  };

  const renderItems = (infoBlock: DataFormLayoutInfoBlock, infoIndex) => {
    const { items = [] } = infoBlock;

    if (items.length === 0) return null;

    return (
      <Row
        style={{
          padding: `${BLOCK_PADDING}px ${BLOCK_PADDING}px 0 ${BLOCK_PADDING}px`,
          display: !judgeVisible(infoIndex) ? '' : 'none',
        }}
      >
        {items.map((item, itemIndex) => renderItem(infoBlock, item, itemIndex))}
      </Row>
    );
  };

  const renderInfoBlock = (infoBlock: DataFormLayoutInfoBlock, infoIndex) => {
    const renderTitle = (infoBlock: DataFormLayoutInfoBlock) => {
      const { title } = infoBlock;

      if (!title) return null;

      return (
        <div key={`info_${infoIndex}`} className="bl-descriptionTitle">
          <div className="title-left-part">
            <span className="title-left-border"></span>
            <span className="title-left">{title}</span>
          </div>
          <Button
            type="text"
            className="bl-toggleButon"
            onClick={() =>
              judgeVisible(infoIndex) ? deleteVisible(infoIndex) : addVisible(infoIndex)
            }
            icon={<BlIcon type={judgeVisible(infoIndex) ? 'iconzhankai' : 'iconshouqi'} />}
          />
        </div>
      );
    };

    return (
      <div
        key={`${infoBlock.title}_${infoBlock.items?.length}`}
        style={{ ...infoBlockStyle, ...infoBlockStyleProps }}
      >
        {renderTitle(infoBlock)}
        {renderItems(infoBlock, infoIndex)}
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

  const renderTopContext = renderOptionalContent(topContext);
  const renderBottomContext = renderOptionalContent(bottomContext);
  const renderLeftContext = renderOptionalContent(leftContext);
  const renderRightContext = renderOptionalContent(rightContext);

  return (
    <div
      className={bodyClassName}
      style={{
        height: '100%',
        padding: `0px ${FORM_LAYOUT_OUTER_PADDING}px`,
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
          style={{ width: '100%', minWidth: FORM_LAYOUT_MIN_WIDTH }}
          labelCol={overallFormLayout === 'horizontal' ? { flex: `${LABEL_WIDTH}px` } : undefined}
          layout={overallFormLayout}
          {...formProps}
        >
          {info?.map(renderInfoBlock)}
          {renderFieldEncoding()}
        </Form>
        {renderRightContext()}
      </Row>
      {renderBottomContext()}
    </div>
  );
};

export default DataFormLayoutBody;
