import React from 'react';
import { Resizable } from 'react-resizable';

const ResizableTitle = (props: { [x: string]: any; onResize: any; width?: any; fixed?: any }) => {
  const { onResize, width, fixed, ...restProps } = props;

  if (!width || fixed) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export default ResizableTitle;
