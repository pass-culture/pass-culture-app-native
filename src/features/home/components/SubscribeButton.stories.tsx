import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubscribeButton } from './SubscribeButton'

const meta: ComponentMeta<typeof SubscribeButton> = {
  title: 'ui/buttons/SubscribeButton',
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
