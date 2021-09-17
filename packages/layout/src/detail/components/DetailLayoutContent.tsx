import React, { useState } from 'react';
import _ from 'lodash';
import { Descriptions, Tooltip } from 'antd';
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
  marginBottom: 24,
};

const RenderInfoBlock: React.FC<{ infoBlock: DetailLayoutInfoBlock; dataSource: any }> = (
  props,
) => {
  const [toggle, setToggle] = useState<boolean>(false); // 是否展开
  const { infoBlock, dataSource } = props;

  const getInfoItem = (dataIndex: string | string[], record: any) => {
    return _.get(record, dataIndex, null);
  };
  const { title, extra, items } = infoBlock;

  return (
    <div>
      <Descriptions
        title={
          <div className="bl-descriptionTitle">
            <p>{title}</p>
            <div className={'bl-toggleButon'} onClick={() => setToggle((prevState) => !prevState)}>
              <BlIcon type={toggle ? 'iconshouqi' : 'iconzhankai'} />
            </div>
          </div>
        }
        labelStyle={{ paddingLeft: 20 }}
        style={infoBlockStyleNoFlex}
        column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 3 }}
        extra={extra}
      >
        {!toggle &&
          items.map((item: any, index: number) => {
            const itemValue = getInfoItem(item.dataIndex, dataSource);

            return (
              <Descriptions.Item
                key={`${item.dataIndex}_${index}`}
                label={
                  item.desc ? (
                    <span>
                      {item.label}
                      <Tooltip title={item.desc}>
                        <BlIcon type="iconwentizhiyinbangzhu" className="bl-title-icon"/>
                      </Tooltip>
                    </span>
                  ) : (
                    item.label
                  )
                }
                span={item?.isFullLine ? 24: 0}
              >
                {item.render ? item.render(itemValue, dataSource) : <span className={'detail-text'}>{itemValue}</span>}
              </Descriptions.Item>
            );
          })}
      </Descriptions>
    </div>
  );
};

const DetailLayoutContent = (props: DetailLayoutContentProps) => {
  const { info, dataSource } = props;

  return (
    <div style={{ height: '100%', padding: 20, overflowY: 'auto' }}>
      {info?.map((item, index) => (
        <RenderInfoBlock key={`${item.title}_${index}`} infoBlock={item} dataSource={dataSource} />
      ))}
    </div>
  );
};

export { DetailLayoutContent };
