import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

import { OfferMessagingApps } from './OfferMessagingApps'

const meta: Meta<typeof OfferMessagingApps> = {
  title: 'features/Offer/OfferMessagingApps',
  component: OfferMessagingApps,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <ReactQueryClientProvider>
          <Story />
        </ReactQueryClientProvider>
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template = (props: React.ComponentProps<typeof OfferMessagingApps>) => (
  <OfferMessagingApps {...props} />
)

export const Default = {
  name: 'OfferMessagingApps',
  render: () => Template({ offer: offerResponseSnap }),
}
