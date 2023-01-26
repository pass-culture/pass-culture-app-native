import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { MessagingApps } from 'features/offer/components/shareMessagingOffer/MessagingApps'
import { Network } from 'ui/components/ShareMessagingApp'

export default {
  title: 'features/offer/MessagingApps',
  component: MessagingApps,
} as ComponentMeta<typeof MessagingApps>

const Template: ComponentStory<typeof MessagingApps> = (args) => <MessagingApps {...args} />

export const Default = Template.bind({})
Default.args = {
  offerType: 'isDigital',
  socialMedias: [Network.instagram, Network.snapchat, Network.tiktok],
}
