import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { MessagingApps } from 'features/offer/components/shareMessagingOffer/MessagingApps'

export default {
  title: 'features/offer/MessagingApps',
  component: MessagingApps,
} as ComponentMeta<typeof MessagingApps>

const Template: ComponentStory<typeof MessagingApps> = (args) => <MessagingApps {...args} />

export const Default = Template.bind({})
Default.args = {
  isEvent: false,
}

export const Event = Template.bind({})
Default.args = {
  isEvent: true,
}
