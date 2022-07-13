import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Badge } from './Badge'

export default {
  title: 'ui/Badge',
  component: Badge,
} as ComponentMeta<typeof Badge>

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />

export const SmallNumber = Template.bind({})
SmallNumber.args = {
  value: 1,
}

export const BigNumber = Template.bind({})
BigNumber.args = {
  value: 33,
}
