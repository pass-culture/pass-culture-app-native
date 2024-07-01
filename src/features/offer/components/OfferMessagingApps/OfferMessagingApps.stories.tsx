import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'

import { OfferMessagingApps } from './OfferMessagingApps'

const meta: ComponentMeta<typeof OfferMessagingApps> = {
  title: 'features/offer/MessagingApps',
  component: OfferMessagingApps,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof OfferMessagingApps> = (args) => (
  <OfferMessagingApps {...args} />
)

export const Default = Template.bind({})
Default.args = {
  offer: offerResponseSnap,
}
