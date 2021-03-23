import React from 'react';
import { Table as AntdTable } from 'antd';

class Table extends React.Component {
  handle = () => {
    return 1;
  };
  render() {
    return <AntdTable onChange={this.handle} columns={[{ dataIndex: 'qq', title: 'test' }]} />;
  }
}

export default Table;
