import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

import { OfferMessagingApps } from './OfferMessagingApps'

const meta: ComponentMeta<typeof OfferMessagingApps> = {
  title: 'features/offer/MessagingApps',
  component: OfferMessagingApps,
  decorators: [
    (Story) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof OfferMessagingApps> = (args) => (
  <OfferMessagingApps {...args} />
)

// TODO(PC-17931): Fix this story
const Default = Template.bind({})
Default.args = {
  offerId: 1,
}

// TODO(PC-17931): Fix this story
const Event = Template.bind({})
Event.args = {
  offerId: 1,
}
