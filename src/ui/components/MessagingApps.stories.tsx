import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { MessagingApps } from 'ui/components/MessagingApps'
import { Network } from 'ui/components/ShareMessagingApp'

export default {
  title: 'ui/MessagingApps',
  component: MessagingApps,
} as ComponentMeta<typeof MessagingApps>

const Template: ComponentStory<typeof MessagingApps> = (args) => <MessagingApps {...args} />

export const Default = Template.bind({})
Default.args = {
  media: [Network.instagram],
  offerType: 'isDigital',
}
