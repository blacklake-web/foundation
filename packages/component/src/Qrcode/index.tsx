import React from 'react';
import QRCode from 'qrcode.react';

interface QRcodeProps {
  /**[BL]样式 */
  style?: {};
  /**[BL]需要转成二维码的字符串 */
  value: string;
}

export function QRcode(props: QRcodeProps) {
  return <QRCode {...props} />;
}
