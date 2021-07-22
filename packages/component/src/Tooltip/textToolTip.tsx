import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import { AbstractTooltipProps } from 'antd/lib/tooltip';

export interface TextTooltipProps {
  /**完整的text */
  text?: string;
  /**
   * 显示文字的最大宽度
   * @default '100%'
   */
  width?: number | string;
  /**text最大显示长度,超出长度时显示省略 */
  length?: number;
}

const overflowStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'inline-block',
  verticalAlign: 'middle',
};

const TextTooltip = (props: TextTooltipProps & AbstractTooltipProps) => {
  const { text, width = '100%', length = 15, ...restProps } = props;

  return (
    <AntTooltip {...restProps} title={text}>
      <span style={{ maxWidth: width, whiteSpace: 'pre', ...overflowStyle }}>{text}</span>
    </AntTooltip>
  );
};

export default TextTooltip;
