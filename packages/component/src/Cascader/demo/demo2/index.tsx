
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
        defaultValue={['zhejiang', 'hangzhou', 'xihu']}
        options={cascaderOptions}
        style={{ width: 300 }}
    />
);

export default App
