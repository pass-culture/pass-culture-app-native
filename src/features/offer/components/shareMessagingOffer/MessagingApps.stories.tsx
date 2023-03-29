import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { MessagingApps } from 'features/offer/components/shareMessagingOffer/MessagingApps'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

export default {
  title: 'features/offer/MessagingApps',
  component: MessagingApps,
  decorators: [
    (Story) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
} as ComponentMeta<typeof MessagingApps>

const Template: ComponentStory<typeof MessagingApps> = (args) => <MessagingApps {...args} />

// TODO(PC-17931): Fix this story
const Default = Template.bind({})
Default.args = {
  isEvent: false,
  offerId: 1,
}

// TODO(PC-17931): Fix this story
const Event = Template.bind({})
Event.args = {
  isEvent: true,
  offerId: 1,
}
