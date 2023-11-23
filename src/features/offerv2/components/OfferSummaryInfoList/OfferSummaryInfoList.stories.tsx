import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferSummaryInfoList } from 'features/offerv2/components/OfferSummaryInfoList/OfferSummaryInfoList'
const meta: ComponentMeta<typeof OfferSummaryInfoList> = {
  title: 'features/offer/OfferSummaryInfoList',
  component: OfferSummaryInfoList,
}
export default meta

const Template: ComponentStory<typeof OfferSummaryInfoList> = (props) => (
  <OfferSummaryInfoList {...props} />
)

export const DigitalOffer = Template.bind({})
DigitalOffer.args = {
  offer: {
    ...offerResponseSnap,
    isDigital: true,
    isDuo: false,
    extraData: { durationMinutes: 90 },
  },
}

export const NotPermanentVenueOffer = Template.bind({})
NotPermanentVenueOffer.args = {
  offer: {
    ...offerResponseSnap,
    venue: { ...offerResponseSnap.venue, isPermanent: false },
  },
}

export const EventOffer = Template.bind({})
EventOffer.args = {
  offer: {
    ...offerResponseSnap,
    extraData: { durationMinutes: 90 },
    stocks: [
      {
        id: 118929,
        beginningDatetime: '2043-01-04T13:30:00',
        price: 500,
        isBookable: true,
        isExpired: false,
        isForbiddenToUnderage: false,
        isSoldOut: false,
        features: [],
      },
      {
        id: 118928,
        beginningDatetime: '2043-01-03T18:00:00',
        price: 500,
        isBookable: true,
        isExpired: false,
        isForbiddenToUnderage: false,
        isSoldOut: false,
        features: [],
      },
    ],
  },
}
