import React from 'react';
import { ButtonProps } from 'antd';
import { Story, Meta } from '@storybook/react';

import Button from './Button';

export default {
  component: Button,
  title: 'Button',
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Base = Template.bind({});

Base.args = {
  type: 'ghost',
  label: 'Custom Button',
};
