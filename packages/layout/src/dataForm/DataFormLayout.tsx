import React from 'react';
import DataFormLayoutBody, { DataFormLayoutBodyProps } from './components/DataFormLayoutBody';
import DataFormLayoutTitle, { DataFormLayoutTitleProps } from './components/DataFormLayoutTitle';
import DataFormLayoutFooter, { DataFormLayoutFooterProps } from './components/DataFormLayoutFooter';

const detailContextStyle = {
  display: 'flex',
  width: '100%',
};

const BlDataFormLayout: React.FC<
  DataFormLayoutTitleProps & DataFormLayoutBodyProps & DataFormLayoutFooterProps
> = (props) => {
  const {
    info,
    title,
    form,
    formLayout,
    topContext,
    leftContext,
    rightContext,
    bottomContext,
    children,
    ...footerProps
  } = props;

  return (
    <div style={{ ...detailContextStyle, flexDirection: 'column' }}>
      <DataFormLayoutTitle title={title} />
      {info?.length ? (
        <DataFormLayoutBody
          info={info}
          form={form}
          formLayout={formLayout}
          topContext={topContext}
          rightContext={rightContext}
          leftContext={leftContext}
          bottomContext={bottomContext}
          {...footerProps}
        />
      ) : null}
      {children}
      <DataFormLayoutFooter {...footerProps} />
    </div>
  );
};

export default BlDataFormLayout;
