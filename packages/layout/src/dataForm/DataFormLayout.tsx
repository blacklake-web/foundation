import React from 'react';
import DataFormLayoutBody, { DataFormLayoutBodyProps } from './components/DataFormLayoutBody';
import DataFormLayoutTitle, { DataFormLayoutTitleProps } from './components/DataFormLayoutTitle';
import DataFormLayoutFooter, { DataFormLayoutFooterProps } from './components/DataFormLayoutFooter';
import './DataFormLayout.less';
import { Spin } from 'antd';

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
    loading,
    ...footerProps
  } = props;

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Spin spinning={loading}>
        <div className="data-layout-context">
          <DataFormLayoutTitle title={title} />
          {info?.length ? (
            <DataFormLayoutBody
              info={info}
              form={form}
              loading={loading}
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
      </Spin>
    </div>
  );
};

export default BlDataFormLayout;
