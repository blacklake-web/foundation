import React from 'react';
import _ from 'lodash';
import { BlIcon } from '@blacklake-web/component';

interface OperationIconProps {
  /** 操作名称 */
  title: string;
  /** 自定义按钮 */
  customIcon?: React.ReactNode | string;
}

const baseOperations = [
  { baseTitle: '新建', icon: 'iconxinjiantianjia' },
  { baseTitle: '编辑', icon: 'iconbianji' },
  { baseTitle: '删除', icon: 'iconshanchulajitong1' },
  { baseTitle: '复制', icon: 'iconfuzhi' },
  { baseTitle: '查看', icon: 'iconcaozuojilu' },
  { baseTitle: '启用', icon: 'iconqiyong' },
  { baseTitle: '停用', icon: 'icontingyong' },
  { baseTitle: '导入', icon: 'icondaoru' },
  { baseTitle: '导出', icon: 'icondaochu' },
  { baseTitle: '操作记录', icon: 'iconcaozuojilu' },
];

const getOperationIcon = (props: OperationIconProps) => {
  const { title, customIcon } = props;

  const renderCustomIcon = (customIcon?: React.ReactNode | string) => {
    return typeof customIcon === 'string' ? <BlIcon type={customIcon} /> : customIcon;
  };

  const renderIcon = (icon?: string) => {
    return icon ? <BlIcon type={icon} /> : renderCustomIcon(customIcon);
  };

  let iconKey;

  _.forEach(baseOperations, ({ baseTitle, icon }) => {
    if (_.includes(title, baseTitle)) iconKey = icon;
  });

  return renderIcon(iconKey);
};

export default getOperationIcon;
