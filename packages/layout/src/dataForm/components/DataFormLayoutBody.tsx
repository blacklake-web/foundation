import React, { ReactNode, CSSProperties } from 'react';
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
}

const infoBlockStyle = {
  marginTop: 24,
};
// 最小宽度: label + 输入区 + infoBlock 左右边距
const FORM_LAYOUT_MIN_WIDTH = 133 + 440 + 24 * 2;

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

const getAdaptiveColumn = (windowSize) => {
  if (windowSize < 1280) {
    return 1
  }
  if (windowSize >= 1440) {
    return 3;
  }
  return 2;
};

const renderOptionalContent = (content?: ReactNode) => () => {
  return content ? <div>{content}</div> : null;
}

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

  const useSize = (target) => {
    const [rowWidth, setRowWidth] = React.useState(0);

    React.useLayoutEffect(() => {
      setRowWidth(target.current.getBoundingClientRect().width);
    }, [target]);

    useResizeObserver(target, (entry) => setRowWidth(entry.contentRect.width));
    return rowWidth;
  };

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
        baseWrapperCol.flex = '440px';
      } else {
        baseStyle.width = 440;
      }
    }
    const baseFormItemProps = {
      className: 'bl-form-item',
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

  const renderItems = (infoBlock: DataFormLayoutInfoBlock) => {
    const { items = [] } = infoBlock;

    if (items.length === 0) return null;

    return (
      <Row style={{ padding: '24px 24px 0 24px' }}>
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

  const renderTopContext = renderOptionalContent(topContext);
  const renderBottomContext = renderOptionalContent(bottomContext);
  const renderLeftContext = renderOptionalContent(leftContext);
  const renderRightContext = renderOptionalContent(rightContext);

  return (
    <div
      style={{
        height: '100%',
        padding: '0px 24px',
        overflowY: 'auto',
        boxSizing: 'content-box',
        minWidth: FORM_LAYOUT_MIN_WIDTH,
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
          style={{ width: '100%' }}
          labelCol={overallFormLayout === 'horizontal' ? { flex: '133px' } : undefined}
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
