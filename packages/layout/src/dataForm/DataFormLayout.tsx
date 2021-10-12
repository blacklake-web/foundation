import React from 'react';
import DataFormLayoutBody, { DataFormLayoutBodyProps } from './components/DataFormLayoutBody';
import DataFormLayoutTitle, { DataFormLayoutTitleProps } from './components/DataFormLayoutTitle';
import DataFormLayoutFooter, { DataFormLayoutFooterProps } from './components/DataFormLayoutFooter';
import './DataFormLayout.less';

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
    <div className="data-layout-context">
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
