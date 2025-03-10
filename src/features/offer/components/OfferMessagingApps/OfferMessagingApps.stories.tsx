import type { Meta } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

import { OfferMessagingApps } from './OfferMessagingApps'

const meta: Meta<typeof OfferMessagingApps> = {
  title: 'features/offer/MessagingApps',
  component: OfferMessagingApps,
  decorators: [
    (Story: React.ComponentType) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
}
export default meta

const Template = (props: React.ComponentProps<typeof OfferMessagingApps>) => (
  <OfferMessagingApps {...props} />
)

// TODO(PC-17931): Fix this story
export const Default = () =>
  Template({
    offer: offerResponseSnap,
  })

// TODO(PC-17931): Fix this story
export const Event = () =>
  Template({
    offer: offerResponseSnap,
  })
