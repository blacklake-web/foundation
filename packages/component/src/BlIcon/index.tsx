import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { IconFontProps } from '@ant-design/icons/dist/components/IconFont';

const MyIcon = createFromIconfontCN({
  scriptUrl: '/fonticons.js', // 在 iconfont.cn 上生成
});

export const BlIcon = React.forwardRef<HTMLElement, any>((props: IconFontProps<string>, ref) => {
  const { type, style = {} } = props;
  let extraStyle = {};

  if (type === 'iconrenyituozhuai') {
    extraStyle = { cursor: 'grab' };
  }
  return <MyIcon ref={ref} {...props} style={{ ...extraStyle, ...style }} />;
});
