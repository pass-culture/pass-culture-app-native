import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubscribeButton } from './SubscribeButton'

const meta: ComponentMeta<typeof SubscribeButton> = {
  title: 'Features/subscription/SubscribeButton',
  component: SubscribeButton,
}
export default meta

const Template: ComponentStory<typeof SubscribeButton> = (props) => <SubscribeButton {...props} />

export const Inactive = Template.bind({})
Inactive.args = {
  active: false,
}

export const Active = Template.bind({})
Active.args = {
  active: true,
}

export const InactiveWithLongTitle = Template.bind({})
InactiveWithLongTitle.args = {
  hasLongTitle: true,
  active: false,
}

export const ActiveWithLongTitle = Template.bind({})
ActiveWithLongTitle.args = {
  hasLongTitle: true,
  active: true,
}
