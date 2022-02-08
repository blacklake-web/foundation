import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import { AbstractTooltipProps } from 'antd/lib/tooltip';

export interface TextTooltipProps {
  /**[BL]完整的text */
  text?: string;
  /**
   *[BL]显示文字的最大宽度
   * @default '100%'
   */
  width?: number | string;
  /**[BL]text最大显示长度,超出长度时显示省略 */
  length?: number;
}

const overflowStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'inline-block',
  verticalAlign: 'middle',
};

const TextTooltip = (props: TextTooltipProps & AbstractTooltipProps) => {
  const { text, width = '100%', length, ...restProps } = props;

  const getDisplayText = () => {
    if (length && length > 0) {
      return (text ?? '').slice(0, length).concat('...');
    }

    return text;
  };

  return (
    <AntTooltip
      overlayInnerStyle={{ maxHeight: 300, overflow: 'auto' }}
      {...restProps}
      title={text}
    >
      <span style={{ maxWidth: width, whiteSpace: 'pre', ...overflowStyle }}>
        {getDisplayText()}
      </span>
    </AntTooltip>
  );
};

export default TextTooltip;
