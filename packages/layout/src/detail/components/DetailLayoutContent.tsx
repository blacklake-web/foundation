import React, { useState, useRef } from 'react';
import _ from 'lodash';
import { Descriptions, Tooltip } from 'antd';
import useResizeObserver from '@react-hook/resize-observer';
//
import { DetailLayoutInfoBlock } from '../DetailLayout.type';
import { BlIcon } from '@blacklake-web/component';
import './DetailLayoutContent.less';

interface DetailLayoutContentProps {
  /**详情内容 */
  info?: DetailLayoutInfoBlock[];
  /**详情数据 */
  dataSource: any;
}

const infoBlockStyleNoFlex = {
  margin: 24,
};

const RenderInfoBlock: React.FC<{
  infoBlock: DetailLayoutInfoBlock;
  dataSource: any;
  width?: number;
}> = (props) => {
  const [toggle, setToggle] = useState<boolean>(false); // 是否展开
  const { infoBlock, dataSource } = props;

  const useSize = (target) => {
    const [rowWidth, setRowWidth] = React.useState(0);

    React.useLayoutEffect(() => {
      if (target.current) {
        setRowWidth(target.current.getBoundingClientRect());
      }
    }, [target]);

    useResizeObserver(target, (entry) => setRowWidth(entry.contentRect.width));
    return rowWidth;
  };

  const getColumn = (windowSize) => {
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

  const getInfoItem = (dataIndex: string | string[], record: any) => {
    return _.get(record, dataIndex, null);
  };
  const { title, extra, items } = infoBlock;
  const baseColumn = getColumn(useSize(document.body));

  const labelStyle = { whiteSpace: 'break-spaces', maxWidth: 120 };

  return (
    <div>
      <Descriptions
        title={
          title ? (
            <div className="bl-descriptionTitle">
              <div className="title-left-part">
                <span className="title-left-border"></span>
                <span className="title-left">{title}</span>
              </div>
              <div
                className={'bl-toggleButon'}
                onClick={() => setToggle((prevState) => !prevState)}
              >
                <BlIcon type={toggle ? 'iconshouqi' : 'iconzhankai'} />
              </div>
            </div>
          ) : null
        }
        labelStyle={{ paddingLeft: 20 }}
        style={infoBlockStyleNoFlex}
        column={baseColumn}
        extra={extra}
      >
        {!toggle &&
          items.map((item: any, index: number) => {
            const itemValue = getInfoItem(item.dataIndex, dataSource);

            return (
              <Descriptions.Item
                key={`${item.dataIndex}_${index}`}
                span={item.isFullLine ? baseColumn : 1}
                contentStyle={{ width: '100%', display: 'inline-block' }}
                labelStyle={{ wordBreak: 'break-word', maxWidth: 120 }}
                label={
                  item.desc ? (
                    <span>
                      {item.label}
                      <Tooltip title={item.desc}>
                        <BlIcon type="iconwentizhiyinbangzhu" className="bl-title-icon" />
                      </Tooltip>
                    </span>
                  ) : (
                    item.label
                  )
                }
              >
                {item.render ? (
                  item.render(itemValue, dataSource)
                ) : (
                  <span className={'detail-text'}>{itemValue}</span>
                )}
              </Descriptions.Item>
            );
          })}
      </Descriptions>
    </div>
  );
};

const DetailLayoutContent = (props: DetailLayoutContentProps) => {
  const { info, dataSource } = props;
  const detailContentRef = useRef(null);
  // const dataCount = info
  //   ?.map((i) => i.items.length)
  //   .reduce((previousValue, currentValue) => previousValue + currentValue);

  return (
    <div ref={detailContentRef} className="detail-content">
      {info?.map((item, index) => (
        <RenderInfoBlock
          key={`${item.title}_${index}`}
          infoBlock={item}
          dataSource={dataSource}
          // baseColumn={getColumn(useSize(detailContentRef))}
        />
      ))}
    </div>
  );
};

export { DetailLayoutContent };
