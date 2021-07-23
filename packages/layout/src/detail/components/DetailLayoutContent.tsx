import React, { useState } from 'react';
import _ from 'lodash';
import { Descriptions } from 'antd';
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

const infoBlockStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  borderBottom: '1px solid #b1b1b12e',
};

const infoBlockStyleNoFlex = {
  marginBottom: 20,
  borderBottom: '1px solid #b1b1b12e',
};

const RenderInfoBlock: React.FC<{ infoBlock: DetailLayoutInfoBlock; dataSource: any }> = (
  props,
) => {
  const [toggle, setToggle] = useState<boolean>(false); // 是否展开
  const { infoBlock, dataSource } = props;

  const getInfoItem = (dataIndex: string | string[], record: any) => {
    return _.get(record, dataIndex, null);
  };

  const { title, extra, column = 3, items } = infoBlock;
  const enableToggle = _.some(items, (item) => item?.toggle);
  const _items = _.filter(items, (item) => {
    if (enableToggle) {
      if (toggle) {
        return true;
      } else {
        return item?.toggle !== true;
      }
    } else {
      return true;
    }
  });

  return (
    <div>
      <Descriptions
        title={title}
        labelStyle={{ paddingLeft: 20 }}
        style={enableToggle ? {} : infoBlockStyleNoFlex}
        column={column}
        extra={extra}
      >
        {_items.map((item: any, index: number) => {
          const itemValue = getInfoItem(item.dataIndex, dataSource);

          return (
            <Descriptions.Item
              key={`${item.dataIndex}_${index}`}
              label={item.label}
              span={item?.span}
            >
              {item.render ? item.render(itemValue, dataSource) : itemValue}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
      {enableToggle && (
        <div style={infoBlockStyle} onClick={() => setToggle((prevState) => !prevState)}>
          <BlIcon className={'bl-toggleStyle'} type={toggle ? 'iconshouqi' : 'iconzhankai'} />
        </div>
      )}
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

export default DetailLayoutContent;
