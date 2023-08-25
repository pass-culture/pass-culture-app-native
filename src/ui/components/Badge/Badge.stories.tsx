import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Badge } from './Badge'

const meta: ComponentMeta<typeof Badge> = {
  title: 'ui/Badge',
  component: Badge,
}
export default meta

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />

export const SmallNumber = Template.bind({})
SmallNumber.args = {
  value: 1,
}

export const BigNumber = Template.bind({})
BigNumber.args = {
  value: 33,
}
