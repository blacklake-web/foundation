/**
 * title: 关键属性
 * desc: customDivider
 *
 */

import React from 'react';
import { BlCascader, cascaderOptions } from '@blacklake-web/component';

const App = () => (
  <BlCascader
    customDivider={'、'}
    defaultValue={['zhejiang1', 'hangzhou1', 'xihu1']}
    options={cascaderOptions}
    style={{ width: 300 }}
  />
);

export default App;
